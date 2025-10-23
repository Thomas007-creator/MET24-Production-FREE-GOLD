/**
 * Push Notifications Client for MET24 PWA
 * Handles subscription management and push notifications
 */

interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  actions?: NotificationAction[];
  requireInteraction?: boolean;
  silent?: boolean;
}

interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

class PushClient {
  private vapidPublicKey: string | null = null;
  private subscription: PushSubscription | null = null;
  private isSupported: boolean = false;

  constructor() {
    this.isSupported = this.checkSupport();
  }

  /**
   * Check if push notifications are supported
   */
  private checkSupport(): boolean {
    return (
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    );
  }

  /**
   * Get VAPID public key from server
   */
  async getVapidPublicKey(): Promise<string> {
    if (this.vapidPublicKey) {
      return this.vapidPublicKey;
    }

    try {
      const response = await fetch('/api/push/vapid-key');
      const data = await response.json();
      
      if (!data.publicKey || typeof data.publicKey !== 'string') {
        throw new Error('Invalid VAPID public key received from server');
      }
      
      this.vapidPublicKey = data.publicKey;
      return data.publicKey; // Return the validated string directly
    } catch (error) {
      console.error('❌ Failed to get VAPID public key:', error);
      throw new Error('Failed to get VAPID public key');
    }
  }

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported) {
      throw new Error('Push notifications not supported');
    }

    const permission = await Notification.requestPermission();
    console.log(`📱 Notification permission: ${permission}`);
    return permission;
  }

  /**
   * Subscribe to push notifications
   */
  async subscribe(userId: string): Promise<PushSubscription> {
    if (!this.isSupported) {
      throw new Error('Push notifications not supported');
    }

    // Check permission
    const permission = await this.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Notification permission denied');
    }

    // Get VAPID public key
    const vapidPublicKey = await this.getVapidPublicKey();

    // Get service worker registration
    const registration = await navigator.serviceWorker.ready;

    // Subscribe to push
    this.subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey)
    });

    // Send subscription to server
    await this.sendSubscriptionToServer(this.subscription, userId);

    console.log('✅ Successfully subscribed to push notifications');
    return this.subscription;
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe(userId: string): Promise<boolean> {
    if (!this.subscription) {
      console.log('⚠️ No active subscription to unsubscribe');
      return false;
    }

    try {
      // Unsubscribe from push manager
      const unsubscribed = await this.subscription.unsubscribe();
      
      if (unsubscribed) {
        // Notify server
        await this.removeSubscriptionFromServer(userId);
        this.subscription = null;
        console.log('✅ Successfully unsubscribed from push notifications');
      }

      return unsubscribed;
    } catch (error) {
      console.error('❌ Failed to unsubscribe:', error);
      return false;
    }
  }

  /**
   * Send subscription to server
   */
  private async sendSubscriptionToServer(
    subscription: PushSubscription, 
    userId: string
  ): Promise<void> {
    try {
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          userId,
          userAgent: navigator.userAgent
        })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Subscription sent to server:', data);
    } catch (error) {
      console.error('❌ Failed to send subscription to server:', error);
      throw error;
    }
  }

  /**
   * Remove subscription from server
   */
  private async removeSubscriptionFromServer(userId: string): Promise<void> {
    try {
      const response = await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Subscription removed from server:', data);
    } catch (error) {
      console.error('❌ Failed to remove subscription from server:', error);
      throw error;
    }
  }

  /**
   * Send test notification
   */
  async sendTestNotification(): Promise<void> {
    try {
      const response = await fetch('/api/push/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Test notification sent:', data);
    } catch (error) {
      console.error('❌ Failed to send test notification:', error);
      throw error;
    }
  }

  /**
   * Get current subscription
   */
  getCurrentSubscription(): PushSubscription | null {
    return this.subscription;
  }

  /**
   * Check if subscribed
   */
  isSubscribed(): boolean {
    return this.subscription !== null;
  }

  /**
   * Check if supported
   */
  isPushSupported(): boolean {
    return this.isSupported;
  }

  /**
   * Get permission status
   */
  getPermissionStatus(): NotificationPermission {
    return Notification.permission;
  }

  /**
   * Convert VAPID key to Uint8Array
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  /**
   * Setup notification click handler
   */
  setupNotificationClickHandler(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'NOTIFICATION_CLICK') {
          this.handleNotificationClick(event.data.payload);
        }
      });
    }
  }

  /**
   * Handle notification click
   */
  private handleNotificationClick(payload: any): void {
    console.log('📱 Notification clicked:', payload);
    
    // Handle different notification types
    switch (payload.type) {
      case 'action_plan':
        // Navigate to action plan
        window.location.href = '/action-plans';
        break;
      case 'wellness_check':
        // Navigate to wellness check
        window.location.href = '/wellness';
        break;
      case 'therapy_session':
        // Navigate to therapy session
        window.location.href = '/therapy';
        break;
      default:
        // Default action
        window.focus();
        break;
    }
  }
}

// Export singleton instance
export const pushClient = new PushClient();

// Export class for testing
export { PushClient };
export type { PushSubscriptionData, NotificationPayload, NotificationAction };