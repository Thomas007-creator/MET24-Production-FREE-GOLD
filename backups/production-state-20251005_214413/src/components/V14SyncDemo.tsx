/**
 * V14 Sync Demo Component
 * 
 * Demonstratie van V14 Supabase sync functionaliteit
 * 
 * @version 14.0.0
 * @author Thomas
 */

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Progress, Chip, Badge } from '@nextui-org/react';
import { 
  RefreshCw, 
  Upload, 
  Download, 
  Wifi, 
  WifiOff, 
  CheckCircle, 
  XCircle,
  Clock,
  Database,
  Cloud
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { 
  syncWithSupabase, 
  syncTableWithSupabase, 
  getSupabaseSyncStatus, 
  testSupabaseConnection 
} from '../services/v14SupabaseSync';
import database from '../database'; // V14 database

const V14SyncDemo: React.FC = () => {
  const { userData } = useAppStore();
  const [syncStatus, setSyncStatus] = useState(getSupabaseSyncStatus());
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastTest, setLastTest] = useState<Date | null>(null);

  // Test Supabase connectie
  const testConnection = async () => {
    setIsLoading(true);
    try {
      const connected = await testSupabaseConnection();
      setIsConnected(connected);
      setLastTest(new Date());
    } catch (error) {
      console.error('Connection test failed:', error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Sync alle tabellen
  const handleFullSync = async () => {
    setIsLoading(true);
    try {
      await syncWithSupabase();
      setSyncStatus(getSupabaseSyncStatus());
    } catch (error) {
      console.error('Full sync failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sync specifieke tabel
  const handleTableSync = async (tableName: string) => {
    setIsLoading(true);
    try {
      await syncTableWithSupabase(tableName);
      setSyncStatus(getSupabaseSyncStatus());
    } catch (error) {
      console.error(`Table sync failed for ${tableName}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update sync status
  useEffect(() => {
    const interval = setInterval(() => {
      setSyncStatus(getSupabaseSyncStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Test connectie bij mount
  useEffect(() => {
    testConnection();
  }, []);

  const tables = [
    { name: 'tasks', label: 'Tasks', color: 'primary' },
    { name: 'contacts', label: 'Contacts', color: 'secondary' },
    { name: 'future_extensions', label: 'Extensions', color: 'success' },
    { name: 'users', label: 'Users', color: 'warning' },
    { name: 'chat_messages', label: 'Messages', color: 'danger' },
    { name: 'journal_entries', label: 'Journal', color: 'default' },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">V14 Supabase Sync</h1>
        <p className="text-gray-600">
          Demonstratie van V14 database sync met Supabase
        </p>
      </div>

      {/* Connection Status */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <h2 className="text-xl font-semibold">Connection Status</h2>
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
                <span className="text-green-600">Connected to Supabase</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-600">Connection failed</span>
              </div>
            )}
            
            {lastTest && (
              <Chip size="sm" color="default">
                Last test: {lastTest.toLocaleTimeString()}
              </Chip>
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
                {syncStatus.recordsTotal}
              </div>
              <div className="text-sm text-gray-600">Total Records</div>
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
                value={syncStatus.recordsTotal > 0 ? 
                  (syncStatus.recordsSynced / syncStatus.recordsTotal) * 100 : 0
                } 
                className="w-full"
              />
              <p className="text-sm text-gray-600 mt-2 text-center">
                Syncing... {syncStatus.recordsSynced} / {syncStatus.recordsTotal}
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

      {/* Sync Actions */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-xl font-semibold">Sync Actions</h2>
        </CardHeader>
        <CardBody>
          <div className="flex gap-4 mb-6">
            <Button
              color="primary"
              size="lg"
              onPress={handleFullSync}
              isLoading={isLoading}
              startContent={<RefreshCw className="w-5 h-5" />}
            >
              Full Sync
            </Button>
            
            <Button
              color="secondary"
              size="lg"
              variant="flat"
              onPress={() => window.location.reload()}
              startContent={<Database className="w-5 h-5" />}
            >
              Refresh Status
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tables.map((table) => (
              <Card key={table.name} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold">{table.label}</h3>
                  </div>
                  <Chip size="sm" color={table.color as any}>
                    {table.name}
                  </Chip>
                </div>
                
                <Button
                  size="sm"
                  color={table.color as any}
                  variant="flat"
                  onPress={() => handleTableSync(table.name)}
                  isLoading={isLoading}
                  startContent={<Download className="w-4 h-4" />}
                  className="w-full"
                >
                  Sync {table.label}
                </Button>
              </Card>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Database Info */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Database Information</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Local Database (V14)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Version:</span>
                  <Badge color="success">14.0.0</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Schema:</span>
                  <span>MET2.4 Future-Ready</span>
                </div>
                <div className="flex justify-between">
                  <span>Tables:</span>
                  <span>35+ tables</span>
                </div>
                <div className="flex justify-between">
                  <span>Features:</span>
                  <span>Tasks, Contacts, Extensions</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Supabase Backend</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge color={isConnected ? "success" : "danger"}>
                    {isConnected ? "Connected" : "Disconnected"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Sync:</span>
                  <Badge color={syncStatus.isSyncing ? "warning" : "default"}>
                    {syncStatus.isSyncing ? "Syncing" : "Idle"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Last Sync:</span>
                  <span>{syncStatus.lastSync ? 
                    new Date(syncStatus.lastSync).toLocaleString() : 
                    'Never'
                  }</span>
                </div>
                <div className="flex justify-between">
                  <span>Errors:</span>
                  <Badge color={syncStatus.errorCount > 0 ? "danger" : "success"}>
                    {syncStatus.errorCount}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default V14SyncDemo;
