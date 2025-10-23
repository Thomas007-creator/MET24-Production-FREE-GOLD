import React from 'react';
import { Card, CardBody, CardHeader, Chip, Progress, Button } from '@nextui-org/react';
import { TrendingUp, Calendar, CheckCircle, Lightbulb } from 'lucide-react';
import type { PatternInsight } from './pattern-types';

interface PatternCardProps {
  pattern: PatternInsight;
  onViewDetails?: (pattern: PatternInsight) => void;
  showActions?: boolean;
}

export const PatternCard: React.FC<PatternCardProps> = ({
  pattern,
  onViewDetails,
  showActions = true
}) => {
  const getPatternTypeColor = (type: PatternInsight['type']) => {
    switch (type) {
      case 'emotional': return 'danger';
      case 'behavioral': return 'primary';
      case 'creative': return 'secondary';
      case 'growth': return 'success';
      default: return 'default';
    }
  };

  const getPatternTypeIcon = (type: PatternInsight['type']) => {
    switch (type) {
      case 'emotional': return '💭';
      case 'behavioral': return '🎯';
      case 'creative': return '🎨';
      case 'growth': return '🌱';
      default: return '📊';
    }
  };

  const getFrequencyLabel = (frequency: number) => {
    if (frequency >= 80) return 'Zeer Frequent';
    if (frequency >= 60) return 'Frequent';
    if (frequency >= 40) return 'Matig';
    if (frequency >= 20) return 'Sporadisch';
    return 'Zeldzaam';
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{getPatternTypeIcon(pattern.type)}</div>
            <div>
              <h3 className="font-semibold text-lg capitalize">
                {pattern.type} Patroon
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Chip
                  color={getPatternTypeColor(pattern.type)}
                  variant="flat"
                  size="sm"
                >
                  {pattern.type}
                </Chip>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{pattern.timeframe}</span>
                </div>
              </div>
            </div>
          </div>
          {showActions && onViewDetails && (
            <Button
              size="sm"
              variant="flat"
              color="primary"
              onClick={() => onViewDetails(pattern)}
            >
              Details
            </Button>
          )}
        </div>
      </CardHeader>

      <CardBody className="space-y-4">
        {/* Pattern Description */}
        <p className="text-gray-700">{pattern.description}</p>

        {/* Frequency Indicator */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Frequentie</span>
            <span className="text-sm text-gray-500">
              {pattern.frequency}% - {getFrequencyLabel(pattern.frequency)}
            </span>
          </div>
          <Progress
            value={pattern.frequency}
            color={getPatternTypeColor(pattern.type)}
            size="sm"
            className="max-w-md"
          />
        </div>

        {/* Actionable Insights */}
        {pattern.actionable.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              <span className="font-medium text-sm">Actiepunten</span>
            </div>
            <div className="space-y-2">
              {pattern.actionable.slice(0, 3).map((action, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{action}</span>
                </div>
              ))}
              {pattern.actionable.length > 3 && (
                <div className="text-sm text-gray-500 pl-6">
                  +{pattern.actionable.length - 3} meer actiepunten...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pattern Trend */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">Trend</span>
          </div>
          <Chip
            variant="flat"
            color={pattern.frequency > 50 ? 'success' : 'warning'}
            size="sm"
          >
            {pattern.frequency > 50 ? 'Groeiend' : 'Stabiel'}
          </Chip>
        </div>
      </CardBody>
    </Card>
  );
};