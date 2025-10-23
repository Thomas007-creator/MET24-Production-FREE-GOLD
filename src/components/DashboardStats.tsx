import React from 'react';
import { Card, CardBody, Progress, Chip } from '@nextui-org/react';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { useDashboard } from './DashboardPage.provider';

export const DashboardStats: React.FC = () => {
  const { stats } = useDashboard();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
        <CardBody className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Wellness Score
              </p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {stats.wellnessScore}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
          <Progress
            value={stats.wellnessScore}
            color="primary"
            size="sm"
            className="mt-2"
          />
        </CardBody>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
        <CardBody className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                Taken
              </p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                {stats.completedTasks}/{stats.totalTasks}
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-green-500" />
          </div>
          <Progress
            value={(stats.completedTasks / stats.totalTasks) * 100}
            color="success"
            size="sm"
            className="mt-2"
          />
        </CardBody>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20 border border-purple-200 dark:border-purple-800">
        <CardBody className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                Streak
              </p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {stats.streakDays}
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-400">
                dagen
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">🔥</span>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200 dark:border-orange-800">
        <CardBody className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                Week Progress
              </p>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                {stats.weeklyProgress}%
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">📈</span>
            </div>
          </div>
          <Progress
            value={stats.weeklyProgress}
            color="warning"
            size="sm"
            className="mt-2"
          />
        </CardBody>
      </Card>
    </div>
  );
};