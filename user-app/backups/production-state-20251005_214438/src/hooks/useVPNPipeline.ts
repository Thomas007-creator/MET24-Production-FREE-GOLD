/**
 * VPN Pipeline Hook - MET2.4 V14
 * 
 * React hook voor VPN Pipeline integratie
 * Biedt eenvoudige toegang tot VPN services in components
 * 
 * @version 14.0.0
 * @author Thomas
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  VPNPipelineManager, 
  VPNProtectedSyncManager, 
  HybridTestingManager 
} from '../services/vpnPipelineIntegration';
import { logger } from '../utils/logger';

interface VPNPipelineState {
  vpnManager: VPNPipelineManager | null;
  vpnSyncManager: VPNProtectedSyncManager | null;
  testingManager: HybridTestingManager | null;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
}

interface VPNPipelineActions {
  initialize: () => Promise<void>;
  shutdown: () => Promise<void>;
  refreshStatus: () => Promise<void>;
}

export const useVPNPipeline = (): VPNPipelineState & VPNPipelineActions => {
  const [state, setState] = useState<VPNPipelineState>({
    vpnManager: null,
    vpnSyncManager: null,
    testingManager: null,
    isInitialized: false,
    isLoading: false,
    error: null
  });

  const initialize = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Import VPN Pipeline Integration
      const { initializeGlobalVPNPipelineIntegration } = await import('../services/vpnPipelineIntegration');
      
      // Initialize VPN Pipeline
      const vpnPipeline = await initializeGlobalVPNPipelineIntegration({
        enabled: true,
        required: true,
        syncEnabled: true,
        testingEnabled: true
      });

      setState(prev => ({
        ...prev,
        vpnManager: vpnPipeline.getVPNManager(),
        vpnSyncManager: vpnPipeline.getVPNSyncManager(),
        testingManager: vpnPipeline.getTestingManager(),
        isInitialized: true,
        isLoading: false,
        error: null
      }));

      logger.info('✅ VPN Pipeline initialized via hook');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      logger.error('❌ VPN Pipeline initialization failed via hook:', { error });
    }
  }, []);

  const shutdown = useCallback(async () => {
    try {
      if (state.vpnManager) {
        await state.vpnManager.shutdown();
      }

      setState(prev => ({
        ...prev,
        vpnManager: null,
        vpnSyncManager: null,
        testingManager: null,
        isInitialized: false,
        error: null
      }));

      logger.info('🔓 VPN Pipeline shutdown via hook');
    } catch (error) {
      logger.error('❌ VPN Pipeline shutdown failed via hook:', { error });
    }
  }, [state.vpnManager]);

  const refreshStatus = useCallback(async () => {
    try {
      if (state.vpnManager) {
        // Trigger status refresh
        const status = state.vpnManager.getVPNStatus();
        logger.info('VPN Status refreshed:', status);
      }
    } catch (error) {
      logger.error('Failed to refresh VPN status:', { error });
    }
  }, [state.vpnManager]);

  // Auto-initialize on mount
  useEffect(() => {
    if (!state.isInitialized && !state.isLoading) {
      initialize();
    }
  }, [initialize, state.isInitialized, state.isLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (state.isInitialized) {
        shutdown();
      }
    };
  }, [shutdown, state.isInitialized]);

  return {
    ...state,
    initialize,
    shutdown,
    refreshStatus
  };
};

export default useVPNPipeline;
