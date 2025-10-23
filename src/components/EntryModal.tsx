import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Textarea, Input, Chip } from '@nextui-org/react';
import { X, Plus } from 'lucide-react';
import { useEnhancedJournaling } from './EnhancedJournalingPage.provider';

export const EntryModal: React.FC = () => {
  const {
    isEntryModalOpen,
    setIsEntryModalOpen,
    newEntry,
    setNewEntry,
    handleCreateEntry,
    isLoading
  } = useEnhancedJournaling();

  const handleSubmit = async () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) return;

    await handleCreateEntry();
  };

  const handleAddTag = (tag: string) => {
    if (tag.trim() && !newEntry.tags.includes(tag.trim())) {
      setNewEntry(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewEntry(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleClose = () => {
    setIsEntryModalOpen(false);
    setNewEntry({
      title: '',
      content: '',
      gratitudeContent: '',
      tags: [],
      primaryTag: '',
      category: '',
      levensgebied: '',
      moodRating: 0,
      moodEmoji: '',
      moodDescription: '',
      tomorrowFocus: '',
      weeklyGoals: []
    });
  };

  return (
    <Modal
      isOpen={isEntryModalOpen}
      onClose={handleClose}
      size="2xl"
      className="glass border border-white/10"
    >
      <ModalContent>
        <ModalHeader className="text-white">
          <h2 className="text-xl font-semibold">Nieuwe Journal Entry</h2>
        </ModalHeader>
        <ModalBody className="space-y-4">
          <Input
            label="Titel"
            placeholder="Geef je entry een titel..."
            value={newEntry.title}
            onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
            className="text-white"
          />

          <Textarea
            label="Inhoud"
            placeholder="Schrijf je gedachten op..."
            value={newEntry.content}
            onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
            minRows={6}
            className="text-white"
          />

          <div>
            <label className="text-sm text-gray-300 mb-2 block">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {newEntry.tags.map((tag) => (
                <Chip
                  key={tag}
                  onClose={() => handleRemoveTag(tag)}
                  className="bg-purple-600/20 text-purple-300"
                >
                  {tag}
                </Chip>
              ))}
            </div>
            <Input
              placeholder="Voeg een tag toe..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
              className="text-white"
            />
          </div>
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
            className="bg-purple-600 hover:bg-purple-700"
            disabled={!newEntry.title.trim() || !newEntry.content.trim()}
          >
            Opslaan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};