/**
 * Inspirations Overview Component - BMAD Architecture
 *
 * Inspirations management and display for Active Imagination
 *
 * @version 14.0.0
 */

import React from 'react';
import { Card, CardBody, Button } from '@nextui-org/react';
import { BarChart3, BookOpen, Archive, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useActiveImagination } from './ActiveImaginationPage.provider';

export const InspirationsOverview: React.FC = () => {
  const {
    inspirations,
    showInspirationsStats,
    setShowInspirationsStats,
    transferToJournaling,
    archiveInspiration
  } = useActiveImagination();

  const handleTransferToJournaling = async (inspirationId: string) => {
    try {
      const journalEntryId = await transferToJournaling(inspirationId);
      alert(`✅ Inspiratie overgeheveld naar journaling!\n\nJournal Entry ID: ${journalEntryId}`);
    } catch (error) {
      alert('❌ Kon inspiratie niet overhevelen naar journaling.');
    }
  };

  const handleArchiveInspiration = async (inspirationId: string) => {
    try {
      await archiveInspiration(inspirationId);
      alert('✅ Inspiratie gearchiveerd!');
    } catch (error) {
      alert('❌ Kon inspiratie niet archiveren.');
    }
  };

  return (
    <Card className="glass border border-white/10 mb-6">
      <CardBody className="p-6">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 className="text-xl font-semibold">💡 Inspirations Overzicht</h3>
          <Button
            onClick={() => setShowInspirationsStats(!showInspirationsStats)}
            variant="ghost"
            size="sm"
            startContent={<BarChart3 className="w-4 h-4" />}
          >
            📊 Statistieken
          </Button>
        </div>

        <p style={{ marginBottom: '20px' }}>Compleet overzicht van alle opgeslagen inzichten van je Actieve Imaginatie sessies.</p>

        {/* Actieve Inspirations */}
        <div style={{ marginBottom: '20px' }}>
          <h4>🔄 Recente Inspirations (Deze Week)</h4>
          <div style={{ display: 'grid', gap: '15px', marginBottom: '20px' }}>
            {inspirations.filter(insp => insp.status === 'active').map((inspiration) => (
              <motion.div
                key={inspiration.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  padding: '15px',
                  borderRadius: '8px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h5 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
                    {inspiration.title}
                  </h5>
                  <span style={{ fontSize: '11px', opacity: 0.7 }}>
                    📅 {new Date(inspiration.timestamp || inspiration.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ marginBottom: '8px', fontSize: '14px', lineHeight: '1.4' }}>
                  {inspiration.summary}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', opacity: 0.8 }}>
                    📍 {inspiration.source}
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                      onClick={() => handleTransferToJournaling(inspiration.id)}
                      size="sm"
                      color="primary"
                      startContent={<BookOpen className="w-3 h-3" />}
                    >
                      🔄 Overhevelen
                    </Button>
                    <Button
                      onClick={() => handleArchiveInspiration(inspiration.id)}
                      size="sm"
                      color="secondary"
                      startContent={<Archive className="w-3 h-3" />}
                    >
                      📚 Archiveren
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Gearchiveerde Inspirations */}
        <div style={{ marginBottom: '20px' }}>
          <h4>📚 Gearchiveerde Inspirations (Afgelopen 3 Maanden)</h4>
          <div style={{ display: 'grid', gap: '10px', maxHeight: '300px', overflow: 'auto' }}>
            {inspirations.filter(insp => insp.status === 'archived').map((inspiration) => (
              <motion.div
                key={inspiration.id}
                whileHover={{ scale: 1.02 }}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <h6 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
                    {inspiration.title}
                  </h6>
                  <span style={{ fontSize: '10px', opacity: 0.6 }}>
                    📅 {new Date(inspiration.timestamp || inspiration.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ marginBottom: '5px', fontSize: '12px', lineHeight: '1.3', opacity: 0.9 }}>
                  {inspiration.summary}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', opacity: 0.7 }}>
                    📍 {inspiration.source}
                  </span>
                  <Button
                    onClick={() => handleTransferToJournaling(inspiration.id)}
                    size="sm"
                    color="warning"
                    startContent={<RotateCcw className="w-3 h-3" />}
                  >
                    🔄 Heractiveren
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};