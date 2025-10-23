/**
 * Content Discovery Carousel Component
 *
 * Carousel for discovering personalized content based on MBTI type
 *
 * @version 14.0.0
 */

import React from 'react';
import { Card, CardBody, Button, Chip, Badge } from '@nextui-org/react';
import { ChevronLeft, ChevronRight, BookOpen, Video, Headphones, FileText, Star } from 'lucide-react';
import { useContentDiscovery } from './ContentDiscoveryCarousel.provider';

interface ContentDiscoveryCarouselProps {
  mbtiType: string;
  selectedLevensgebied?: string;
  onContentClick?: (content: any) => void;
}

export const ContentDiscoveryCarousel: React.FC<ContentDiscoveryCarouselProps> = ({
  mbtiType,
  selectedLevensgebied,
  onContentClick
}) => {
  const { currentIndex, filteredContent, nextSlide, prevSlide, handleContentClick } = useContentDiscovery();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'audio': return <Headphones className="w-4 h-4" />;
      case 'article': return <FileText className="w-4 h-4" />;
      case 'guide': return <BookOpen className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'text-red-400';
      case 'audio': return 'text-purple-400';
      case 'article': return 'text-blue-400';
      case 'guide': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  if (filteredContent.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Geen content beschikbaar voor je MBTI type</p>
      </div>
    );
  }

  const currentContent = filteredContent[currentIndex];

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          🎯 Aanbevolen voor {mbtiType}
        </h3>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="bordered"
            isIconOnly
            onClick={prevSlide}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            disabled={filteredContent.length <= 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-400">
            {currentIndex + 1} / {filteredContent.length}
          </span>
          <Button
            size="sm"
            variant="bordered"
            isIconOnly
            onClick={nextSlide}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            disabled={filteredContent.length <= 1}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-sm border border-white/20">
        <CardBody className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {currentContent.featured && (
                  <Badge color="warning" variant="flat" className="text-xs">
                    Featured
                  </Badge>
                )}
                <div className={`flex items-center gap-1 ${getTypeColor(currentContent.type)}`}>
                  {getTypeIcon(currentContent.type)}
                  <span className="text-sm capitalize">{currentContent.type}</span>
                </div>
              </div>
              <h4 className="text-xl font-bold text-white mb-2">
                {currentContent.title}
              </h4>
              <p className="text-gray-300 text-sm mb-3">
                {currentContent.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>⏱️ {currentContent.duration}</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{currentContent.rating}</span>
                </div>
                <Chip size="sm" variant="flat" className="bg-white/10 text-white">
                  {currentContent.difficulty}
                </Chip>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {currentContent.tags.slice(0, 3).map(tag => (
                <Chip
                  key={tag}
                  size="sm"
                  variant="bordered"
                  className="bg-white/5 border-white/20 text-white/80"
                >
                  {tag}
                </Chip>
              ))}
            </div>
            <Button
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium"
              onClick={() => handleContentClick(currentContent)}
            >
              Start Nu
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {filteredContent.map((_, index) => (
          <button
            key={index}
            onClick={() => {}}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex
                ? 'bg-purple-400'
                : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
