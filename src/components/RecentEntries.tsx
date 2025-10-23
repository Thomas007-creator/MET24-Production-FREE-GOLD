import React from 'react';
import { Card, CardBody, CardHeader, Chip } from '@nextui-org/react';
import { useEnhancedJournaling } from './EnhancedJournalingPage.provider';

export const RecentEntries: React.FC = () => {
  const { journalEntries } = useEnhancedJournaling();

  return (
    <Card className="glass border border-white/10">
      <CardHeader>
        <h2 className="text-xl font-semibold text-white">📖 Recent Entries</h2>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {journalEntries.slice(0, 3).map((entry) => (
            <div key={entry.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-white">{entry.title}</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{entry.moodEmoji}</span>
                  <span className="text-sm text-gray-400">{entry.moodRating}/10</span>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-2 line-clamp-2">{entry.content}</p>
              <div className="flex items-center justify-between">
                <div className="flex space-x-1">
                  {entry.tags?.slice(0, 3).map((tag) => (
                    <Chip key={tag} size="sm" variant="flat" className="text-xs">
                      {tag}
                    </Chip>
                  ))}
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(entry.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};