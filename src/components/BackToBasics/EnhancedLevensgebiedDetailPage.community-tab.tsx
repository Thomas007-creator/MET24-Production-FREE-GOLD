import React from 'react';
import { Card, CardBody, CardHeader, Button, Badge } from '@nextui-org/react';
import { MessageCircle, ExternalLink, Users, Zap, Calendar, MapPin } from 'lucide-react';
import { useEnhancedLevensgebiedDetailPage } from './EnhancedLevensgebiedDetailPage.provider';

export const EnhancedLevensgebiedDetailPageCommunityTab: React.FC = () => {
  const {
    area,
    mbtiType,
    handleCommunityClick
  } = useEnhancedLevensgebiedDetailPage();

  if (!area) return null;

  return (
    <div className="space-y-6">
      {/* Community Links */}
      <Card className="glass border border-white/10">
        <CardHeader>
          <h2 className="text-xl font-semibold text-white">💬 Community Links</h2>
          <p className="text-gray-300 text-sm">Join de communities die het beste bij jouw {mbtiType} persoonlijkheid passen</p>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {area.community.links.map((link, index) => (
              <Card
                key={index}
                className="border-2 border-white/20 hover:border-purple-400 transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => handleCommunityClick(link.url)}
              >
                <CardBody>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-white">{link.title}</h4>
                    <div className="flex items-center space-x-2">
                      {link.isLive && (
                        <Badge content="Live" color="success" variant="flat" size="sm">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        </Badge>
                      )}
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mb-3">
                    <MessageCircle className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-gray-300">{link.hashtag}</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-300 mb-4">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>{link.memberCount.toLocaleString()} members</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4" />
                      <span>Last activity: {link.lastActivity}</span>
                    </div>
                  </div>
                  <Button
                    color="primary"
                    variant="solid"
                    size="sm"
                    className="w-full"
                    startContent={<MessageCircle className="w-4 h-4" />}
                  >
                    Join Community
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Community Events */}
      <Card className="glass border border-white/10">
        <CardHeader>
          <h2 className="text-xl font-semibold text-white">📅 Aankomende Events</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {area.community.events.map((event, index) => (
              <Card key={index} className="border-2 border-white/20">
                <CardBody>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-2">{event.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-300">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{event.attendees} attendees</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      color="primary"
                      variant="solid"
                      size="sm"
                      onClick={() => window.open(event.registrationUrl, '_blank')}
                      startContent={<ExternalLink className="w-4 h-4" />}
                    >
                      Register
                    </Button>
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