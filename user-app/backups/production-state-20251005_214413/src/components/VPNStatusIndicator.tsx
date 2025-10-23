/**
 * VPN Status Indicator - MET2.4 V14
 * 
 * React component voor VPN status weergave in User App
 * Toont VPN verbinding status en kwaliteit
 * 
 * @version 14.0.0
 * @author Thomas
 */

import React, { useState, useEffect } from 'react';
import { VPNPipelineManager } from '../services/vpnPipelineManager';
import { logger } from '../utils/logger';

interface VPNStatusIndicatorProps {
  vpnManager: VPNPipelineManager;
  showDetails?: boolean;
  className?: string;
}

interface VPNStatus {
  isConnected: boolean;
  isSecure: boolean;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'unknown';
  vpnType: 'tailscale' | 'wireguard' | 'none';
  ipAddress?: string;
  serverLocation?: string;
  lastCheck: Date;
}

export const VPNStatusIndicator: React.FC<VPNStatusIndicatorProps> = ({
  vpnManager,
  showDetails = false,
  className = ''
}) => {
  const [vpnStatus, setVpnStatus] = useState<VPNStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateVPNStatus = async () => {
      try {
        setIsLoading(true);
        const status = vpnManager.getVPNStatus();
        setVpnStatus(status);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        logger.error('Failed to get VPN status:', { error: err });
      } finally {
        setIsLoading(false);
      }
    };

    // Initial load
    updateVPNStatus();

    // Update every 30 seconds
    const interval = setInterval(updateVPNStatus, 30000);

    return () => clearInterval(interval);
  }, [vpnManager]);

  const getStatusColor = (status: VPNStatus | null): string => {
    if (!status) return 'text-gray-500';
    
    if (status.isConnected && status.isSecure) {
      switch (status.connectionQuality) {
        case 'excellent': return 'text-green-500';
        case 'good': return 'text-blue-500';
        case 'poor': return 'text-yellow-500';
        default: return 'text-gray-500';
      }
    }
    
    return 'text-red-500';
  };

  const getStatusIcon = (status: VPNStatus | null): string => {
    if (!status) return '🔓';
    
    if (status.isConnected && status.isSecure) {
      switch (status.connectionQuality) {
        case 'excellent': return '🔐';
        case 'good': return '🔒';
        case 'poor': return '🔓';
        default: return '🔓';
      }
    }
    
    return '🔓';
  };

  const getStatusText = (status: VPNStatus | null): string => {
    if (!status) return 'Unknown';
    
    if (status.isConnected && status.isSecure) {
      return `${status.vpnType.toUpperCase()} - ${status.connectionQuality}`;
    }
    
    return 'Disconnected';
  };

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        <span className="text-sm text-gray-500">Checking VPN...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <span className="text-red-500">⚠️</span>
        <span className="text-sm text-red-500">VPN Error</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className={`text-lg ${getStatusColor(vpnStatus)}`}>
        {getStatusIcon(vpnStatus)}
      </span>
      
      <div className="flex flex-col">
        <span className={`text-sm font-medium ${getStatusColor(vpnStatus)}`}>
          {getStatusText(vpnStatus)}
        </span>
        
        {showDetails && vpnStatus && (
          <div className="text-xs text-gray-500">
            {vpnStatus.ipAddress && (
              <div>IP: {vpnStatus.ipAddress}</div>
            )}
            {vpnStatus.serverLocation && (
              <div>Server: {vpnStatus.serverLocation}</div>
            )}
            <div>Last check: {vpnStatus.lastCheck.toLocaleTimeString()}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VPNStatusIndicator;
