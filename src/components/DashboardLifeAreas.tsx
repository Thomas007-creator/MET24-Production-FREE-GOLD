import React from 'react';
import { Card, CardBody, CardHeader, Progress, Button } from '@nextui-org/react';
import { useDashboard } from './DashboardPage.provider';

export const DashboardLifeAreas: React.FC = () => {
  const { lifeAreas, handleFeatureClick } = useDashboard();

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <h2 className="text-xl font-semibold">Levensgebieden</h2>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lifeAreas.map((area) => (
            <Card
              key={area.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleFeatureClick(area.id)}
            >
              <CardBody className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${area.color} flex items-center justify-center text-white text-lg`}>
                      {area.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{area.name}</h3>
                      <p className="text-xs text-gray-500">{area.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{area.progress}%</p>
                    <p className="text-xs text-gray-500">{area.challenges} challenges</p>
                  </div>
                </div>
                <Progress
                  value={area.progress}
                  color="primary"
                  size="sm"
                  className="mb-2"
                />
                <p className="text-xs text-gray-500">
                  Laatste activiteit: {area.lastActivity}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Button
            color="primary"
            variant="ghost"
            onClick={() => handleFeatureClick('life-areas')}
          >
            Bekijk alle levensgebieden
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};