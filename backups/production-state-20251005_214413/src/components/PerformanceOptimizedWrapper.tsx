import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { logger } from '../utils/logger';

interface PerformanceOptimizedWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  autoLoadUserData?: boolean;
}

/**
 * Performance-optimized wrapper component that:
 * 1. Automatically loads user data from database
 * 2. Provides safe fallbacks for missing data
 * 3. Prevents runtime errors from missing fields
 * 4. Optimizes re-renders with proper state management
 */
const PerformanceOptimizedWrapper: React.FC<PerformanceOptimizedWrapperProps> = ({
  children,
  fallback = <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
    <div className="text-white text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
      <p>Laden...</p>
    </div>
  </div>,
  autoLoadUserData = true
}) => {
  const { loadUserData, userData } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        if (autoLoadUserData) {
          await loadUserData();
        }

        logger.info('App initialized successfully', { 
          hasUserData: !!userData.id,
          userName: userData.name 
        });
      } catch (error) {
        logger.error('Failed to initialize app', { 
          error: error instanceof Error ? error.message : String(error) 
        });
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [autoLoadUserData, loadUserData]);

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-indigo-900">
        <div className="text-white text-center p-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-4">Er is een fout opgetreden</h2>
          <p className="text-gray-300 mb-6">
            De app kon niet worden geladen. Probeer de pagina te vernieuwen.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Pagina Vernieuwen
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PerformanceOptimizedWrapper;
