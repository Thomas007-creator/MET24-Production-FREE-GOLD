import React from 'react';
import { Card, CardBody, CardHeader, Button, Chip } from '@nextui-org/react';
import { Play, BookOpen } from 'lucide-react';
import { useEnhancedLevensgebiedDetailPage } from './EnhancedLevensgebiedDetailPage.provider';

export const EnhancedLevensgebiedDetailPageResourcesTab: React.FC = () => {
  const { area } = useEnhancedLevensgebiedDetailPage();

  if (!area) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video':
        return <Play className="w-4 h-4" />;
      case 'audio':
        return <Play className="w-4 h-4" />;
      case 'pdf':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass border border-white/10">
        <CardHeader>
          <h2 className="text-xl font-semibold text-white">📚 Beschikbare Resources</h2>
          <p className="text-gray-300 text-sm">Leer en ontwikkel met onze zorgvuldig geselecteerde materialen</p>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {area.resources.map((resource, index) => (
              <Card
                key={index}
                className="border-2 border-white/20 hover:border-purple-400 transition-all duration-300 hover:scale-105"
              >
                <CardBody>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getResourceIcon(resource.type)}
                      <Chip
                        size="sm"
                        variant="flat"
                        className="bg-purple-600/20 text-purple-300"
                      >
                        {resource.type}
                      </Chip>
                    </div>
                    <Chip
                      size="sm"
                      color={getDifficultyColor(resource.difficulty) as any}
                      variant="flat"
                    >
                      {resource.difficulty}
                    </Chip>
                  </div>

                  <h4 className="font-semibold text-white mb-2">{resource.title}</h4>

                  <div className="flex items-center justify-between text-sm text-gray-300 mb-4">
                    <span>⏱️ {resource.duration}</span>
                  </div>

                  <Button
                    color="primary"
                    variant="solid"
                    size="sm"
                    className="w-full"
                    startContent={getResourceIcon(resource.type)}
                  >
                    Start {resource.type}
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};