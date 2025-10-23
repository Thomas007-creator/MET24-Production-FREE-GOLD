import React from 'react';
import { Button } from '@nextui-org/react';
import { useOnboardingProfile } from './d-OnboardingProfile.provider';

export const OnboardingProfileActionButtons: React.FC = () => {
  const { isSubmitting, isValid, handleSubmit, handleSkip } = useOnboardingProfile();

  return (
    <div className="flex flex-col gap-4">
      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={!isValid || isSubmitting}
        isLoading={isSubmitting}
        className={`w-full h-12 text-lg font-semibold rounded-xl transition-all duration-300 ${
          isValid && !isSubmitting
            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
        }`}
      >
        {isSubmitting ? 'Opslaan...' : 'Opslaan & Doorgaan'}
      </Button>

      {/* Skip Button */}
      <Button
        onClick={handleSkip}
        disabled={isSubmitting}
        variant="ghost"
        className="w-full h-12 text-lg font-medium rounded-xl border-2 border-white/30 text-white/80 hover:bg-white/10 hover:border-white/50 transition-all duration-300"
      >
        Overslaan
      </Button>
    </div>
  );
};