import React from 'react';
import { Card, CardBody } from '@nextui-org/react';
import { Bell, Heart, Shield, Settings } from 'lucide-react';

export const OnboardingNotificationsBenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: Bell,
      title: 'Persoonlijke tips',
      description: 'Krijg dagelijkse inzichten gebaseerd op je MBTI-type en interesses.',
    },
    {
      icon: Heart,
      title: 'Herinneringen',
      description: 'Subtiele reminders om je doelen te blijven nastreven.',
    },
    {
      icon: Shield,
      title: 'Privacy eerst',
      description: 'Je gegevens blijven altijd privé en veilig.',
    },
    {
      icon: Settings,
      title: 'Volledig aanpasbaar',
      description: 'Stel je notificaties in zoals jij dat wilt.',
    },
  ];

  return (
    <Card className="mb-6">
      <CardBody>
        <h3 className="text-lg font-semibold mb-4 text-center">
          Waarom notificaties inschakelen?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{benefit.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
};