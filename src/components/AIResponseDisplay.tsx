/**
 * AI Response Display Component - BMAD Architecture
 *
 * AI feedback display for Active Imagination
 *
 * @version 14.0.0
 */

import React from 'react';
import { Card, CardBody } from '@nextui-org/react';
import { useActiveImagination } from './ActiveImaginationPage.provider';

export const AIResponseDisplay: React.FC = () => {
  const { aiResponse } = useActiveImagination();

  if (!aiResponse) return null;

  return (
    <Card className="glass border border-white/10 mb-6">
      <CardBody className="p-6">
        <h3 className="text-xl font-semibold mb-4">🤖 AI Ondersteuning</h3>
        <div
          style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '15px',
            borderRadius: '8px',
            fontSize: '16px',
            lineHeight: '1.5',
            whiteSpace: 'pre-line'
          }}
        >
          {aiResponse}
        </div>
      </CardBody>
    </Card>
  );
};