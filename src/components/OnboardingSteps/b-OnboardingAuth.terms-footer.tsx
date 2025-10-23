import React from 'react';

export const OnboardingAuthTermsFooter: React.FC = () => {
  return (
    <div className="bg-yellow-800/80 backdrop-blur-xl border border-yellow-800/60 rounded-xl p-4">
      <p className="text-xs text-white/80 leading-relaxed">
        Door door te gaan accepteer je onze{' '}
        <button
          onClick={() => console.log('Terms of service clicked')}
          className="underline hover:text-blue-200 transition-colors"
        >
          Gebruiksvoorwaarden
        </button>{' '}
        en{' '}
        <button
          onClick={() => console.log('Privacy policy clicked')}
          className="underline hover:text-blue-200 transition-colors"
        >
          Privacyverklaring
        </button>
        .
      </p>
    </div>
  );
};