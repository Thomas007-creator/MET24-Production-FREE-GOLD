/**
 * V14 Sync Example Component
 * 
 * Voorbeeld van hoe je syncWithSupabase() kunt gebruiken in je componenten
 * 
 * @version 14.0.0
 * @author Thomas
 */

import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, CardHeader, Progress } from '@nextui-org/react';
import { RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import database from '../database'; // V14 database
import { 
  syncWithSupabase, 
  syncTableWithSupabase, 
  pushToSupabase,
  getSupabaseSyncStatus 
} from '../services/v14SupabaseSync';

const V14SyncExample: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(getSupabaseSyncStatus());
  const [tasks, setTasks] = useState<any[]>([]);

  // Voorbeeld: Sync alle data
  const handleFullSync = async () => {
    setIsSyncing(true);
    try {
      // Gebruik supabase-js om data te pushen/pullen
      await syncWithSupabase();
      
      // Update local state
      setSyncStatus(getSupabaseSyncStatus());
      console.log('✅ Full sync completed');
    } catch (error) {
      console.error('❌ Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Voorbeeld: Sync specifieke tabel
  const handleTasksSync = async () => {
    try {
      // Sync tasks tabel
      await syncTableWithSupabase('tasks');
      
      // Herlaad lokale tasks
      const tasksCollection = database.get('tasks');
      const userTasks = await tasksCollection.query().fetch();
      setTasks(userTasks);
      
      console.log('✅ Tasks sync completed');
    } catch (error) {
      console.error('❌ Tasks sync failed:', error);
    }
  };

  // Voorbeeld: Push lokale wijzigingen
  const handlePushChanges = async () => {
    try {
      // Haal lokale tasks op
      const tasksCollection = database.get('tasks');
      const localTasks = await tasksCollection.query().fetch();
      
      // Push naar Supabase
      await pushToSupabase('tasks', localTasks);
      
      console.log('✅ Changes pushed to Supabase');
    } catch (error) {
      console.error('❌ Push failed:', error);
    }
  };

  // Voorbeeld: Create task en sync
  const handleCreateAndSync = async () => {
    try {
      // 1. Maak task in lokale database
      const tasksCollection = database.get('tasks');
      await database.write(async () => {
        await tasksCollection.create((task: any) => {
          task.userId = 'user123';
          task.title = 'New Task from Sync Example';
          task.description = 'Created via sync example';
          task.completed = false;
          task.priority = 'medium';
          task.category = 'example';
          task.tags = '[]';
          task.createdAt = Date.now();
          task.updatedAt = Date.now();
          task.createdBy = 'user123';
        });
      });

      // 2. Sync met Supabase
      await syncTableWithSupabase('tasks');
      
      // 3. Herlaad lokale data
      const userTasks = await tasksCollection.query().fetch();
      setTasks(userTasks);
      
      console.log('✅ Task created and synced');
    } catch (error) {
      console.error('❌ Create and sync failed:', error);
    }
  };

  // Load tasks bij mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const tasksCollection = database.get('tasks');
        const userTasks = await tasksCollection.query().fetch();
        setTasks(userTasks);
      } catch (error) {
        console.error('Failed to load tasks:', error);
      }
    };

    loadTasks();
  }, []);

  // Update sync status
  useEffect(() => {
    const interval = setInterval(() => {
      setSyncStatus(getSupabaseSyncStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">V14 Sync Examples</h1>
        <p className="text-gray-600">
          Voorbeelden van hoe je syncWithSupabase() kunt gebruiken
        </p>
      </div>

      {/* Sync Status */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-xl font-semibold">Sync Status</h2>
        </CardHeader>
        <CardBody>
          <div className="flex items-center gap-4 mb-4">
            {syncStatus.isSyncing ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
                <span className="text-blue-600">Syncing...</span>
              </div>
            ) : syncStatus.lastSync ? (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-600">Last sync: {new Date(syncStatus.lastSync).toLocaleTimeString()}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">Never synced</span>
              </div>
            )}
          </div>

          {syncStatus.isSyncing && (
            <Progress 
              value={syncStatus.recordsTotal > 0 ? 
                (syncStatus.recordsSynced / syncStatus.recordsTotal) * 100 : 0
              } 
              className="w-full"
            />
          )}

          <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-blue-600">{syncStatus.recordsSynced}</div>
              <div className="text-gray-600">Synced</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-green-600">{syncStatus.recordsTotal}</div>
              <div className="text-gray-600">Total</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-red-600">{syncStatus.errorCount}</div>
              <div className="text-gray-600">Errors</div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Sync Actions */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-xl font-semibold">Sync Actions</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              color="primary"
              size="lg"
              onPress={handleFullSync}
              isLoading={isSyncing}
              startContent={<RefreshCw className="w-5 h-5" />}
            >
              Full Sync
            </Button>
            
            <Button
              color="secondary"
              size="lg"
              onPress={handleTasksSync}
              isLoading={isSyncing}
            >
              Sync Tasks Only
            </Button>
            
            <Button
              color="success"
              size="lg"
              onPress={handlePushChanges}
              isLoading={isSyncing}
            >
              Push Changes
            </Button>
            
            <Button
              color="warning"
              size="lg"
              onPress={handleCreateAndSync}
              isLoading={isSyncing}
            >
              Create & Sync
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Tasks List */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Local Tasks ({tasks.length})</h2>
        </CardHeader>
        <CardBody>
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No tasks found. Create some tasks to see them here!
            </p>
          ) : (
            <div className="space-y-2">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold">{task.title}</h3>
                    <p className="text-sm text-gray-600">{task.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      task.priority === 'high' ? 'bg-red-100 text-red-800' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}
                    </span>
                    {task.completed && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default V14SyncExample;
