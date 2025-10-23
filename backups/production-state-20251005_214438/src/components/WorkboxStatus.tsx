/**
 * Workbox Status Component
 * Displays caching and offline queue status
 */

import React from 'react';
import { useWorkbox } from '../hooks/useWorkbox';

interface WorkboxStatusProps {
  showDetails?: boolean;
  className?: string;
}

export const WorkboxStatus: React.FC<WorkboxStatusProps> = ({ 
  showDetails = false, 
  className = '' 
}) => {
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

  const totalCachedItems = Object.values(cacheStats).reduce((sum, count) => sum + count, 0);
  const queuedRequests = queueStatus?.queuedRequests || 0;

  return (
    <div className={`workbox-status ${className}`}>
      {/* Online/Offline Status */}
      <div className="flex items-center gap-2 mb-2">
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

      {/* Cache Statistics */}
      {showDetails && (
        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">Cache:</span> {totalCachedItems} items
          </div>
          
          {Object.keys(cacheStats).length > 0 && (
            <div className="text-xs space-y-1">
              {Object.entries(cacheStats).map(([cacheName, count]) => (
                <div key={cacheName} className="flex justify-between">
                  <span className="text-gray-600">{cacheName}:</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="text-xs text-red-600 bg-red-50 p-2 rounded mt-2">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      {showDetails && (
        <div className="flex gap-2 mt-3">
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
      )}
    </div>
  );
};

export default WorkboxStatus;
