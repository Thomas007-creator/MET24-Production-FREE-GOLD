/**
 * Imagination Prompt Component - BMAD Architecture
 *
 * MBTI-specific prompts display for Active Imagination
 *
 * @version 14.0.0
 */

import React from 'react';
import { Card, CardBody } from '@nextui-org/react';
import { useActiveImagination } from './ActiveImaginationPage.provider';

interface ImaginationPromptProps {
  mbtiType: string;
}

export const ImaginationPrompt: React.FC<ImaginationPromptProps> = ({
  mbtiType
}) => {
  const { currentStep, getMBTIPrompt } = useActiveImagination();

  const prompt = getMBTIPrompt(mbtiType, currentStep);

  return (
    <Card className="glass border border-white/10 mb-6">
      <CardBody className="p-6">
        <h3 className="text-xl font-semibold mb-4">📝 Visualisatie Prompt</h3>
        <div
          style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}
        >
          <p style={{ margin: 0, fontSize: '16px', lineHeight: '1.5' }}>
            {prompt}
          </p>
        </div>
      </CardBody>
    </Card>
  );
};