/**
 * Levensgebied Detail Overview Tab Component
 *
 * Overview tab showing area introduction and key information
 *
 * @version 14.0.0
 */

import React from 'react';
import { Card, CardBody, CardHeader, Progress, Button } from '@nextui-org/react';
import { TrendingUp, BookOpen, Users, Calendar } from 'lucide-react';
import { useLevensgebiedDetail } from './LevensgebiedDetailPage.provider';

export const LevensgebiedDetailOverviewTab: React.FC = () => {
  const { areaData, progress } = useLevensgebiedDetail();

  if (!areaData) return null;

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Voortgang Overzicht</h2>
        </CardHeader>
        <CardBody>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Vragenlijst Compleet</span>
            <span className="text-sm font-bold">{progress}%</span>
          </div>
          <Progress value={progress} color="primary" className="mb-4" />
          <p className="text-sm text-gray-600">
            Beantwoord de vragenlijst om gepersonaliseerde inzichten te krijgen voor dit levensgebied.
          </p>
        </CardBody>
      </Card>

      {/* Area Introduction */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Over dit Levensgebied</h2>
        </CardHeader>
        <CardBody>
          <p className="text-gray-700 mb-4">
            {areaData.description}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold">Content</div>
                <div className="text-sm text-gray-600">{areaData.exercises.length} oefeningen</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="font-semibold">Community</div>
                <div className="text-sm text-gray-600">{areaData.community.links.length} groepen</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="font-semibold">Events</div>
                <div className="text-sm text-gray-600">{areaData.community.events.length} aankomend</div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Snelle Acties</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              color="primary"
              variant="bordered"
              className="h-16"
              startContent={<BookOpen />}
            >
              <div className="text-left">
                <div className="font-semibold">Vragenlijst Invullen</div>
                <div className="text-sm opacity-80">Persoonlijke assessment</div>
              </div>
            </Button>
            <Button
              color="secondary"
              variant="bordered"
              className="h-16"
              startContent={<TrendingUp />}
            >
              <div className="text-left">
                <div className="font-semibold">Oefeningen Starten</div>
                <div className="text-sm opacity-80">Praktische tools</div>
              </div>
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};