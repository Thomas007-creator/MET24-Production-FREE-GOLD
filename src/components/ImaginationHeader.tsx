/**
 * Imagination Header Component - BMAD Architecture
 *
 * Header section with navigation and user greeting for Active Imagination
 *
 * @version 14.0.0
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@nextui-org/react';
import { ArrowLeft } from 'lucide-react';
import { useActiveImagination } from './ActiveImaginationPage.provider';

interface ImaginationHeaderProps {
  userName?: string;
  mbtiType?: string;
  onBackToMain: () => void;
}

export const ImaginationHeader: React.FC<ImaginationHeaderProps> = ({
  userName = 'Gebruiker',
  mbtiType = 'INFP',
  onBackToMain
}) => {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ marginBottom: '30px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '32px', margin: 0 }}>
          🧘‍♀️ Actieve Imaginatie
        </h1>
        <Button
          onClick={onBackToMain}
          variant="ghost"
          startContent={<ArrowLeft className="w-4 h-4" />}
          className="text-white hover:bg-white/20"
        >
          Terug naar Hoofdmenu
        </Button>
      </div>

      <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>
        Welkom, {userName} ({mbtiType})
      </h2>
    </motion.div>
  );
};