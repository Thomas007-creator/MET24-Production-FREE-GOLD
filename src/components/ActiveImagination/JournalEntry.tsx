import React from 'react';
import { Card, CardBody, CardHeader, Chip, Button, Badge } from '@nextui-org/react';
import { Calendar, Tag, TrendingUp, Lightbulb, BookOpen } from 'lucide-react';
import type { JournalEntryData } from './types';

interface JournalEntryProps {
  entry: JournalEntryData;
  onSelect?: (entry: JournalEntryData) => void;
  onAnalyze?: (entry: JournalEntryData) => void;
  isSelected?: boolean;
  showInsights?: boolean;
}

export const JournalEntry: React.FC<JournalEntryProps> = ({
  entry,
  onSelect,
  onAnalyze,
  isSelected = false,
  showInsights = true
}) => {
  const renderMoodIndicator = (mood: number) => {
    const moodColors = ['red', 'orange', 'yellow', 'green', 'blue'];
    const moodLabels = ['Zeer laag', 'Laag', 'Neutraal', 'Goed', 'Uitstekend'];

    return (
      <Chip
        color={moodColors[mood - 1] as any}
        variant="flat"
        size="sm"
      >
        {moodLabels[mood - 1]}
      </Chip>
    );
  };

  const getEntryTypeIcon = (type: JournalEntryData['entryType']) => {
    switch (type) {
      case 'active-imagination': return <Lightbulb className="w-4 h-4" />;
      case 'mbti-exercise': return <TrendingUp className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 ${
        isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
      }`}
      onClick={() => onSelect?.(entry)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between w-full">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {getEntryTypeIcon(entry.entryType)}
              <h3 className="font-semibold text-lg">{entry.title}</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{new Date(entry.date).toLocaleDateString()}</span>
              <span>•</span>
              {renderMoodIndicator(entry.mood)}
            </div>
          </div>
          {onAnalyze && (
            <Button
              size="sm"
              variant="flat"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                onAnalyze(entry);
              }}
            >
              Analyseren
            </Button>
          )}
        </div>
      </CardHeader>

      <CardBody className="pt-0">
        <p className="text-gray-700 mb-3 line-clamp-3">
          {entry.content}
        </p>

        {entry.tags.length > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <Tag className="w-4 h-4 text-gray-500" />
            <div className="flex flex-wrap gap-1">
              {entry.tags.slice(0, 3).map((tag, index) => (
                <Chip key={index} size="sm" variant="flat">
                  {tag}
                </Chip>
              ))}
              {entry.tags.length > 3 && (
                <Chip size="sm" variant="flat">
                  +{entry.tags.length - 3}
                </Chip>
              )}
            </div>
          </div>
        )}

        {showInsights && entry.insights.length > 0 && (
          <div className="border-t pt-3">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              <span className="font-medium text-sm">Insights</span>
            </div>
            <div className="space-y-1">
              {entry.insights.slice(0, 2).map((insight, index) => (
                <Badge key={index} variant="flat" color="warning" className="text-xs">
                  {insight}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
          <span>{entry.mbtiTechnique}</span>
          <span>{entry.entryType.replace('-', ' ')}</span>
        </div>
      </CardBody>
    </Card>
  );
};