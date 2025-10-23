/**
 * Statistics Modal Component - BMAD Architecture
 *
 * Inspirations statistics modal for Active Imagination
 *
 * @version 14.0.0
 */

import React from 'react';
import { Button } from '@nextui-org/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useActiveImagination } from './ActiveImaginationPage.provider';

export const StatisticsModal: React.FC = () => {
  const { showInspirationsStats, setShowInspirationsStats, inspirations } = useActiveImagination();

  if (!showInspirationsStats) return null;

  const activeCount = inspirations.filter(i => i.status === 'active').length;
  const archivedCount = inspirations.filter(i => i.status === 'archived').length;
  const transferredCount = inspirations.filter(i => i.status === 'transferred').length;
  const totalCount = inspirations.length;

  return (
    <>
      {showInspirationsStats && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0,0,0,0.9)',
            padding: '30px',
            borderRadius: '12px',
            border: '2px solid rgba(255,255,255,0.3)',
            zIndex: 1000,
            minWidth: '300px'
          }}
        >
          <h3 style={{ marginBottom: '20px' }}>📊 Inspirations Statistieken</h3>
          <div style={{ textAlign: 'left', marginBottom: '20px' }}>
            <p>Actieve Inspirations: {activeCount}</p>
            <p>Gearchiveerde Inspirations: {archivedCount}</p>
            <p>Overgehevelde Inspirations: {transferredCount}</p>
            <p>Totale Inspirations: {totalCount}</p>
          </div>
          <Button
            onClick={() => setShowInspirationsStats(false)}
            color="primary"
            className="w-full"
          >
            Sluiten
          </Button>
        </motion.div>
      )}
    </>
  );
};