/**
 * VPN Status Indicator - BMAD Refactored
 * 
 * React component voor VPN status weergave in User App
 * Refactored using BMAD composition patterns to eliminate boolean props
 * 
 * @version 14.1.0
 * @author BMAD Team - Mary (Master) | Jordan (Architecture) | Riley (Implementation)
 */

import React, { useState, useEffect, createContext, useContext } from 'react';
import { VPNPipelineManager } from '../services/vpnPipelineManager';
import { logger } from '../utils/logger';

// ================================================
// BMAD Types
// ================================================

interface VPNStatus {
  isConnected: boolean;
  isSecure: boolean;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'unknown';
  vpnType: 'tailscale' | 'wireguard' | 'none';
  ipAddress?: string;
  serverLocation?: string;
  lastCheck: Date;
}

interface VPNStatusContextType {
  vpnStatus: VPNStatus | null;
  isLoading: boolean;
  error: string | null;
  updateStatus: () => Promise<void>;
}

// ================================================
// BMAD VPN Status Context & Provider
// ================================================

const VPNStatusContext = createContext<VPNStatusContextType | null>(null);

interface VPNStatusProviderProps {
  children: React.ReactNode;
  vpnManager: VPNPipelineManager;
}

const VPNStatusProvider: React.FC<VPNStatusProviderProps> = ({ children, vpnManager }) => {
  const [vpnStatus, setVpnStatus] = useState<VPNStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async () => {
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

  useEffect(() => {
    // Initial load
    updateStatus();

    // Update every 30 seconds
    const interval = setInterval(updateStatus, 30000);

    return () => clearInterval(interval);
  }, [vpnManager]);

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

const useVPNStatus = (): VPNStatusContextType => {
  const context = useContext(VPNStatusContext);
  if (!context) {
    throw new Error('useVPNStatus must be used within VPNStatusProvider');
  }
  return context;
};

// ================================================
// BMAD VPN Status Icon Component
// ================================================

interface VPNStatusIconProps {
  status: VPNStatus | null;
  className?: string;
}

const VPNStatusIcon: React.FC<VPNStatusIconProps> = ({ status, className = "text-lg" }) => {
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

  return (
    <span className={`${className} ${getStatusColor(status)}`}>
      {getStatusIcon(status)}
    </span>
  );
};

// ================================================
// BMAD VPN Status Text Component
// ================================================

interface VPNStatusTextProps {
  status: VPNStatus | null;
  className?: string;
}

const VPNStatusText: React.FC<VPNStatusTextProps> = ({ status, className = "text-sm font-medium" }) => {
  const getStatusText = (status: VPNStatus | null): string => {
    if (!status) return 'Unknown';
    
    if (status.isConnected && status.isSecure) {
      return `${status.vpnType.toUpperCase()} - ${status.connectionQuality}`;
    }
    
    return 'Disconnected';
  };

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

  return (
    <span className={`${className} ${getStatusColor(status)}`}>
      {getStatusText(status)}
    </span>
  );
};

// ================================================
// BMAD VPN Status Details Component
// ================================================

interface VPNStatusDetailsProps {
  status: VPNStatus | null;
  className?: string;
}

const VPNStatusDetails: React.FC<VPNStatusDetailsProps> = ({ status, className = "text-xs text-gray-500" }) => {
  if (!status) return null;

  return (
    <div className={className}>
      {status.ipAddress && (
        <div>IP: {status.ipAddress}</div>
      )}
      {status.serverLocation && (
        <div>Server: {status.serverLocation}</div>
      )}
      <div>Last check: {status.lastCheck.toLocaleTimeString()}</div>
    </div>
  );
};

// ================================================
// BMAD VPN Loading Component
// ================================================

interface VPNLoadingProps {
  className?: string;
}

const VPNLoading: React.FC<VPNLoadingProps> = ({ className = "flex items-center space-x-2" }) => {
  return (
    <div className={className}>
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
      <span className="text-sm text-gray-500">Checking VPN...</span>
    </div>
  );
};

// ================================================
// BMAD VPN Error Component
// ================================================

interface VPNErrorProps {
  error: string;
  className?: string;
}

const VPNError: React.FC<VPNErrorProps> = ({ error, className = "flex items-center space-x-2" }) => {
  return (
    <div className={className}>
      <span className="text-red-500">⚠️</span>
      <span className="text-sm text-red-500">VPN Error: {error}</span>
    </div>
  );
};

// ================================================
// BMAD VPN Status Basic Component
// ================================================

interface VPNStatusBasicProps {
  className?: string;
}

const VPNStatusBasic: React.FC<VPNStatusBasicProps> = ({ className = "flex items-center space-x-2" }) => {
  const { vpnStatus } = useVPNStatus();

  return (
    <div className={className}>
      <VPNStatusIcon status={vpnStatus} />
      <VPNStatusText status={vpnStatus} />
    </div>
  );
};

// ================================================
// BMAD VPN Status Detailed Component
// ================================================

interface VPNStatusDetailedProps {
  className?: string;
}

const VPNStatusDetailed: React.FC<VPNStatusDetailedProps> = ({ className = "flex items-center space-x-2" }) => {
  const { vpnStatus } = useVPNStatus();

  return (
    <div className={className}>
      <VPNStatusIcon status={vpnStatus} />
      <div className="flex flex-col">
        <VPNStatusText status={vpnStatus} />
        <VPNStatusDetails status={vpnStatus} />
      </div>
    </div>
  );
};

// ================================================
// BMAD VPN Status Container Component
// ================================================

interface VPNStatusContainerProps {
  children: React.ReactNode;
  className?: string;
}

const VPNStatusContainer: React.FC<VPNStatusContainerProps> = ({ children, className = "" }) => {
  const { isLoading, error } = useVPNStatus();

  if (isLoading) {
    return <VPNLoading className={className} />;
  }

  if (error) {
    return <VPNError error={error} className={className} />;
  }

  return <>{children}</>;
};

// ================================================
// BMAD Main VPN Status Indicator Component
// ================================================

interface VPNStatusIndicatorProps {
  vpnManager: VPNPipelineManager;
  variant?: 'basic' | 'detailed';
  className?: string;
}

const VPNStatusIndicator: React.FC<VPNStatusIndicatorProps> = ({
  vpnManager,
  variant = 'basic',
  className = ''
}) => {
  return (
    <VPNStatusProvider vpnManager={vpnManager}>
      <VPNStatusContainer className={className}>
        {variant === 'detailed' ? (
          <VPNStatusDetailed />
        ) : (
          <VPNStatusBasic />
        )}
      </VPNStatusContainer>
    </VPNStatusProvider>
  );
};

// ================================================
// BMAD Compound Components Export
// ================================================

export const VPNStatus = {
  Provider: VPNStatusProvider,
  Indicator: VPNStatusIndicator,
  Basic: VPNStatusBasic,
  Detailed: VPNStatusDetailed,
  Icon: VPNStatusIcon,
  Text: VPNStatusText,
  Details: VPNStatusDetails,
  Loading: VPNLoading,
  Error: VPNError,
  Container: VPNStatusContainer,
  useStatus: useVPNStatus
};

export default VPNStatusIndicator;
