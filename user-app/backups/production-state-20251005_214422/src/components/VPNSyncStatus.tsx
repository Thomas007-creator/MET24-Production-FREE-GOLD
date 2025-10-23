/**
 * VPN Sync Status - MET2.4 V14
 * 
 * React component voor VPN sync status weergave
 * Toont sync queue status en VPN bescherming
 * 
 * @version 14.0.0
 * @author Thomas
 */

import React, { useState, useEffect } from 'react';
import { VPNProtectedSyncManager } from '../services/vpnProtectedSyncManager';
import { logger } from '../utils/logger';

interface VPNSyncStatusProps {
  vpnSyncManager: VPNProtectedSyncManager;
  showDetails?: boolean;
  className?: string;
}

interface SyncStatus {
  queueLength: number;
  isSyncing: boolean;
}

export const VPNSyncStatus: React.FC<VPNSyncStatusProps> = ({
  vpnSyncManager,
  showDetails = false,
  className = ''
}) => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateSyncStatus = async () => {
      try {
        setIsLoading(true);
        const status = vpnSyncManager.getSyncQueueStatus();
        setSyncStatus(status);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        logger.error('Failed to get sync status:', { error: err });
      } finally {
        setIsLoading(false);
      }
    };

    // Initial load
    updateSyncStatus();

    // Update every 10 seconds
    const interval = setInterval(updateSyncStatus, 10000);

    return () => clearInterval(interval);
  }, [vpnSyncManager]);

  const getStatusColor = (status: SyncStatus | null): string => {
    if (!status) return 'text-gray-500';
    
    if (status.isSyncing) return 'text-blue-500';
    if (status.queueLength > 0) return 'text-yellow-500';
    
    return 'text-green-500';
  };

  const getStatusIcon = (status: SyncStatus | null): string => {
    if (!status) return '🔄';
    
    if (status.isSyncing) return '🔄';
    if (status.queueLength > 0) return '⏳';
    
    return '✅';
  };

  const getStatusText = (status: SyncStatus | null): string => {
    if (!status) return 'Unknown';
    
    if (status.isSyncing) return 'Syncing...';
    if (status.queueLength > 0) return `${status.queueLength} pending`;
    
    return 'Up to date';
  };

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        <span className="text-sm text-gray-500">Checking sync...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <span className="text-red-500">⚠️</span>
        <span className="text-sm text-red-500">Sync Error</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className={`text-lg ${getStatusColor(syncStatus)}`}>
        {getStatusIcon(syncStatus)}
      </span>
      
      <div className="flex flex-col">
        <span className={`text-sm font-medium ${getStatusColor(syncStatus)}`}>
          {getStatusText(syncStatus)}
        </span>
        
        {showDetails && syncStatus && (
          <div className="text-xs text-gray-500">
            <div>VPN Protected: ✅</div>
            <div>Queue: {syncStatus.queueLength} items</div>
            <div>Status: {syncStatus.isSyncing ? 'Active' : 'Idle'}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VPNSyncStatus;
