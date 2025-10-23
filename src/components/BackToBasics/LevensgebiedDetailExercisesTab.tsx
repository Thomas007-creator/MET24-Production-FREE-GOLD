/**
 * Levensgebied Detail Exercises Tab Component
 *
 * Exercises tab showing available exercises and tools
 *
 * @version 14.0.0
 */

import React from 'react';
import { Card, CardBody, CardHeader, Button, Chip } from '@nextui-org/react';
import { Play, Clock, Target } from 'lucide-react';
import { useLevensgebiedDetail } from './LevensgebiedDetailPage.provider';

export const LevensgebiedDetailExercisesTab: React.FC = () => {
  const { areaData } = useLevensgebiedDetail();

  if (!areaData) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Exercises Header */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Praktische Oefeningen</h2>
          <p className="text-sm text-gray-600">
            Ontwikkel vaardigheden en inzichten door gerichte oefeningen
          </p>
        </CardHeader>
      </Card>

      {/* Exercises Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {areaData.exercises.map((exercise, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardBody>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{exercise.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {exercise.duration}
                    </div>
                    <Chip
                      size="sm"
                      color={getDifficultyColor(exercise.difficulty) as any}
                      variant="flat"
                    >
                      {exercise.difficulty}
                    </Chip>
                  </div>
                </div>
              </div>

              <Button
                color="primary"
                className="w-full"
                startContent={<Play className="w-4 h-4" />}
              >
                Start Oefening
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Exercise Categories */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Oefening Categorieën</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Assessment</h3>
              <p className="text-sm text-gray-600">Zelfevaluatie oefeningen</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Play className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Praktijk</h3>
              <p className="text-sm text-gray-600">Hands-on oefeningen</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Reflectie</h3>
              <p className="text-sm text-gray-600">Reflectie en journaling</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};