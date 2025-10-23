/**
 * Workbox Status Component - BMAD Refactored
 * 
 * Displays caching and offline queue status
 * Refactored using BMAD composition patterns to eliminate boolean props
 * 
 * @version 14.1.0
 * @author BMAD Team - Mary (Master) | Jordan (Architecture) | Riley (Implementation)
 */

import React, { createContext, useContext } from 'react';
import { useWorkbox } from '../hooks/useWorkbox';

// ================================================
// BMAD Types
// ================================================

interface WorkboxStatusContextType {
  isOnline: boolean;
  queueStatus: any;
  cacheStats: any;
  isLoading: boolean;
  error: string | null;
  processQueue: () => void;
  getQueueStatus: () => void;
  getCacheStats: () => void;
  clearCaches: () => void;
  totalCachedItems: number;
  queuedRequests: number;
}

// ================================================
// BMAD Workbox Status Context & Provider
// ================================================

const WorkboxStatusContext = createContext<WorkboxStatusContextType | null>(null);

interface WorkboxStatusProviderProps {
  children: React.ReactNode;
}

const WorkboxStatusProvider: React.FC<WorkboxStatusProviderProps> = ({ children }) => {
  const {
    isOnline,
    queueStatus,
    cacheStats,
    isLoading,
    error,
    processQueue,
    getQueueStatus,
    getCacheStats,
    clearCaches
  } = useWorkbox();

  const totalCachedItems = Object.values(cacheStats).reduce((sum: number, count: any) => sum + count, 0);
  const queuedRequests = queueStatus?.queuedRequests || 0;

  const contextValue: WorkboxStatusContextType = {
    isOnline,
    queueStatus,
    cacheStats,
    isLoading,
    error,
    processQueue,
    getQueueStatus,
    getCacheStats,
    clearCaches,
    totalCachedItems,
    queuedRequests
  };

  return (
    <WorkboxStatusContext.Provider value={contextValue}>
      {children}
    </WorkboxStatusContext.Provider>
  );
};

// ================================================
// BMAD Workbox Status Hook
// ================================================

const useWorkboxStatus = (): WorkboxStatusContextType => {
  const context = useContext(WorkboxStatusContext);
  if (!context) {
    throw new Error('useWorkboxStatus must be used within WorkboxStatusProvider');
  }
  return context;
};

// ================================================
// BMAD Workbox Online Status Component
// ================================================

interface WorkboxOnlineStatusProps {
  className?: string;
}

const WorkboxOnlineStatus: React.FC<WorkboxOnlineStatusProps> = ({ className = "flex items-center gap-2 mb-2" }) => {
  const { isOnline, queuedRequests } = useWorkboxStatus();

  return (
    <div className={className}>
      <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
      <span className="text-sm font-medium">
        {isOnline ? 'Online' : 'Offline'}
      </span>
      {queuedRequests > 0 && (
        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
          {queuedRequests} queued
        </span>
      )}
    </div>
  );
};

// ================================================
// BMAD Workbox Cache Stats Component
// ================================================

interface WorkboxCacheStatsProps {
  className?: string;
}

const WorkboxCacheStats: React.FC<WorkboxCacheStatsProps> = ({ className = "space-y-2" }) => {
  const { totalCachedItems, cacheStats } = useWorkboxStatus();

  return (
    <div className={className}>
      <div className="text-sm">
        <span className="font-medium">Cache:</span> {totalCachedItems} items
      </div>
      
      {Object.keys(cacheStats).length > 0 && (
        <div className="text-xs space-y-1">
          {Object.entries(cacheStats).map(([cacheName, count]: [string, any]) => (
            <div key={cacheName} className="flex justify-between">
              <span className="text-gray-600">{cacheName}:</span>
              <span className="font-medium">{String(count)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ================================================
// BMAD Workbox Error Component
// ================================================

interface WorkboxErrorProps {
  className?: string;
}

const WorkboxError: React.FC<WorkboxErrorProps> = ({ className = "text-xs text-red-600 bg-red-50 p-2 rounded mt-2" }) => {
  const { error } = useWorkboxStatus();

  if (!error) return null;

  return (
    <div className={className}>
      {error}
    </div>
  );
};

// ================================================
// BMAD Workbox Actions Component
// ================================================

interface WorkboxActionsProps {
  className?: string;
}

const WorkboxActions: React.FC<WorkboxActionsProps> = ({ className = "flex gap-2 mt-3" }) => {
  const { 
    isLoading, 
    isOnline, 
    processQueue, 
    getQueueStatus, 
    clearCaches 
  } = useWorkboxStatus();

  return (
    <div className={className}>
      <button
        onClick={processQueue}
        disabled={isLoading || isOnline}
        className="text-xs bg-blue-500 text-white px-2 py-1 rounded disabled:opacity-50"
      >
        {isLoading ? 'Processing...' : 'Process Queue'}
      </button>
      
      <button
        onClick={getQueueStatus}
        disabled={isLoading}
        className="text-xs bg-gray-500 text-white px-2 py-1 rounded disabled:opacity-50"
      >
        Refresh
      </button>
      
      <button
        onClick={clearCaches}
        disabled={isLoading}
        className="text-xs bg-red-500 text-white px-2 py-1 rounded disabled:opacity-50"
      >
        Clear Cache
      </button>
    </div>
  );
};

// ================================================
// BMAD Workbox Status Basic Component
// ================================================

interface WorkboxStatusBasicProps {
  className?: string;
}

const WorkboxStatusBasic: React.FC<WorkboxStatusBasicProps> = ({ className = "workbox-status" }) => {
  return (
    <div className={className}>
      <WorkboxOnlineStatus />
      <WorkboxError />
    </div>
  );
};

// ================================================
// BMAD Workbox Status Detailed Component
// ================================================

interface WorkboxStatusDetailedProps {
  className?: string;
}

const WorkboxStatusDetailed: React.FC<WorkboxStatusDetailedProps> = ({ className = "workbox-status" }) => {
  return (
    <div className={className}>
      <WorkboxOnlineStatus />
      <WorkboxCacheStats />
      <WorkboxError />
      <WorkboxActions />
    </div>
  );
};

// ================================================
// BMAD Workbox Status Container Component
// ================================================

interface WorkboxStatusContainerProps {
  children: React.ReactNode;
  className?: string;
}

const WorkboxStatusContainer: React.FC<WorkboxStatusContainerProps> = ({ children, className = "" }) => {
  return <>{children}</>;
};

// ================================================
// BMAD Main Workbox Status Component
// ================================================

interface WorkboxStatusProps {
  variant?: 'basic' | 'detailed';
  className?: string;
}

const WorkboxStatus: React.FC<WorkboxStatusProps> = ({ 
  variant = 'basic', 
  className = '' 
}) => {
  return (
    <WorkboxStatusProvider>
      <WorkboxStatusContainer className={className}>
        {variant === 'detailed' ? (
          <WorkboxStatusDetailed />
        ) : (
          <WorkboxStatusBasic />
        )}
      </WorkboxStatusContainer>
    </WorkboxStatusProvider>
  );
};

// ================================================
// BMAD Compound Components Export
// ================================================

export const WorkboxStatusComponents = {
  Provider: WorkboxStatusProvider,
  Status: WorkboxStatus,
  Basic: WorkboxStatusBasic,
  Detailed: WorkboxStatusDetailed,
  OnlineStatus: WorkboxOnlineStatus,
  CacheStats: WorkboxCacheStats,
  Error: WorkboxError,
  Actions: WorkboxActions,
  Container: WorkboxStatusContainer,
  useStatus: useWorkboxStatus
};

export default WorkboxStatus;
