/**
 * VPN Status Page - MET2.4 V14
 * 
 * Dedicated page voor VPN status monitoring
 * Toont alle VPN gerelateerde informatie
 * 
 * @version 14.0.0
 * @author Thomas
 */

import React, { useState, useEffect } from 'react';
import { useVPNPipeline } from '../hooks/useVPNPipeline';
import VPNStatusIndicator from '../components/VPNStatusIndicator';
import VPNSyncStatus from '../components/VPNSyncStatus';
import VPNTestingStatus from '../components/VPNTestingStatus';
import { logger } from '../utils/logger';

export const VPNStatusPage: React.FC = () => {
  const {
    vpnManager,
    vpnSyncManager,
    testingManager,
    isInitialized,
    isLoading,
    error
  } = useVPNPipeline();

  const [vpnStatus, setVpnStatus] = useState<any>(null);
  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [testResults, setTestResults] = useState<any>(null);

  useEffect(() => {
    const updateStatus = async () => {
      if (vpnManager) {
        try {
          const status = vpnManager.getVPNStatus();
          setVpnStatus(status);
        } catch (error) {
          logger.error('Failed to get VPN status:', { error });
        }
      }

      if (vpnSyncManager) {
        try {
          const status = vpnSyncManager.getSyncQueueStatus();
          setSyncStatus(status);
        } catch (error) {
          logger.error('Failed to get sync status:', { error });
        }
      }

      if (testingManager) {
        try {
          const results = testingManager.getTestResults();
          const summary = testingManager.getTestSummary();
          setTestResults({ results, summary });
        } catch (error) {
          logger.error('Failed to get test results:', { error });
        }
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 30000);

    return () => clearInterval(interval);
  }, [vpnManager, vpnSyncManager, testingManager]);

  const handleRunTests = async () => {
    if (testingManager) {
      try {
        await testingManager.runHybridTests();
        // Status will be updated by the interval
      } catch (error) {
        logger.error('Failed to run tests:', { error });
      }
    }
  };

  const handleForceSync = async () => {
    if (vpnSyncManager) {
      try {
        await vpnSyncManager.forceSyncAll();
        // Status will be updated by the interval
      } catch (error) {
        logger.error('Failed to force sync:', { error });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Initializing VPN Pipeline...</h2>
          <p className="text-gray-500 mt-2">Please wait while we set up your secure connection</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-600 mb-2">VPN Pipeline Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">VPN Pipeline Status</h1>
          <p className="text-gray-600 mt-2">Monitor your secure connection and sync status</p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* VPN Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">VPN Connection</h3>
              <VPNStatusIndicator 
                vpnManager={vpnManager!} 
                showDetails={true}
              />
            </div>
            
            {vpnStatus && (
              <div className="space-y-2 text-sm text-gray-600">
                <div>Type: {vpnStatus.vpnType.toUpperCase()}</div>
                <div>Quality: {vpnStatus.connectionQuality}</div>
                <div>Connected: {vpnStatus.isConnected ? 'Yes' : 'No'}</div>
                <div>Secure: {vpnStatus.isSecure ? 'Yes' : 'No'}</div>
                {vpnStatus.ipAddress && (
                  <div>IP: {vpnStatus.ipAddress}</div>
                )}
              </div>
            )}
          </div>

          {/* Sync Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Sync Status</h3>
              <VPNSyncStatus 
                vpnSyncManager={vpnSyncManager!} 
                showDetails={true}
              />
            </div>
            
            {syncStatus && (
              <div className="space-y-2 text-sm text-gray-600">
                <div>Queue Length: {syncStatus.queueLength}</div>
                <div>Status: {syncStatus.isSyncing ? 'Active' : 'Idle'}</div>
                <div>VPN Protected: ✅</div>
              </div>
            )}
            
            <button
              onClick={handleForceSync}
              className="mt-4 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
            >
              Force Sync
            </button>
          </div>

          {/* Testing Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Testing Status</h3>
              <VPNTestingStatus 
                testingManager={testingManager!} 
                showDetails={true}
              />
            </div>
            
            {testResults && (
              <div className="space-y-2 text-sm text-gray-600">
                <div>Total Tests: {testResults.summary.total}</div>
                <div>Passed: {testResults.summary.passed}</div>
                <div>Failed: {testResults.summary.failed}</div>
                <div>Success Rate: {testResults.summary.successRate.toFixed(1)}%</div>
              </div>
            )}
            
            <button
              onClick={handleRunTests}
              className="mt-4 bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
            >
              Run Tests
            </button>
          </div>
        </div>

        {/* Detailed Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Status</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* VPN Details */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">VPN Details</h4>
              <div className="bg-gray-50 rounded p-3 text-sm">
                <pre>{JSON.stringify(vpnStatus, null, 2)}</pre>
              </div>
            </div>

            {/* Sync Details */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Sync Details</h4>
              <div className="bg-gray-50 rounded p-3 text-sm">
                <pre>{JSON.stringify(syncStatus, null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Test Results */}
        {testResults && testResults.results.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Results</h3>
            
            <div className="space-y-3">
              {testResults.results.map((result: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <span className={`text-lg ${result.success ? 'text-green-500' : 'text-red-500'}`}>
                      {result.success ? '✅' : '❌'}
                    </span>
                    <span className="font-medium">{result.testName}</span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    {result.duration && `${result.duration}ms`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VPNStatusPage;








