/**
 * V14 Dynamic Sync Demo Component
 * 
 * Demonstratie van automatische tabel detectie en sync
 * Toont hoe nieuwe tabellen automatisch worden geïncludeerd
 * 
 * @version 14.0.0
 * @author Thomas
 */

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Progress, Chip, Badge, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react';
import { 
  RefreshCw, 
  Search, 
  Database, 
  CheckCircle, 
  XCircle,
  Clock,
  AlertTriangle,
  Plus,
  Eye
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { 
  detectNewTables, 
  syncAllTables, 
  getDynamicSyncStatus, 
  testSupabaseConnection 
} from '../services/v14DynamicSync';
import database from '../database'; // V14 database

interface TableInfo {
  name: string;
  schema: string;
  recordCount: number;
  lastSync: number | null;
  syncStatus: 'pending' | 'syncing' | 'completed' | 'error';
  errorMessage?: string;
}

const V14DynamicSyncDemo: React.FC = () => {
  const { userData } = useAppStore();
  const [syncStatus, setSyncStatus] = useState(getDynamicSyncStatus());
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [detectedTables, setDetectedTables] = useState<TableInfo[]>([]);
  const [newTables, setNewTables] = useState<string[]>([]);
  const [watermelondbTables, setWatermelondbTables] = useState<string[]>([]);

  // Test Supabase connectie
  const testConnection = async () => {
    setIsLoading(true);
    try {
      const connected = await testSupabaseConnection();
      setIsConnected(connected);
    } catch (error) {
      console.error('Connection test failed:', error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Detecteer nieuwe tabellen
  const handleDetectTables = async () => {
    setIsLoading(true);
    try {
      const newTablesFound = await detectNewTables();
      setNewTables(newTablesFound);
      
      // Update sync status
      setSyncStatus(getDynamicSyncStatus());
    } catch (error) {
      console.error('Table detection failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sync alle tabellen
  const handleSyncAll = async () => {
    setIsLoading(true);
    try {
      await syncAllTables();
      setSyncStatus(getDynamicSyncStatus());
      
      // Herlaad WatermelonDB tabellen
      loadWatermelonDBTables();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Laad WatermelonDB tabellen
  const loadWatermelonDBTables = () => {
    try {
      const tables = Object.keys(database.collections);
      setWatermelondbTables(tables);
    } catch (error) {
      console.error('Failed to load WatermelonDB tables:', error);
    }
  };

  // Update sync status
  useEffect(() => {
    const interval = setInterval(() => {
      setSyncStatus(getDynamicSyncStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Test connectie en laad tabellen bij mount
  useEffect(() => {
    testConnection();
    loadWatermelonDBTables();
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
        <h1 className="text-3xl font-bold mb-2">V14 Dynamic Sync</h1>
        <p className="text-gray-600">
          Automatische detectie en sync van nieuwe tabellen
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
              startContent={<Database className="w-4 h-4" />}
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
          </div>
        </CardBody>
      </Card>

      {/* Sync Status */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-xl font-semibold">Dynamic Sync Status</h2>
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
              <div className="text-2xl font-bold text-purple-600">
                {syncStatus.tablesDetected.length}
              </div>
              <div className="text-sm text-gray-600">Tables Detected</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {syncStatus.newTablesFound.length}
              </div>
              <div className="text-sm text-gray-600">New Tables</div>
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

      {/* Actions */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-xl font-semibold">Dynamic Sync Actions</h2>
        </CardHeader>
        <CardBody>
          <div className="flex gap-4 mb-6">
            <Button
              color="primary"
              size="lg"
              onPress={handleDetectTables}
              isLoading={isLoading}
              startContent={<Search className="w-5 h-5" />}
            >
              Detect New Tables
            </Button>
            
            <Button
              color="secondary"
              size="lg"
              onPress={handleSyncAll}
              isLoading={isLoading}
              startContent={<RefreshCw className="w-5 h-5" />}
            >
              Sync All Tables
            </Button>
            
            <Button
              color="success"
              size="lg"
              variant="flat"
              onPress={loadWatermelonDBTables}
              startContent={<Database className="w-5 h-5" />}
            >
              Refresh Tables
            </Button>
          </div>

          {/* New Tables Alert */}
          {newTables.length > 0 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Plus className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-800">New Tables Detected!</h3>
              </div>
              <p className="text-sm text-blue-700 mb-2">
                Found {newTables.length} new tables that can be synced:
              </p>
              <div className="flex flex-wrap gap-2">
                {newTables.map((table) => (
                  <Chip key={table} size="sm" color="primary">
                    {table}
                  </Chip>
                ))}
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Tables Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supabase Tables */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Supabase Tables</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-2">
              {syncStatus.tablesDetected.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No tables detected yet. Click "Detect New Tables" to scan.
                </p>
              ) : (
                syncStatus.tablesDetected.map((table) => (
                  <div key={table.name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(table.syncStatus)}
                      <span className="font-medium">{table.name}</span>
                      <Chip size="sm" color="default">{table.schema}</Chip>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge color={getStatusColor(table.syncStatus)}>
                        {table.syncStatus}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {table.recordCount} records
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardBody>
        </Card>

        {/* WatermelonDB Tables */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">WatermelonDB V14 Tables</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-2">
              {watermelondbTables.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No WatermelonDB tables found.
                </p>
              ) : (
                watermelondbTables.map((table) => (
                  <div key={table} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="font-medium">{table}</span>
                    </div>
                    <Chip size="sm" color="success">V14</Chip>
                  </div>
                ))
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Features Info */}
      <Card className="mt-6">
        <CardHeader>
          <h2 className="text-xl font-semibold">V14 Dynamic Sync Features</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Automatic Detection</h3>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Scans Supabase for new tables</li>
                <li>• Compares with WatermelonDB schema</li>
                <li>• Identifies missing tables</li>
                <li>• Supports all V14 schemas</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Future-Proof</h3>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Automatically includes new tables</li>
                <li>• No manual configuration needed</li>
                <li>• Supports extension system</li>
                <li>• Scales with schema updates</li>
              </ul>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default V14DynamicSyncDemo;
