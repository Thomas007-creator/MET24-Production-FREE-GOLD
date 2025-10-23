import React from 'react';
import { Card, CardBody, Button } from '@nextui-org/react';
import { Plus, Target } from 'lucide-react';
import { useEnhancedJournaling } from './EnhancedJournalingPage.provider';

export const QuickActions: React.FC = () => {
  const { onEntryModalOpen, onGoalModalOpen } = useEnhancedJournaling();

  return (
    <Card className="glass border border-white/10">
      <CardBody>
        <div className="grid grid-cols-2 gap-4">
          <Button
            color="primary"
            variant="solid"
            onClick={onEntryModalOpen}
            startContent={<Plus className="w-4 h-4" />}
            className="bg-purple-600 hover:bg-purple-700"
          >
            New Entry
          </Button>
          <Button
            color="secondary"
            variant="solid"
            onClick={onGoalModalOpen}
            startContent={<Target className="w-4 h-4" />}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Add Goal
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};