/**
 * AI1 Support Component - BMAD Architecture
 *
 * AI assistance integration for Active Imagination
 *
 * @version 14.0.0
 */

import React from 'react';
import { Card, CardBody, Button, Spinner } from '@nextui-org/react';
import { Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';
import { useActiveImagination } from './ActiveImaginationPage.provider';

interface AI1SupportProps {
  mbtiType: string;
}

export const AI1Support: React.FC<AI1SupportProps> = ({
  mbtiType
}) => {
  const {
    ai1Active,
    aiResponse,
    aiLoading,
    activateAI,
    deactivateAI
  } = useActiveImagination();

  const handleActivateAI = async () => {
    try {
      await activateAI(mbtiType);
    } catch (error) {
      alert('❌ Kon AI niet activeren. Probeer het opnieuw.');
    }
  };

  return (
    <Card className="glass border border-white/10 mb-6">
      <CardBody className="p-6">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h4 style={{ margin: 0 }}>🤖 AI 1 Ondersteuning</h4>
          {!ai1Active ? (
            <Button
              onClick={handleActivateAI}
              disabled={aiLoading}
              color="primary"
              size="sm"
              startContent={aiLoading ? <Spinner size="sm" /> : <Play className="w-4 h-4" />}
            >
              {aiLoading ? '🔄 Activeren...' : '🚀 Activeer AI 1'}
            </Button>
          ) : (
            <Button
              onClick={deactivateAI}
              color="danger"
              size="sm"
              startContent={<Pause className="w-4 h-4" />}
            >
              ❌ Deactiveer AI 1
            </Button>
          )}
        </div>

        {ai1Active && aiResponse && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '10px',
              borderRadius: '5px',
              marginTop: '10px',
              fontSize: '14px',
              lineHeight: '1.4',
              whiteSpace: 'pre-line'
            }}
          >
            {aiResponse}
          </motion.div>
        )}
      </CardBody>
    </Card>
  );
};