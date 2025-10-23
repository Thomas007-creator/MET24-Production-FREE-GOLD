import React from 'react';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { CheckCircle, Circle } from 'lucide-react';
import { useEnhancedJournaling } from './EnhancedJournalingPage.provider';

export const DailyGoals: React.FC = () => {
  const { dailyGoals, handleGoalToggle } = useEnhancedJournaling();

  return (
    <Card className="glass border border-white/10">
      <CardHeader>
        <h2 className="text-xl font-semibold text-white">🎯 Daily Goals</h2>
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          {dailyGoals.length === 0 ? (
            <p className="text-gray-400 text-center py-4">
              Geen dagelijkse doelen ingesteld
            </p>
          ) : (
            dailyGoals.map((goal) => (
              <div
                key={goal.id}
                className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <button
                  onClick={() => handleGoalToggle(goal.id!)}
                  className="flex-shrink-0"
                >
                  {goal.isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400" />
                  )}
                </button>
                <div className="flex-1">
                  <p className={`text-sm ${goal.isCompleted ? 'line-through text-gray-400' : 'text-white'}`}>
                    {goal.goalText}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardBody>
    </Card>
  );
};