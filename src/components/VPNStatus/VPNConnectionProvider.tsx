/**
 * VPN Connection Provider - BMAD Composition Patterns
 *
 * Context provider voor VPN connection management
 * Beheert connection actions zoals reconnect/disconnect
 *
 * @version 14.1.0
 * @author BMAD Team - Mary (Master) | Jordan (Architecture) | Riley (Implementation)
 */

import React, { createContext, useContext, useCallback } from 'react';
import { logger } from '../../utils/logger';
import { VPNConnectionContextType, VPNConnectionProviderProps } from './types';
import { useVPNStatus } from './VPNStatusProvider';

// ================================================
// BMAD VPN Connection Context
// ================================================

const VPNConnectionContext = createContext<VPNConnectionContextType | null>(null);

// ================================================
// BMAD VPN Connection Provider
// ================================================

export const VPNConnectionProvider: React.FC<VPNConnectionProviderProps> = ({
  children,
  vpnManager
}) => {
  const { vpnStatus, updateStatus } = useVPNStatus();

  const reconnect = useCallback(async () => {
    try {
      logger.info('Attempting VPN reconnect');
      await vpnManager.reconnect();
      // Refresh status after reconnect attempt
      await updateStatus();
      logger.info('VPN reconnect completed');
    } catch (err) {
      logger.error('VPN reconnect failed', { error: err });
      throw err;
    }
  }, [vpnManager, updateStatus]);

  const disconnect = useCallback(async () => {
    try {
      logger.info('Attempting VPN disconnect');
      await vpnManager.disconnect();
      // Refresh status after disconnect
      await updateStatus();
      logger.info('VPN disconnect completed');
    } catch (err) {
      logger.error('VPN disconnect failed', { error: err });
      throw err;
    }
  }, [vpnManager, updateStatus]);

  const contextValue: VPNConnectionContextType = {
    isConnected: vpnStatus?.isConnected ?? false,
    connectionQuality: vpnStatus?.connectionQuality ?? 'unknown',
    vpnType: vpnStatus?.vpnType ?? 'none',
    reconnect,
    disconnect
  };

  return (
    <VPNConnectionContext.Provider value={contextValue}>
      {children}
    </VPNConnectionContext.Provider>
  );
};

// ================================================
// BMAD VPN Connection Hook
// ================================================

export const useVPNConnection = (): VPNConnectionContextType => {
  const context = useContext(VPNConnectionContext);
  if (!context) {
    throw new Error('useVPNConnection must be used within VPNConnectionProvider');
  }
  return context;
};

export default VPNConnectionProvider;