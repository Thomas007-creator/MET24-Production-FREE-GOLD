import React, { useState } from 'react';
import { theme } from '../theme/theme';

interface IdealStripeIntegrationPageProps {
  totalPrice?: number;
  onPaymentSuccess?: () => void;
  onPaymentFailed?: (error: string) => void;
  onBack?: () => void;
  onCancel?: () => void;
}

const IdealStripeIntegrationPage: React.FC<IdealStripeIntegrationPageProps> = ({
  totalPrice = 14.99,
  onPaymentSuccess = () => {},
  onPaymentFailed = () => {},
  onBack = () => {},
  onCancel = () => {},
}) => {
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBankSelector, setShowBankSelector] = useState(false);

  const idealBanks = [
    { code: 'ABNANL2A', name: 'ABN AMRO', logo: '🏦' },
    { code: 'SNSBNL2A', name: 'SNS Bank', logo: '🏦' },
    { code: 'ASNNL2A', name: 'ASN Bank', logo: '🏦' },
    { code: 'BUNQNL2A', name: 'bunq', logo: '🏦' },
    { code: 'CITINL2A', name: 'Citi', logo: '🏦' },
    { code: 'FORUMNL2A', name: 'Forum for Banks', logo: '🏦' },
    { code: 'FRBKNL2A', name: 'Friesland Bank', logo: '🏦' },
    { code: 'FVLBNL22', name: 'F.v.Lanschot Kempen', logo: '🏦' },
    { code: 'GEBABEBB', name: 'BNP Paribas Fortis', logo: '🏦' },
    { code: 'HANDNL2A', name: 'Handelsbanken', logo: '🏦' },
    { code: 'INGBNL2A', name: 'ING', logo: '🏦' },
    { code: 'KREDBE22', name: 'KBC/CBC', logo: '🏦' },
    { code: 'RBRBNL21', name: 'Rabobank', logo: '🏦' },
    { code: 'TRIOBEBB', name: 'Triodos Bank', logo: '🏦' },
    { code: 'NNABEBB22', name: 'NN Bank', logo: '🏦' },
  ];

  const handleBankSelect = async (bankCode: string) => {
    setSelectedBank(bankCode);
    setIsProcessing(true);

    try {
      // Simulate iDEAL payment initiation
      // In production, this would call your Stripe backend
      const response = await fetch('/api/stripe/ideal-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(totalPrice * 100), // Stripe expects cents
          bank: bankCode,
          description: 'YOUR FUTURE SELF Gold Subscription',
        }),
      });

      if (!response.ok) {
        throw new Error('Payment initiation failed');
      }

      const data = await response.json();

      // Redirect to iDEAL payment page
      if (data.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        throw new Error('No redirect URL provided');
      }
    } catch (error: any) {
      setIsProcessing(false);
      onPaymentFailed(error.message || 'Payment failed. Please try again.');
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
      {/* Back Button */}
      <button
        onClick={onBack}
        disabled={isProcessing}
        style={{
          position: 'absolute',
          top: theme.spacing.medium,
          left: theme.spacing.medium,
          background: 'rgba(255,255,255,0.2)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          fontSize: '20px',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          opacity: isProcessing ? 0.5 : 1,
        }}
      >
        ←
      </button>

      {/* Close Button */}
      <button
        onClick={onCancel}
        disabled={isProcessing}
        style={{
          position: 'absolute',
          top: theme.spacing.medium,
          right: theme.spacing.medium,
          background: 'rgba(255,255,255,0.2)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          fontSize: '20px',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          opacity: isProcessing ? 0.5 : 1,
        }}
      >
        ✕
      </button>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px', marginTop: '20px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          <span style={{ fontSize: '32px' }}>🏦</span>
          <h1
            style={{
              ...theme.typography.h1,
              color: '#FFD700',
              fontSize: '24px',
              margin: '0',
              fontWeight: 'bold',
            }}
          >
            iDEAL betaling
          </h1>
          <span style={{ fontSize: '32px' }}>€</span>
        </div>
        <h2
          style={{
            fontSize: '28px',
            color: 'white',
            fontWeight: 'bold',
            margin: '0 0 10px 0',
          }}
        >
          €{totalPrice.toFixed(2)}
        </h2>
        <p style={{ fontSize: '14px', color: '#B0B0B0', margin: '0' }}>
          YOUR FUTURE SELF Gold™ Subscription
        </p>
      </div>

      {/* Payment Status */}
      {isProcessing && (
        <div
          style={{
            background: 'rgba(76,175,80,0.1)',
            border: '1px solid rgba(76,175,80,0.3)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '30px',
            maxWidth: '500px',
            margin: '0 auto 30px auto',
            width: '100%',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '12px' }}>⏳</div>
          <p style={{ fontSize: '14px', color: '#81C784', margin: '0', fontWeight: 'bold' }}>
            Verwerken van betaling...
          </p>
          <p style={{ fontSize: '12px', color: '#A5D6A7', margin: '8px 0 0 0' }}>
            Je wordt doorgestuurd naar je bank voor bevestiging.
          </p>
        </div>
      )}

      {/* Bank Selection */}
      {!showBankSelector ? (
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
          <h3
            style={{
              fontSize: '16px',
              color: '#FFD700',
              marginBottom: '16px',
              fontWeight: 'bold',
              margin: '0 0 16px 0',
            }}
          >
            Kies je bank
          </h3>

          <p style={{ fontSize: '14px', color: '#B0B0B0', marginBottom: '20px', margin: '0 0 20px 0' }}>
            Selecteer je bank om veilig te betalen via iDEAL.
          </p>

          <button
            onClick={() => setShowBankSelector(true)}
            disabled={isProcessing}
            style={{
              width: '100%',
              padding: '16px',
              background: 'rgba(255,215,0,0.1)',
              border: '1px solid rgba(255,215,0,0.3)',
              borderRadius: '12px',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              color: '#FFD700',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              opacity: isProcessing ? 0.5 : 1,
            }}
          >
            🏦 Selecteer je bank
          </button>
        </div>
      ) : (
        <div
          style={{
            maxWidth: '500px',
            margin: '0 auto 30px auto',
            width: '100%',
          }}
        >
          <h3
            style={{
              fontSize: '16px',
              color: '#FFD700',
              marginBottom: '16px',
              fontWeight: 'bold',
            }}
          >
            Kies je bank
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              marginBottom: '20px',
            }}
          >
            {idealBanks.map((bank) => (
              <button
                key={bank.code}
                onClick={() => handleBankSelect(bank.code)}
                disabled={isProcessing}
                style={{
                  padding: '16px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '12px',
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  color: 'white',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  opacity: isProcessing ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isProcessing) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                    e.currentTarget.style.borderColor = 'rgba(255,215,0,0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isProcessing) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                  }
                }}
              >
                <div style={{ fontSize: '20px', marginBottom: '8px' }}>{bank.logo}</div>
                <div style={{ fontSize: '12px' }}>{bank.name}</div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowBankSelector(false)}
            disabled={isProcessing}
            style={{
              width: '100%',
              padding: '12px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '12px',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              color: '#B0B0B0',
              transition: 'all 0.3s ease',
              opacity: isProcessing ? 0.5 : 1,
            }}
          >
            ← Terug
          </button>
        </div>
      )}

      {/* Security Info */}
      <div
        style={{
          background: 'rgba(76,175,80,0.1)',
          border: '1px solid rgba(76,175,80,0.3)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '30px',
          maxWidth: '500px',
          margin: '0 auto 30px auto',
          width: '100%',
        }}
      >
        <p style={{ fontSize: '12px', color: '#81C784', margin: '0', lineHeight: '1.6' }}>
          🔒 Je betaling is beveiligd met iDEAL. Alle gegevens worden versleuteld verzonden.
        </p>
      </div>

      {/* Spacer */}
      <div style={{ height: '40px' }} />
    </div>
  );
};

export default IdealStripeIntegrationPage;
