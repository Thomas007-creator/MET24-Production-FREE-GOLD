import React from 'react';
import { Card, CardBody, CardHeader, Button, Badge } from '@nextui-org/react';
import { useMainView } from './MainView.provider';

const BackgroundServiceStatus: React.FC<{
  service: {
    name: string;
    status: 'online' | 'offline' | 'syncing' | 'error';
    lastSync?: string;
    icon: string;
  };
}> = ({ service }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'success';
      case 'syncing': return 'warning';
      case 'error': return 'danger';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'syncing': return 'Synchroniseren';
      case 'error': return 'Fout';
      default: return 'Offline';
    }
  };

  return (
    <div className='flex items-center justify-between p-3 bg-white bg-opacity-10 rounded-lg border border-white border-opacity-20'>
      <div className='flex items-center gap-3'>
        <span className='text-lg' aria-hidden='true'>
          {service.icon}
        </span>
        <div>
          <span className='font-medium text-sm'>{service.name}</span>
          {service.lastSync && (
            <div className='text-xs text-gray-400'>
              Laatste sync: {service.lastSync}
            </div>
          )}
        </div>
      </div>
      <Badge
        color={getStatusColor(service.status) as any}
        variant='flat'
        size='sm'
      >
        {getStatusText(service.status)}
      </Badge>
    </div>
  );
};

const BackgroundServicesCard: React.FC = () => {
  const { backgroundServices, mcpBridgeStatus } = useMainView();

  const services: Array<{ name: string; status: 'error' | 'offline' | 'online' | 'syncing'; lastSync?: string; icon: string }> = [
    {
      name: 'MCP Bridge',
      status: (mcpBridgeStatus?.isOnline ? 'online' : 'offline') as 'online' | 'offline',
      lastSync: mcpBridgeStatus?.lastSync?.toString(),
      icon: '🔗'
    },
    {
      name: 'AI Processing',
      status: (backgroundServices?.aiProcessing ? 'online' : 'offline') as 'online' | 'offline',
      lastSync: backgroundServices?.lastUpdate?.toString(),
      icon: '🤖'
    },
    {
      name: 'Content Sync',
      status: (backgroundServices?.contentSync ? 'syncing' : 'online') as 'syncing' | 'online',
      lastSync: backgroundServices?.lastUpdate?.toString(),
      icon: '📚'
    },
    {
      name: 'Analytics',
      status: (backgroundServices?.analytics ? 'online' : 'offline') as 'online' | 'offline',
      lastSync: backgroundServices?.lastUpdate?.toString(),
      icon: '📊'
    }
  ];

  return (
    <Card
      className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)] shadow-lg hover:shadow-[0_0_30px_rgba(100,223,223,0.2)] hover:-translate-y-1 transition-all duration-300 focus-within:ring-2 focus-within:ring-gray-500 focus-within:ring-offset-2'
      role='article'
      aria-labelledby='background-services-title'
    >
      <CardHeader>
        <h3 id='background-services-title' className='text-xl font-bold'>
          ⚙️ Achtergrond Services
        </h3>
      </CardHeader>
      <CardBody>
        <p className='mb-4'>
          Status van automatische synchronisatie en achtergrondprocessen
        </p>

        <div className='space-y-3 mb-4'>
          {services.map((service, index) => (
            <BackgroundServiceStatus key={index} service={service} />
          ))}
        </div>

        <div className='bg-white bg-opacity-15 rounded-lg p-4 border border-white border-opacity-20'>
          <div className='flex items-center gap-2 mb-3'>
            <span className='text-xl' aria-hidden='true'>
              🔄
            </span>
            <span className='font-bold text-sm'>
              Systeem Status
            </span>
          </div>

          <div className='grid grid-cols-2 gap-3 text-sm'>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-green-400 rounded-full'></div>
              <span>Auto-sync actief</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-blue-400 rounded-full'></div>
              <span>PWA klaar</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-purple-400 rounded-full'></div>
              <span>Offline modus</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-orange-400 rounded-full'></div>
              <span>Push notificaties</span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

// Main Background Services Component
export const MainViewBackgroundServices: React.FC = () => {
  return (
    <section
      aria-labelledby='background-services-section-title'
      className='mb-8'
    >
      <h2 id='background-services-section-title' className='sr-only'>
        Achtergrond Services Status
      </h2>

      <BackgroundServicesCard />
    </section>
  );
};