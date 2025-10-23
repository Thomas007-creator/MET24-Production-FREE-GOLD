// Dexie Client for offline queue management
// Handles queuing and dequeuing of sync operations

class DexieQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  // Add item to queue
  async enqueue(item) {
    const queueItem = {
      id: `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      method: item.method || 'POST',
      url: item.url,
      body: item.body,
      status: 'pending',
      createdAt: new Date().toISOString(),
      retryCount: 0,
      maxRetries: 3
    };

    this.queue.push(queueItem);
    console.log('Item enqueued:', queueItem.id);
    
    // Try to process immediately if online
    if (navigator.onLine) {
      this.processQueue();
    }
    
    return queueItem.id;
  }

  // Process queue with processor function
  async dequeueAndSend(processor) {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;
    console.log(`Processing ${this.queue.length} queued items...`);

    const itemsToProcess = [...this.queue];
    const results = [];

    for (const item of itemsToProcess) {
      try {
        if (item.status === 'pending' || item.status === 'retry') {
          console.log(`Processing item: ${item.id}`);
          
          const result = await processor(item);
          
          // Mark as completed and remove from queue
          this.removeFromQueue(item.id);
          results.push({ success: true, item, result });
          
          console.log(`Item processed successfully: ${item.id}`);
        }
      } catch (error) {
        console.error(`Error processing item ${item.id}:`, error);
        
        // Increment retry count
        item.retryCount++;
        
        if (item.retryCount >= item.maxRetries) {
          // Mark as failed and remove from queue
          item.status = 'failed';
          this.removeFromQueue(item.id);
          results.push({ success: false, item, error: error.message });
          console.error(`Item failed after ${item.maxRetries} retries: ${item.id}`);
        } else {
          // Mark for retry
          item.status = 'retry';
          results.push({ success: false, item, error: error.message, willRetry: true });
          console.log(`Item marked for retry (${item.retryCount}/${item.maxRetries}): ${item.id}`);
        }
      }
    }

    this.isProcessing = false;
    return results;
  }

  // Remove item from queue
  removeFromQueue(itemId) {
    this.queue = this.queue.filter(item => item.id !== itemId);
  }

  // Get queue status
  getQueueStatus() {
    return {
      total: this.queue.length,
      pending: this.queue.filter(item => item.status === 'pending').length,
      retry: this.queue.filter(item => item.status === 'retry').length,
      failed: this.queue.filter(item => item.status === 'failed').length
    };
  }

  // Clear queue
  clearQueue() {
    this.queue = [];
    console.log('Queue cleared');
  }

  // Get all queued items
  getAllItems() {
    return [...this.queue];
  }

  // Process queue (internal method)
  async processQueue() {
    if (!this.isProcessing && this.queue.length > 0) {
      // This would be called with a processor function
      console.log('Queue processing triggered');
    }
  }
}

// Create singleton instance
const dexieQueue = new DexieQueue();

// Export functions
export const enqueueRequest = (item) => dexieQueue.enqueue(item);
export const dequeueAndSend = (processor) => dexieQueue.dequeueAndSend(processor);
export const getQueueStatus = () => dexieQueue.getQueueStatus();
export const clearQueue = () => dexieQueue.clearQueue();
export const getAllQueuedItems = () => dexieQueue.getAllItems();

// Make available globally for syncWorker
if (typeof window !== 'undefined') {
  window.dexieQueue = dexieQueue;
}

export default dexieQueue;
