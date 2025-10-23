import React from 'react';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { useEnhancedJournaling } from './EnhancedJournalingPage.provider';

export const MoodTracker: React.FC = () => {
  const { moodEmojis, newEntry, setNewEntry } = useEnhancedJournaling();

  return (
    <Card className="glass border border-white/10">
      <CardHeader>
        <h2 className="text-xl font-semibold text-white">😊 Mood Tracking</h2>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          <div className="flex justify-center space-x-2">
            {moodEmojis.map((mood) => (
              <button
                key={mood.rating}
                onClick={() => setNewEntry(prev => ({
                  ...prev,
                  moodRating: mood.rating,
                  moodEmoji: mood.emoji
                }))}
                className={`p-2 rounded-lg transition-all ${
                  newEntry.moodRating === mood.rating
                    ? 'bg-purple-600 scale-110'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
                title={mood.label}
              >
                <span className="text-2xl">{mood.emoji}</span>
              </button>
            ))}
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-300">
              {newEntry.moodRating > 0
                ? `Huidige stemming: ${moodEmojis.find(m => m.rating === newEntry.moodRating)?.label}`
                : 'Selecteer je stemming'
              }
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};