import React from 'react';
import { Card, CardBody, Button } from '@nextui-org/react';
import { Brain, Heart, Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  selectedMbtiType: string;
  onStartSession: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  selectedMbtiType,
  onStartSession
}) => {
  const getWelcomeTitle = (mbtiType: string) => {
    const titles: Record<string, string> = {
      'INFP': 'Ontdek Je Innerlijke Wereld',
      'INTJ': 'Strategische Persoonlijke Ontwikkeling',
      'ENFP': 'Verken Je Creatieve Mogelijkheden',
      'ENFJ': 'Mensgerichte Groei en Ontwikkeling',
      'INFJ': 'Diepe Zelfreflectie en Betekenis',
      'INTP': 'Analytische Zelfverbetering',
      'ENTJ': 'Leiderschap en Doelgerichtheid',
      'ENTP': 'Innovatieve Probleemoplossing',
      'ISTJ': 'Methodische Zelfontwikkeling',
      'ISFJ': 'Harmonie en Persoonlijke Zorg',
      'ESTJ': 'Structuur en Effectiviteit',
      'ESFJ': 'Relatiegerichte Ontwikkeling',
      'ISTP': 'Praktische Vaardigheden',
      'ISFP': 'Creatieve Zelfexpressie',
      'ESTP': 'Avontuurlijke Groei',
      'ESFP': 'Levensvreugde en Sociale Ontwikkeling'
    };
    return titles[mbtiType] || 'Persoonlijke Ontwikkeling';
  };

  const getWelcomeDescription = (mbtiType: string) => {
    const descriptions: Record<string, string> = {
      'INFP': 'Als INFP ben je gefocust op authenticiteit en persoonlijke betekenis. Laten we samen verkennen wat echt belangrijk voor je is.',
      'INTJ': 'Als INTJ heb je een strategische mindset. Laten we je doelen organiseren en een plan maken voor succes.',
      'ENFP': 'Als ENFP heb je eindeloze ideeën en mogelijkheden. Laten we je enthousiasme kanaliseren naar concrete actie.',
      'ENFJ': 'Als ENFJ zorg je voor anderen. Laten we ook voor jou zorgen en je helpen groeien als leider.',
      'INFJ': 'Als INFJ heb je diepe inzichten. Laten we je intuïtie gebruiken om betekenisvolle verandering te creëren.',
      'INTP': 'Als INTP hou je van analyseren. Laten we je sterke punten gebruiken voor systematische zelfverbetering.',
      'ENTJ': 'Als ENTJ ben je doelgericht. Laten we je leiderschapskwaliteiten inzetten voor persoonlijke groei.',
      'ENTP': 'Als ENTP ben je innovatief. Laten we je creativiteit gebruiken om nieuwe oplossingen te vinden.',
      'ISTJ': 'Als ISTJ waardeer je betrouwbaarheid. Laten we een solide fundament bouwen voor je ontwikkeling.',
      'ISFJ': 'Als ISFJ ben je zorgzaam. Laten we je empathie gebruiken voor harmonieuze persoonlijke groei.',
      'ESTJ': 'Als ESTJ ben je praktisch. Laten we structuur brengen in je ontwikkelingsproces.',
      'ESFJ': 'Als ESFJ ben je sociaal. Laten we je relationele vaardigheden verder ontwikkelen.',
      'ISTP': 'Als ISTP ben je praktisch. Laten we je technische vaardigheden inzetten voor zelfontwikkeling.',
      'ISFP': 'Als ISFP ben je creatief. Laten we je artistieke kant verkennen en ontwikkelen.',
      'ESTP': 'Als ESTP ben je avontuurlijk. Laten we je energie gebruiken voor spannende groei.',
      'ESFP': 'Als ESFP ben je levendig. Laten we je enthousiasme gebruiken voor positieve verandering.'
    };

    return descriptions[mbtiType] ||
      `Als ${mbtiType} heb je unieke sterke punten. Laten we samen werken aan je persoonlijke ontwikkeling.`;
  };

  return (
    <Card className="bg-white/10 backdrop-blur-xl border border-white/20 h-96">
      <CardBody className="flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md">
          {/* Icon */}
          <div className="relative">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-8 rounded-full w-fit mx-auto shadow-lg">
              <Brain className="w-16 h-16 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 bg-yellow-400 p-2 rounded-full">
              <Sparkles className="w-6 h-6 text-yellow-900" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {getWelcomeTitle(selectedMbtiType)}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {getWelcomeDescription(selectedMbtiType)}
              </p>
            </div>

            {/* MBTI Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <span className="text-sm font-medium text-purple-300">MBTI Type:</span>
              <span className="text-sm font-bold text-white bg-gradient-to-r from-purple-400 to-pink-400 px-3 py-1 rounded-full">
                {selectedMbtiType}
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            color="primary"
            size="lg"
            onClick={onStartSession}
            startContent={<Heart className="w-5 h-5" />}
            className="shadow-lg hover:shadow-xl transition-shadow"
          >
            Begin Coaching Sessie
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};