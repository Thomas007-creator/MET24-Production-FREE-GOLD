/**
 * 🚀 BMAD PWA Manager - Advanced PWA Features with Composition Patterns
 * 
 * Implements advanced PWA features using BMAD composition patterns
 * Team: Mary (Master) | Jordan (Architecture) | Riley (Implementation) | Morgan (QA) | Sam (Metrics)
 * 
 * @version 1.0.0
 * @author BMAD Team
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Card, CardBody, CardHeader, Button, Progress, Chip, Switch, Badge } from '@nextui-org/react';
import { 
  Smartphone, 
  Wifi, 
  WifiOff, 
  Download, 
  Bell, 
  BellOff, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle,
  Settings,
  Zap,
  Shield,
  TrendingUp
} from 'lucide-react';

// ================================================
// BMAD PWA Context & Provider
// ================================================

interface PWAState {
  isInstalled: boolean;
  isOnline: boolean;
  isServiceWorkerActive: boolean;
  pushNotificationsEnabled: boolean;
  backgroundSyncEnabled: boolean;
  offlineMode: boolean;
  cacheSize: number;
  lastSync: Date | null;
  performanceScore: number;
  architectureScore: number;
}

interface PWAActions {
  installPWA: () => Promise<void>;
  togglePushNotifications: () => Promise<void>;
  toggleBackgroundSync: () => Promise<void>;
  toggleOfflineMode: () => void;
  clearCache: () => Promise<void>;
  forceSync: () => Promise<void>;
  updateServiceWorker: () => Promise<void>;
}

interface PWAContextType {
  state: PWAState;
  actions: PWAActions;
  metrics: PWAMetrics;
}

interface PWAMetrics {
  installs: number;
  sessions: number;
  offlineUsage: number;
  pushNotificationClicks: number;
  backgroundSyncSuccess: number;
  cacheHitRate: number;
  performanceScore: number;
  architectureScore: number;
}

const PWAContext = createContext<PWAContextType | null>(null);

// ================================================
// BMAD PWA Provider Component
// ================================================

interface BMADPWAProviderProps {
  children: React.ReactNode;
}

export const BMADPWAProvider: React.FC<BMADPWAProviderProps> = ({ children }) => {
  const [state, setState] = useState<PWAState>({
    isInstalled: false,
    isOnline: navigator.onLine,
    isServiceWorkerActive: false,
    pushNotificationsEnabled: false,
    backgroundSyncEnabled: false,
    offlineMode: false,
    cacheSize: 0,
    lastSync: null,
    performanceScore: 0,
    architectureScore: 0
  });

  const [metrics, setMetrics] = useState<PWAMetrics>({
    installs: 0,
    sessions: 0,
    offlineUsage: 0,
    pushNotificationClicks: 0,
    backgroundSyncSuccess: 0,
    cacheHitRate: 0,
    performanceScore: 0,
    architectureScore: 0
  });

  // ================================================
  // BMAD PWA Actions
  // ================================================

  const installPWA = useCallback(async () => {
    try {
      console.log('🚀 BMAD PWA: Installing PWA...');
      
      // Check if PWA is already installed
      if (state.isInstalled) {
        console.log('✅ PWA already installed');
        return;
      }

      // Trigger PWA installation
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('✅ Service Worker registered:', registration);
        
        setState(prev => ({
          ...prev,
          isInstalled: true,
          isServiceWorkerActive: true
        }));

        setMetrics(prev => ({
          ...prev,
          installs: prev.installs + 1
        }));

        console.log('🎉 BMAD PWA: Installation successful');
      }
    } catch (error) {
      console.error('❌ BMAD PWA: Installation failed:', error);
    }
  }, [state.isInstalled]);

  const togglePushNotifications = useCallback(async () => {
    try {
      if (!state.pushNotificationsEnabled) {
        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
          setState(prev => ({
            ...prev,
            pushNotificationsEnabled: true
          }));
          
          console.log('✅ Push notifications enabled');
        } else {
          console.log('❌ Push notification permission denied');
        }
      } else {
        setState(prev => ({
          ...prev,
          pushNotificationsEnabled: false
        }));
        
        console.log('🔕 Push notifications disabled');
      }
    } catch (error) {
      console.error('❌ Push notification toggle failed:', error);
    }
  }, [state.pushNotificationsEnabled]);

  const toggleBackgroundSync = useCallback(async () => {
    try {
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        const registration = await navigator.serviceWorker.ready;
        
        if (!state.backgroundSyncEnabled) {
          (registration as any).sync.register('background-sync');
          
          setState(prev => ({
            ...prev,
            backgroundSyncEnabled: true
          }));
          
          console.log('✅ Background sync enabled');
        } else {
          setState(prev => ({
            ...prev,
            backgroundSyncEnabled: false
          }));
          
          console.log('🔄 Background sync disabled');
        }
      } else {
        console.log('⚠️ Background sync not supported');
      }
    } catch (error) {
      console.error('❌ Background sync toggle failed:', error);
    }
  }, [state.backgroundSyncEnabled]);

  const toggleOfflineMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      offlineMode: !prev.offlineMode
    }));
    
    console.log(`📱 Offline mode: ${!state.offlineMode ? 'enabled' : 'disabled'}`);
  }, [state.offlineMode]);

  const clearCache = useCallback(async () => {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        
        setState(prev => ({
          ...prev,
          cacheSize: 0
        }));
        
        console.log('🗑️ Cache cleared');
      }
    } catch (error) {
      console.error('❌ Cache clear failed:', error);
    }
  }, []);

  const forceSync = useCallback(async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        
        if ('sync' in registration) {
          (registration as any).sync.register('force-sync');
          
          setState(prev => ({
            ...prev,
            lastSync: new Date()
          }));
          
          setMetrics(prev => ({
            ...prev,
            backgroundSyncSuccess: prev.backgroundSyncSuccess + 1
          }));
          
          console.log('🔄 Force sync completed');
        }
      }
    } catch (error) {
      console.error('❌ Force sync failed:', error);
    }
  }, []);

  const updateServiceWorker = useCallback(async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        await registration.update();
        
        console.log('🔄 Service Worker updated');
      }
    } catch (error) {
      console.error('❌ Service Worker update failed:', error);
    }
  }, []);

  // ================================================
  // BMAD PWA Effects
  // ================================================

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => {
      setState(prev => ({ ...prev, isOnline: true }));
      console.log('🌐 Online');
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOnline: false }));
      console.log('📱 Offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check PWA installation status
    const checkPWAStatus = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.ready;
          setState(prev => ({
            ...prev,
            isServiceWorkerActive: !!registration.active
          }));
        } catch (error) {
          console.error('❌ Service Worker check failed:', error);
        }
      }
    };

    checkPWAStatus();

    // Load metrics from localStorage
    const savedMetrics = localStorage.getItem('bmad-pwa-metrics');
    if (savedMetrics) {
      try {
        setMetrics(JSON.parse(savedMetrics));
      } catch (error) {
        console.error('❌ Failed to load metrics:', error);
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Save metrics to localStorage
    localStorage.setItem('bmad-pwa-metrics', JSON.stringify(metrics));
  }, [metrics]);

  // ================================================
  // BMAD PWA Context Value
  // ================================================

  const contextValue: PWAContextType = {
    state,
    actions: {
      installPWA,
      togglePushNotifications,
      toggleBackgroundSync,
      toggleOfflineMode,
      clearCache,
      forceSync,
      updateServiceWorker
    },
    metrics
  };

  return (
    <PWAContext.Provider value={contextValue}>
      {children}
    </PWAContext.Provider>
  );
};

// ================================================
// BMAD PWA Hook
// ================================================

export const useBMADPWA = (): PWAContextType => {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error('useBMADPWA must be used within BMADPWAProvider');
  }
  return context;
};

// ================================================
// BMAD PWA Manager Component
// ================================================

interface BMADPWAManagerProps {
  className?: string;
}

export const BMADPWAManager: React.FC<BMADPWAManagerProps> = ({ className }) => {
  const { state, actions, metrics } = useBMADPWA();

  return (
    <div className={`bmad-pwa-manager ${className || ''}`}>
      <Card className="w-full">
        <CardHeader className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Smartphone className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold">BMAD PWA Manager</h3>
            <Chip 
              color={state.isInstalled ? "success" : "warning"}
              variant="flat"
              size="sm"
            >
              {state.isInstalled ? "Installed" : "Not Installed"}
            </Chip>
          </div>
          <p className="text-sm text-gray-600">
            Advanced PWA features with BMAD composition patterns
          </p>
        </CardHeader>
        
        <CardBody className="space-y-6">
          {/* Connection Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {state.isOnline ? (
                <Wifi className="w-5 h-5 text-success" />
              ) : (
                <WifiOff className="w-5 h-5 text-danger" />
              )}
              <span className="font-medium">
                {state.isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <Badge 
              content={state.isServiceWorkerActive ? "Active" : "Inactive"}
              color={state.isServiceWorkerActive ? "success" : "warning"}
              variant="flat"
            >
              <span></span>
            </Badge>
          </div>

          {/* PWA Installation */}
          {!state.isInstalled && (
            <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Install PWA</p>
                  <p className="text-sm text-gray-600">
                    Install for better performance and offline access
                  </p>
                </div>
              </div>
              <Button 
                color="primary" 
                onPress={actions.installPWA}
                startContent={<Download className="w-4 h-4" />}
              >
                Install
              </Button>
            </div>
          )}

          {/* PWA Features */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Settings className="w-5 h-5" />
              PWA Features
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Push Notifications */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {state.pushNotificationsEnabled ? (
                    <Bell className="w-5 h-5 text-success" />
                  ) : (
                    <BellOff className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-gray-600">
                      {metrics.pushNotificationClicks} clicks
                    </p>
                  </div>
                </div>
                <Switch
                  isSelected={state.pushNotificationsEnabled}
                  onValueChange={actions.togglePushNotifications}
                />
              </div>

              {/* Background Sync */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Background Sync</p>
                    <p className="text-sm text-gray-600">
                      {metrics.backgroundSyncSuccess} successful
                    </p>
                  </div>
                </div>
                <Switch
                  isSelected={state.backgroundSyncEnabled}
                  onValueChange={actions.toggleBackgroundSync}
                />
              </div>

              {/* Offline Mode */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {state.offlineMode ? (
                    <WifiOff className="w-5 h-5 text-warning" />
                  ) : (
                    <Wifi className="w-5 h-5 text-success" />
                  )}
                  <div>
                    <p className="font-medium">Offline Mode</p>
                    <p className="text-sm text-gray-600">
                      {metrics.offlineUsage} sessions
                    </p>
                  </div>
                </div>
                <Switch
                  isSelected={state.offlineMode}
                  onValueChange={actions.toggleOfflineMode}
                />
              </div>

              {/* Cache Management */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-warning" />
                  <div>
                    <p className="font-medium">Cache</p>
                    <p className="text-sm text-gray-600">
                      {state.cacheSize}MB, {metrics.cacheHitRate}% hit rate
                    </p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="flat"
                  onPress={actions.clearCache}
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Performance Metrics
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Architecture Score</span>
                  <Chip 
                    color={metrics.architectureScore >= 85 ? "success" : "warning"}
                    variant="flat"
                    size="sm"
                  >
                    {metrics.architectureScore}/100
                  </Chip>
                </div>
                <Progress 
                  value={metrics.architectureScore} 
                  color={metrics.architectureScore >= 85 ? "success" : "warning"}
                  className="w-full"
                />
              </div>

              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Performance Score</span>
                  <Chip 
                    color={metrics.performanceScore >= 90 ? "success" : "warning"}
                    variant="flat"
                    size="sm"
                  >
                    {metrics.performanceScore}/100
                  </Chip>
                </div>
                <Progress 
                  value={metrics.performanceScore} 
                  color={metrics.performanceScore >= 90 ? "success" : "warning"}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button 
              color="primary" 
              variant="flat"
              onPress={actions.forceSync}
              startContent={<RefreshCw className="w-4 h-4" />}
            >
              Force Sync
            </Button>
            <Button 
              color="secondary" 
              variant="flat"
              onPress={actions.updateServiceWorker}
              startContent={<Zap className="w-4 h-4" />}
            >
              Update SW
            </Button>
          </div>

          {/* Last Sync */}
          {state.lastSync && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-success" />
              Last sync: {state.lastSync.toLocaleString()}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

// ================================================
// BMAD PWA Compound Components
// ================================================

export const BMADPWA = {
  Provider: BMADPWAProvider,
  Manager: BMADPWAManager,
  usePWA: useBMADPWA
};

// ================================================
// BMAD PWA Status Indicator
// ================================================

export const BMADPWAStatusIndicator: React.FC = () => {
  const { state } = useBMADPWA();

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${
        state.isInstalled ? 'bg-success' : 'bg-warning'
      }`} />
      <span className="text-sm">
        PWA {state.isInstalled ? 'Active' : 'Inactive'}
      </span>
    </div>
  );
};

export default BMADPWAManager;
