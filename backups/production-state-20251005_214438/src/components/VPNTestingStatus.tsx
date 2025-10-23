/**
 * VPN Testing Status - MET2.4 V14
 * 
 * React component voor VPN testing status weergave
 * Toont test results en VPN validatie status
 * 
 * @version 14.0.0
 * @author Thomas
 */

import React, { useState, useEffect } from 'react';
import { HybridTestingManager } from '../services/hybridTestingManager';
import { logger } from '../utils/logger';

interface VPNTestingStatusProps {
  testingManager: HybridTestingManager;
  showDetails?: boolean;
  className?: string;
}

interface TestSummary {
  total: number;
  passed: number;
  failed: number;
  successRate: number;
}

export const VPNTestingStatus: React.FC<VPNTestingStatusProps> = ({
  testingManager,
  showDetails = false,
  className = ''
}) => {
  const [testSummary, setTestSummary] = useState<TestSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    // Initial load
    updateTestSummary();

    // Update every 60 seconds
    const interval = setInterval(updateTestSummary, 60000);

    return () => clearInterval(interval);
  }, [testingManager]);

  const getStatusColor = (summary: TestSummary | null): string => {
    if (!summary) return 'text-gray-500';
    
    if (summary.successRate >= 90) return 'text-green-500';
    if (summary.successRate >= 70) return 'text-yellow-500';
    
    return 'text-red-500';
  };

  const getStatusIcon = (summary: TestSummary | null): string => {
    if (!summary) return '🧪';
    
    if (summary.successRate >= 90) return '✅';
    if (summary.successRate >= 70) return '⚠️';
    
    return '❌';
  };

  const getStatusText = (summary: TestSummary | null): string => {
    if (!summary) return 'Unknown';
    
    return `${summary.passed}/${summary.total} tests passed`;
  };

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        <span className="text-sm text-gray-500">Checking tests...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <span className="text-red-500">⚠️</span>
        <span className="text-sm text-red-500">Test Error</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className={`text-lg ${getStatusColor(testSummary)}`}>
        {getStatusIcon(testSummary)}
      </span>
      
      <div className="flex flex-col">
        <span className={`text-sm font-medium ${getStatusColor(testSummary)}`}>
          {getStatusText(testSummary)}
        </span>
        
        {showDetails && testSummary && (
          <div className="text-xs text-gray-500">
            <div>Success Rate: {testSummary.successRate.toFixed(1)}%</div>
            <div>Failed: {testSummary.failed}</div>
            <div>VPN Tests: Included</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VPNTestingStatus;
