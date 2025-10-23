/**
 * VPN Testing Status - BMAD Refactored
 * 
 * React component voor VPN testing status weergave
 * Refactored using BMAD composition patterns to eliminate boolean props
 * 
 * @version 14.1.0
 * @author BMAD Team - Mary (Master) | Jordan (Architecture) | Riley (Implementation)
 */

import React, { useState, useEffect, createContext, useContext } from 'react';
import { HybridTestingManager } from '../services/hybridTestingManager';
import { logger } from '../utils/logger';

// ================================================
// BMAD Types
// ================================================

interface TestSummary {
  total: number;
  passed: number;
  failed: number;
  successRate: number;
}

interface VPNTestingStatusContextType {
  testSummary: TestSummary | null;
  isLoading: boolean;
  error: string | null;
  updateTestSummary: () => Promise<void>;
}

// ================================================
// BMAD VPN Testing Status Context & Provider
// ================================================

const VPNTestingStatusContext = createContext<VPNTestingStatusContextType | null>(null);

interface VPNTestingStatusProviderProps {
  children: React.ReactNode;
  testingManager: HybridTestingManager;
}

const VPNTestingStatusProvider: React.FC<VPNTestingStatusProviderProps> = ({ children, testingManager }) => {
  const [testSummary, setTestSummary] = useState<TestSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateTestSummary = async () => {
    try {
      setIsLoading(true);
      const summary = testingManager.getTestSummary();
      setTestSummary(summary);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      logger.error('Failed to get test summary:', { error: err });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    updateTestSummary();

    // Update every 60 seconds
    const interval = setInterval(updateTestSummary, 60000);

    return () => clearInterval(interval);
  }, [testingManager]);

  const contextValue: VPNTestingStatusContextType = {
    testSummary,
    isLoading,
    error,
    updateTestSummary
  };

  return (
    <VPNTestingStatusContext.Provider value={contextValue}>
      {children}
    </VPNTestingStatusContext.Provider>
  );
};

// ================================================
// BMAD VPN Testing Status Hook
// ================================================

const useVPNTestingStatus = (): VPNTestingStatusContextType => {
  const context = useContext(VPNTestingStatusContext);
  if (!context) {
    throw new Error('useVPNTestingStatus must be used within VPNTestingStatusProvider');
  }
  return context;
};

// ================================================
// BMAD VPN Testing Status Icon Component
// ================================================

interface VPNTestingStatusIconProps {
  summary: TestSummary | null;
  className?: string;
}

const VPNTestingStatusIcon: React.FC<VPNTestingStatusIconProps> = ({ summary, className = "text-lg" }) => {
  const getStatusIcon = (summary: TestSummary | null): string => {
    if (!summary) return '🧪';
    
    if (summary.successRate >= 90) return '✅';
    if (summary.successRate >= 70) return '⚠️';
    
    return '❌';
  };

  const getStatusColor = (summary: TestSummary | null): string => {
    if (!summary) return 'text-gray-500';
    
    if (summary.successRate >= 90) return 'text-green-500';
    if (summary.successRate >= 70) return 'text-yellow-500';
    
    return 'text-red-500';
  };

  return (
    <span className={`${className} ${getStatusColor(summary)}`}>
      {getStatusIcon(summary)}
    </span>
  );
};

// ================================================
// BMAD VPN Testing Status Text Component
// ================================================

interface VPNTestingStatusTextProps {
  summary: TestSummary | null;
  className?: string;
}

const VPNTestingStatusText: React.FC<VPNTestingStatusTextProps> = ({ summary, className = "text-sm font-medium" }) => {
  const getStatusText = (summary: TestSummary | null): string => {
    if (!summary) return 'Unknown';
    
    return `${summary.passed}/${summary.total} tests passed`;
  };

  const getStatusColor = (summary: TestSummary | null): string => {
    if (!summary) return 'text-gray-500';
    
    if (summary.successRate >= 90) return 'text-green-500';
    if (summary.successRate >= 70) return 'text-yellow-500';
    
    return 'text-red-500';
  };

  return (
    <span className={`${className} ${getStatusColor(summary)}`}>
      {getStatusText(summary)}
    </span>
  );
};

// ================================================
// BMAD VPN Testing Status Details Component
// ================================================

interface VPNTestingStatusDetailsProps {
  summary: TestSummary | null;
  className?: string;
}

