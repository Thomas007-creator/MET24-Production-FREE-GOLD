/**
 * Offline Queue Client Tests
 * Tests for cross-platform offline queue functionality
 */

import 'fake-indexeddb/auto';
import offlineQueueClient, { type StoredRequest } from '../offlineQueueClient';

describe('OfflineQueueClient', () => {
  beforeEach(async () => {
    // Clear queue before each test
    await offlineQueueClient.clearQueue();
  });

  describe('enqueueRequest', () => {
    it('should enqueue a GET request', async () => {
      const requestId = await offlineQueueClient.enqueueRequest({
        url: '/api/test',
        method: 'GET'
      });

      expect(requestId).toBeDefined();
      expect(typeof requestId).toBe('number');
    });

    it('should enqueue a POST request with body', async () => {
      const requestId = await offlineQueueClient.enqueueRequest({
        url: '/api/diary',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Test entry' })
      });

      expect(requestId).toBeDefined();
    });

    it('should default to GET method when not specified', async () => {
      const requestId = await offlineQueueClient.enqueueRequest({
        url: '/api/test'
      });

      expect(requestId).toBeDefined();
    });
  });

  describe('getAllRequests', () => {
    it('should return empty array when no requests', async () => {
      const requests = await offlineQueueClient.getAllRequests();
      expect(requests).toEqual([]);
    });

    it('should return all queued requests', async () => {
      await offlineQueueClient.enqueueRequest({
        url: '/api/test1',
        method: 'GET'
      });

      await offlineQueueClient.enqueueRequest({
        url: '/api/test2',
        method: 'POST',
        body: 'test data'
      });

      const requests = await offlineQueueClient.getAllRequests();
      expect(requests).toHaveLength(2);
      expect(requests[0].url).toBe('/api/test1');
      expect(requests[1].url).toBe('/api/test2');
    });
  });

  describe('getOldestRequests', () => {
    it('should return oldest requests first', async () => {
      const firstId = await offlineQueueClient.enqueueRequest({
        url: '/api/first',
        method: 'GET'
      });

      // Small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10));

      const secondId = await offlineQueueClient.enqueueRequest({
        url: '/api/second',
        method: 'GET'
      });

      const oldest = await offlineQueueClient.getOldestRequests(1);
      expect(oldest).toHaveLength(1);
      expect(oldest[0].id).toBe(firstId);
    });

    it('should respect limit parameter', async () => {
      // Add 5 requests
      for (let i = 0; i < 5; i++) {
        await offlineQueueClient.enqueueRequest({
          url: `/api/test${i}`,
          method: 'GET'
        });
      }

      const limited = await offlineQueueClient.getOldestRequests(3);
      expect(limited).toHaveLength(3);
    });
  });

  describe('removeRequest', () => {
    it('should remove specific request', async () => {
      const requestId = await offlineQueueClient.enqueueRequest({
        url: '/api/test',
        method: 'GET'
      });

      await offlineQueueClient.removeRequest(requestId);

      const requests = await offlineQueueClient.getAllRequests();
      expect(requests).toHaveLength(0);
    });
  });

  describe('clearQueue', () => {
    it('should clear all requests', async () => {
      await offlineQueueClient.enqueueRequest({
        url: '/api/test1',
        method: 'GET'
      });

      await offlineQueueClient.enqueueRequest({
        url: '/api/test2',
        method: 'POST'
      });

      await offlineQueueClient.clearQueue();

      const requests = await offlineQueueClient.getAllRequests();
      expect(requests).toHaveLength(0);
    });
  });

  describe('getOfflineQueueSupport', () => {
    it('should return support information', () => {
      const support = offlineQueueClient.getOfflineQueueSupport();

      expect(support).toHaveProperty('indexedDB');
      expect(support).toHaveProperty('serviceWorker');
      expect(support).toHaveProperty('backgroundSync');
      expect(support).toHaveProperty('platform');
      expect(typeof support.indexedDB).toBe('boolean');
      expect(typeof support.serviceWorker).toBe('boolean');
      expect(typeof support.backgroundSync).toBe('boolean');
      expect(typeof support.platform).toBe('string');
    });
  });
});
