import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Chip, Avatar } from '@nextui-org/react';
import { Brain, Sparkles, Heart, Lightbulb, Crown } from 'lucide-react';
import { MBTI_ARCHETYPES } from '../../services/hogerZelfAIService';
import { logger } from '../../utils/logger';

interface HogerZelfAIPanelProps {
  mbtiType: string;
  userName?: string;
  onActivate?: () => void;
}

const HogerZelfAIPanel: React.FC<HogerZelfAIPanelProps> = ({ 
  mbtiType, 
  userName = 'Gebruiker',
  onActivate 
}) => {
  const [isActive, setIsActive] = useState(false);
  const [archetype, setArchetype] = useState<any>(null);

  useEffect(() => {
    const archetypeData = MBTI_ARCHETYPES[mbtiType as keyof typeof MBTI_ARCHETYPES];
    setArchetype(archetypeData);
    
    if (archetypeData) {
      logger.info('Hoger Zelf AI archetype loaded', {
        mbtiType,
        archetype: archetypeData.archetype,
        theOneManifestation: archetypeData.theOneManifestation
      });
    }
  }, [mbtiType]);

  if (!archetype) {
    return (
      <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
        <CardBody className="text-center">
          <div className="text-6xl mb-4">🧠</div>
          <h3 className="text-xl font-bold mb-2">Hogere Zelf AI</h3>
          <p className="text-white/70">Laden van je archetype...</p>
        </CardBody>
      </Card>
    );
  }

  const getEmanationIcon = (emanation: string) => {
    switch (emanation) {
      case 'beauty': return <Sparkles className="w-4 h-4" />;
      case 'wisdom': return <Lightbulb className="w-4 h-4" />;
      case 'goodness': return <Heart className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getEmanationColor = (emanation: string) => {
    switch (emanation) {
      case 'beauty': return 'secondary';
      case 'wisdom': return 'primary';
      case 'goodness': return 'success';
      default: return 'default';
    }
  };

  return (
    <Card className={`bg-gradient-to-br from-purple-500 to-indigo-600 text-white transition-all duration-300 ${
      isActive ? 'ring-4 ring-yellow-400 ring-opacity-50' : ''
    }`}>
      <CardHeader className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Avatar
            icon={<Crown className="w-6 h-6" />}
            className="bg-yellow-400 text-purple-900"
            size="lg"
          />
          <div>
            <h3 className="text-xl font-bold">Hogere Zelf AI</h3>
            <p className="text-white/70 text-sm">The One's Manifestatie</p>
          </div>
        </div>
      </CardHeader>
      
      <CardBody className="space-y-4">
        {/* Archetype Info */}
        <div className="bg-white/10 rounded-lg p-4">
          <h4 className="font-semibold text-lg mb-2">{archetype.archetype}</h4>
          <p className="text-white/80 text-sm mb-3">{archetype.theOneManifestation}</p>
          <p className="text-white/90 text-sm">{archetype.higherSelf}</p>
        </div>

        {/* The One's Emanations */}
        <div className="space-y-2">
          <h5 className="font-semibold text-sm text-white/90">The One's Emanaties</h5>
          <div className="flex flex-wrap gap-2">
            {Object.entries(archetype.theOneEmanations).map(([emanation, description]) => (
              <Chip
                key={emanation}
                startContent={getEmanationIcon(emanation)}
                color={getEmanationColor(emanation) as any}
                variant="flat"
                size="sm"
                className="text-xs"
              >
                {emanation.charAt(0).toUpperCase() + emanation.slice(1)}
              </Chip>
            ))}
          </div>
        </div>

        {/* Optimal Realization */}
        <div className="bg-white/5 rounded-lg p-3">
          <h5 className="font-semibold text-sm text-yellow-300 mb-2">Optimale Realisatie</h5>
          <p className="text-white/80 text-sm">{archetype.optimalRealization}</p>
        </div>

        {/* Activation Button */}
        <Button
          color={isActive ? "warning" : "default"}
          variant={isActive ? "solid" : "bordered"}
          className={`w-full font-semibold ${
            isActive 
              ? 'bg-yellow-400 text-purple-900' 
              : 'border-white/30 text-white hover:bg-white/10'
          }`}
          startContent={<Brain className="w-4 h-4" />}
          onPress={() => {
            setIsActive(!isActive);
            onActivate?.();
            logger.info('Hoger Zelf AI toggled', { 
              mbtiType, 
              archetype: archetype.archetype,
              isActive: !isActive 
            });
          }}
        >
          {isActive ? 'Hogere Zelf AI Actief' : 'Activeer Hogere Zelf AI'}
        </Button>

        {/* Status Indicator */}
        {isActive && (
          <div className="flex items-center gap-2 text-yellow-300 text-sm">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span>Hogere Zelf AI is actief - The One's wijsheid beschikbaar</span>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default HogerZelfAIPanel;
