import React from 'react';
import { Card, CardBody, Button } from '@nextui-org/react';
import { Bell, Settings } from 'lucide-react';
import { useDashboard } from './DashboardPage.provider';

export const DashboardHeader: React.FC = () => {
  const { userName, mbtiType, handleQuickActionClick } = useDashboard();

  return (
    <Card className="mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
      <CardBody className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-xl">👋</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                Welkom terug, {userName}!
              </h1>
              <p className="text-blue-100">
                {mbtiType} • Laten we je dag geweldig maken
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              isIconOnly
              variant="light"
              className="text-white hover:bg-white/20"
              onClick={() => handleQuickActionClick('notifications')}
            >
              <Bell size={20} />
            </Button>
            <Button
              isIconOnly
              variant="light"
              className="text-white hover:bg-white/20"
              onClick={() => handleQuickActionClick('settings')}
            >
              <Settings size={20} />
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};