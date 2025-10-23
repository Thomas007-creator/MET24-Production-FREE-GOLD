import React from 'react';
import { OnboardingNotificationsProvider } from './l-OnboardingNotifications.provider';
import { OnboardingNotificationsForm } from './l-OnboardingNotifications.form';

interface OnboardingNotificationsProps {
  onNext: (notificationData: { enabled: boolean; categories: string[]; choice: 'allow' | 'deny' | 'later'; permission: 'granted' | 'denied' }) => void;
  onSkip: () => void;
}

const OnboardingNotifications: React.FC<OnboardingNotificationsProps> = ({
  onNext,
  onSkip,
}) => {
  return (
    <OnboardingNotificationsProvider onNext={onNext} onSkip={onSkip}>
      <OnboardingNotificationsForm />
    </OnboardingNotificationsProvider>
  );
};

export default OnboardingNotifications;
