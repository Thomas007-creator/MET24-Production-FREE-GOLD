import React from 'react';
import { useOnboardingMbtiResult } from './h-OnboardingMbtiResult.provider';

export const OnboardingMbtiResultDichotomyBreakdown: React.FC = () => {
  const {
    result,
    getDichotomyColor,
    getDichotomyLabel,
    getConfidenceColor
  } = useOnboardingMbtiResult();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Object.entries(result.percentages).map(([dichotomy, data]) => (
        <div
          key={dichotomy}
          className={`${getDichotomyColor(dichotomy)} backdrop-blur-xl rounded-2xl p-6`}
        >
          <h3 className="text-lg font-semibold mb-4 text-blue-300">
            {getDichotomyLabel(dichotomy)}
          </h3>

          <div className="flex justify-between items-center mb-4">
            <span
              className={`text-3xl font-bold ${
                data.letter === dichotomy.split('/')[0]
                  ? 'text-blue-300'
                  : 'text-cyan-300'
              }`}
            >
              {data.letter}
            </span>
            <span
              className="text-2xl font-semibold"
              style={{ color: getConfidenceColor(data.confidence) }}
            >
              {data.percentage}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden mb-3">
            <div
              className="h-full transition-all duration-500 ease-out rounded-full"
              style={{
                width: `${data.percentage}%`,
                background: `linear-gradient(90deg, ${getConfidenceColor(data.confidence)} 0%, ${getConfidenceColor(data.confidence)}80 100%)`,
              }}
            />
          </div>

          <p className="text-sm opacity-70">
            Vertrouwen: {data.confidence}%
          </p>
        </div>
      ))}
    </div>
  );
};