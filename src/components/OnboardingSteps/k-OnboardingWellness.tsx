import React from 'react';
import { OnboardingWellness } from './k-OnboardingWellness.form';

interface OnboardingWellnessProps {
  onNext: (wellnessData: WellnessData) => void;
  onSkip: () => void;
}

interface WellnessData {
  answers: number[];
  scores: {
    energy_index: number;
    stress_index: number;
    social_support_score: number;
    self_compassion_score: number;
  };
}

const OnboardingWellnessWrapper: React.FC<OnboardingWellnessProps> = ({
  onNext,
  onSkip,
}) => {
  return <OnboardingWellness />;
};

export default OnboardingWellnessWrapper;
export type { OnboardingWellnessProps, WellnessData };
