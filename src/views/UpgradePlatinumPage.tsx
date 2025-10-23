import React, { useState } from 'react';
import { theme } from '../theme/theme';

interface UpgradePlatinumPageProps {
  userName?: string;
  mbtiType?: string;
  onSelectSubscription?: (planId: string, tier: string) => void;
  onCancel?: () => void;
}

type PlatinumTier = 'tier1' | 'tier2' | 'tier3';

interface PlatinumPlan {
  id: string;
  tier: PlatinumTier;
  title: string;
  subtitle: string;
  pricePerMonth: number;
  description: string;
  features: string[];
  isPopular: boolean;
  icon: string;
}

const UpgradePlatinumPage: React.FC<UpgradePlatinumPageProps> = ({
  userName = 'Gebruiker',
  mbtiType = 'INTP',
  onSelectSubscription = () => {},
  onCancel = () => {},
}) => {
  const [selectedTier, setSelectedTier] = useState<PlatinumTier | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const platformPlans: PlatinumPlan[] = [
    {
      id: 'platinum-tier1-monthly',
      tier: 'tier1',
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
      tier: 'tier2',
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
      tier: 'tier3',
      title: 'Platinum Tier 3',
      subtitle: 'Enterprise',
      pricePerMonth: 0, // Custom pricing
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

  const handleSelectPlan = (plan: PlatinumPlan) => {
    setSelectedTier(plan.tier);
    setSelectedPlan(plan.id);
  };

  const handleContinue = () => {
    if (selectedTier && selectedPlan) {
      onSelectSubscription(selectedPlan, selectedTier);
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
          Ontdek premium mogelijkheden
        </h1>
        <p
          style={{
            fontSize: '18px',
            color: '#E0A0FF',
            marginBottom: '20px',
            fontWeight: '500',
          }}
        >
          en bereik je volledige potentieel met
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '10px',
          }}
        >
          <span style={{ fontSize: '32px' }}>👑</span>
          <h2
            style={{
              ...theme.typography.h2,
              color: '#E0A0FF',
              fontSize: '24px',
              margin: '0',
            }}
          >
            YOUR FUTURE SELF Platinum™
          </h2>
        </div>
        <p style={{ fontSize: '14px', color: '#B0B0B0', margin: '8px 0 0 0' }}>
          Kies je perfecte plan
        </p>
      </div>

      {/* Plans Container */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          maxWidth: '1200px',
          margin: '0 auto 40px auto',
          width: '100%',
          padding: '0 10px',
        }}
      >
        {platformPlans.map((plan) => (
          <PlatinumTierCard
            key={plan.id}
            plan={plan}
            isSelected={selectedPlan === plan.id}
            onSelect={() => handleSelectPlan(plan)}
          />
        ))}
      </div>

      {/* Selection Summary */}
      {selectedTier && (
        <div
          style={{
            background: 'rgba(224,160,255,0.1)',
            border: '1px solid rgba(224,160,255,0.3)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '30px',
            maxWidth: '500px',
            margin: '0 auto 30px auto',
            width: '100%',
          }}
        >
          <h4
            style={{
              fontSize: '16px',
              color: '#E0A0FF',
              marginBottom: '12px',
              fontWeight: 'bold',
              margin: '0 0 12px 0',
            }}
          >
            Geselecteerde Plan
          </h4>
          {selectedTier === 'tier1' && (
            <>
              <p style={{ fontSize: '14px', color: 'white', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                💎 Platinum Tier 1 - Individual Premium
              </p>
              <p style={{ fontSize: '13px', color: '#B0B0B0', margin: '0' }}>
                €9,99 per maand. Geavanceerde AI coaching en inzichten.
              </p>
            </>
          )}
          {selectedTier === 'tier2' && (
            <>
              <p style={{ fontSize: '14px', color: 'white', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                👥 Platinum Tier 2 - Team Edition
              </p>
              <p style={{ fontSize: '13px', color: '#B0B0B0', margin: '0' }}>
                €49,99 per maand. Voor therapeuten en coaches teams.
              </p>
            </>
          )}
          {selectedTier === 'tier3' && (
            <>
              <p style={{ fontSize: '14px', color: 'white', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                🏢 Platinum Tier 3 - Enterprise
              </p>
              <p style={{ fontSize: '13px', color: '#B0B0B0', margin: '0' }}>
                Custom pricing. On-premise, custom LLM, white-label.
              </p>
            </>
          )}
        </div>
      )}

      {/* Terms & Conditions */}
      <div
        style={{
          fontSize: '12px',
          color: '#B0B0B0',
          textAlign: 'center',
          marginBottom: '30px',
          maxWidth: '500px',
          margin: '0 auto 30px auto',
          lineHeight: '1.6',
        }}
      >
        <p style={{ margin: '0' }}>
          Door op Doorgaan te tikken, gaat je akkoord met automatische vernieuwing van je
          abonnement. Je kunt op elk moment opzeggen in de instellingen.
        </p>
      </div>

      {/* Continue Button */}
      <div style={{ maxWidth: '500px', margin: '0 auto', width: '100%' }}>
        <button
          onClick={handleContinue}
          disabled={!selectedTier}
          style={{
            width: '100%',
            padding: '16px 24px',
            background: selectedTier ? '#E0A0FF' : 'rgba(224,160,255,0.3)',
            color: selectedTier ? '#1a1a1a' : '#888',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: selectedTier ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease',
            opacity: selectedTier ? 1 : 0.6,
          }}
        >
          Doorgaan met Platinum
        </button>
      </div>

      {/* Spacer */}
      <div style={{ height: '40px' }} />
    </div>
  );
};

// Platinum Tier Card Component
interface PlatinumTierCardProps {
  plan: PlatinumPlan;
  isSelected: boolean;
  onSelect: () => void;
}

const PlatinumTierCard: React.FC<PlatinumTierCardProps> = ({
  plan,
  isSelected,
  onSelect,
}) => {
  return (
    <button
      onClick={onSelect}
      style={{
        position: 'relative',
        padding: '24px',
        background: isSelected
          ? 'linear-gradient(135deg, rgba(224,160,255,0.2), rgba(224,160,255,0.1))'
          : 'rgba(255,255,255,0.08)',
        border: isSelected ? '2px solid #E0A0FF' : '1px solid rgba(255,255,255,0.15)',
        borderRadius: '16px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        outline: 'none',
        minHeight: '500px',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
          e.currentTarget.style.borderColor = 'rgba(224,160,255,0.5)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
        }
      }}
    >
      {/* Popular Badge */}
      {plan.isPopular && (
        <div
          style={{
            position: 'absolute',
            top: '-12px',
            right: '20px',
            background: '#E0A0FF',
            color: '#1a1a1a',
            fontSize: '11px',
            fontWeight: 'bold',
            padding: '6px 16px',
            borderRadius: '20px',
          }}
        >
          POPULAIR
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>{plan.icon}</div>
        <h4
          style={{
            fontSize: '18px',
            color: '#E0A0FF',
            fontWeight: 'bold',
            margin: '0 0 4px 0',
          }}
        >
          {plan.title}
        </h4>
        <p style={{ fontSize: '14px', color: '#B0B0B0', margin: '0 0 12px 0' }}>
          {plan.subtitle}
        </p>

        {/* Price */}
        {plan.tier !== 'tier3' ? (
          <div>
            <div style={{ fontSize: '28px', color: 'white', fontWeight: 'bold', margin: '0' }}>
              €{plan.pricePerMonth.toFixed(2)}
            </div>
            <p style={{ fontSize: '13px', color: '#B0B0B0', margin: '4px 0 0 0' }}>
              per maand
            </p>
          </div>
        ) : (
          <div style={{ fontSize: '16px', color: '#E0A0FF', fontWeight: 'bold' }}>
            Custom Pricing
          </div>
        )}
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: '14px',
          color: '#B0B0B0',
          margin: '0 0 20px 0',
          lineHeight: '1.5',
          flex: 1,
        }}
      >
        {plan.description}
      </p>

      {/* Features */}
      <ul
        style={{
          listStyle: 'none',
          padding: '0',
          margin: '0 0 20px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          flex: 1,
        }}
      >
        {plan.features.map((feature, index) => (
          <li
            key={index}
            style={{
              fontSize: '13px',
              color: '#D0D0D0',
              fontWeight: '400',
            }}
          >
            {feature}
          </li>
        ))}
      </ul>

      {/* Selection Indicator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 'auto',
          paddingTop: '16px',
          borderTop: isSelected ? '1px solid rgba(224,160,255,0.3)' : 'none',
        }}
      >
        <div
          style={{
            width: '24px',
            height: '24px',
            border: '2px solid rgba(224,160,255,0.5)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isSelected ? '#E0A0FF' : 'transparent',
          }}
        >
          {isSelected && <span style={{ color: '#1a1a1a', fontWeight: 'bold' }}>✓</span>}
        </div>
      </div>
    </button>
  );
};

export default UpgradePlatinumPage;
