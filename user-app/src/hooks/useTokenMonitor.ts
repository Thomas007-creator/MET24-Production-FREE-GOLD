/**
 * React Hook for Token Monitoring
 * Provides easy access to token usage monitoring functionality
 */

import { useState, useEffect, useCallback } from 'react';
import { tokenMonitor, TokenUsage } from '../lib/tokenMonitor';

interface TokenMonitorState {
  isMonitoring: boolean;
  tokenUsage: TokenUsage[];
  summary: {
    totalProviders: number;
    providersNearLimit: number;
    providersAtLimit: number;
    summary: Array<{
      provider: string;
      percentage: number;
      status: 'ok' | 'warning' | 'critical';
    }>;
  };
  isLoading: boolean;
  error: string | null;
}

export const useTokenMonitor = () => {
  const [state, setState] = useState<TokenMonitorState>({
    isMonitoring: false,
    tokenUsage: [],
    summary: {
      totalProviders: 0,
      providersNearLimit: 0,
      providersAtLimit: 0,
      summary: []
    },
    isLoading: false,
    error: null
  });

  /**
   * Start monitoring
   */
  const startMonitoring = useCallback((intervalMs?: number) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      tokenMonitor.startMonitoring(intervalMs);
      setState(prev => ({ 
        ...prev, 
        isMonitoring: true, 
        isLoading: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to start monitoring'
      }));
    }
  }, []);

  /**
   * Stop monitoring
   */
  const stopMonitoring = useCallback(() => {
    try {
      tokenMonitor.stopMonitoring();
      setState(prev => ({ 
        ...prev, 
        isMonitoring: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to stop monitoring'
      }));
    }
  }, []);

  /**
   * Update token usage
   */
  const updateTokenUsage = useCallback((
    provider: string, 
    model: string, 
    tokensUsed: number, 
    tokenLimit: number
  ) => {
    try {
      tokenMonitor.updateTokenUsage(provider, model, tokensUsed, tokenLimit);
      refreshData();
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to update token usage'
      }));
    }
  }, []);

  /**
   * Get token usage for specific provider
   */
  const getTokenUsage = useCallback((provider: string): TokenUsage | null => {
    return tokenMonitor.getTokenUsage(provider);
  }, []);

  /**
   * Simulate token usage for testing
   */
  const simulateTokenUsage = useCallback((provider: string, percentage: number) => {
    try {
      tokenMonitor.simulateTokenUsage(provider, percentage);
      refreshData();
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to simulate token usage'
      }));
    }
  }, []);

  /**
   * Refresh monitoring data
   */
  const refreshData = useCallback(() => {
    try {
      const tokenUsage = tokenMonitor.getAllTokenUsage();
      const summary = tokenMonitor.getTokenUsageSummary();
      
      setState(prev => ({ 
        ...prev, 
        tokenUsage, 
        summary,
        isMonitoring: tokenMonitor.isActive()
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to refresh data'
      }));
    }
  }, []);

  /**
   * Initialize monitoring on mount
   */
  useEffect(() => {
    refreshData();
    
    // Start monitoring with 5-minute intervals
    startMonitoring(300000);
    
    return () => {
      stopMonitoring();
    };
  }, [startMonitoring, stopMonitoring, refreshData]);

  /**
   * Auto-refresh data every minute
   */
  useEffect(() => {
    if (state.isMonitoring) {
      const interval = setInterval(() => {
        refreshData();
      }, 60000); // Every minute

      return () => clearInterval(interval);
    }
  }, [state.isMonitoring, refreshData]);

  return {
    // State
    isMonitoring: state.isMonitoring,
    tokenUsage: state.tokenUsage,
    summary: state.summary,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    startMonitoring,
    stopMonitoring,
    updateTokenUsage,
    getTokenUsage,
    simulateTokenUsage,
    refreshData,

    // Utilities
    hasWarnings: state.summary.providersNearLimit > 0,
    hasCritical: state.summary.providersAtLimit > 0,
    needsAttention: state.summary.providersNearLimit > 0 || state.summary.providersAtLimit > 0
  };
};
