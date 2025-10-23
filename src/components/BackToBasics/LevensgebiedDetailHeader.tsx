/**
 * Levensgebied Detail Header Component
 *
 * Header section for Levensgebied Detail page with navigation and area info
 *
 * @version 14.0.0
 */

import React from 'react';
import { Button, Chip } from '@nextui-org/react';
import { ArrowLeft } from 'lucide-react';
import { useLevensgebiedDetail } from './LevensgebiedDetailPage.provider';

export const LevensgebiedDetailHeader: React.FC = () => {
  const { areaData, handleBackToBasics } = useLevensgebiedDetail();

  if (!areaData) return null;

  return (
    <div className={`bg-gradient-to-r ${areaData.color} text-white p-6`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <Button
            isIconOnly
            variant="light"
            onClick={handleBackToBasics}
            className="text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold">{areaData.name}</h1>
        </div>
        <p className="text-lg opacity-90">{areaData.description}</p>

        {/* Hashtags */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {areaData.hashtags.map((hashtag, index) => (
            <Chip
              key={index}
              variant="flat"
              className="bg-white/20 text-white border-white/30"
            >
              {hashtag}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
};