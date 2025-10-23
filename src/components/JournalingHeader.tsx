import React from 'react';
import { Button } from '@nextui-org/react';
import { ArrowLeft, PenTool, Target, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEnhancedJournaling } from './EnhancedJournalingPage.provider';

export const JournalingHeader: React.FC = () => {
  const navigate = useNavigate();
  const { currentView, setCurrentView } = useEnhancedJournaling();

  return (
    <div className="max-w-7xl mx-auto mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            isIconOnly
            variant="ghost"
            className="text-white hover:bg-white/10"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">📝 Enhanced Journaling</h1>
            <p className="text-gray-300">V3 Features - Mood Tracking, Planning & Analytics</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            color={currentView === 'journaling' ? 'primary' : 'default'}
            variant={currentView === 'journaling' ? 'solid' : 'ghost'}
            onClick={() => setCurrentView('journaling')}
            startContent={<PenTool className="w-4 h-4" />}
          >
            Journaling
          </Button>
          <Button
            color={currentView === 'planning' ? 'primary' : 'default'}
            variant={currentView === 'planning' ? 'solid' : 'ghost'}
            onClick={() => setCurrentView('planning')}
            startContent={<Target className="w-4 h-4" />}
          >
            Planning
          </Button>
          <Button
            color={currentView === 'analytics' ? 'primary' : 'default'}
            variant={currentView === 'analytics' ? 'solid' : 'ghost'}
            onClick={() => setCurrentView('analytics')}
            startContent={<BarChart3 className="w-4 h-4" />}
          >
            Analytics
          </Button>
        </div>
      </div>
    </div>
  );
};