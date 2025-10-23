import React from 'react';
import { Checkbox } from '@nextui-org/react';
import { useOnboardingPrivacy } from './c-OnboardingPrivacy.provider';

export const OnboardingPrivacyCheckbox: React.FC = () => {
  const { isChecked, setIsChecked } = useOnboardingPrivacy();

  return (
    <div className="mb-8">
      <Checkbox
        isSelected={isChecked}
        onValueChange={setIsChecked}
        className="text-white"
        classNames={{
          label: 'text-white text-sm leading-relaxed',
          wrapper: 'items-start',
        }}
      >
        <div className="text-left">
          <span>Ik begrijp en ga akkoord met de </span>
          <button
            className="underline hover:text-cyan-200 transition-colors"
            onClick={() => console.log('Privacyverklaring clicked')}
          >
            Privacyverklaring
          </button>
          <span> en </span>
          <button
            className="underline hover:text-cyan-200 transition-colors"
            onClick={() => console.log('Gebruiksvoorwaarden clicked')}
          >
            Gebruiksvoorwaarden
          </button>
          <span>.</span>
        </div>
      </Checkbox>
    </div>
  );
};