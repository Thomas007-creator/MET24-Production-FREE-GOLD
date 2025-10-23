import React from 'react';
import { Card, CardBody, CardHeader, Chip, Button } from '@nextui-org/react';
import { useDashboard } from './DashboardPage.provider';

export const DashboardRecentActivity: React.FC = () => {
  const { recentActivities, getStatusColor, getStatusIcon, getTypeIcon } = useDashboard();

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <h2 className="text-xl font-semibold">Recente Activiteit</h2>
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {getTypeIcon(activity.type)}
                </div>
                <div>
                  <p className="font-medium text-sm">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.description}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
              <Chip
                size="sm"
                color={getStatusColor(activity.status)}
                variant="flat"
                startContent={getStatusIcon(activity.status)}
              >
                {activity.status === 'completed' ? 'Voltooid' :
                 activity.status === 'pending' ? 'In afwachting' :
                 activity.status === 'overdue' ? 'Achterstallig' : activity.status}
              </Chip>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Button
            color="primary"
            variant="ghost"
            onClick={() => window.location.href = '/activity'}
          >
            Bekijk alle activiteiten
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};