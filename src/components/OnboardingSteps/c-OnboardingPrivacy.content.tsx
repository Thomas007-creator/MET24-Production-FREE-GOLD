import React from 'react';

export const OnboardingPrivacyContent: React.FC = () => {
  return (
    <>
      <p className="text-xl mb-4 text-center font-medium text-white/90">
        Jouw data, jouw potentieel.
      </p>

      <p className="text-lg mb-8 text-center text-white/80">
        Standaard vindt analyse lokaal plaats op jouw apparaat. We slaan geen
        persoonlijke profilinggegevens op servers op zonder jouw expliciete
        toestemming.
      </p>
    </>
  );
};