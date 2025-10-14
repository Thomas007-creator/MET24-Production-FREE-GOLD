import React, { useState, useEffect } from 'react';
import { Card, CardBody, Button } from '@nextui-org/react';
import { useLocation } from 'react-router-dom';
import { logger } from '../utils/logger';
import pwaInstallService, { PWAInstallContext, PWAInstallPrompt as PWAInstallPromptData } from '../services/pwaInstallService';

interface PWAInstallPromptProps {
  onInstall?: () => void;
  onDismiss?: () => void;
}

const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ onInstall, onDismiss }) => {
  const location = useLocation();
  const [promptData, setPromptData] = useState<PWAInstallPromptData>({
    show: false,
    context: 'none',
    message: '',
    priority: 'low'
  });

  useEffect(() => {
    // Track visit
    pwaInstallService.trackVisit();

    // Check if we should show prompt
    const checkPrompt = () => {
      const context: PWAInstallContext = {
        isOnboardingCompleted: localStorage.getItem('onboarding_completed') === 'true',
        visitCount: pwaInstallService.getInstallationStatus().visitCount,
        lastVisit: Date.now(),
        hasEngaged: pwaInstallService.getInstallationStatus().hasEngaged,
        currentRoute: location.pathname
      };

      const shouldShow = pwaInstallService.shouldShowPrompt(context);
      setPromptData(shouldShow);
    };

    // Check immediately
    checkPrompt();

    // Check again after a short delay to ensure all data is loaded
    const timer = setTimeout(checkPrompt, 1000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleInstall = async () => {
    const success = await pwaInstallService.install();
    if (success) {
      onInstall?.();
      setPromptData({ show: false, context: 'none', message: '', priority: 'low' });
    }
  };

  const handleDismiss = () => {
    pwaInstallService.dismiss();
    onDismiss?.();
    setPromptData({ show: false, context: 'none', message: '', priority: 'low' });
  };

  // Don't show if not needed
  if (!promptData.show) {
    return null;
  }

  // Get context-specific styling and messaging
  const getContextualContent = () => {
    switch (promptData.context) {
      case 'onboarding':
        return {
          icon: '🎉',
          title: 'Welkom bij Your Future Self!',
          message: promptData.message,
          gradient: 'from-green-600 to-blue-600',
          priority: 'high'
        };
      case 'engagement':
        return {
          icon: '⭐',
          title: 'Je bent een actieve gebruiker!',
          message: promptData.message,
          gradient: 'from-purple-600 to-pink-600',
          priority: 'medium'
        };
      case 'mainview':
        return {
          icon: '📱',
          title: 'Installeer Your Future Self',
          message: promptData.message,
          gradient: 'from-blue-600 to-purple-600',
          priority: 'low'
        };
      default:
        return {
          icon: '📱',
          title: 'Installeer Your Future Self',
          message: 'Installeer de app voor snellere toegang en offline functionaliteit',
          gradient: 'from-blue-600 to-purple-600',
          priority: 'low'
        };
    }
  };

  const content = getContextualContent();

  return (
    <div className={`fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm ${
      promptData.priority === 'high' ? 'animate-pulse' : ''
    }`}>
      <Card className={`bg-gradient-to-r ${content.gradient} border border-white/20 shadow-2xl ${
        promptData.priority === 'high' ? 'ring-2 ring-white/30' : ''
      }`}>
        <CardBody className="p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">{content.icon}</div>
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-1">
                {content.title}
              </h3>
              <p className="text-blue-100 text-sm mb-3">
                {content.message}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  color="primary"
                  variant="solid"
                  onClick={handleInstall}
                  className="bg-white text-blue-600 font-semibold hover:bg-blue-50"
                >
                  Installeer
                </Button>
                <Button
                  size="sm"
                  color="default"
                  variant="light"
                  onClick={handleDismiss}
                  className="text-white hover:bg-white/10"
                >
                  Later
                </Button>
              </div>
            </div>
            <Button
              size="sm"
              color="default"
              variant="light"
              onClick={handleDismiss}
              className="text-white min-w-0 p-1 hover:bg-white/10"
            >
              ✕
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default PWAInstallPrompt;
