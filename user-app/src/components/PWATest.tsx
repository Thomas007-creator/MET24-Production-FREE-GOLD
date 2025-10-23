import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Progress, Chip } from '@nextui-org/react';
import { logger } from '../utils/logger';

interface PWAStatus {
  isInstalled: boolean;
  canInstall: boolean;
  isOnline: boolean;
  serviceWorkerRegistered: boolean;
  manifestLoaded: boolean;
  installPrompt: any;
  browser: string;
  platform: string;
}

const PWATest: React.FC = () => {
  const [pwaStatus, setPwaStatus] = useState<PWAStatus>({
    isInstalled: false,
    canInstall: false,
    isOnline: navigator.onLine,
    serviceWorkerRegistered: false,
    manifestLoaded: false,
    installPrompt: null,
    browser: '',
    platform: ''
  });
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  useEffect(() => {
    detectBrowser();
    checkPWAStatus();
    registerServiceWorker();
    checkManifest();
    setupInstallPrompt();
    setupOnlineStatus();
  }, []);

  const detectBrowser = () => {
    const userAgent = navigator.userAgent;
    let browser = 'Unknown';
    
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    else if (userAgent.includes('Opera')) browser = 'Opera';
    
    const platform = navigator.platform;
    
    setPwaStatus(prev => ({ ...prev, browser, platform }));
    logger.info('🔍 Browser detected', { browser, platform });
  };

  const checkPWAStatus = () => {
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                       (window.navigator as any).standalone === true;
    
    setPwaStatus(prev => ({ ...prev, isInstalled }));
    logger.info('📱 PWA install status', { isInstalled });
  };

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        logger.info('✅ Service Worker registered', { registration });
        setPwaStatus(prev => ({ ...prev, serviceWorkerRegistered: true }));
      } catch (error) {
        logger.error('❌ Service Worker registration failed', { error });
        setPwaStatus(prev => ({ ...prev, serviceWorkerRegistered: false }));
      }
    } else {
      logger.warn('⚠️ Service Worker not supported');
      setPwaStatus(prev => ({ ...prev, serviceWorkerRegistered: false }));
    }
  };

  const checkManifest = async () => {
    try {
      const response = await fetch('/manifest.json');
      if (response.ok) {
        const manifest = await response.json();
        logger.info('✅ Manifest loaded', { manifest });
        setPwaStatus(prev => ({ ...prev, manifestLoaded: true }));
      } else {
        logger.error('❌ Manifest not found');
        setPwaStatus(prev => ({ ...prev, manifestLoaded: false }));
      }
    } catch (error) {
      logger.error('❌ Manifest check failed', { error });
      setPwaStatus(prev => ({ ...prev, manifestLoaded: false }));
    }
  };

  const setupInstallPrompt = () => {
    let deferredPrompt: any;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      setPwaStatus(prev => ({ ...prev, canInstall: true, installPrompt: deferredPrompt }));
      logger.info('📱 Install prompt available');
    });

    window.addEventListener('appinstalled', () => {
      setPwaStatus(prev => ({ ...prev, isInstalled: true, canInstall: false }));
      logger.info('✅ PWA installed successfully');
    });
  };

  const setupOnlineStatus = () => {
    const updateOnlineStatus = () => {
      setPwaStatus(prev => ({ ...prev, isOnline: navigator.onLine }));
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
  };

  const runPWATests = async () => {
    setIsRunningTests(true);
    setTestResults([]);
    
    const tests = [
      {
        name: 'Service Worker Support',
        test: () => 'serviceWorker' in navigator,
        description: 'Browser ondersteunt Service Workers'
      },
      {
        name: 'Manifest Support',
        test: () => 'onbeforeinstallprompt' in window,
        description: 'Browser ondersteunt PWA installatie'
      },
      {
        name: 'Cache API',
        test: () => 'caches' in window,
        description: 'Browser ondersteunt Cache API'
      },
      {
        name: 'Push Notifications',
        test: () => 'PushManager' in window,
        description: 'Browser ondersteunt Push Notifications'
      },
      {
        name: 'Background Sync',
        test: () => 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
        description: 'Browser ondersteunt Background Sync'
      },
      {
        name: 'Web App Manifest',
        test: () => pwaStatus.manifestLoaded,
        description: 'Web App Manifest is geladen'
      },
      {
        name: 'Service Worker Registered',
        test: () => pwaStatus.serviceWorkerRegistered,
        description: 'Service Worker is geregistreerd'
      },
      {
        name: 'HTTPS/SSL',
        test: () => window.location.protocol === 'https:' || window.location.hostname === 'localhost',
        description: 'App draait over HTTPS of localhost'
      }
    ];

    for (const test of tests) {
      try {
        const result = test.test();
        const testResult = {
          name: test.name,
          passed: result,
          description: test.description,
          timestamp: new Date().toISOString()
        };
        
        setTestResults(prev => [...prev, testResult]);
        logger.info(`🧪 Test: ${test.name}`, { result });
        
        // Kleine delay tussen tests
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        const testResult = {
          name: test.name,
          passed: false,
          description: test.description,
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString()
        };
        
        setTestResults(prev => [...prev, testResult]);
        logger.error(`❌ Test failed: ${test.name}`, { error });
      }
    }
    
    setIsRunningTests(false);
  };

  const installPWA = async () => {
    if (pwaStatus.installPrompt) {
      pwaStatus.installPrompt.prompt();
      const result = await pwaStatus.installPrompt.userChoice;
      
      if (result.outcome === 'accepted') {
        logger.info('✅ PWA installatie geaccepteerd');
        setPwaStatus(prev => ({ ...prev, canInstall: false }));
      } else {
        logger.info('❌ PWA installatie geweigerd');
      }
    }
  };

  const getStatusColor = (status: boolean) => status ? 'success' : 'danger';
  const getStatusIcon = (status: boolean) => status ? '✅' : '❌';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-800/20 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
          <CardHeader>
            <h1 className="text-2xl font-bold text-white">🧪 PWA Installatie Tests</h1>
          </CardHeader>
          <CardBody>
            <p className="text-gray-300">
              Test PWA functionaliteit voor Your Future Self app in verschillende browsers
            </p>
          </CardBody>
        </Card>

        {/* PWA Status */}
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
          <CardHeader>
            <h2 className="text-xl font-semibold text-white">📱 PWA Status</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl mb-2">{getStatusIcon(pwaStatus.isInstalled)}</div>
                <div className="text-sm text-gray-300">Geïnstalleerd</div>
                <Chip color={getStatusColor(pwaStatus.isInstalled)} size="sm">
                  {pwaStatus.isInstalled ? 'Ja' : 'Nee'}
                </Chip>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">{getStatusIcon(pwaStatus.canInstall)}</div>
                <div className="text-sm text-gray-300">Kan Installeren</div>
                <Chip color={getStatusColor(pwaStatus.canInstall)} size="sm">
                  {pwaStatus.canInstall ? 'Ja' : 'Nee'}
                </Chip>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">{getStatusIcon(pwaStatus.isOnline)}</div>
                <div className="text-sm text-gray-300">Online</div>
                <Chip color={getStatusColor(pwaStatus.isOnline)} size="sm">
                  {pwaStatus.isOnline ? 'Ja' : 'Nee'}
                </Chip>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">{getStatusIcon(pwaStatus.serviceWorkerRegistered)}</div>
                <div className="text-sm text-gray-300">Service Worker</div>
                <Chip color={getStatusColor(pwaStatus.serviceWorkerRegistered)} size="sm">
                  {pwaStatus.serviceWorkerRegistered ? 'Actief' : 'Inactief'}
                </Chip>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-white/5 rounded-lg">
              <div className="text-sm text-gray-300">
                <strong>Browser:</strong> {pwaStatus.browser} | <strong>Platform:</strong> {pwaStatus.platform}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Test Controls */}
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
          <CardHeader>
            <h2 className="text-xl font-semibold text-white">🧪 Test Controls</h2>
          </CardHeader>
          <CardBody>
            <div className="flex gap-4 flex-wrap">
              <Button
                color="primary"
                onClick={runPWATests}
                isLoading={isRunningTests}
                disabled={isRunningTests}
              >
                {isRunningTests ? 'Tests Uitvoeren...' : '🚀 Start PWA Tests'}
              </Button>
              
              {pwaStatus.canInstall && (
                <Button
                  color="success"
                  onClick={installPWA}
                >
                  📱 Installeer PWA
                </Button>
              )}
              
              <Button
                color="secondary"
                variant="bordered"
                onClick={() => window.location.reload()}
              >
                🔄 Herlaad Pagina
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Test Results */}
        {testResults.length > 0 && (
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
            <CardHeader>
              <h2 className="text-xl font-semibold text-white">📊 Test Resultaten</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-xl">{getStatusIcon(result.passed)}</div>
                      <div>
                        <div className="font-medium text-white">{result.name}</div>
                        <div className="text-sm text-gray-300">{result.description}</div>
                        {result.error && (
                          <div className="text-sm text-red-400">Error: {result.error}</div>
                        )}
                      </div>
                    </div>
                    <Chip color={getStatusColor(result.passed)} size="sm">
                      {result.passed ? 'PASS' : 'FAIL'}
                    </Chip>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-white/5 rounded-lg">
                <div className="text-sm text-gray-300">
                  <strong>Tests Geslaagd:</strong> {testResults.filter(r => r.passed).length} / {testResults.length}
                </div>
                <Progress 
                  value={(testResults.filter(r => r.passed).length / testResults.length) * 100}
                  className="mt-2"
                  color="success"
                />
              </div>
            </CardBody>
          </Card>
        )}

        {/* Browser Instructions */}
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
          <CardHeader>
            <h2 className="text-xl font-semibold text-white">📋 Browser Instructies</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4 text-sm text-gray-300">
              <div>
                <strong>Chrome/Edge:</strong> Klik op het installatie-icoon in de adresbalk of gebruik het menu (⋮) → "App installeren"
              </div>
              <div>
                <strong>Firefox:</strong> Klik op het installatie-icoon in de adresbalk of gebruik het menu (≡) → "Installeer"
              </div>
              <div>
                <strong>Safari (iOS):</strong> Tap op de deel-knop (□↗) en selecteer "Voeg toe aan beginscherm"
              </div>
              <div>
                <strong>Safari (macOS):</strong> Gebruik het menu "Safari" → "Voeg toe aan beginscherm"
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default PWATest;
