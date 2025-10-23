/**
 * Feature Gate Component
 * Shows feature or upgrade prompt based on user tier
 */

import React from 'react';
import { tierService, getCurrentTier, hasFeatureAccess } from '../services/tierService';
import { isBetaBuild } from '../config/buildConfig';
import { trackUpgradeInitiated } from '../services/conversionTrackingService';

interface FeatureGateProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
  upgradeTier?: 'gold' | 'platinum';
  sourceFeature?: string;
}

const FeatureGate: React.FC<FeatureGateProps> = ({
  feature,
  children,
  fallback,
  showUpgradePrompt = true,
  upgradeTier = 'gold',
  sourceFeature = 'feature_gate',
}) => {
  const currentTier = getCurrentTier();
  const hasAccess = hasFeatureAccess(feature);
  const isBeta = isBetaBuild();

  // In beta mode, always show the feature
  if (isBeta) {
    return <>{children}</>;
  }

  // If user has access, show the feature
  if (hasAccess) {
    return <>{children}</>;
  }

  // If no fallback provided, show upgrade prompt
  if (!fallback && showUpgradePrompt) {
    return (
      <div
        style={{
          padding: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          textAlign: 'center',
          margin: '20px 0',
        }}
      >
        <div style={{ fontSize: '24px', marginBottom: '12px' }}>🔒</div>
        <h3 style={{ color: 'white', marginBottom: '8px', fontSize: '18px' }}>
          {upgradeTier === 'gold' ? 'Gold Feature' : 'Platinum Feature'}
        </h3>
        <p style={{ color: '#b0b0b0', marginBottom: '16px', fontSize: '14px' }}>
          This feature is available in {upgradeTier === 'gold' ? 'Gold' : 'Platinum'} tier
        </p>
        <button
          onClick={() => {
            trackUpgradeInitiated(upgradeTier, sourceFeature);
            // Navigate to upgrade page
            window.location.href = '/upgrade';
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: upgradeTier === 'gold' ? '#FFD700' : '#A855F7',
            color: upgradeTier === 'gold' ? '#1a1a1a' : 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          Upgrade to {upgradeTier === 'gold' ? 'Gold' : 'Platinum'}
        </button>
      </div>
    );
  }

  // Show custom fallback
  return <>{fallback}</>;
};

export default FeatureGate;


