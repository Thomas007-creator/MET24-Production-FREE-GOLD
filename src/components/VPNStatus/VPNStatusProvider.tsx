/**
 * VPN Status Provider - BMAD Composition Patterns
 *
 * Context provider voor VPN status state management
 * Beheert VPN status updates, loading states en error handling
 *
 * @version 14.1.0
 * @author BMAD Team - Mary (Master) | Jordan (Architecture) | Riley (Implementation)
 */

import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { logger } from '../../utils/logger';
import { VPNStatusContextType, VPNStatusProviderProps, VPNStatus } from './types';

// ================================================
// BMAD VPN Status Context
// ================================================

const VPNStatusContext = createContext<VPNStatusContextType | null>(null);

// ================================================
// BMAD VPN Status Provider
// ================================================

export const VPNStatusProvider: React.FC<VPNStatusProviderProps> = ({
  children,
  vpnManager
}) => {
  const [vpnStatus, setVpnStatus] = useState<VPNStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const status = await vpnManager.getVPNStatus();
      setVpnStatus(status);

      logger.info('VPN status updated', { status });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown VPN error';
      setError(errorMessage);
      logger.error('Failed to update VPN status', { error: err });
    } finally {
      setIsLoading(false);
    }
  }, [vpnManager]);

  useEffect(() => {
    // Initial status check
    updateStatus();

    // Set up periodic updates (every 30 seconds)
    const interval = setInterval(updateStatus, 30000);

    return () => clearInterval(interval);
  }, [updateStatus]);

  const contextValue: VPNStatusContextType = {
    vpnStatus,
    isLoading,
    error,
    updateStatus
  };

  return (
    <VPNStatusContext.Provider value={contextValue}>
      {children}
    </VPNStatusContext.Provider>
  );
};

// ================================================
// BMAD VPN Status Hook
// ================================================

export const useVPNStatus = (): VPNStatusContextType => {
  const context = useContext(VPNStatusContext);
  if (!context) {
    throw new Error('useVPNStatus must be used within VPNStatusProvider');
  }
  return context;
};

export default VPNStatusProvider;