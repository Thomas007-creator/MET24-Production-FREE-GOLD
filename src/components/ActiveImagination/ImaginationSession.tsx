import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Textarea, Progress, Chip, Badge } from '@nextui-org/react';
import { Play, Pause, Square, Send, Lightbulb, Clock, Target } from 'lucide-react';
import type { ImaginationSession } from './imagination-types';

interface ImaginationSessionProps {
  session: ImaginationSession;
  onSubmitResponse?: (response: string) => void;
  onPause?: () => void;
  onResume?: () => void;
  onComplete?: () => void;
  isActive?: boolean;
}

export const ImaginationSessionComponent: React.FC<ImaginationSessionProps> = ({
  session,
  onSubmitResponse,
  onPause,
  onResume,
  onComplete,
  isActive = false
}) => {
  const [currentResponse, setCurrentResponse] = useState('');

  const getSessionTypeColor = (type: ImaginationSession['type']) => {
    switch (type) {
      case 'guided': return 'primary';
      case 'free-form': return 'secondary';
      case 'mbti-specific': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: ImaginationSession['status']) => {
    switch (status) {
      case 'active': return 'success';
      case 'paused': return 'warning';
      case 'completed': return 'default';
      default: return 'default';
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between w-full">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-5 h-5" />
              <h3 className="font-semibold text-lg">Imaginatie Sessie</h3>
              <Chip
                color={getSessionTypeColor(session.type)}
                variant="flat"
                size="sm"
              >
                {session.type.replace('-', ' ')}
              </Chip>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(session.duration)}</span>
              </div>
              <Chip
                color={getStatusColor(session.status)}
                variant="dot"
                size="sm"
              >
                {session.status}
              </Chip>
            </div>
          </div>
          <div className="flex gap-2">
            {session.status === 'active' && onPause && (
              <Button
                size="sm"
                variant="flat"
                color="warning"
                onClick={onPause}
                startContent={<Pause className="w-4 h-4" />}
              >
                Pauzeer
              </Button>
            )}
            {session.status === 'paused' && onResume && (
              <Button
                size="sm"
                variant="flat"
                color="success"
                onClick={onResume}
                startContent={<Play className="w-4 h-4" />}
              >
                Hervat
              </Button>
            )}
            {onComplete && (
              <Button
                size="sm"
                variant="flat"
                color="primary"
                onClick={onComplete}
                startContent={<Square className="w-4 h-4" />}
              >
                Voltooi
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardBody className="space-y-4">
        {/* Session Prompt */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-blue-900 mb-1">Prompt:</p>
          <p className="text-blue-800">{session.prompt}</p>
        </div>

        {/* Creativity Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Creativiteit Score</span>
            <span className="text-sm text-gray-500">{session.creativityScore}/100</span>
          </div>
          <Progress
            value={session.creativityScore}
            color="primary"
            size="sm"
            className="max-w-md"
          />
        </div>

        {/* Response Input */}
        {isActive && (
          <div>
            <Textarea
              placeholder="Schrijf je imaginatie reactie hier..."
              value={currentResponse}
              onChange={(e) => setCurrentResponse(e.target.value)}
              minRows={3}
              className="mb-2"
            />
            <Button
              size="sm"
              color="primary"
              onClick={() => {
                if (currentResponse.trim()) {
                  onSubmitResponse?.(currentResponse);
                  setCurrentResponse('');
                }
              }}
              startContent={<Send className="w-4 h-4" />}
              isDisabled={!currentResponse.trim()}
            >
              Verstuur Reactie
            </Button>
          </div>
        )}

        {/* Previous Responses */}
        {session.responses.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Vorige Reacties</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {session.responses.slice(-3).map((response, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">
                      {new Date(response.timestamp).toLocaleTimeString()}
                    </span>
                    {response.guidance && (
                      <Badge variant="flat" color="warning" size="sm">
                        Met begeleiding
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm">{response.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Insights */}
        {session.insights.length > 0 && (
          <div className="border-t pt-3">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              <span className="font-medium text-sm">Sessies Insights</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {session.insights.map((insight, index) => (
                <Chip key={index} size="sm" variant="flat" color="warning">
                  {insight}
                </Chip>
              ))}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};