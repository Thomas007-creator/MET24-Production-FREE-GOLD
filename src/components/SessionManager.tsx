/**
 * Session Manager Component - BMAD Architecture
 *
 * Session start/stop controls for Active Imagination
 *
 * @version 14.0.0
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardBody, Button, Spinner } from '@nextui-org/react';
import { Play } from 'lucide-react';
import { useActiveImagination } from './ActiveImaginationPage.provider';

interface SessionManagerProps {
  mbtiType: string;
}

export const SessionManager: React.FC<SessionManagerProps> = ({
  mbtiType
}) => {
  const { isLoading, startSession } = useActiveImagination();

  const handleStartSession = async () => {
    try {
      await startSession(mbtiType);
    } catch (error) {
      alert('❌ Kon sessie niet starten. Probeer het opnieuw.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="start-session"
    >
      <Card className="glass border border-white/10">
        <CardBody className="p-8">
          <h3 className="text-2xl font-semibold mb-4">🚀 Start Nieuwe Sessie</h3>
          <p className="text-gray-300 mb-6">
            Begin je creatieve visualisatie reis met MBTI-gepersonaliseerde begeleiding.
          </p>
          <Button
            onClick={handleStartSession}
            disabled={isLoading}
            color="primary"
            size="lg"
            className="bg-green-600 hover:bg-green-700"
            startContent={isLoading ? <Spinner size="sm" /> : <Play className="w-5 h-5" />}
          >
            {isLoading ? '🔄 Starten...' : '🚀 Start Nieuwe Sessie'}
          </Button>
        </CardBody>
      </Card>
    </motion.div>
  );
};