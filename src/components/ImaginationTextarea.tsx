/**
 * Imagination Textarea Component - BMAD Architecture
 *
 * User input textarea for Active Imagination responses
 *
 * @version 14.0.0
 */

import React from 'react';
import { Card, CardBody, Button, Textarea, Spinner } from '@nextui-org/react';
import { Lightbulb } from 'lucide-react';
import { useActiveImagination } from './ActiveImaginationPage.provider';

interface ImaginationTextareaProps {
  mbtiType: string;
}

export const ImaginationTextarea: React.FC<ImaginationTextareaProps> = ({
  mbtiType
}) => {
  const {
    userResponse,
    setUserResponse,
    isLoading,
    processResponse
  } = useActiveImagination();

  const handleProcessResponse = async () => {
    try {
      await processResponse(mbtiType);
    } catch (error) {
      alert('❌ Kon response niet verwerken. Probeer het opnieuw.');
    }
  };

  return (
    <Card className="glass border border-white/10 mb-6">
      <CardBody className="p-6">
        <h3 className="text-xl font-semibold mb-4">📝 Jouw Visualisatie</h3>
        <Textarea
          placeholder="Beschrijf je visualisatie..."
          value={userResponse}
          onChange={(e) => setUserResponse(e.target.value)}
          minRows={6}
          maxRows={10}
          className="mb-4"
          style={{
            background: 'rgba(255,255,255,0.1)',
            color: 'white'
          }}
        />
        <Button
          onClick={handleProcessResponse}
          disabled={isLoading || !userResponse.trim()}
          color="primary"
          size="lg"
          className="w-full"
          startContent={isLoading ? <Spinner size="sm" /> : <Lightbulb className="w-5 h-5" />}
        >
          {isLoading ? '🔄 Verwerken...' : '💭 Verwerk Response'}
        </Button>
      </CardBody>
    </Card>
  );
};