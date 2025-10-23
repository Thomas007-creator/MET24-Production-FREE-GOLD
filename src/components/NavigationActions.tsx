/**
 * Navigation Actions Component - BMAD Architecture
 *
 * Session controls and navigation for Active Imagination
 *
 * @version 14.0.0
 */

import React from 'react';
import { Button } from '@nextui-org/react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useActiveImagination } from './ActiveImaginationPage.provider';

interface NavigationActionsProps {
  onBackToMain: () => void;
}

export const NavigationActions: React.FC<NavigationActionsProps> = ({
  onBackToMain
}) => {
  const { resetSession } = useActiveImagination();

  const handleNewSession = () => {
    resetSession();
  };

  return (
    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
      <Button
        onClick={onBackToMain}
        color="primary"
        size="lg"
        startContent={<ArrowLeft className="w-5 h-5" />}
        className="bg-blue-600 hover:bg-blue-700"
      >
        ← Terug naar Hoofdmenu
      </Button>
      <Button
        onClick={handleNewSession}
        color="secondary"
        size="lg"
        startContent={<RotateCcw className="w-5 h-5" />}
      >
        🔄 Nieuwe Sessie
      </Button>
    </div>
  );
};