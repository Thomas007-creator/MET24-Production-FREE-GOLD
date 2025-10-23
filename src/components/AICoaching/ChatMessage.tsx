import React from 'react';
import { Card, CardBody, Button, Chip, Avatar } from '@nextui-org/react';
import { Brain, User, Lightbulb, CheckCircle, MessageCircle } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from './types';

interface ChatMessageProps {
  message: ChatMessageType;
  showInsights?: boolean;
  onFollowUpClick?: (question: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  showInsights = true,
  onFollowUpClick
}) => {
  const isCoach = message.type === 'coach';

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'default';
    if (confidence >= 0.8) return 'success';
    if (confidence >= 0.6) return 'primary';
    return 'warning';
  };

  const getAlignmentColor = (alignment?: number) => {
    if (!alignment) return 'default';
    if (alignment >= 0.8) return 'success';
    if (alignment >= 0.6) return 'primary';
    return 'warning';
  };

  return (
    <div className={`flex ${isCoach ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`flex gap-3 max-w-[80%] ${isCoach ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Avatar */}
        <Avatar
          icon={isCoach ? <Brain className="w-5 h-5" /> : <User className="w-5 h-5" />}
          className={`w-8 h-8 ${isCoach ? 'bg-purple-500' : 'bg-blue-500'}`}
        />

        {/* Message Content */}
        <div className={`flex-1 ${isCoach ? '' : 'text-right'}`}>
          <Card className={`${
            isCoach
              ? 'bg-gray-700 border-gray-600'
              : 'bg-blue-600 border-blue-500'
          }`}>
            <CardBody className="p-3">
              {/* Message Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${
                    isCoach ? 'text-purple-300' : 'text-blue-200'
                  }`}>
                    {isCoach ? 'AI Coach' : 'Jij'}
                  </span>
                  {message.confidence && (
                    <Chip
                      size="sm"
                      variant="flat"
                      color={getConfidenceColor(message.confidence)}
                      className="text-xs"
                    >
                      {Math.round(message.confidence * 100)}%
                    </Chip>
                  )}
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>

              {/* Message Content */}
              <p className={`text-sm leading-relaxed ${
                isCoach ? 'text-gray-200' : 'text-white'
              }`}>
                {message.content}
              </p>

              {/* Insights */}
              {showInsights && message.insights && message.insights.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs font-medium text-yellow-300">Insights</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {message.insights.map((insight, index) => (
                      <Chip
                        key={index}
                        size="sm"
                        variant="flat"
                        color="warning"
                        className="text-xs"
                      >
                        {insight}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Suggestions */}
              {message.actionSuggestions && message.actionSuggestions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-xs font-medium text-green-300">Actie Suggesties</span>
                  </div>
                  <ul className="space-y-1">
                    {message.actionSuggestions.map((action, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-gray-300">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Follow-up Questions */}
              {message.followUpQuestions && message.followUpQuestions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-medium text-blue-300">Vervolg Vragen</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {message.followUpQuestions.map((question, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant="flat"
                        color="primary"
                        className="text-xs h-6 mr-1 mb-1"
                        onClick={() => onFollowUpClick?.(question)}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* MBTI Alignment */}
              {message.mbtiAlignment && (
                <div className="mt-3 pt-3 border-t border-gray-600">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">MBTI Alignment</span>
                    <Chip
                      size="sm"
                      variant="dot"
                      color={getAlignmentColor(message.mbtiAlignment)}
                      className="text-xs"
                    >
                      {Math.round(message.mbtiAlignment * 100)}%
                    </Chip>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};