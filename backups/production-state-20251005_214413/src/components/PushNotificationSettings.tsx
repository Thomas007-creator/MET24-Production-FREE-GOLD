/**
 * Push Notification Settings Component
 * Allows users to manage their push notification preferences
 */

import React from 'react';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { Button, Card, CardBody, CardHeader, Switch, Chip, Spinner } from '@nextui-org/react';
import { Bell, BellOff, TestTube, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface PushNotificationSettingsProps {
  userId: string;
  className?: string;
}

export const PushNotificationSettings: React.FC<PushNotificationSettingsProps> = ({
  userId,
  className = ''
}) => {
  const {
    isSupported,
    isSubscribed,
    permission,
    isLoading,
    error,
    subscribe,
    unsubscribe,
    sendTestNotification,
    requestPermission
  } = usePushNotifications();

  const handleToggleSubscription = async () => {
    if (isSubscribed) {
      await unsubscribe(userId);
    } else {
      await subscribe(userId);
    }
  };

  const handleRequestPermission = async () => {
    await requestPermission();
  };

  const getPermissionStatus = () => {
    switch (permission) {
      case 'granted':
        return { color: 'success' as const, icon: CheckCircle, text: 'Granted' };
      case 'denied':
        return { color: 'danger' as const, icon: XCircle, text: 'Denied' };
      default:
        return { color: 'warning' as const, icon: AlertCircle, text: 'Not Requested' };
    }
  };

  const permissionStatus = getPermissionStatus();
  const PermissionIcon = permissionStatus.icon;

  if (!isSupported) {
    return (
      <Card className={`w-full max-w-md ${className}`}>
        <CardHeader className="flex gap-3">
          <BellOff className="h-5 w-5 text-danger" />
          <div className="flex flex-col">
            <p className="text-md font-semibold">Push Notifications</p>
            <p className="text-small text-default-500">Not supported in this browser</p>
          </div>
        </CardHeader>
        <CardBody>
          <p className="text-small text-default-400">
            Your browser doesn't support push notifications. Please use a modern browser like Chrome, Firefox, or Safari.
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardHeader className="flex gap-3">
        <Bell className="h-5 w-5 text-primary" />
        <div className="flex flex-col">
          <p className="text-md font-semibold">Push Notifications</p>
          <p className="text-small text-default-500">Stay updated with your MBTI coaching</p>
        </div>
      </CardHeader>
      
      <CardBody className="gap-4">
        {/* Permission Status */}
        <div className="flex items-center justify-between">
          <span className="text-small font-medium">Permission Status</span>
          <Chip
            color={permissionStatus.color}
            variant="flat"
            startContent={<PermissionIcon className="h-3 w-3" />}
          >
            {permissionStatus.text}
          </Chip>
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-danger-50 border border-danger-200 rounded-lg">
            <XCircle className="h-4 w-4 text-danger" />
            <p className="text-small text-danger">{error}</p>
          </div>
        )}

        {/* Permission Request */}
        {permission === 'default' && (
          <Button
            color="primary"
            variant="flat"
            onPress={handleRequestPermission}
            isLoading={isLoading}
            startContent={!isLoading && <Bell className="h-4 w-4" />}
            className="w-full"
          >
            {isLoading ? 'Requesting Permission...' : 'Request Permission'}
          </Button>
        )}

        {/* Subscription Toggle */}
        {permission === 'granted' && (
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-small font-medium">Enable Notifications</span>
              <span className="text-tiny text-default-400">
                Receive updates about your MBTI coaching progress
              </span>
            </div>
            <Switch
              isSelected={isSubscribed}
              onValueChange={handleToggleSubscription}
              isDisabled={isLoading}
              color="primary"
            />
          </div>
        )}

        {/* Test Notification */}
        {isSubscribed && (
          <Button
            color="secondary"
            variant="bordered"
            onPress={sendTestNotification}
            isLoading={isLoading}
            startContent={!isLoading && <TestTube className="h-4 w-4" />}
            className="w-full"
          >
            {isLoading ? 'Sending...' : 'Send Test Notification'}
          </Button>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center gap-2">
            <Spinner size="sm" />
            <span className="text-small text-default-500">Processing...</span>
          </div>
        )}

        {/* Help Text */}
        <div className="text-tiny text-default-400 space-y-1">
          <p>• Get reminders for your daily MBTI exercises</p>
          <p>• Receive notifications about new insights</p>
          <p>• Stay motivated with progress updates</p>
        </div>
      </CardBody>
    </Card>
  );
};

export default PushNotificationSettings;