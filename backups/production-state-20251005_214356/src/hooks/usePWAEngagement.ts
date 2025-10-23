import { useEffect } from 'react';
import pwaInstallService from '../services/pwaInstallService';
import { logger } from '../utils/logger';

/**
 * Hook to track PWA engagement for better install prompt timing
 */
export const usePWAEngagement = (action?: string) => {
  useEffect(() => {
    if (action) {
      // Track specific engagement actions
      switch (action) {
        case 'button_click':
        case 'navigation':
        case 'content_interaction':
        case 'ai_interaction':
        case 'onboarding_complete':
          pwaInstallService.trackEngagement();
          logger.info('🎯 PWA engagement tracked:', { action });
          break;
        default:
          // Track general engagement
          pwaInstallService.trackEngagement();
          break;
      }
    }
  }, [action]);
};

/**
 * Hook to track PWA engagement on component mount
 */
export const usePWAVisitTracking = () => {
  useEffect(() => {
    pwaInstallService.trackVisit();
  }, []);
};

export default usePWAEngagement;








