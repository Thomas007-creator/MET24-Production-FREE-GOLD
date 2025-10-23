import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react';
import { Target } from 'lucide-react';
import { useEnhancedJournaling } from './EnhancedJournalingPage.provider';

export const GoalModal: React.FC = () => {
  const {
    isGoalModalOpen,
    setIsGoalModalOpen,
    newGoal,
    setNewGoal,
    handleCreateGoal,
    isLoading
  } = useEnhancedJournaling();

  const handleSubmit = async () => {
    if (!newGoal.goalText.trim()) return;
    await handleCreateGoal();
  };

  const handleClose = () => {
    setIsGoalModalOpen(false);
    setNewGoal({
      goalText: '',
      goalEmoji: '',
      goalCategory: '',
      priority: 1,
      estimatedDuration: 30
    });
  };

  return (
    <Modal
      isOpen={isGoalModalOpen}
      onClose={handleClose}
      size="2xl"
      className="glass border border-white/10"
    >
      <ModalContent>
        <ModalHeader className="text-white">
          <h2 className="text-xl font-semibold flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Nieuw Doel
          </h2>
        </ModalHeader>
        <ModalBody className="space-y-4">
          <Input
            label="Doel Tekst"
            placeholder="Wat wil je bereiken?"
            value={newGoal.goalText}
            onChange={(e) => setNewGoal(prev => ({ ...prev, goalText: e.target.value }))}
            className="text-white"
          />

          <Input
            label="Categorie (optioneel)"
            placeholder="bijv. Gezondheid, Carrière, Persoonlijk..."
            value={newGoal.goalCategory}
            onChange={(e) => setNewGoal(prev => ({ ...prev, goalCategory: e.target.value }))}
            className="text-white"
          />

          <Input
            type="number"
            label="Prioriteit (1-5)"
            value={String(newGoal.priority)}
            onChange={(e) => setNewGoal(prev => ({ ...prev, priority: parseInt(e.target.value) || 1 }))}
            min="1"
            max="5"
            className="text-white"
          />

          <Input
            type="number"
            label="Geschatte Duur (minuten)"
            value={String(newGoal.estimatedDuration)}
            onChange={(e) => setNewGoal(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) || 30 }))}
            className="text-white"
          />
        </ModalBody>
        <ModalFooter>
          <Button
            variant="light"
            onPress={handleClose}
            className="text-gray-300"
          >
            Annuleren
          </Button>
          <Button
            onPress={handleSubmit}
            isLoading={isLoading}
            className="bg-green-600 hover:bg-green-700"
            disabled={!newGoal.goalText.trim()}
          >
            Doel Aanmaken
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};