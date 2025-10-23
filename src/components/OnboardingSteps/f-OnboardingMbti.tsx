import React, { useEffect } from 'react';
import { OnboardingMbtiProvider } from './f-OnboardingMbti.provider';
import { OnboardingMbtiChoiceScreen } from './f-OnboardingMbti.choice-screen';
import { OnboardingMbtiInputForm } from './f-OnboardingMbti.input-form';
import { OnboardingMbtiExternalPaste } from './f-OnboardingMbti.external-paste';
import { OnboardingMbtiAiRecommendation } from './f-OnboardingMbti.ai-recommendation';
import { useOnboardingMbti } from './f-OnboardingMbti.provider';

interface OnboardingMbtiProps {
  onMbtiKnown: (mbtiData: {
    letters: string;
    percentages: { [key: string]: number } | null;
    confidence: number;
    source: 'user_input' | 'external' | 'ai_recommendation';
    aiInsights?: any;
    cognitiveFunctions?: string[];
    developmentPath?: any;
  }) => void;
  onQuickTest: () => void;
  onBack: () => void;
}

const OnboardingMbtiContent: React.FC<OnboardingMbtiProps> = ({
  onMbtiKnown,
  onQuickTest,
  onBack,
}) => {
  const {
    showMbtiInput,
    showExternalPaste,
    showAIRecommendation,
  } = useOnboardingMbti();

  // Track that MBTI page is shown
  useEffect(() => {
    const trackMbtiShown = async () => {
      try {
        console.log('📊 MBTI page shown event tracked');
      } catch (error) {
        console.error('❌ Error tracking MBTI shown event:', error);
      }
    };

    trackMbtiShown();
  }, []);

  // Render different screens based on state
  if (showAIRecommendation) {
    return <OnboardingMbtiAiRecommendation />;
  }

  if (showMbtiInput) {
    return <OnboardingMbtiInputForm />;
  }

  if (showExternalPaste) {
    return <OnboardingMbtiExternalPaste />;
  }

  // Default: Choice screen
  return <OnboardingMbtiChoiceScreen onBack={onBack} />;
};

const OnboardingMbti: React.FC<OnboardingMbtiProps> = (props) => {
  return (
    <OnboardingMbtiProvider {...props}>
      <OnboardingMbtiContent {...props} />
    </OnboardingMbtiProvider>
  );
};

export default OnboardingMbti;
