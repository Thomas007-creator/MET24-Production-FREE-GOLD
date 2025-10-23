import React from 'react';
import { Card, CardBody, Button } from '@nextui-org/react';
import { Star, ThumbsUp } from 'lucide-react';

interface SessionRatingProps {
  currentRating?: number;
  onRate: (rating: number) => void;
  disabled?: boolean;
}

export const SessionRating: React.FC<SessionRatingProps> = ({
  currentRating,
  onRate,
  disabled = false
}) => {
  const getRatingLabel = (rating: number) => {
    const labels = [
      'Helemaal niet helpend',
      'Niet helpend',
      'Een beetje helpend',
      'Helpend',
      'Zeer helpend'
    ];
    return labels[rating - 1] || '';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'success';
    if (rating >= 3) return 'primary';
    if (rating >= 2) return 'warning';
    return 'danger';
  };

  return (
    <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
      <CardBody className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <ThumbsUp className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">Hoe helpend was deze sessie?</span>
            </div>
            {currentRating && (
              <p className="text-xs text-gray-400">
                {getRatingLabel(currentRating)}
              </p>
            )}
          </div>

          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Button
                key={rating}
                size="sm"
                variant={currentRating === rating ? "solid" : "flat"}
                color={currentRating === rating ? getRatingColor(rating) : "default"}
                onClick={() => onRate(rating)}
                disabled={disabled}
                className="w-8 h-8 p-0 min-w-8"
                isIconOnly
              >
                <Star
                  className={`w-4 h-4 ${
                    currentRating && rating <= currentRating
                      ? 'fill-current'
                      : ''
                  }`}
                />
              </Button>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};