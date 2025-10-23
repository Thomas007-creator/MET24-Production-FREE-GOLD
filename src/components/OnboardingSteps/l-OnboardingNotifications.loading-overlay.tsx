import React from 'react';
import { Spinner } from '@nextui-org/react';
import { useOnboardingNotifications } from './l-OnboardingNotifications.provider';

export const OnboardingNotificationsLoadingOverlay: React.FC = () => {
  const { isSubmitting } = useOnboardingNotifications();

  if (!isSubmitting) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4">
        <Spinner size="lg" color="primary" />
        <p className="text-center text-gray-700">
          Notificaties worden ingesteld...
        </p>
      </div>
    </div>
  );
};