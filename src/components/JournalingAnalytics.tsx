import React from 'react';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';
import { useEnhancedJournaling } from './EnhancedJournalingPage.provider';

export const JournalingAnalytics: React.FC = () => {
  const { analytics } = useEnhancedJournaling();

  if (!analytics) {
    return (
      <Card className="glass border border-white/10">
        <CardHeader>
          <h2 className="text-xl font-semibold text-white flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Journaling Analytics
          </h2>
        </CardHeader>
        <CardBody>
          <p className="text-gray-400 text-center py-8">Geen analytics gegevens beschikbaar</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="glass border border-white/10">
      <CardHeader>
        <h2 className="text-xl font-semibold text-white flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Journaling Analytics
        </h2>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Totaal Entries</p>
                <p className="text-2xl font-bold text-white">{analytics.totalEntries}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Totaal Woorden</p>
                <p className="text-2xl font-bold text-white">{analytics.totalWords}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Gemiddelde Stemming</p>
                <p className="text-2xl font-bold text-white">
                  {analytics.averageMood.toFixed(1)}/5
                </p>
              </div>
              <span className="text-2xl">
                {analytics.averageMood >= 4 ? '😊' :
                 analytics.averageMood >= 3 ? '😐' :
                 analytics.averageMood >= 2 ? '😔' : '😢'}
              </span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};