const VPNTestingStatusDetails: React.FC<VPNTestingStatusDetailsProps> = ({ summary, className = "text-xs text-gray-500" }) => {
  if (!summary) return null;

  return (
    <div className={className}>
      <div>Success Rate: {summary.successRate.toFixed(1)}%</div>
      <div>Failed: {summary.failed}</div>
      <div>VPN Tests: Included</div>
    </div>
  );
};

// ================================================
// BMAD VPN Testing Loading Component
// ================================================

interface VPNTestingLoadingProps {
  className?: string;
}

const VPNTestingLoading: React.FC<VPNTestingLoadingProps> = ({ className = "flex items-center space-x-2" }) => {
  return (
    <div className={className}>
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
      <span className="text-sm text-gray-500">Checking tests...</span>
    </div>
  );
};

// ================================================
// BMAD VPN Testing Error Component
// ================================================

interface VPNTestingErrorProps {
  error: string;
  className?: string;
}

const VPNTestingError: React.FC<VPNTestingErrorProps> = ({ error, className = "flex items-center space-x-2" }) => {
  return (
    <div className={className}>
      <span className="text-red-500">⚠️</span>
      <span className="text-sm text-red-500">Test Error: {error}</span>
    </div>
  );
};

// ================================================
// BMAD VPN Testing Status Basic Component
// ================================================

interface VPNTestingStatusBasicProps {
  className?: string;
}

const VPNTestingStatusBasic: React.FC<VPNTestingStatusBasicProps> = ({ className = "flex items-center space-x-2" }) => {
  const { testSummary } = useVPNTestingStatus();

  return (
    <div className={className}>
      <VPNTestingStatusIcon summary={testSummary} />
      <VPNTestingStatusText summary={testSummary} />
    </div>
  );
};

// ================================================
// BMAD VPN Testing Status Detailed Component
// ================================================

interface VPNTestingStatusDetailedProps {
  className?: string;
}

const VPNTestingStatusDetailed: React.FC<VPNTestingStatusDetailedProps> = ({ className = "flex items-center space-x-2" }) => {
  const { testSummary } = useVPNTestingStatus();

  return (
    <div className={className}>
      <VPNTestingStatusIcon summary={testSummary} />
      <div className="flex flex-col">
        <VPNTestingStatusText summary={testSummary} />
        <VPNTestingStatusDetails summary={testSummary} />
      </div>
    </div>
  );
};

// ================================================
// BMAD VPN Testing Status Container Component
// ================================================

interface VPNTestingStatusContainerProps {
  children: React.ReactNode;
  className?: string;
}

const VPNTestingStatusContainer: React.FC<VPNTestingStatusContainerProps> = ({ children, className = "" }) => {
  const { isLoading, error } = useVPNTestingStatus();

  if (isLoading) {
    return <VPNTestingLoading className={className} />;
  }

  if (error) {
    return <VPNTestingError error={error} className={className} />;
  }

  return <>{children}</>;
};

// ================================================
// BMAD Main VPN Testing Status Component
// ================================================

interface VPNTestingStatusProps {
  testingManager: HybridTestingManager;
  variant?: 'basic' | 'detailed';
  className?: string;
}

const VPNTestingStatus: React.FC<VPNTestingStatusProps> = ({
  testingManager,
  variant = 'basic',
  className = ''
}) => {
  return (
    <VPNTestingStatusProvider testingManager={testingManager}>
      <VPNTestingStatusContainer className={className}>
        {variant === 'detailed' ? (
          <VPNTestingStatusDetailed />
        ) : (
          <VPNTestingStatusBasic />
        )}
      </VPNTestingStatusContainer>
    </VPNTestingStatusProvider>
  );
};

// ================================================
// BMAD Compound Components Export
// ================================================

export const VPNTestingStatusComponents = {
  Provider: VPNTestingStatusProvider,
  Status: VPNTestingStatus,
  Basic: VPNTestingStatusBasic,
  Detailed: VPNTestingStatusDetailed,
  Icon: VPNTestingStatusIcon,
  Text: VPNTestingStatusText,
  Details: VPNTestingStatusDetails,
  Loading: VPNTestingLoading,
  Error: VPNTestingError,
  Container: VPNTestingStatusContainer,
  useStatus: useVPNTestingStatus
};

export default VPNTestingStatus;
