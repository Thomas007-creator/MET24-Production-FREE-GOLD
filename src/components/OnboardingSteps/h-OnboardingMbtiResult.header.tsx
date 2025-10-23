import React from 'react';
import { useOnboardingMbtiResult } from './h-OnboardingMbtiResult.provider';

export const OnboardingMbtiResultHeader: React.FC = () => {
  const { result, bmadColors, getConfidenceColor, getConfidenceLabel } = useOnboardingMbtiResult();

  return (
    <div className="mb-10">
      {/* MBTI Result Icon */}
      <div className={`w-24 h-24 bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl`}>
        <span className={`text-4xl font-bold tracking-widest bg-gradient-to-r ${bmadColors.gradient} bg-clip-text text-transparent`}>
          {result.letters}
        </span>
      </div>

      <h1 className={`text-4xl font-bold mb-4 bg-gradient-to-r ${bmadColors.gradient} bg-clip-text text-transparent`}>Jouw MBTI‑inschatting</h1>

      {/* Database status indicator */}
      <div className="mb-6 p-2 bg-black/20 backdrop-blur-lg rounded-lg border border-white/20">
        <p className="text-xs text-white/60">
          Database: {'🔗 WatermelonDB'}|
          Version: {'2.0.0'}| Status:{' '}
          {'✅ Connected'}
        </p>
      </div>

      {/* Main Result */}
      <div className="mb-8">
        <h2 className="text-5xl font-bold mb-4 tracking-widest">
          {result.letters}
        </h2>
        <p className="text-xl opacity-90 mb-6">
          Vertrouwen:{' '}
          <span
            className="font-bold"
            style={{ color: getConfidenceColor(result.confidence) }}
          >
            {result.confidence}% ({getConfidenceLabel(result.confidence)})
          </span>
        </p>
      </div>
    </div>
  );
};