/**
 * Beta Demo Component
 * Demonstrates FREE + GOLD features with payment disabled
 */

import React, { useState, useEffect } from 'react';
import FeatureGate from './FeatureGate';
import { tierService, getCurrentTier, getAvailableFeatures, getLockedFeatures } from '../services/tierService';
import { getConversionMetrics } from '../services/conversionTrackingService';
import { isBetaBuild } from '../config/buildConfig';

const BetaDemo: React.FC = () => {
  const [currentTier, setCurrentTier] = useState(getCurrentTier());
  const [availableFeatures, setAvailableFeatures] = useState<string[]>([]);
  const [lockedFeatures, setLockedFeatures] = useState<string[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [isBeta, setIsBeta] = useState(false);

  useEffect(() => {
    setIsBeta(isBetaBuild());
    setAvailableFeatures(getAvailableFeatures());
    setLockedFeatures(getLockedFeatures());
    setMetrics(getConversionMetrics());
  }, []);

  const handleTierChange = (newTier: string) => {
    tierService.setUserTier(newTier as any);
    setCurrentTier(newTier as any);
    setAvailableFeatures(getAvailableFeatures());
    setLockedFeatures(getLockedFeatures());
  };

  const handleFeatureTest = (feature: string) => {
    console.log(`[Beta Demo] Testing feature: ${feature}`);
    // In a real app, this would trigger the feature
  };

  return (
    <div style={{ padding: '20px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', margin: '20px 0' }}>
      <h2 style={{ color: 'white', marginBottom: '20px' }}>
        🧪 Beta Demo - FREE + GOLD Features
        {isBeta && <span style={{ marginLeft: '10px', fontSize: '14px', color: '#93c5fd' }}>(Beta Mode)</span>}
      </h2>

      {/* Current Tier Display */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: 'white', marginBottom: '10px' }}>Current Tier: {currentTier}</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          {['beta', 'free', 'gold', 'platinum'].map(tier => (
            <button
              key={tier}
              onClick={() => handleTierChange(tier)}
              style={{
                padding: '8px 16px',
                backgroundColor: currentTier === tier ? '#10b981' : 'rgba(255,255,255,0.1)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Available Features */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: 'white', marginBottom: '10px' }}>Available Features ({availableFeatures.length})</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          {availableFeatures.map(feature => (
            <div
              key={feature}
              style={{
                padding: '10px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '6px',
                color: '#10b981',
                fontSize: '12px',
                cursor: 'pointer',
              }}
              onClick={() => handleFeatureTest(feature)}
            >
              ✅ {feature}
            </div>
          ))}
        </div>
      </div>

      {/* Locked Features */}
      {lockedFeatures.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: 'white', marginBottom: '10px' }}>Locked Features ({lockedFeatures.length})</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            {lockedFeatures.map(feature => (
              <div
                key={feature}
                style={{
                  padding: '10px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '6px',
                  color: '#ef4444',
                  fontSize: '12px',
                }}
              >
                🔒 {feature}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feature Gate Examples */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: 'white', marginBottom: '10px' }}>Feature Gate Examples</h3>
        
        {/* Gold Feature Example */}
        <div style={{ marginBottom: '15px' }}>
          <h4 style={{ color: 'white', marginBottom: '5px' }}>Gold Feature: Conversational AI</h4>
          <FeatureGate
            feature="conversational_ai"
            upgradeTier="gold"
            sourceFeature="beta_demo"
          >
            <div style={{ padding: '15px', backgroundColor: 'rgba(255, 215, 0, 0.1)', border: '1px solid rgba(255, 215, 0, 0.3)', borderRadius: '8px' }}>
              <h4 style={{ color: '#FFD700', marginBottom: '10px' }}>🤖 Conversational AI</h4>
              <p style={{ color: '#e0e0e0', fontSize: '14px' }}>
                This is a Gold tier feature. In beta mode, you can see it, but in production, 
                free users would see an upgrade prompt here.
              </p>
              <button
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#FFD700',
                  color: '#1a1a1a',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
                onClick={() => handleFeatureTest('conversational_ai')}
              >
                Try AI Chat
              </button>
            </div>
          </FeatureGate>
        </div>

        {/* Platinum Feature Example */}
        <div style={{ marginBottom: '15px' }}>
          <h4 style={{ color: 'white', marginBottom: '5px' }}>Platinum Feature: AI Orchestration</h4>
          <FeatureGate
            feature="ai_orchestration"
            upgradeTier="platinum"
            sourceFeature="beta_demo"
          >
            <div style={{ padding: '15px', backgroundColor: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '8px' }}>
              <h4 style={{ color: '#A855F7', marginBottom: '10px' }}>🎭 AI Orchestration</h4>
              <p style={{ color: '#e0e0e0', fontSize: '14px' }}>
                This is a Platinum tier feature. Advanced AI routing and orchestration capabilities.
              </p>
              <button
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#A855F7',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
                onClick={() => handleFeatureTest('ai_orchestration')}
              >
                Try AI Orchestration
              </button>
            </div>
          </FeatureGate>
        </div>
      </div>

      {/* Conversion Metrics */}
      {metrics && (
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: 'white', marginBottom: '10px' }}>Conversion Metrics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
            <div style={{ padding: '10px', backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ color: '#3b82f6', fontSize: '18px', fontWeight: 'bold' }}>{metrics.totalSessions}</div>
              <div style={{ color: '#93c5fd', fontSize: '12px' }}>Sessions</div>
            </div>
            <div style={{ padding: '10px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ color: '#10b981', fontSize: '18px', fontWeight: 'bold' }}>{metrics.upgradeAttempts}</div>
              <div style={{ color: '#6ee7b7', fontSize: '12px' }}>Upgrade Attempts</div>
            </div>
            <div style={{ padding: '10px', backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ color: '#f59e0b', fontSize: '18px', fontWeight: 'bold' }}>{metrics.conversionRate.toFixed(1)}%</div>
              <div style={{ color: '#fbbf24', fontSize: '12px' }}>Conversion Rate</div>
            </div>
          </div>
        </div>
      )}

      {/* Beta Mode Info */}
      {isBeta && (
        <div style={{ padding: '15px', backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px', marginTop: '20px' }}>
          <h4 style={{ color: '#3b82f6', marginBottom: '10px' }}>🧪 Beta Mode Information</h4>
          <ul style={{ color: '#93c5fd', fontSize: '14px', margin: 0, paddingLeft: '20px' }}>
            <li>All features are visible and accessible</li>
            <li>Payment is disabled for safety</li>
            <li>Conversion tracking is active</li>
            <li>Feature gates are not enforced</li>
            <li>Perfect for testing user behavior</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default BetaDemo;


