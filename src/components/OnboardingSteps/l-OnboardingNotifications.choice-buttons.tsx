import React from 'react';
import { Button } from '@nextui-org/react';
import { Check, X, Clock } from 'lucide-react';
import { useOnboardingNotifications } from './l-OnboardingNotifications.provider';

export const OnboardingNotificationsChoiceButtons: React.FC = () => {
  const { isSubmitting, handleChoice, handleSkip } = useOnboardingNotifications();

  return (
    <div className="space-y-3">
      <Button
        color="primary"
        size="lg"
        className="w-full"
        startContent={<Check className="w-5 h-5" />}
        isLoading={isSubmitting}
        onClick={() => handleChoice('allow')}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Inschakelen...' : 'Sta toe'}
      </Button>

      <Button
        variant="bordered"
        size="lg"
        className="w-full"
        startContent={<X className="w-5 h-5" />}
        onClick={() => handleChoice('deny')}
        disabled={isSubmitting}
      >
        Niet nu
      </Button>

      <Button
        variant="light"
        size="lg"
        className="w-full"
        startContent={<Clock className="w-5 h-5" />}
        onClick={() => handleChoice('later')}
        disabled={isSubmitting}
      >
        Later beslissen
      </Button>

      <div className="text-center mt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSkip}
          disabled={isSubmitting}
          className="text-gray-500"
        >
          Overslaan
        </Button>
      </div>
    </div>
  );
};