/**
 * Levensgebied Detail AI Coaching Tab Component
 *
 * AI Coaching tab for personalized insights and guidance
 *
 * @version 14.0.0
 */

import React from 'react';
import { Card, CardBody, CardHeader, Button, Progress } from '@nextui-org/react';
import { Bot, Sparkles, Brain, Target } from 'lucide-react';
import { useLevensgebiedDetail } from './LevensgebiedDetailPage.provider';

export const LevensgebiedDetailAICoachingTab: React.FC = () => {
  const { areaData, progress } = useLevensgebiedDetail();

  if (!areaData) return null;

  const isQuestionnaireComplete = progress === 100;

  return (
    <div className="space-y-6">
      {/* AI Coaching Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">AI Coaching & Inzichten</h2>
              <p className="text-sm text-gray-600">
                Gebaseerd op je vragenlijst resultaten en MBTI type
              </p>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          {!isQuestionnaireComplete ? (
            <div className="text-center py-8">
              <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Vragenlijst Vereist
              </h3>
              <p className="text-gray-600 mb-4">
                Beantwoord eerst de vragenlijst om gepersonaliseerde AI coaching te ontvangen.
              </p>
              <div className="mb-4">
                <Progress value={progress} color="primary" className="max-w-xs mx-auto" />
                <p className="text-sm text-gray-500 mt-2">{progress}% compleet</p>
              </div>
              <Button color="primary" variant="bordered">
                Naar Vragenlijst
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                AI Coaching Komt Binnenkort
              </h3>
              <p className="text-gray-600 mb-4">
                Gebaseerd op je vragenlijst resultaten en MBTI type, krijg je gepersonaliseerde coaching en inzichten voor dit levensgebied.
              </p>
              <Button color="primary" disabled>
                <Bot className="w-4 h-4 mr-2" />
                AI Coaching Activeren
              </Button>
            </div>
          )}
        </CardBody>
      </Card>

      {/* AI Features Preview */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">AI Features Preview</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <Target className="w-8 h-8 text-blue-500 mb-2" />
              <h3 className="font-semibold mb-1">Persoonlijke Doelen</h3>
              <p className="text-sm text-gray-600">
                AI-gestuurde doelstellingen gebaseerd op je antwoorden
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <Brain className="w-8 h-8 text-green-500 mb-2" />
              <h3 className="font-semibold mb-1">Inzichten & Analyse</h3>
              <p className="text-sm text-gray-600">
                Diepe analyse van je sterke punten en ontwikkelgebieden
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <Sparkles className="w-8 h-8 text-purple-500 mb-2" />
              <h3 className="font-semibold mb-1">Gepersonaliseerde Tips</h3>
              <p className="text-sm text-gray-600">
                Praktische adviezen afgestemd op je persoonlijkheid
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <Bot className="w-8 h-8 text-orange-500 mb-2" />
              <h3 className="font-semibold mb-1">Vooruitgang Tracking</h3>
              <p className="text-sm text-gray-600">
                Continue monitoring en aanpassingen van je plan
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Coming Soon */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardBody className="text-center py-8">
          <Bot className="w-12 h-12 text-purple-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Binnenkort Beschikbaar</h3>
          <p className="text-gray-600">
            Ons AI coaching systeem wordt momenteel ontwikkeld en zal binnenkort beschikbaar zijn voor alle gebruikers.
          </p>
        </CardBody>
      </Card>
    </div>
  );
};