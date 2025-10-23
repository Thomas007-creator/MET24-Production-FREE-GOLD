/**
 * MET2.4 V14 Sync Service Demo Component
 * 
 * Versie: 2.4.2
 * Datum: 2025-01-07
 * 
 * Features:
 * - Test MCP-Bridge connection
 * - Sync individual tables
 * - Sync all V14 tables
 * - Real-time sync status
 * - MBTI context display
 * - Error handling demo
 * 
 * @author Thomas
 * @version 2.4.2
 */

import React, { useState, useEffect } from 'react';
import {
  syncDataToBridge,
  syncAllV14Tables,
  testMCPBridgeConnection,
  getMCPBridgeHealthStatus,
  getSyncStatus,
  clearSyncStatus,
  isSyncInProgress,
  getMBTIContext,
  type SyncResponse,
  type MBTIContext
} from '../services/syncService';

const SyncServiceDemo: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [syncStatus, setSyncStatus] = useState<Map<string, string>>(new Map());
  const [mbtiContext, setMbtiContext] = useState<MBTIContext | null>(null);
  const [syncResults, setSyncResults] = useState<SyncResponse[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('tasks');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [healthStatus, setHealthStatus] = useState<any>(null);

  // V14 tables for selection
  const v14Tables = [
    'users', 'mbti_profiles', 'settings', 'life_areas_progress',
    'onboarding_states', 'chat_messages', 'journal_entries', 'contacts',
    'ai_interactions', 'vector_embeddings', 'ai_action_plans', 'super_insights',
    'rewind_sessions', 'ai_learning_pipeline', 'ai_personalization_engine',
    'offline_ai_models', 'user_behavior_analytics', 'external_ai_services',
    'interactive_ai_sessions', 'dynamic_content_creation', 'ai_service_health_monitoring',
    'content_items', 'content_chunks', 'content_pointers', 'offline_packs',
    'content_recommendations', 'content_sources', 'mbti_learning_paths',
    'content_analytics', 'media_intelligence', 'content_sync_status',
    'subscription_plans', 'user_subscriptions', 'payment_transactions',
    'upgrade_flow_events', 'met24_domains', 'met24_domain_relations',
    'met24_new_insights', 'met24_practical_applications', 'met24_user_progress',
    'met24_sync_queue', 'met24_server_sync_status', 'levensgebieden_questionnaires',
    'tasks', 'sync_status', 'feature_usage', 'mbti_contents', 'future_extensions'
  ];

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Update sync status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setSyncStatus(getSyncStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const loadInitialData = async () => {
    try {
      // Test connection
      const connected = await testMCPBridgeConnection();
      setIsConnected(connected);

      // Get detailed health status
      const health = await getMCPBridgeHealthStatus();
      setHealthStatus(health);

      // Get MBTI context
      const context = await getMBTIContext();
      setMbtiContext(context);

      // Get initial sync status
      setSyncStatus(getSyncStatus());
    } catch (error) {
      console.error('Error loading initial data:', error);
      setError('Failed to load initial data');
    }
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const connected = await testMCPBridgeConnection();
      setIsConnected(connected);
      
      const health = await getMCPBridgeHealthStatus();
      setHealthStatus(health);
    } catch (error) {
      setError('Connection test failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncTable = async () => {
    if (isSyncInProgress()) {
      setError('Sync already in progress');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const result = await syncDataToBridge(selectedTable, {
        batchSize: 10,
        includeMBTIContext: true
      });
      
      setSyncResults([result]);
      setSyncStatus(getSyncStatus());
    } catch (error) {
      setError(`Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncAllTables = async () => {
    if (isSyncInProgress()) {
      setError('Sync already in progress');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const results = await syncAllV14Tables({
        batchSize: 5,
        includeMBTIContext: true
      });
      
      setSyncResults(results);
      setSyncStatus(getSyncStatus());
    } catch (error) {
      setError(`Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearStatus = () => {
    clearSyncStatus();
    setSyncStatus(new Map());
    setSyncResults([]);
    setError(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'syncing': return 'text-blue-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getConnectionStatus = () => {
    if (isConnected === null) return 'text-gray-600';
    return isConnected ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🔄 MET2.4 V14 Sync Service Demo
        </h1>
        <p className="text-gray-600">
          Test de MCP-Bridge integratie en sync functionaliteit
        </p>
      </div>

      {/* Connection Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">🔗 Connection Status</h2>
        <div className="flex items-center gap-4">
          <div className={`text-lg font-medium ${getConnectionStatus()}`}>
            {isConnected === null ? '⏳ Testing...' : 
             isConnected ? '✅ Connected' : '❌ Disconnected'}
          </div>
          <button
            onClick={handleTestConnection}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Connection'}
          </button>
        </div>
      </div>

      {/* Health Status */}
      {healthStatus && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">🏥 MCP-Bridge Health Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Status:</strong> 
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                healthStatus.connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {healthStatus.connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <div><strong>Response Time:</strong> {healthStatus.responseTime || 'N/A'}</div>
            {healthStatus.status && (
              <>
                <div><strong>Version:</strong> {healthStatus.status.version}</div>
                <div><strong>Environment:</strong> {healthStatus.status.environment}</div>
                <div><strong>Uptime:</strong> {Math.round(healthStatus.status.uptime / 1000)}s</div>
                <div><strong>Memory:</strong> {healthStatus.status.services?.memory?.percentage || 0}%</div>
              </>
            )}
            {healthStatus.error && (
              <div className="col-span-2 text-red-600">
                <strong>Error:</strong> {healthStatus.error}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MBTI Context */}
      {mbtiContext && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">🧠 MBTI Context</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Type:</strong> {mbtiContext.type}</div>
            <div><strong>Session ID:</strong> {mbtiContext.sessionId}</div>
            <div><strong>User ID:</strong> {mbtiContext.userId || 'N/A'}</div>
            <div><strong>Timestamp:</strong> {mbtiContext.timestamp}</div>
          </div>
        </div>
      )}

      {/* Sync Controls */}
      <div className="mb-6 p-4 bg-green-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">⚙️ Sync Controls</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Single Table Sync */}
          <div>
            <label className="block text-sm font-medium mb-2">Select Table:</label>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="w-full p-2 border rounded mb-3"
            >
              {v14Tables.map(table => (
                <option key={table} value={table}>{table}</option>
              ))}
            </select>
            <button
              onClick={handleSyncTable}
              disabled={isLoading || !isConnected}
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              {isLoading ? 'Syncing...' : 'Sync Selected Table'}
            </button>
          </div>

          {/* All Tables Sync */}
          <div>
            <label className="block text-sm font-medium mb-2">Sync All Tables:</label>
            <button
              onClick={handleSyncAllTables}
              disabled={isLoading || !isConnected}
              className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
            >
              {isLoading ? 'Syncing All...' : 'Sync All V14 Tables'}
            </button>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={handleClearStatus}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Clear Status
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800 mb-2">❌ Error</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Sync Status */}
      <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">📊 Sync Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          {Array.from(syncStatus.entries()).map(([table, status]) => (
            <div key={table} className="flex justify-between">
              <span className="truncate">{table}:</span>
              <span className={`font-medium ${getStatusColor(status)}`}>
                {status}
              </span>
            </div>
          ))}
        </div>
        {syncStatus.size === 0 && (
          <p className="text-gray-500 text-center py-4">No sync operations yet</p>
        )}
      </div>

      {/* Sync Results */}
      {syncResults.length > 0 && (
        <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">📈 Sync Results</h2>
          <div className="space-y-2">
            {syncResults.map((result, index) => (
              <div key={index} className="p-3 bg-white rounded border">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">
                    {result.success ? '✅' : '❌'} 
                    {result.success ? 'Success' : 'Failed'}
                  </span>
                  <span className="text-sm text-gray-500">{result.timestamp}</span>
                </div>
                <div className="text-sm">
                  <div>Records Synced: {result.syncedCount}</div>
                  {result.errors && result.errors.length > 0 && (
                    <div className="text-red-600">
                      Errors: {result.errors.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Usage Examples */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">💡 Usage Examples</h2>
        <div className="space-y-3 text-sm">
          <div>
            <strong>Sync single table:</strong>
            <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
{`import { syncDataToBridge } from '../services/syncService';

// Sync tasks table
await syncDataToBridge('tasks', {
  batchSize: 20,
  includeMBTIContext: true
});`}
            </pre>
          </div>
          
          <div>
            <strong>Sync all tables:</strong>
            <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
{`import { syncAllV14Tables } from '../services/syncService';

// Sync all V14 tables
const results = await syncAllV14Tables({
  batchSize: 10,
  retryAttempts: 3
});`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyncServiceDemo;
