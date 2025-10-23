/**
 * React Hook for Push Notifications
 * Integrates with PushClient for easy use in React components
 */

import { useState, useEffect, useCallback } from 'react';
import { pushClient, NotificationPayload } from '../lib/pushClient';

interface UsePushNotificationsReturn {
  isSupported: boolean;
  isSubscribed: boolean;
  permission: NotificationPermission;
  isLoading: boolean;
  error: string | null;
  subscribe: (userId: string) => Promise<void>;
  unsubscribe: (userId: string) => Promise<void>;
  sendTestNotification: () => Promise<void>;
  requestPermission: () => Promise<NotificationPermission>;
}

export const usePushNotifications = (): UsePushNotificationsReturn => {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isSupported = pushClient.isPushSupported();

  // Initialize hook
  useEffect(() => {
    if (!isSupported) {
      setError('Push notifications not supported in this browser');
      return;
    }

    // Check current permission status
    setPermission(pushClient.getPermissionStatus());
    
    // Check if already subscribed
    setIsSubscribed(pushClient.isSubscribed());

    // Setup notification click handler
    pushClient.setupNotificationClickHandler();
  }, [isSupported]);

  // Subscribe to push notifications
  const subscribe = useCallback(async (userId: string): Promise<void> => {
    if (!isSupported) {
      setError('Push notifications not supported');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await pushClient.subscribe(userId);
      setIsSubscribed(true);
      setPermission('granted');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to subscribe';
      setError(errorMessage);
      console.error('❌ Push subscription failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async (userId: string): Promise<void> => {
    if (!isSupported) {
      setError('Push notifications not supported');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const success = await pushClient.unsubscribe(userId);
      if (success) {
        setIsSubscribed(false);
      } else {
        setError('Failed to unsubscribe');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to unsubscribe';
      setError(errorMessage);
      console.error('❌ Push unsubscription failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  // Send test notification
  const sendTestNotification = useCallback(async (): Promise<void> => {
    if (!isSupported) {
      setError('Push notifications not supported');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await pushClient.sendTestNotification();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send test notification';
      setError(errorMessage);
      console.error('❌ Test notification failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  // Request permission
  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      setError('Push notifications not supported');
      return 'denied';
    }

    setIsLoading(true);
    setError(null);

    try {
      const newPermission = await pushClient.requestPermission();
      setPermission(newPermission);
      return newPermission;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request permission';
      setError(errorMessage);
      console.error('❌ Permission request failed:', err);
      return 'denied';
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  return {
    isSupported,
    isSubscribed,
    permission,
    isLoading,
    error,
    subscribe,
    unsubscribe,
    sendTestNotification,
    requestPermission
  };
};