import React from 'react';
import { Button } from '@nextui-org/react';
import { useOnboardingMbtiResult } from './h-OnboardingMbtiResult.provider';

export const OnboardingMbtiResultActionButtons: React.FC = () => {
  const {
    isSaving,
    handleSave,
    handleEdit,
    handleBack,
    handleUseExternal,
  } = useOnboardingMbtiResult();

  return (
    <div className="space-y-4 mb-8">
      {/* Primary Button - Save */}
      <Button
        color="primary"
        size="lg"
        onClick={handleSave}
        disabled={isSaving}
        className="w-full bg-white text-blue-600 hover:bg-gray-100 transition-colors font-semibold"
      >
        {isSaving ? '⏳ Opslaan...' : '💾 Opslaan en verder'}
      </Button>

      {/* Secondary Button - Edit */}
      <Button
        color="primary"
        size="lg"
        onClick={handleEdit}
        className="w-full bg-white/15 text-white border border-white/30 hover:bg-white/25 transition-colors"
      >
        ✏️ Bewerk
      </Button>

      {/* Back Button */}
      <Button
        color="primary"
        size="lg"
        onClick={handleBack}
        className="w-full bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors"
      >
        ← Terug naar vorige stap
      </Button>

      {/* Tertiary Button - Use External (if available) */}
      {handleUseExternal && (
        <Button
          color="primary"
          size="lg"
          onClick={handleUseExternal}
          className="w-full bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors"
        >
          📋 Gebruik externe resultaat
        </Button>
      )}
    </div>
  );
};