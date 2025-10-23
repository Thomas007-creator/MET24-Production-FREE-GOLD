import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Select, SelectItem, Button, Chip, Input } from '@nextui-org/react';
import { Target, Plus, X, Settings } from 'lucide-react';
import { useMBTIConfig } from './MBTIConfigProvider';
import { useMood } from './MoodProvider';
import { useFocusAreas } from './FocusAreaProvider';

interface CoachingSetupProps {
  showSessionControls?: boolean;
  onStartSession?: () => void;
  onEndSession?: () => void;
}

const moodOptions = [
  { value: 1, label: '😫 Zeer slecht', color: 'danger' },
  { value: 2, label: '😞 Slecht', color: 'danger' },
  { value: 3, label: '😐 Neutraal', color: 'warning' },
  { value: 4, label: '😊 Goed', color: 'primary' },
  { value: 5, label: '😄 Zeer goed', color: 'success' }
] as const;

export const CoachingSetup: React.FC<CoachingSetupProps> = ({
  showSessionControls = true,
  onStartSession,
  onEndSession
}) => {
  const { selectedMbtiType, availableTypes, setMbtiType, updateContext } = useMBTIConfig();
  const { currentMood, setMood } = useMood();
  const { focusAreas, suggestedAreas, addFocusArea, removeFocusArea } = useFocusAreas();

  const [newFocusArea, setNewFocusArea] = useState('');

  const handleAddFocusArea = () => {
    if (newFocusArea.trim()) {
      addFocusArea(newFocusArea.trim());
      setNewFocusArea('');
    }
  };

  const handleMoodChange = (moodValue: number) => {
    setMood(moodValue);
    updateContext({ moodRating: moodValue });
  };

  return (
    <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
      <CardHeader>
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Target className="w-5 h-5" />
          Coaching Setup
        </h2>
      </CardHeader>
      <CardBody className="space-y-4">
        {/* MBTI Type Selection */}
        <div>
          <label className="text-sm text-gray-300 mb-2 block">MBTI Type</label>
          <Select
            placeholder="Kies je MBTI type"
            selectedKeys={[selectedMbtiType]}
            onSelectionChange={(keys) => {
              const selectedType = Array.from(keys)[0] as string;
              setMbtiType(selectedType);
            }}
            className="w-full"
          >
            {availableTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </Select>
        </div>

        {/* Current Mood */}
        <div>
          <label className="text-sm text-gray-300 mb-2 block">Huidige Stemming</label>
          <div className="grid grid-cols-5 gap-1">
            {moodOptions.map((mood) => (
              <Button
                key={mood.value}
                size="sm"
                variant={currentMood === mood.value ? "solid" : "flat"}
                color={currentMood === mood.value ? mood.color as any : "default"}
                onClick={() => handleMoodChange(mood.value)}
                className="text-xs"
              >
                {mood.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Focus Areas */}
        <div>
          <label className="text-sm text-gray-300 mb-2 block">Focus Gebieden</label>

          {/* Current Focus Areas */}
          {focusAreas.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {focusAreas.map((area, index) => (
                <Chip
                  key={index}
                  variant="flat"
                  color="primary"
                  onClose={() => removeFocusArea(area)}
                  className="text-xs"
                >
                  {area}
                </Chip>
              ))}
            </div>
          )}

          {/* Add New Focus Area */}
          <div className="flex gap-2">
            <Input
              placeholder="Nieuw focus gebied..."
              value={newFocusArea}
              onChange={(e) => setNewFocusArea(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddFocusArea()}
              size="sm"
              className="flex-1"
            />
            <Button
              size="sm"
              color="primary"
              isIconOnly
              onClick={handleAddFocusArea}
              disabled={!newFocusArea.trim()}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Suggested Areas */}
          {suggestedAreas.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-400 mb-1">Suggesties:</p>
              <div className="flex flex-wrap gap-1">
                {suggestedAreas
                  .filter(area => !focusAreas.includes(area))
                  .slice(0, 4)
                  .map((area, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant="flat"
                      color="secondary"
                      className="text-xs h-6"
                      onClick={() => addFocusArea(area)}
                    >
                      + {area}
                    </Button>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Session Controls */}
        {showSessionControls && (
          <div className="pt-4 border-t border-white/10 space-y-2">
            <Button
              color="primary"
              fullWidth
              onClick={onStartSession}
              startContent={<Settings className="w-4 h-4" />}
            >
              Start Nieuwe Sessie
            </Button>
            <Button
              color="danger"
              variant="flat"
              fullWidth
              onClick={onEndSession}
              startContent={<X className="w-4 h-4" />}
            >
              Beëindig Sessie
            </Button>
          </div>
        )}
      </CardBody>
    </Card>
  );
};