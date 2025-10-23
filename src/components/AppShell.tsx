/**
 * App Shell Component for MET24 Phase 1
 * 
 * Provides the main app shell structure for PWA
 * 
 * @version 3.0.0-core
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface AppShellProps {
  children: React.ReactNode;
  mbtiType?: string;
}

export const AppShell: React.FC<AppShellProps> = ({ children, mbtiType }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isLoading, setIsLoading] = useState(false);
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineBanner(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle loading states
  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    // Simulate loading for navigation
    const timer = setTimeout(handleComplete, 300);
    
    return () => clearTimeout(timer);
  }, [location]);

  // Navigation items
  const navigationItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/mbti-assessment', label: 'MBTI', icon: '🧠' },
    { path: '/active-imagination', label: 'Imaginatie', icon: '🎭' },
    { path: '/enhanced-journaling', label: 'Journal', icon: '📝' },
    { path: '/challenges', label: 'Challenges', icon: '🎯' },
    { path: '/levensgebieden', label: 'Levensgebieden', icon: '🌱' }
  ];

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Offline Banner */}
      {showOfflineBanner && (
        <div className="bg-orange-500 text-white text-center py-2 px-4">
          <span className="text-sm">
            📱 Je bent offline - MET24 werkt ook zonder internetverbinding
          </span>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700"
              >
                <span className="text-2xl">🧠</span>
                <span className="text-xl font-bold">MET24</span>
                {mbtiType && (
                  <span className="text-sm bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                    {mbtiType}
                  </span>
                )}
              </button>
            </div>

            {/* Online Status */}
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 text-sm ${
                isOnline ? 'text-green-600' : 'text-orange-600'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  isOnline ? 'bg-green-500' : 'bg-orange-500'
                }`}></span>
                <span>{isOnline ? 'Online' : 'Offline'}</span>
              </div>

              {/* Settings */}
              <button
                onClick={() => navigate('/settings')}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                ⚙️
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              <span className="text-gray-700">Laden...</span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
        <div className="grid grid-cols-6 gap-1">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center py-2 px-1 text-xs transition-colors ${
                isActivePath(item.path)
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="text-lg mb-1">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                isActivePath(item.path)
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* V3 Features Section */}
        <div className="p-4 border-t border-gray-200 mt-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">V3 Features</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-green-600">
              <span>✅</span>
              <span>Active Imagination</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-green-600">
              <span>✅</span>
              <span>Enhanced Journaling</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-green-600">
              <span>✅</span>
              <span>Challenges</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-green-600">
              <span>✅</span>
              <span>Levensgebieden</span>
            </div>
          </div>
        </div>

        {/* Phase Indicator */}
        <div className="p-4 border-t border-gray-200 mt-4">
          <div className="bg-indigo-50 rounded-lg p-3">
            <div className="text-xs font-semibold text-indigo-700 mb-1">
              Phase 1: Core App
            </div>
            <div className="text-xs text-indigo-600">
              V3 Features + PWA + MBTI
            </div>
          </div>
        </div>
      </aside>

      {/* Desktop Content Offset */}
      <div className="hidden md:block md:ml-64">
        {/* This div provides offset for the fixed sidebar */}
      </div>
    </div>
  );
};

export default AppShell;
