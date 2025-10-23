/**
 * Imagination Video Component - BMAD Architecture
 *
 * MBTI-specific video display for Active Imagination
 *
 * @version 14.0.0
 */

import React from 'react';
import { Card, CardBody } from '@nextui-org/react';
import { useActiveImagination } from './ActiveImaginationPage.provider';

export const ImaginationVideo: React.FC = () => {
  const { videoUrl, currentStep } = useActiveImagination();

  return (
    <Card className="glass border border-white/10 mb-6">
      <CardBody className="p-6">
        <h3 className="text-xl font-semibold mb-4">🎬 MBTI Visualisatie Video</h3>
        {videoUrl ? (
          <div className="video-container">
            <div
              style={{
                width: '100%',
                maxWidth: '600px',
                height: '200px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                color: 'rgba(255,255,255,0.7)',
                border: '2px dashed rgba(255,255,255,0.3)',
                margin: '0 auto'
              }}
            >
              🎥 Video: MBTI Visualisatie - Stap {currentStep}
            </div>
          </div>
        ) : (
          <div
            style={{
              width: '100%',
              maxWidth: '600px',
              height: '200px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              color: 'rgba(255,255,255,0.7)',
              border: '2px dashed rgba(255,255,255,0.3)',
              margin: '0 auto'
            }}
          >
            🎥 Video niet beschikbaar
          </div>
        )}
      </CardBody>
    </Card>
  );
};