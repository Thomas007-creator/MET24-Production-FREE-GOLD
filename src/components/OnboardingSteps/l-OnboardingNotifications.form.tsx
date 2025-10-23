import React from 'react';
import { Card, CardBody } from '@nextui-org/react';
import { Bell } from 'lucide-react';
import { OnboardingNotificationsBenefitsSection } from './l-OnboardingNotifications.benefits-section';
import { OnboardingNotificationsChoiceButtons } from './l-OnboardingNotifications.choice-buttons';
import { OnboardingNotificationsLoadingOverlay } from './l-OnboardingNotifications.loading-overlay';

export const OnboardingNotificationsForm: React.FC = () => {
  return (
    <div className="max-w-md mx-auto p-4">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <Bell className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">
          Notificaties
        </h2>
        <p className="text-gray-600">
          Blijf verbonden met je persoonlijke ontwikkeling
        </p>
      </div>

      <OnboardingNotificationsBenefitsSection />

      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold mb-4">
            Wil je notificaties ontvangen?
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            We respecteren je privacy en sturen alleen relevante berichten.
            Je kunt dit altijd later aanpassen in je instellingen.
          </p>

          <OnboardingNotificationsChoiceButtons />
        </CardBody>
      </Card>

      <OnboardingNotificationsLoadingOverlay />
    </div>
  );
};