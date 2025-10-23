/**
 * Levensgebied Detail Community Tab Component
 *
 * Community tab showing links and events
 *
 * @version 14.0.0
 */

import React from 'react';
import { Card, CardBody, CardHeader, Button, Chip } from '@nextui-org/react';
import { Users, Calendar, ExternalLink, MapPin } from 'lucide-react';
import { useLevensgebiedDetail } from './LevensgebiedDetailPage.provider';

export const LevensgebiedDetailCommunityTab: React.FC = () => {
  const { areaData } = useLevensgebiedDetail();

  if (!areaData) return null;

  return (
    <div className="space-y-6">
      {/* Community Links */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users className="w-5 h-5" />
            Community Groepen
          </h2>
          <p className="text-sm text-gray-600">
            Verbind met anderen die werken aan dit levensgebied
          </p>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {areaData.community.links.map((link, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{link.title}</h3>
                  <Chip size="sm" variant="flat" className="mt-1">
                    {link.hashtag}
                  </Chip>
                </div>
                <Button
                  size="sm"
                  variant="bordered"
                  endContent={<ExternalLink className="w-4 h-4" />}
                  onClick={() => window.open(link.url, '_blank')}
                >
                  Deelnemen
                </Button>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Aankomende Events
          </h2>
          <p className="text-sm text-gray-600">
            Workshops, retraites en community bijeenkomsten
          </p>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {areaData.community.events.map((event, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold mb-1">{event.title}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {event.date}
                    </div>
                  </div>
                  <Chip color="primary" variant="flat">
                    Event
                  </Chip>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                  <MapPin className="w-4 h-4" />
                  {event.location}
                </div>
                <Button size="sm" color="primary" variant="bordered">
                  Meer Info
                </Button>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Community Guidelines */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Community Richtlijnen</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 font-semibold text-xs">1</span>
              </div>
              <p>Wees respectvol en ondersteunend naar andere leden</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 font-semibold text-xs">2</span>
              </div>
              <p>Deel je ervaringen en inzichten om anderen te helpen</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 font-semibold text-xs">3</span>
              </div>
              <p>Stel vragen en zoek hulp wanneer je die nodig hebt</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 font-semibold text-xs">4</span>
              </div>
              <p>Respecteer privacy en persoonlijke grenzen</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};