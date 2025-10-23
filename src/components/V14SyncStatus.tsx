/**
 * MET2.4 V14 Sync Status Component
 * 
 * Versie: 2.4.2
 * Datum: 2025-01-07
 * 
 * Features:
 * - Real-time sync status display
 * - App-specific configuration
 * - Sync controls (start/stop/force)
 * - Error handling en retry
 * - Cross-app sync monitoring
 * 
 * @author Thomas
 * @version 2.4.2
 */

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Chip, Progress, Badge } from '@nextui-org/react';
import { 
  RefreshCw, 
  Play, 
  Pause, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Database,
  Wifi,
  WifiOff
} from 'lucide-react';
import v14AppSyncService from '../services/v14AppSyncService';
import { logger } from '../utils/logger';

interface SyncStatus {
  isActive: boolean;
  lastSync: Date | null;
  errorCount: number;
  successCount: number;
  currentApp: {
    port: number;
    name: string;
    mcpBridgeUrl: string;
    syncInterval: number;
    batchSize: number;
  };
  isInitialized: boolean;
}

const V14SyncStatus: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update sync status periodically
  useEffect(() => {
    const updateStatus = () => {
      const status = v14AppSyncService.getSyncStatus();
      setSyncStatus(status);
    };

    // Initial update
    updateStatus();

    // Update every 5 seconds
    const interval = setInterval(updateStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleForceSync = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await v14AppSyncService.forceSyncAll();
      logger.info('Force sync completed');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      logger.error('Force sync failed:', undefined, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncTable = async (tableName: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await v14AppSyncService.syncTable(tableName);
      logger.info(`Table ${tableName} synced successfully`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      logger.error(`Table ${tableName} sync failed:`, undefined, error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = () => {
    if (!syncStatus) return 'default';
    if (syncStatus.errorCount > 0) return 'danger';
    if (syncStatus.isActive) return 'warning';
    return 'success';
  };

  const getStatusIcon = () => {
    if (!syncStatus) return <Clock className="w-4 h-4" />;
    if (syncStatus.errorCount > 0) return <AlertCircle className="w-4 h-4" />;
    if (syncStatus.isActive) return <RefreshCw className="w-4 h-4 animate-spin" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  const getConnectionStatus = () => {
    if (!syncStatus) return { connected: false, icon: <WifiOff className="w-4 h-4" /> };
    
    // Simple check based on error count
    const connected = syncStatus.errorCount === 0;
    return {
      connected,
      icon: connected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />
    };
  };

  if (!syncStatus) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            <h3 className="text-lg font-semibold">V14 Sync Status</h3>
          </div>
        </CardHeader>
        <CardBody>
          <div className="text-center py-4">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-400" />
            <p className="text-gray-500">Loading sync status...</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  const connectionStatus = getConnectionStatus();

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            <h3 className="text-lg font-semibold">V14 Sync Status</h3>
            <Chip 
              color={getStatusColor()} 
              variant="flat" 
              size="sm"
              startContent={getStatusIcon()}
            >
              {syncStatus.isActive ? 'Syncing' : 
               syncStatus.errorCount > 0 ? 'Error' : 'Ready'}
            </Chip>
          </div>
          <div className="flex items-center gap-2">
            {connectionStatus.icon}
            <span className="text-sm text-gray-500">
              {syncStatus.currentApp.name} (:{syncStatus.currentApp.port})
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardBody className="space-y-4">
        {/* App Configuration */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>App:</strong> {syncStatus.currentApp.name}
          </div>
          <div>
            <strong>Port:</strong> {syncStatus.currentApp.port}
          </div>
          <div>
            <strong>Sync Interval:</strong> {syncStatus.currentApp.syncInterval / 1000}s
          </div>
          <div>
            <strong>Batch Size:</strong> {syncStatus.currentApp.batchSize}
          </div>
        </div>

        {/* Sync Statistics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {syncStatus.successCount}
            </div>
            <div className="text-sm text-gray-500">Successful</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {syncStatus.errorCount}
            </div>
            <div className="text-sm text-gray-500">Errors</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {syncStatus.lastSync ? 
                Math.round((Date.now() - syncStatus.lastSync.getTime()) / 1000) : 
                '--'
              }s
            </div>
            <div className="text-sm text-gray-500">Last Sync</div>
          </div>
        </div>

        {/* Connection Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            {connectionStatus.icon}
            <span className="font-medium">
              MCP-Bridge Connection
            </span>
          </div>
          <Chip 
            color={connectionStatus.connected ? 'success' : 'danger'} 
            variant="flat" 
            size="sm"
          >
            {connectionStatus.connected ? 'Connected' : 'Disconnected'}
          </Chip>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium">Sync Error</span>
            </div>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Sync Controls */}
        <div className="flex gap-2">
          <Button
            color="primary"
            variant="flat"
            size="sm"
            startContent={<RefreshCw className="w-4 h-4" />}
            onPress={handleForceSync}
            isLoading={isLoading}
            isDisabled={syncStatus.isActive}
          >
            Force Sync All
          </Button>
          
          <Button
            color="secondary"
            variant="flat"
            size="sm"
            onPress={() => handleSyncTable('tasks')}
            isLoading={isLoading}
            isDisabled={syncStatus.isActive}
          >
            Sync Tasks
          </Button>
          
          <Button
            color="secondary"
            variant="flat"
            size="sm"
            onPress={() => handleSyncTable('contacts')}
            isLoading={isLoading}
            isDisabled={syncStatus.isActive}
          >
            Sync Contacts
          </Button>
        </div>

        {/* Sync Progress */}
        {syncStatus.isActive && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Syncing...</span>
              <span>In Progress</span>
            </div>
            <Progress 
              isIndeterminate 
              color="primary" 
              className="w-full"
            />
          </div>
        )}

        {/* Last Sync Info */}
        {syncStatus.lastSync && (
          <div className="text-xs text-gray-500 text-center">
            Last sync: {syncStatus.lastSync.toLocaleString()}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default V14SyncStatus;
