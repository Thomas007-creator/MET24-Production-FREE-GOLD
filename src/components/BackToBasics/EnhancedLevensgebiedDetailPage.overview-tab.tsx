import React from 'react';
import { Card, CardBody, CardHeader, Progress, Chip } from '@nextui-org/react';
import { ExternalLink } from 'lucide-react';
import { useEnhancedLevensgebiedDetailPage } from './EnhancedLevensgebiedDetailPage.provider';

export const EnhancedLevensgebiedDetailPageOverviewTab: React.FC = () => {
  const {
    area,
    progress,
    mbtiType,
    handleCommunityClick
  } = useEnhancedLevensgebiedDetailPage();

  if (!area) return null;

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="glass border border-white/10">
        <CardHeader>
          <h2 className="text-xl font-semibold text-white">📊 Progress Overview</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-3xl font-bold text-white mb-2">{progress}%</div>
              <div className="text-sm text-gray-300">Overall Progress</div>
              <Progress value={progress} className="mt-2" />
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-3xl font-bold text-white mb-2">
                {area.community.links.length}
              </div>
              <div className="text-sm text-gray-300">Active Communities</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-3xl font-bold text-white mb-2">
                {area.community.events.length}
              </div>
              <div className="text-sm text-gray-300">Upcoming Events</div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* MBTI-Optimized Communities Preview */}
      <Card className="glass border border-white/10">
        <CardHeader>
          <h2 className="text-xl font-semibold text-white">🎯 {mbtiType}-Optimized Communities</h2>
          <p className="text-gray-300 text-sm">Communities specifiek geselecteerd voor jouw persoonlijkheidstype</p>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {area.community.links.slice(0, 3).map((link, index) => (
              <Card
                key={index}
                className="border-2 border-white/20 hover:border-purple-400 transition-colors cursor-pointer"
                onClick={() => handleCommunityClick(link.url)}
              >
                <CardBody>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">{link.title}</h4>
                    <div className="flex items-center space-x-1">
                      {link.isLive && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />}
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <Chip color="primary" variant="flat" className="mb-3">
                    {link.hashtag}
                  </Chip>
                  <div className="flex items-center justify-between text-sm text-gray-300">
                    <span>👥 {link.memberCount} members</span>
                    <span>🕒 {link.lastActivity}</span>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};