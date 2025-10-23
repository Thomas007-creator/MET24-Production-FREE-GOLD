
/**
 * MCP Bridge Sync Demo Component
 * 
 * Demonstratie van communicatie tussen User App en MCP-Bridge
 * Toont hoe V14 tabellen worden gesynced via de bridge
 * 
 * @version 14.0.0
 * @author Thomas
 */

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Progress, Chip, Badge, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react';
import { 
  RefreshCw, 
  Database, 
  CheckCircle, 
  XCircle,
  Clock,
  AlertTriangle,
  Send,
  Download,
  Upload,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { 
  syncDataToBridge, 
  syncV14Tables, 
  testMCPBridgeConnection, 
  getMCPBridgeSyncStatus,
  retrySync
} from '../services/mcpBridgeSyncService';

interface SyncTable {
  name: string;
  status: 'pending' | 'syncing' | 'completed' | 'error';
  recordCount: number;
  lastSync: number | null;
  errorMessage?: string;
}

const MCPBridgeSyncDemo: React.FC = () => {
  const { userData } = useAppStore();
  const [syncStatus, setSyncStatus] = useState(getMCPBridgeSyncStatus());
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [syncTables, setSyncTables] = useState<SyncTable[]>([]);

  // V14 tables to sync
  const v14Tables = [
    'tasks',
    'contacts', 
    'future_extensions',
    'extension_events',
    'extension_settings',
    'users',
    'chat_messages',
    'journal_entries',
    'ai_interactions',
    'settings',
    'mbti_profiles',
    'life_areas_progress',
    'onboarding_states',
    'levensgebieden_questionnaires',
  ];

  // Test MCP Bridge connection
  const testConnection = async () => {
    setIsLoading(true);
    try {
      const connected = await testMCPBridgeConnection();
      setIsConnected(connected);
    } catch (error) {
      console.error('Connection test failed:', error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Sync specific table
  const handleSyncTable = async (tableName: string) => {
    setIsLoading(true);
    try {
      // Update table status
      setSyncTables(prev => prev.map(table => 
        table.name === tableName 
          ? { ...table, status: 'syncing' }
          : table
      ));

      const result = await syncDataToBridge(tableName, 'bidirectional');
      
      // Update table status
      setSyncTables(prev => prev.map(table => 
        table.name === tableName 
          ? { 
              ...table, 
              status: 'completed',
              recordCount: result.syncedRecords,
              lastSync: Date.now()
            }
          : table
      ));

      setSyncStatus(getMCPBridgeSyncStatus());
    } catch (error) {
      console.error(`Sync failed for ${tableName}:`, error);
      
      // Update table status with error
      setSyncTables(prev => prev.map(table => 
        table.name === tableName 
          ? { 
              ...table, 
              status: 'error',
              errorMessage: error instanceof Error ? error.message : String(error)
            }
          : table
      ));
    } finally {
      setIsLoading(false);
    }
  };

  // Sync all V14 tables
  const handleSyncAll = async () => {
    setIsLoading(true);
    try {
      // Update all tables to syncing
      setSyncTables(prev => prev.map(table => ({ ...table, status: 'syncing' })));

      await syncV14Tables();
      
      // Update all tables to completed
      setSyncTables(prev => prev.map(table => ({ 
        ...table, 
        status: 'completed',
        lastSync: Date.now()
      })));

      setSyncStatus(getMCPBridgeSyncStatus());
    } catch (error) {
      console.error('Sync all failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Retry failed sync
  const handleRetrySync = async (tableName: string) => {
    setIsLoading(true);
    try {
      await retrySync(tableName);
      
      // Update table status
      setSyncTables(prev => prev.map(table => 
        table.name === tableName 
          ? { 
              ...table, 
              status: 'completed',
              lastSync: Date.now(),
              errorMessage: undefined
            }
          : table
      ));

      setSyncStatus(getMCPBridgeSyncStatus());
    } catch (error) {
      console.error(`Retry failed for ${tableName}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize sync tables
  useEffect(() => {
    const initialTables: SyncTable[] = v14Tables.map(table => ({
      name: table,
      status: 'pending',
      recordCount: 0,
      lastSync: null,
    }));
    setSyncTables(initialTables);
  }, []);

  // Update sync status
  useEffect(() => {
    const interval = setInterval(() => {
      setSyncStatus(getMCPBridgeSyncStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Test connection on mount
  useEffect(() => {
    testConnection();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'syncing': return 'warning';
      case 'error': return 'danger';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'syncing': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">MCP Bridge Sync</h1>
        <p className="text-gray-600">
          Communicatie tussen User App en MCP-Bridge voor V14 tabellen
        </p>
      </div>

      {/* Connection Status */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <h2 className="text-xl font-semibold">MCP Bridge Connection</h2>
            <Button
              size="sm"
              color="primary"
              variant="flat"
              onPress={testConnection}
              isLoading={isLoading}
              startContent={<Wifi className="w-4 h-4" />}
            >
              Test Connection
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <div className="flex items-center gap-4">
            {isConnected === null ? (
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="text-gray-500">Testing connection...</span>
              </div>
            ) : isConnected ? (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-600">Connected to MCP Bridge (localhost:3001)</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-600">Connection failed</span>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Sync Status */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-xl font-semibold">Sync Status</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {syncStatus.recordsSynced}
              </div>
              <div className="text-sm text-gray-600">Records Synced</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {syncStatus.tablesSynced.length}
              </div>
              <div className="text-sm text-gray-600">Tables Synced</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {syncStatus.errorCount}
              </div>
              <div className="text-sm text-gray-600">Errors</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {syncStatus.lastSync ? 
                  new Date(syncStatus.lastSync).toLocaleTimeString() : 
                  'Never'
                }
              </div>
              <div className="text-sm text-gray-600">Last Sync</div>
            </div>
          </div>

          {syncStatus.isSyncing && (
            <div className="mt-4">
              <Progress 
                value={syncStatus.tablesSynced.length > 0 ? 
                  (syncStatus.tablesSynced.length / v14Tables.length) * 100 : 0
                } 
                className="w-full"
              />
              <p className="text-sm text-gray-600 mt-2 text-center">
                Syncing... {syncStatus.tablesSynced.length} / {v14Tables.length} tables
              </p>
            </div>
          )}

          {syncStatus.lastError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">
                <strong>Last Error:</strong> {syncStatus.lastError}
              </p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Actions */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-xl font-semibold">Sync Actions</h2>
        </CardHeader>
        <CardBody>
          <div className="flex gap-4 mb-6">
            <Button
              color="primary"
              size="lg"
              onPress={handleSyncAll}
              isLoading={isLoading}
              startContent={<RefreshCw className="w-5 h-5" />}
            >
              Sync All V14 Tables
            </Button>
            
            <Button
              color="secondary"
              size="lg"
              variant="flat"
              onPress={() => setSyncStatus(getMCPBridgeSyncStatus())}
              startContent={<Database className="w-5 h-5" />}
            >
              Refresh Status
            </Button>
          </div>

          {/* MBTI Context Info */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">MBTI Context</h3>
            <div className="text-sm text-blue-700">
              <p><strong>User Type:</strong> {userData?.mbtiType || 'Not set'}</p>
              <p><strong>User ID:</strong> {userData?.id || 'Not available'}</p>
              <p><strong>Session:</strong> Active</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Tables Status */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">V14 Tables Sync Status</h2>
        </CardHeader>
        <CardBody>
          <Table aria-label="V14 Tables Sync Status">
            <TableHeader>
              <TableColumn>TABLE</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>RECORDS</TableColumn>
              <TableColumn>LAST SYNC</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {syncTables.map((table) => (
                <TableRow key={table.name}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">{table.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(table.status)}
                      <Badge color={getStatusColor(table.status)}>
                        {table.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {table.recordCount} records
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {table.lastSync ? 
                        new Date(table.lastSync).toLocaleTimeString() : 
                        'Never'
                      }
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        onPress={() => handleSyncTable(table.name)}
                        isLoading={isLoading && table.status === 'syncing'}
                        startContent={<Send className="w-3 h-3" />}
                      >
                        Sync
                      </Button>
                      {table.status === 'error' && (
                        <Button
                          size="sm"
                          color="warning"
                          variant="flat"
                          onPress={() => handleRetrySync(table.name)}
                          startContent={<RefreshCw className="w-3 h-3" />}
                        >
                          Retry
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default MCPBridgeSyncDemo;
