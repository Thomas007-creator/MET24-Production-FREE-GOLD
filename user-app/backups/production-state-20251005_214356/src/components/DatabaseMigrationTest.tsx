import React, { useState, useEffect } from 'react';
import { database, dbHelpers } from '../database';
import { logger } from '../utils/logger';

interface DatabaseStatus {
  version: string;
  schema: string;
  status: string;
  tables: any;
}

const DatabaseMigrationTest: React.FC = () => {
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [met24Tables, setMet24Tables] = useState<any>({});

  useEffect(() => {
    testDatabaseMigration();
  }, []);

  const testDatabaseMigration = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      logger.info('🧪 Testing WatermelonDB V11 migration...');
      
      // Get database status
      const status = await dbHelpers.getDatabaseStatus();
      setDbStatus(status);
      
      // Test MET2.4 tables specifically
      const met24TableTests = {
        domains: await testTable('met24_domains'),
        domain_relations: await testTable('met24_domain_relations'),
        new_insights: await testTable('met24_new_insights'),
        practical_applications: await testTable('met24_practical_applications'),
        user_progress: await testTable('met24_user_progress'),
        sync_queue: await testTable('met24_sync_queue'),
        server_sync_status: await testTable('met24_server_sync_status')
      };
      
      setMet24Tables(met24TableTests);
      
      logger.info('✅ Database migration test completed', { status, met24TableTests });
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg);
      logger.error('❌ Database migration test failed', { error: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  const testTable = async (tableName: string) => {
    try {
      const collection = database.get(tableName);
      const count = await collection.query().fetchCount();
      return { accessible: true, recordCount: count };
    } catch (err) {
      return { 
        accessible: false, 
        error: err instanceof Error ? err.message : String(err) 
      };
    }
  };

  const createTestRecord = async (tableName: string) => {
    try {
      const collection = database.get(tableName);
      
      await database.write(async () => {
        await collection.create((record: any) => {
          // Set basic fields based on table type
          if (tableName === 'met24_domains') {
            record.domainId = `test-domain-${Date.now()}`;
            record.domainNumber = 999;
            record.domainName = 'Test Domain';
            record.domainDescription = 'Test domain for migration verification';
            record.philosophicalLevel = 'Test';
            record.practicalApplications = JSON.stringify(['test1', 'test2']);
            record.metadata = JSON.stringify({ test: true });
            record.syncStatus = 'pending';
          } else if (tableName === 'met24_domain_relations') {
            record.relationId = `test-relation-${Date.now()}`;
            record.sourceDomainId = 'test-source';
            record.targetDomainId = 'test-target';
            record.relationType = 'test';
            record.relationStrength = 5;
            record.relationDescription = 'Test relation';
            record.bidirectional = true;
            record.metadata = JSON.stringify({ test: true });
            record.syncStatus = 'pending';
          }
          // Add more table types as needed
          
          record.createdAt = Date.now();
          record.updatedAt = Date.now();
        });
      });
      
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : String(err) 
      };
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">🧪 Database Migration Test</h2>
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span>Testing database migration...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">🧪 Database Migration Test</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {dbStatus && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">📊 Database Status</h3>
          <div className="bg-gray-100 p-4 rounded">
            <p><strong>Version:</strong> {dbStatus.version}</p>
            <p><strong>Schema:</strong> {dbStatus.schema}</p>
            <p><strong>Status:</strong> {dbStatus.status}</p>
          </div>
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">🔍 MET2.4 Tables Test</h3>
        <div className="space-y-2">
          {Object.entries(met24Tables).map(([tableName, result]: [string, any]) => (
            <div key={tableName} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <span className="font-mono text-sm">{tableName}</span>
                {result.accessible ? (
                  <span className="ml-2 text-green-600">✅ Accessible ({result.recordCount} records)</span>
                ) : (
                  <span className="ml-2 text-red-600">❌ Error: {result.error}</span>
                )}
              </div>
              {result.accessible && (
                <button
                  onClick={() => createTestRecord(tableName)}
                  className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                >
                  Test Write
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <button
        onClick={testDatabaseMigration}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        🔄 Re-test Migration
      </button>
    </div>
  );
};

export default DatabaseMigrationTest;
