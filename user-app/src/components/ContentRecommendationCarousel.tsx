import React, { useState, useEffect } from 'react';
import { Card, CardBody, Button } from '@nextui-org/react';
import { contentRecommendationsCollection, contentItemsCollection } from '../database';
import { logger } from '../utils/logger';

interface ContentRecommendation {
  id: string;
  title: string;
  summary: string;
  type: 'article' | 'video' | 'podcast' | 'exercise';
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  mbtiAlignment: string;
  score: number;
  thumbnail?: string;
}

interface ContentRecommendationCarouselProps {
  userId: string;
  mbtiType: string;
  maxItems?: number;
}

const ContentRecommendationCarousel: React.FC<ContentRecommendationCarouselProps> = ({
  userId,
  mbtiType,
  maxItems = 5
}) => {
  const [recommendations, setRecommendations] = useState<ContentRecommendation[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, [userId, mbtiType]);

  const loadRecommendations = async () => {
    setIsLoading(true);
    try {
      // Mock data voor nu - later vervangen door echte database queries
      const mockRecommendations: ContentRecommendation[] = [
        {
          id: 'rec_1',
          title: 'Diepgaande Introspectie voor INFP',
          summary: 'Ontdek je innerlijke creativiteit en waarden door gestructureerde zelfreflectie.',
          type: 'exercise',
          duration: 15,
          difficulty: 'beginner',
          mbtiAlignment: 'INFP',
          score: 0.95,
          thumbnail: '🧘‍♀️'
        },
        {
          id: 'rec_2',
          title: 'MBTI & Emotionele Intelligentie',
          summary: 'Versterk je empathie en sociale vaardigheden gebaseerd op je persoonlijkheidstype.',
          type: 'article',
          duration: 8,
          difficulty: 'intermediate',
          mbtiAlignment: mbtiType,
          score: 0.88,
          thumbnail: '💡'
        },
        {
          id: 'rec_3',
          title: 'Creatieve Visualisatie Technieken',
          summary: 'Leer hoe je je verbeeldingskracht kunt gebruiken voor persoonlijke groei.',
          type: 'video',
          duration: 12,
          difficulty: 'beginner',
          mbtiAlignment: mbtiType,
          score: 0.92,
          thumbnail: '🎨'
        },
        {
          id: 'rec_4',
          title: 'Mindfulness voor Intuïtieve Types',
          summary: 'Specifieke mindfulness oefeningen afgestemd op jouw MBTI type.',
          type: 'podcast',
          duration: 20,
          difficulty: 'intermediate',
          mbtiAlignment: mbtiType,
          score: 0.85,
          thumbnail: '🧠'
        },
        {
          id: 'rec_5',
          title: 'Persoonlijke Waarden Verkenning',
          summary: 'Een diepgaande oefening om je kernwaarden te identificeren en te versterken.',
          type: 'exercise',
          duration: 25,
          difficulty: 'advanced',
          mbtiAlignment: mbtiType,
          score: 0.90,
          thumbnail: '⭐'
        }
      ];

      // Filter op MBTI type en sorteer op score
      const filteredRecommendations = mockRecommendations
        .filter(rec => rec.mbtiAlignment === mbtiType || rec.mbtiAlignment === 'ALL')
        .sort((a, b) => b.score - a.score)
        .slice(0, maxItems);

      setRecommendations(filteredRecommendations);
    } catch (error) {
      logger.error('Error loading content recommendations', { error });
    } finally {
      setIsLoading(false);
    }
  };

  const nextRecommendation = () => {
    setCurrentIndex((prev) => (prev + 1) % recommendations.length);
  };

  const prevRecommendation = () => {
    setCurrentIndex((prev) => (prev - 1 + recommendations.length) % recommendations.length);
  };

  const getTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      article: '📖',
      video: '🎥',
      podcast: '🎧',
      exercise: '💪'
    };
    return icons[type] || '📄';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: { [key: string]: string } = {
      beginner: 'text-green-400',
      intermediate: 'text-yellow-400',
      advanced: 'text-red-400'
    };
    return colors[difficulty] || 'text-gray-400';
  };

  if (isLoading) {
    return (
      <div className="glass rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-white mb-4">Aanbevolen Content</h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="text-gray-300 mt-2">Laden van persoonlijke aanbevelingen...</p>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="glass rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-white mb-4">Aanbevolen Content</h2>
        <p className="text-gray-400 text-center py-8">
          Nog geen aanbevelingen beschikbaar. Start je eerste sessie om gepersonaliseerde content te ontvangen!
        </p>
      </div>
    );
  }

  const currentRec = recommendations[currentIndex];

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-white">Aanbevolen Content</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">
            {currentIndex + 1} van {recommendations.length}
          </span>
          <div className="flex space-x-1">
            {recommendations.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex ? 'bg-purple-400' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative">
        <Card className="bg-white/5 border border-white/10">
          <CardBody className="p-6">
            <div className="flex items-start space-x-4">
              <div className="text-4xl">{currentRec.thumbnail}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">{getTypeIcon(currentRec.type)}</span>
                  <h3 className="text-xl font-semibold text-white">{currentRec.title}</h3>
                  <span className={`text-sm px-2 py-1 rounded-full bg-white/10 ${getDifficultyColor(currentRec.difficulty)}`}>
                    {currentRec.difficulty}
                  </span>
                </div>
                <p className="text-gray-300 mb-4">{currentRec.summary}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>⏱️ {currentRec.duration} min</span>
                    <span>🎯 {Math.round(currentRec.score * 100)}% match</span>
                    <span>🧠 {currentRec.mbtiAlignment}</span>
                  </div>
                  <Button
                    color="primary"
                    variant="solid"
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Start
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Navigation buttons */}
        {recommendations.length > 1 && (
          <>
            <button
              onClick={prevRecommendation}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all"
            >
              ←
            </button>
            <button
              onClick={nextRecommendation}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all"
            >
              →
            </button>
          </>
        )}
      </div>

      {/* Quick access to all recommendations */}
      {recommendations.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {recommendations.map((rec, index) => (
            <button
              key={rec.id}
              onClick={() => setCurrentIndex(index)}
              className={`px-3 py-1 rounded-full text-sm transition-all ${
                index === currentIndex
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {getTypeIcon(rec.type)} {rec.title.substring(0, 20)}...
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentRecommendationCarousel;
