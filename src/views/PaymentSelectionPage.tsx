import React, { useState } from 'react';
import { theme } from '../theme/theme';

interface PaymentSelectionPageProps {
  selectedPlan?: string;
  totalPrice?: number;
  userName?: string;
  onSelectPaymentMethod?: (method: string) => void;
  onBack?: () => void;
  onCancel?: () => void;
}

const PaymentSelectionPage: React.FC<PaymentSelectionPageProps> = ({
  selectedPlan = 'monthly',
  totalPrice = 14.99,
  userName = 'geert.m@gmail.com',
  onSelectPaymentMethod = () => {},
  onBack = () => {},
  onCancel = () => {},
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  const paymentMethods = [
    {
      id: 'apple-account',
      label: '🍎 Apple Account',
      description: 'Betaal via je Apple Account',
      icon: '🍎',
    },
    {
      id: 'ideal-stripe',
      label: '🏦 iDEAL / Stripe',
      description: 'Betaal via iDEAL (Nederland)',
      icon: '🏦',
    },
    {
      id: 'credit-card',
      label: '💳 Creditcard',
      description: 'Visa, Mastercard, American Express',
      icon: '💳',
    },
    {
      id: 'bitcoin',
      label: '₿ Bitcoin',
      description: 'Betaal met cryptocurrency',
      icon: '₿',
    },
  ];

  const handleSelectMethod = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
    // Navigate to payment confirmation
    onSelectPaymentMethod(methodId);
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
      {/* Back Button */}
      <button
        onClick={onBack}
        style={{
          position: 'absolute',
          top: theme.spacing.medium,
          left: theme.spacing.medium,
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
        ←
      </button>

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

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px', marginTop: '20px' }}>
        <h1
          style={{
            ...theme.typography.h1,
            color: 'white',
            fontSize: '28px',
            marginBottom: '10px',
            fontWeight: 'bold',
          }}
        >
          Betaalkeuze
        </h1>
        <p style={{ fontSize: '14px', color: '#B0B0B0', margin: '0' }}>
          Selecteer je betaalmethode
        </p>
      </div>

      {/* Invoice Overview */}
      <div
        style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '40px',
          maxWidth: '500px',
          margin: '0 auto 40px auto',
          width: '100%',
        }}
      >
        <h3
          style={{
            fontSize: '16px',
            color: '#FFD700',
            marginBottom: '16px',
            fontWeight: 'bold',
            margin: '0 0 16px 0',
          }}
        >
          Facturenoverzicht
        </h3>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '12px',
            paddingBottom: '12px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <span style={{ fontSize: '14px', color: '#B0B0B0' }}>Gebruikersnaam/Email:</span>
          <span style={{ fontSize: '14px', color: 'white', fontWeight: 'bold' }}>
            {userName}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '12px',
            paddingBottom: '12px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <span style={{ fontSize: '14px', color: '#B0B0B0' }}>Plan:</span>
          <span style={{ fontSize: '14px', color: 'white', fontWeight: 'bold' }}>
            {selectedPlan === 'monthly' ? '1 Maand' : selectedPlan === 'weekly' ? '1 Week' : '6 Maanden'}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '12px',
            paddingBottom: '12px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <span style={{ fontSize: '14px', color: '#B0B0B0' }}>Startdatum:</span>
          <span style={{ fontSize: '14px', color: 'white', fontWeight: 'bold' }}>
            Vandaag
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '2px solid rgba(255,215,0,0.3)',
          }}
        >
          <span style={{ fontSize: '16px', color: 'white', fontWeight: 'bold' }}>Totaal:</span>
          <span style={{ fontSize: '16px', color: '#FFD700', fontWeight: 'bold' }}>
            €{totalPrice.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Payment Methods */}
      <h3
        style={{
          fontSize: '16px',
          color: 'white',
          marginBottom: '20px',
          textAlign: 'center',
          fontWeight: 'bold',
        }}
      >
        Betaalmethode
      </h3>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          maxWidth: '500px',
          margin: '0 auto 40px auto',
          width: '100%',
        }}
      >
        {paymentMethods.map((method) => (
          <PaymentMethodCard
            key={method.id}
            method={method}
            isSelected={selectedPaymentMethod === method.id}
            onSelect={() => handleSelectMethod(method.id)}
          />
        ))}
      </div>

      {/* Warning Note */}
      <div
        style={{
          background: 'rgba(255,193,7,0.1)',
          border: '1px solid rgba(255,193,7,0.3)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '30px',
          maxWidth: '500px',
          margin: '0 auto 30px auto',
          width: '100%',
        }}
      >
        <p style={{ fontSize: '12px', color: '#FFE082', margin: '0', lineHeight: '1.6' }}>
          ⚠️ Je abonnement wordt automatisch verlengd op dezelfde voorwaarden. Je kunt dit op elk
          moment opzeggen in de instellingen.
        </p>
      </div>

      {/* Spacer */}
      <div style={{ height: '40px' }} />
    </div>
  );
};

// Payment Method Card Component
interface PaymentMethod {
  id: string;
  label: string;
  description: string;
  icon: string;
}

interface PaymentMethodCardProps {
  method: PaymentMethod;
  isSelected: boolean;
  onSelect: () => void;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  method,
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
          ? 'linear-gradient(135deg, rgba(76,175,80,0.2), rgba(76,175,80,0.1))'
          : 'rgba(255,255,255,0.08)',
        border: isSelected ? '2px solid #4CAF50' : '1px solid rgba(255,255,255,0.15)',
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
          e.currentTarget.style.borderColor = 'rgba(76,175,80,0.5)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
        }
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
        <span style={{ fontSize: '28px' }}>{method.icon}</span>
        <div style={{ textAlign: 'left' }}>
          <h5
            style={{
              fontSize: '16px',
              color: 'white',
              fontWeight: 'bold',
              margin: '0 0 4px 0',
            }}
          >
            {method.label}
          </h5>
          <p style={{ fontSize: '13px', color: '#B0B0B0', margin: '0' }}>
            {method.description}
          </p>
        </div>
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
          background: isSelected ? '#4CAF50' : 'transparent',
          flexShrink: 0,
        }}
      >
        {isSelected && <span style={{ color: 'white', fontWeight: 'bold' }}>✓</span>}
      </div>
    </button>
  );
};

export default PaymentSelectionPage;
