import React from 'react';
import { useMainView } from './MainView.provider';
import { NavigationButton } from './NavigationButton';

export const MainViewNavigation: React.FC = () => {
  const { handleQuickActionClick } = useMainView();

  return (
    <section className='mb-8'>
      <nav
        aria-label='Navigation'
        className='flex gap-3 flex-wrap justify-center'
      >
        <NavigationButton
          onClick={() => handleQuickActionClick('profile')}
          variant="primary"
          ariaLabel='Ga naar profiel pagina'
        >
          👤 Profiel
        </NavigationButton>
        <NavigationButton
          onClick={() => handleQuickActionClick('settings')}
          variant="primary"
          ariaLabel='Ga naar instellingen pagina'
        >
          ⚙️ Instellingen
        </NavigationButton>
        <NavigationButton
          onClick={() => handleQuickActionClick('upgrade-gold')}
          variant="warning"
          ariaLabel='Upgrade naar Gold abonnement'
        >
          ⭐ Upgrade Gold
        </NavigationButton>
        <NavigationButton
          onClick={() => handleQuickActionClick('upgrade-platinum')}
          variant="secondary"
          ariaLabel='Upgrade naar Platinum abonnement'
        >
          👑 Upgrade Platinum
        </NavigationButton>
      </nav>
    </section>
  );
};