import React, { useState } from 'react';
import { theme } from '../theme/theme';
import { useAppStore } from '../store/useAppStore';

interface UpgradeGoldPageProps {
  userName?: string;
  mbtiType?: string;
  onSelectSubscription?: (planId: string) => void;
  onCancel?: () => void;
}

const UpgradeGoldPage: React.FC<UpgradeGoldPageProps> = ({
  userName = 'Gebruiker',
  mbtiType = 'INTP',
  onSelectSubscription = () => {},
  onCancel = () => {},
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Gold Tier Features
  const goldFeatures = [
    '✓ Onbeperkte Personalisatie',
    '✓ Bekijk Je Inzichten',
    '✓ Onbeperkte Rewinds',
    '✓ 1 Gratis Diepgaande Analyse per Maand',
    '✓ 2 Gratis Super Insights per Week',
    '✓ Onbeperkt Globale Inspiratie',
    '✓ Top Picks: doelen en micro-beloningen',
  ];

  const handleContinue = () => {
    if (selectedPlan) {
      onSelectSubscription(selectedPlan);
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
          Ontdek je potentieel
        </h1>
        <p
          style={{
            fontSize: '18px',
            color: '#FFD700',
            marginBottom: '20px',
            fontWeight: '500',
          }}
        >
          en match met je hogere zelf via
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
              color: '#FFD700',
              fontSize: '24px',
              margin: '0',
            }}
          >
            YOUR FUTURE SELF Gold™
          </h2>
        </div>
      </div>

      {/* Subscription Plans */}
      <div style={{ marginBottom: '40px' }}>
        <h3
          style={{
            fontSize: '18px',
            color: 'white',
            textAlign: 'center',
            marginBottom: '30px',
            fontWeight: 'bold',
          }}
        >
          Kies een abonnement
        </h3>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxWidth: '500px',
            margin: '0 auto',
          }}
        >
          {/* Weekly Plan */}
          <PlanCard
            planId="weekly"
            title="1 week"
            pricePerWeek={14.99}
            monthlyEquivalent={6.87}
            savePct={51}
            isPopular={false}
            isSelected={selectedPlan === 'weekly'}
            onSelect={() => setSelectedPlan('weekly')}
          />

          {/* Monthly Plan - Recommended */}
          <PlanCard
            planId="monthly"
            title="1 maand"
            pricePerWeek={6.87}
            monthlyEquivalent={6.87}
            savePct={51}
            isPopular={true}
            isSelected={selectedPlan === 'monthly'}
            onSelect={() => setSelectedPlan('monthly')}
          />

          {/* 6-Month Plan - Best Value */}
          <PlanCard
            planId="sixMonth"
            title="6 maanden"
            pricePerWeek={3.42}
            monthlyEquivalent={14.82}
            savePct={76}
            isPopular={false}
            isSelected={selectedPlan === 'sixMonth'}
            onSelect={() => setSelectedPlan('sixMonth')}
          />
        </div>
      </div>

      {/* Features List */}
      <div
        style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
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
            color: '#FFD700',
            marginBottom: '16px',
            fontWeight: 'bold',
          }}
        >
          Inbegrepen bij YOUR FUTURE SELF Gold™
        </h4>
        <ul
          style={{
            listStyle: 'none',
            padding: '0',
            margin: '0',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {goldFeatures.map((feature, index) => (
            <li
              key={index}
              style={{
                fontSize: '15px',
                color: '#E0E0E0',
                fontWeight: '400',
              }}
            >
              {feature}
            </li>
          ))}
        </ul>
      </div>

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
        <p style={{ margin: '0 0 8px 0' }}>
          Door op Doorgaan te tikken, wordt er geld in rekening gebracht, wordt je
          abonnement automatisch verlengd voor dezelfde prijs en pakketduur totdat je
          opzegt via de App Store-instellingen, en ga je akkoord met onze Voorwaarden.
        </p>
      </div>

      {/* Continue Button */}
      <div style={{ maxWidth: '500px', margin: '0 auto', width: '100%' }}>
        <button
          onClick={handleContinue}
          disabled={!selectedPlan}
          style={{
            width: '100%',
            padding: '16px 24px',
            background: selectedPlan ? '#FFD700' : 'rgba(255,215,0,0.3)',
            color: selectedPlan ? 'black' : '#888',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: selectedPlan ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease',
            opacity: selectedPlan ? 1 : 0.6,
          }}
        >
          Doorgaan — Totaal €{
            selectedPlan === 'weekly'
              ? '14,99'
              : selectedPlan === 'monthly'
              ? '6,87'
              : selectedPlan === 'sixMonth'
              ? '20,52'
              : '0,00'
          }
        </button>
      </div>

      {/* Spacer */}
      <div style={{ height: '40px' }} />
    </div>
  );
};

// Plan Card Component
interface PlanCardProps {
  planId: string;
  title: string;
  pricePerWeek: number;
  monthlyEquivalent: number;
  savePct: number;
  isPopular: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({
  planId,
  title,
  pricePerWeek,
  monthlyEquivalent,
  savePct,
  isPopular,
  isSelected,
  onSelect,
}) => {
  return (
    <button
      onClick={onSelect}
      style={{
        position: 'relative',
        padding: '20px',
        background: isSelected
          ? 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,215,0,0.1))'
          : 'rgba(255,255,255,0.08)',
        border: isSelected
          ? '2px solid #FFD700'
          : '1px solid rgba(255,255,255,0.15)',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        textAlign: 'left',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        outline: 'none',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
          e.currentTarget.style.borderColor = 'rgba(255,215,0,0.5)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
        }
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <h5
            style={{
              fontSize: '16px',
              color: 'white',
              fontWeight: 'bold',
              margin: '0',
            }}
          >
            {title}
          </h5>
          {isPopular && (
            <span
              style={{
                background: '#FFD700',
                color: 'black',
                fontSize: '11px',
                fontWeight: 'bold',
                padding: '4px 12px',
                borderRadius: '20px',
              }}
            >
              POPULAIR
            </span>
          )}
        </div>
        <p style={{ fontSize: '14px', color: '#B0B0B0', margin: '0' }}>
          €{pricePerWeek.toFixed(2)} p.w.
          {savePct > 0 && (
            <span style={{ color: '#4CAF50', fontWeight: 'bold', marginLeft: '12px' }}>
              Bespaar {savePct}%
            </span>
          )}
        </p>
      </div>
      <div
        style={{
          width: '24px',
          height: '24px',
          border: '2px solid rgba(255,255,255,0.3)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isSelected ? '#FFD700' : 'transparent',
          flexShrink: 0,
        }}
      >
        {isSelected && <span style={{ color: 'black', fontWeight: 'bold' }}>✓</span>}
      </div>
    </button>
  );
};

export default UpgradeGoldPage;
