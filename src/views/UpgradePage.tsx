import React, { useState } from 'react';
import { theme } from '../theme/theme';
import { useAppStore } from '../store/useAppStore';
import { Tabs, Tab, Card, CardBody, Button } from '@nextui-org/react';
import BUILD_CONFIG, { isBetaBuild } from '../config/buildConfig';
import { trackUpgradeInitiated, trackUpgradeCompleted } from '../services/conversionTrackingService';
import { tierService } from '../services/tierService';

interface UpgradePageProps {
  userName?: string;
  mbtiType?: string;
  onSelectSubscription?: (planId: string, tier?: string) => void;
  onCancel?: () => void;
}

type UpgradeTier = 'gold' | 'platinum-tier1' | 'platinum-tier2' | 'platinum-tier3';

interface UpgradePlan {
  id: string;
  tier: UpgradeTier;
  title: string;
  subtitle: string;
  pricePerMonth: number;
  description: string;
  features: string[];
  isPopular?: boolean;
  icon?: string;
}

const UpgradePage: React.FC<UpgradePageProps> = ({
  userName = 'Gebruiker',
  mbtiType = 'INTP',
  onSelectSubscription = () => {},
  onCancel = () => {},
}) => {
  const [selectedTab, setSelectedTab] = useState<'gold' | 'platinum'>('gold');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const isBeta = isBetaBuild();

  // 🏆 Gold Tier Features
  const goldPlan: UpgradePlan = {
    id: 'gold-monthly',
    tier: 'gold',
    title: 'Gold',
    subtitle: 'Premium Features',
    pricePerMonth: 4.99,
    description: 'Alles wat je nodig hebt voor persoonlijke groei',
    icon: '⭐',
    features: [
      '✓ Onbeperkte Personalisatie',
      '✓ Bekijk Je Inzichten',
      '✓ Onbeperkte Rewinds',
      '✓ 1 Gratis Diepgaande Analyse per Maand',
      '✓ 2 Gratis Super Insights per Week',
      '✓ Onbeperkt Globale Inspiratie',
      '✓ Top Picks: doelen en micro-beloningen',
    ],
  };

  // 💎 Platinum Tier Features
  const platinumPlans: UpgradePlan[] = [
    {
      id: 'platinum-tier1-monthly',
      tier: 'platinum-tier1',
      title: 'Platinum Tier 1',
      subtitle: 'Individual Premium',
      pricePerMonth: 9.99,
      description: 'Geavanceerde AI coaching en inzichten',
      icon: '💎',
      isPopular: false,
      features: [
        '✓ Predictieve Mood Forecasting',
        '✓ Voice Journal Transcriptie',
        '✓ Onbeperkt Data Exporteren',
        '✓ API Toegang (basis)',
        '✓ Priority Support',
        '✓ Alles van Gold Tier',
      ],
    },
    {
      id: 'platinum-tier2-monthly',
      tier: 'platinum-tier2',
      title: 'Platinum Tier 2',
      subtitle: 'Team Edition',
      pricePerMonth: 49.99,
      description: 'Voor therapeuten en coaches teams',
      icon: '👥',
      isPopular: true,
      features: [
        '✓ Team Workspaces (5 slots)',
        '✓ SSO/OAuth Integratie',
        '✓ Slack, HubSpot, Jira integratie',
        '✓ Therapist Network Toegang',
        '✓ Advanced Analytics Dashboard',
        '✓ API Toegang (uitgebreid)',
        '✓ Dedicated Account Manager',
        '✓ Alles van Tier 1',
      ],
    },
    {
      id: 'platinum-tier3-custom',
      tier: 'platinum-tier3',
      title: 'Platinum Tier 3',
      subtitle: 'Enterprise',
      pricePerMonth: 0,
      description: 'On-premise, custom LLM, white-label',
      icon: '🏢',
      isPopular: false,
      features: [
        '✓ On-Premise Deployment',
        '✓ Custom LLM Fine-tuning',
        '✓ Knowledge Graph Building',
        '✓ SAML/LDAP Integration',
        '✓ White-Label Options',
        '✓ SLA Garanties (99.99%)',
        '✓ Dedicated Infrastructure',
        '✓ Unlimited API Usage',
      ],
    },
  ];

  const handleSelectPlan = (planId: string, tier?: string) => {
    setSelectedPlan(planId);
    
    // Track upgrade interest
    if (tier) {
      trackUpgradeInitiated(tier, 'upgrade_page');
    }
    
    // Log in beta
    if (isBeta) {
      console.log('[Beta] User interested in upgrade:', { planId, tier });
    }
  };

  const handleContinue = () => {
    if (selectedPlan) {
      if (selectedTab === 'platinum') {
        const plan = platinumPlans.find((p) => p.id === selectedPlan);
        onSelectSubscription(selectedPlan, plan?.tier);
        
        // Track upgrade completion in production
        if (!isBeta && plan?.tier) {
          trackUpgradeCompleted(plan.tier, 'stripe');
        }
      } else {
        onSelectSubscription(selectedPlan);
        
        // Track upgrade completion in production
        if (!isBeta) {
          trackUpgradeCompleted('gold', 'stripe');
        }
      }
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: theme.colors.backgroundGradient,
        padding: theme.spacing.sectionPadding,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingTop: '40px',
      }}
    >
      {/* Close Button */}
      <button
        onClick={onCancel}
        style={{
          position: 'absolute',
          top: theme.spacing.medium,
          right: theme.spacing.medium,
          background: 'rgba(255,255,255,0.2)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          cursor: 'pointer',
          fontSize: '20px',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}
      >
        ✕
      </button>

      {/* Header Section */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1
          style={{
            ...theme.typography.h1,
            color: 'white',
            fontSize: '28px',
            marginBottom: '10px',
            fontWeight: 'bold',
          }}
        >
          Your Upgrade
          {isBeta && (
            <span
              style={{
                marginLeft: '8px',
                fontSize: '14px',
                backgroundColor: 'rgba(59, 130, 246, 0.3)',
                border: '1px solid rgba(59, 130, 246, 0.6)',
                borderRadius: '4px',
                padding: '2px 8px',
                color: '#93c5fd',
              }}
            >
              🧪 BETA
            </span>
          )}
        </h1>
        <p
          style={{
            fontSize: '16px',
            color: '#b0b0b0',
            marginBottom: '20px',
          }}
        >
          Kies het plan dat het beste voor je past
        </p>
      </div>

      {/* Plan Selection Tabs */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={(key) => {
            setSelectedTab(key as 'gold' | 'platinum');
            setSelectedPlan(null);
          }}
          classNames={{
            base: 'w-full',
            tabList: 'w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-1',
            cursor: 'bg-gradient-to-r from-yellow-500 to-amber-600',
            tab: 'h-12 text-lg font-semibold',
          }}
        >
          {/* Gold Tab */}
          <Tab key="gold" title="Gold ⭐">
            <div style={{ paddingTop: '40px', paddingBottom: '40px' }}>
              <div
                style={{
                  maxWidth: '600px',
                  margin: '0 auto',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '32px',
                }}
              >
                {/* Gold Plan Card */}
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '24px', color: 'white', marginBottom: '8px', fontWeight: 'bold' }}>
                    {goldPlan.title}
                  </h2>
                  <p style={{ fontSize: '14px', color: '#b0b0b0', marginBottom: '16px' }}>
                    {goldPlan.subtitle}
                  </p>
                  <div
                    style={{
                      fontSize: '42px',
                      fontWeight: 'bold',
                      color: '#FFD700',
                      marginBottom: '8px',
                    }}
                  >
                    €{goldPlan.pricePerMonth.toFixed(2)}
                  </div>
                  <p style={{ fontSize: '12px', color: '#b0b0b0' }}>per maand</p>
                </div>

                {/* Features List */}
                <div style={{ marginBottom: '32px' }}>
                  {goldPlan.features.map((feature, index) => (
                    <div
                      key={index}
                      style={{
                        color: '#e0e0e0',
                        fontSize: '14px',
                        padding: '8px 0',
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Select Button */}
                <button
                  onClick={() => handleSelectPlan(goldPlan.id)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor:
                      selectedPlan === goldPlan.id ? '#FFD700' : 'rgba(255,215,0,0.3)',
                    color: selectedPlan === goldPlan.id ? '#1a1a1a' : '#FFD700',
                    border: '1px solid #FFD700',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {selectedPlan === goldPlan.id ? '✓ Selected' : 'Select Plan'}
                </button>
              </div>
            </div>
          </Tab>

          {/* Platinum Tab */}
          <Tab key="platinum" title="Platinum 💎">
            <div style={{ paddingTop: '40px', paddingBottom: '40px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '24px',
                  maxWidth: '1200px',
                  margin: '0 auto',
                }}
              >
                {platinumPlans.map((plan) => (
                  <div
                    key={plan.id}
                    style={{
                      backgroundColor: plan.isPopular ? 'rgba(168,85,247,0.1)' : 'rgba(255,255,255,0.05)',
                      borderRadius: '12px',
                      border: plan.isPopular
                        ? '2px solid rgba(168,85,247,0.5)'
                        : '1px solid rgba(255,255,255,0.1)',
                      padding: '24px',
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      transform:
                        selectedPlan === plan.id ? 'scale(1.05)' : selectedPlan ? 'scale(0.95)' : 'scale(1)',
                    }}
                  >
                    {plan.isPopular && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '-12px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          backgroundColor: '#A855F7',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                        }}
                      >
                        Most Popular
                      </div>
                    )}

                    {/* Plan Header */}
                    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                      <div style={{ fontSize: '32px', marginBottom: '8px' }}>{plan.icon}</div>
                      <h3 style={{ fontSize: '18px', color: 'white', fontWeight: 'bold', marginBottom: '4px' }}>
                        {plan.title}
                      </h3>
                      <p style={{ fontSize: '12px', color: '#b0b0b0' }}>{plan.subtitle}</p>
                    </div>

                    {/* Pricing */}
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                      {plan.pricePerMonth > 0 ? (
                        <>
                          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#A855F7', marginBottom: '4px' }}>
                            €{plan.pricePerMonth.toFixed(2)}
                          </div>
                          <p style={{ fontSize: '12px', color: '#b0b0b0' }}>per maand</p>
                        </>
                      ) : (
                        <div style={{ fontSize: '18px', color: '#A855F7', fontWeight: 'bold' }}>
                          Custom Pricing
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: '12px', color: '#b0b0b0', marginBottom: '16px', textAlign: 'center' }}>
                      {plan.description}
                    </p>

                    {/* Features */}
                    <div style={{ marginBottom: '20px' }}>
                      {plan.features.map((feature, index) => (
                        <div
                          key={index}
                          style={{
                            color: '#e0e0e0',
                            fontSize: '12px',
                            padding: '6px 0',
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                          }}
                        >
                          {feature}
                        </div>
                      ))}
                    </div>

                    {/* Select Button */}
                    <button
                      onClick={() => handleSelectPlan(plan.id, plan.tier)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor:
                          selectedPlan === plan.id ? '#A855F7' : 'rgba(168,85,247,0.2)',
                        color: '#ffffff',
                        border: '1px solid #A855F7',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {selectedPlan === plan.id ? '✓ Selected' : 'Select Plan'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>

      {/* Continue Button */}
      <div style={{ maxWidth: '1200px', margin: '40px auto 0', width: '100%', textAlign: 'center' }}>
        {isBeta && (
          <div
            style={{
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              border: '1px solid rgba(59, 130, 246, 0.5)',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px',
              color: '#93c5fd',
              fontSize: '14px',
            }}
          >
            📊 <strong>Beta Mode:</strong> Payment is disabled for beta testing. Click "Explore Plan" to see what you'd get!
            This helps us track which plans interest you most.
          </div>
        )}
        <button
          onClick={
            isBeta
              ? () => {
                  console.log('[Beta] User clicked to explore plan:', selectedPlan);
                  // Just show confirmation in beta, don't proceed to payment
                  if (selectedPlan) {
                    alert(
                      `Awesome! You're interested in: ${selectedPlan}\n\nIn the full version, you'd proceed to payment now. We're tracking this interest! 📊`
                    );
                  }
                }
              : handleContinue
          }
          disabled={!selectedPlan}
          style={{
            padding: '12px 40px',
            backgroundColor: selectedPlan ? '#10b981' : 'rgba(16,185,129,0.3)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: selectedPlan ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease',
            opacity: selectedPlan ? 1 : 0.5,
          }}
        >
          {isBeta ? '✨ Explore Plan' : 'Continue with Payment'}
        </button>
        <p style={{ fontSize: '12px', color: '#b0b0b0', marginTop: '12px' }}>
          {selectedPlan
            ? isBeta
              ? 'Great choice! We love your interest in upgrading 🎉'
              : 'Ready to upgrade!'
            : 'Please select a plan to continue'}
        </p>
      </div>
    </div>
  );
};

export default UpgradePage;
