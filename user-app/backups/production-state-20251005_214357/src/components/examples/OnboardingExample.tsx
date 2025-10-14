/**
 * Onboarding Example - Met nieuw design system
 * 
 * Dit toont hoe je onboarding componenten kunt maken met het nieuwe design system.
 * Alle styling is nu gecentraliseerd en makkelijk aan te passen.
 */

import React, { useState } from 'react';
import { 
  PageContainer, 
  ContentContainer, 
  GlassCard, 
  StyledButton, 
  PageHeader,
  FormContainer,
  FormGroup,
  StatusIndicator,
  AnimatedContainer,
  Spacer
} from '../ui/DesignSystem';

const OnboardingExample: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>('');

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    console.log('Next clicked with option:', selectedOption);
  };

  return (
    <PageContainer variant="onboarding">
      <ContentContainer size="lg">
        <AnimatedContainer animation="fade-in">
          <PageHeader
            title="Welkom bij Your Future Self"
            subtitle="Persoonlijke AI‑coaching. Privé. Lokaal op jouw telefoon."
            icon="🧠"
          />
        </AnimatedContainer>

        <AnimatedContainer animation="slide-up" delay={0.2}>
          <StatusIndicator status="connected" label="Database" />
        </AnimatedContainer>

        <Spacer size="lg" />

        <AnimatedContainer animation="scale-in" delay={0.4}>
          <GlassCard variant="strong" className="p-8">
            <FormContainer>
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Kies je voorkeur
              </h2>
              
              <FormGroup>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <GlassCard
                    variant="light"
                    className={`p-6 cursor-pointer transition-all duration-300 ${
                      selectedOption === 'ai' 
                        ? 'ring-2 ring-accent-aqua shadow-glow-accent' 
                        : 'hover:shadow-glow'
                    }`}
                    onClick={() => handleOptionSelect('ai')}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-4">🤖</div>
                      <h3 className="text-xl font-bold mb-3 text-white">AI Aanbeveling</h3>
                      <p className="text-sm text-white/80">
                        Laat AI je MBTI type voorspellen op basis van je gedrag
                      </p>
                    </div>
                  </GlassCard>

                  <GlassCard
                    variant="light"
                    className={`p-6 cursor-pointer transition-all duration-300 ${
                      selectedOption === 'manual' 
                        ? 'ring-2 ring-accent-aqua shadow-glow-accent' 
                        : 'hover:shadow-glow'
                    }`}
                    onClick={() => handleOptionSelect('manual')}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-4">✏️</div>
                      <h3 className="text-xl font-bold mb-3 text-white">Ik weet het al</h3>
                      <p className="text-sm text-white/80">
                        Ik ken mijn MBTI type en wil het direct invoeren
                      </p>
                    </div>
                  </GlassCard>
                </div>
              </FormGroup>

              <Spacer size="md" />

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <StyledButton
                  variant="accent"
                  size="lg"
                  onClick={handleNext}
                  disabled={!selectedOption}
                  className="flex-1 sm:flex-none"
                >
                  {selectedOption ? '✅ Doorgaan' : '⏳ Selecteer een optie'}
                </StyledButton>

                <StyledButton
                  variant="glass"
                  size="lg"
                  onClick={() => console.log('Skip clicked')}
                  className="flex-1 sm:flex-none"
                >
                  ⏭️ Overslaan
                </StyledButton>
              </div>
            </FormContainer>
          </GlassCard>
        </AnimatedContainer>

        <Spacer size="lg" />

        <AnimatedContainer animation="fade-in" delay={0.6}>
          <div className="text-center">
            <p className="text-sm text-white/60">
              Je kunt deze instellingen later altijd wijzigen in je profiel.
            </p>
          </div>
        </AnimatedContainer>
      </ContentContainer>
    </PageContainer>
  );
};

export default OnboardingExample;








