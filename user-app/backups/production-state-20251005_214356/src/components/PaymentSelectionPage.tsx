import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Divider } from '@nextui-org/react';
import { ArrowLeft, CreditCard, Apple, Building2 } from 'lucide-react';
import { analytics } from '../services/analytics';

interface PaymentSelectionPageProps {
  selectedPlan: string | null;
  onSelectPaymentMethod: (method: string) => void;
  onBack: () => void;
  onCancel?: () => void;
}

const PaymentSelectionPage: React.FC<PaymentSelectionPageProps> = ({
  selectedPlan,
  onSelectPaymentMethod,
  onBack,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [userEmail] = useState<string>('geert.m@gmail.com');
  const [userPhone] = useState<string>('+32 6-44836980');

  const planData = {
    weekly: { name: '1 week', price: 14.99, period: 'per week' },
    monthly: { name: '1 maand', price: 6.87, period: 'per week' },
    sixMonth: { name: '6 maanden', price: 3.42, period: 'per week' },
  };

  const currentPlan = selectedPlan
    ? planData[selectedPlan as keyof typeof planData]
    : null;

  const paymentMethods = [
    {
      id: 'apple',
      name: 'Apple Account',
      description: 'Betaling via App Store',
      icon: Apple,
      color: 'bg-black text-white',
      popular: true,
    },
    {
      id: 'ideal',
      name: 'iDEAL/Stripe',
      description: 'Betaling via Nederlandse banken',
      icon: Building2,
      color: 'bg-orange-500 text-white',
    },
    {
      id: 'stripe',
      name: 'Creditcard of Bitcoin',
      description: 'Visa, Mastercard, Bitcoin',
      icon: CreditCard,
      color: 'bg-blue-600 text-white',
    },
  ];

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    analytics.track('payment_method_selected', {
      step: 'payment_selection',
      method: methodId,
      timestamp: new Date().toISOString(),
    });

    // For iDEAL, go directly to external provider
    if (methodId === 'ideal') {
      // iDEAL payment flow
      window.location.href = `https://pay.ideal.nl/payment/${currentPlan?.price}`;
    }
    // Apple and Stripe stay in the app for now
  };

  const handleConfirmPayment = () => {
    if (!selectedMethod) return;

    analytics.track('payment_confirmed', {
      step: 'payment_confirmation',
      method: selectedMethod,
      timestamp: new Date().toISOString(),
    });

    // Navigate to external payment providers based on selected method
    switch (selectedMethod) {
      case 'apple':
        // Apple App Store subscription flow - currently deactivated
        analytics.track('apple_payment_attempted', { status: 'deactivated' });
        break;
      case 'ideal':
        // iDEAL payment flow
        window.location.href = `https://pay.ideal.nl/payment/${currentPlan?.price}`;
        break;
      case 'stripe':
        // Stripe payment flow - currently form only, no actual processing
        analytics.track('stripe_payment_attempted', { status: 'form_only' });
        break;
      default:
        onSelectPaymentMethod(selectedMethod);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center p-4'>
      <div className='max-w-2xl w-full'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-white mb-2'>Betaalkeuze</h1>
          <p className='text-white/80'>Kies je voorkeurs betaalmethode</p>
        </div>

        {/* Invoice Summary */}
        <Card className='bg-white/10 backdrop-blur-xl border border-white/20 mb-6'>
          <CardHeader>
            <h2 className='text-xl font-bold text-white'>Facturenoverzicht</h2>
          </CardHeader>
          <CardBody>
            <div className='space-y-4'>
              <div className='flex justify-between items-center'>
                <span className='text-white/80'>
                  Huidige factuur is nog niet betaald. Tik je &apos;m nog door?
                </span>
              </div>

              <Divider className='bg-white/20' />

              <div className='space-y-3'>
                <div className='flex justify-between'>
                  <span className='text-white'>
                    Gebruikersnaam of mobiel-nummer:
                  </span>
                </div>
                <div className='bg-white/10 rounded-lg p-3'>
                  <p className='text-white font-medium'>{userEmail}</p>
                  <p className='text-white/80 text-sm'>of {userPhone}</p>
                </div>
              </div>

              <Divider className='bg-white/20' />

              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <span className='text-white'>Vanaf 11 Augustus 2025</span>
                  <span className='text-white'>
                    €{currentPlan?.price} {currentPlan?.period}
                  </span>
                </div>
                <div className='flex justify-between font-bold text-lg'>
                  <span className='text-white'>Totaal:</span>
                  <span className='text-yellow-300'>€{currentPlan?.price}</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Payment Methods */}
        <Card className='bg-white/10 backdrop-blur-xl border border-white/20 mb-6'>
          <CardHeader>
            <h3 className='text-xl font-bold text-white'>Betaalroute</h3>
          </CardHeader>
          <CardBody>
            <div className='space-y-4'>
              {paymentMethods.map(method => (
                <Card
                  key={method.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedMethod === method.id
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black border-2 border-yellow-300'
                      : 'bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20'
                  }`}
                  onClick={() => handleMethodSelect(method.id)}
                >
                  <CardBody className='p-4'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-4'>
                        <div className={`p-3 rounded-lg ${method.color}`}>
                          <method.icon className='w-6 h-6' />
                        </div>
                        <div>
                          <h4 className='font-semibold text-lg'>
                            {method.name}
                          </h4>
                          <p
                            className={`text-sm ${selectedMethod === method.id ? 'text-black/80' : 'text-white/80'}`}
                          >
                            {method.description}
                          </p>
                        </div>
                      </div>
                      {method.popular && (
                        <div className='bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold'>
                          Populair
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Apple Account Modal Preview - Deactivated */}
        {selectedMethod === 'apple' && (
          <Card className='bg-white/10 backdrop-blur-xl border border-white/20 mb-6'>
            <CardHeader>
              <div className='flex items-center gap-3'>
                <Apple className='w-6 h-6 text-white' />
                <h3 className='text-lg font-bold text-white'>App Store</h3>
                <span className='bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold'>
                  Binnenkort
                </span>
              </div>
            </CardHeader>
            <CardBody>
              <div className='space-y-4 text-center'>
                <div className='w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto'>
                  <Apple className='w-8 h-8 text-white' />
                </div>
                <h4 className='font-semibold text-white'>
                  Apple App Store Integratie
                </h4>
                <p className='text-white/80 text-sm'>
                  Deze betalingsmethode wordt binnenkort geactiveerd
                </p>
                <p className='text-white/60 text-xs'>
                  Houd de app bijgewerkt voor de nieuwste functies
                </p>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Creditcard & Bitcoin Payment Form */}
        {selectedMethod === 'stripe' && (
          <Card className='bg-white/10 backdrop-blur-xl border border-white/20 mb-6'>
            <CardHeader>
              <div className='flex items-center gap-3'>
                <CreditCard className='w-6 h-6 text-white' />
                <h3 className='text-lg font-bold text-white'>
                  Creditcard & Bitcoin Betaling
                </h3>
              </div>
            </CardHeader>
            <CardBody>
              <div className='space-y-6'>
                {/* Credit Card Section */}
                <div className='space-y-4'>
                  <h4 className='text-white font-semibold text-lg'>
                    💳 Creditcard Betaling
                  </h4>

                  {/* Credit Card Logos */}
                  <div className='flex items-center gap-3 p-3 bg-white/10 rounded-lg'>
                    <div className='w-12 h-8 bg-blue-600 rounded flex items-center justify-center'>
                      <span className='text-white font-bold text-xs'>VISA</span>
                    </div>
                    <div className='w-12 h-8 bg-red-600 rounded flex items-center justify-center'>
                      <span className='text-white font-bold text-xs'>MC</span>
                    </div>
                    <div className='w-12 h-8 bg-blue-800 rounded flex items-center justify-center'>
                      <span className='text-white font-bold text-xs'>AMEX</span>
                    </div>
                    <div className='w-12 h-8 bg-yellow-500 rounded flex items-center justify-center'>
                      <span className='text-white font-bold text-xs'>PP</span>
                    </div>
                  </div>

                  {/* Credit Card Form Fields */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <label
                        htmlFor='cardholder-name'
                        className='text-white/80 text-sm'
                      >
                        Kaarthouder Naam
                      </label>
                      <input
                        id='cardholder-name'
                        type='text'
                        placeholder='Jouw naam'
                        className='w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-yellow-400 transition-colors'
                      />
                    </div>
                    <div className='space-y-2'>
                      <label
                        htmlFor='card-number'
                        className='text-white/80 text-sm'
                      >
                        Kaartnummer
                      </label>
                      <input
                        id='card-number'
                        type='text'
                        placeholder='1234 5678 9012 3456'
                        className='w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-yellow-400 transition-colors'
                      />
                    </div>
                    <div className='space-y-2'>
                      <label
                        htmlFor='expiry-date'
                        className='text-white/80 text-sm'
                      >
                        Vervaldatum
                      </label>
                      <input
                        id='expiry-date'
                        type='text'
                        placeholder='MM/YY'
                        className='w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-yellow-400 transition-colors'
                      />
                    </div>
                    <div className='space-y-2'>
                      <label htmlFor='cvc' className='text-white/80 text-sm'>
                        CVC
                      </label>
                      <input
                        id='cvc'
                        type='text'
                        placeholder='123'
                        className='w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-yellow-400 transition-colors'
                      />
                    </div>
                  </div>

                  <div className='text-center'>
                    <p className='text-xs text-white/60'>
                      Betaling wordt verwerkt via Stripe - Veilig en versleuteld
                    </p>
                  </div>
                </div>

                <Divider className='bg-white/20' />

                {/* Bitcoin Section */}
                <div className='space-y-4'>
                  <h4 className='text-white font-semibold text-lg'>
                    ₿ Bitcoin Betaling
                  </h4>

                  <div className='space-y-4'>
                    {/* Bitcoin Address */}
                    <div className='space-y-2'>
                      <label
                        htmlFor='bitcoin-address'
                        className='text-white/80 text-sm'
                      >
                        Bitcoin Adres
                      </label>
                      <div
                        id='bitcoin-address'
                        className='bg-white/10 border border-white/20 rounded-lg p-3'
                      >
                        <p className='text-white font-mono text-sm break-all'>
                          bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
                        </p>
                        <p className='text-white/60 text-xs mt-1'>
                          Vaste encryptie code voor betalingen
                        </p>
                      </div>
                    </div>

                    {/* QR Code Placeholder */}
                    <div className='space-y-2'>
                      <label
                        htmlFor='qr-code'
                        className='text-white/80 text-sm'
                      >
                        QR Code
                      </label>
                      <div
                        id='qr-code'
                        className='w-32 h-32 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center mx-auto'
                      >
                        <div className='text-center'>
                          <div className='w-20 h-20 bg-white/20 rounded-lg flex items-center justify-center mb-2'>
                            <span className='text-white text-2xl'>📱</span>
                          </div>
                          <p className='text-white/60 text-xs'>
                            Scan met je wallet app
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className='text-center'>
                      <p className='text-xs text-white/60'>
                        Betaling wordt automatisch geverifieerd op de blockchain
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* iDEAL Bank Selection */}
        {selectedMethod === 'ideal' && (
          <Card className='bg-white/10 backdrop-blur-xl border border-white/20 mb-6'>
            <CardHeader>
              <div className='flex items-center gap-3'>
                <Building2 className='w-6 h-6 text-white' />
                <h3 className='text-lg font-bold text-white'>iDEAL Betaling</h3>
              </div>
            </CardHeader>
            <CardBody>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <div className='w-8 h-8 bg-orange-500 rounded flex items-center justify-center'>
                      <span className='text-white font-bold text-sm'>i</span>
                    </div>
                    <span className='text-white font-bold'>iDEAL</span>
                  </div>
                  <span className='text-white font-bold'>
                    €{currentPlan?.price}
                  </span>
                </div>

                <Divider className='bg-white/20' />

                <div className='space-y-3'>
                  <h4 className='text-white font-semibold'>Kies je bank</h4>

                  <div className='grid grid-cols-1 gap-3'>
                    {[
                      { name: 'ABN AMRO', logo: '🏦', color: 'bg-red-600' },
                      { name: 'ING Bank', logo: '🦁', color: 'bg-orange-500' },
                      { name: 'Rabobank', logo: '🌾', color: 'bg-green-600' },
                      { name: 'SNS Bank', logo: '📱', color: 'bg-blue-600' },
                      { name: 'ASN Bank', logo: '🌱', color: 'bg-teal-600' },
                      { name: 'Bunq', logo: '💚', color: 'bg-green-500' },
                      { name: 'RegioBank', logo: '🏛️', color: 'bg-purple-600' },
                      {
                        name: 'Triodos Bank',
                        logo: '🌿',
                        color: 'bg-green-700',
                      },
                      {
                        name: 'Van Lanschot',
                        logo: '🏰',
                        color: 'bg-gray-700',
                      },
                      { name: 'Knab', logo: '🔵', color: 'bg-blue-700' },
                    ].map(bank => (
                      <Card
                        key={bank.name}
                        className='bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 cursor-pointer transition-all duration-200 hover:scale-105'
                        onClick={() => {
                          analytics.track('bank_selected', {
                            bank: bank.name,
                            method: 'ideal',
                            timestamp: new Date().toISOString(),
                          });
                          // Hier zou normaal de bank-app of telefoon worden geopend
                          // Maar we forceren dit niet zoals gevraagd
                        }}
                      >
                        <CardBody className='p-4'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-4'>
                              <div
                                className={`w-12 h-12 ${bank.color} rounded-lg flex items-center justify-center text-2xl`}
                              >
                                {bank.logo}
                              </div>
                              <div>
                                <h5 className='font-semibold text-lg'>
                                  {bank.name}
                                </h5>
                                <p className='text-white/80 text-sm'>
                                  Veilig betalen via iDEAL
                                </p>
                              </div>
                            </div>
                            <div className='text-white/60'>
                              <span className='text-xs'>
                                Klik om te selecteren
                              </span>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className='text-center'>
                  <p className='text-xs text-white/60'>
                    pay.ideal.nl - Veilig betalen via Nederlandse banken
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Button
            color='default'
            variant='bordered'
            onClick={onBack}
            className='bg-white/10 text-white border-white/30 hover:bg-white/20'
            startContent={<ArrowLeft className='w-4 h-4' />}
          >
            Annuleer
          </Button>

          <Button
            color='warning'
            variant='solid'
            onClick={handleConfirmPayment}
            disabled={!selectedMethod}
            className='bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-8 py-3 disabled:opacity-50'
            size='lg'
          >
            Bevestig Betaling
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSelectionPage;
