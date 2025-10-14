import React, { useState } from 'react';
import { Card, CardBody, Button, Badge } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { 
  User, 
  Settings, 
  Star, 
  Brain, 
  Heart, 
  Bot, 
  Target, 
  MessageSquare, 
  Users,
  BookOpen,
  BarChart3,
  Mic
} from 'lucide-react';
import { useSwipeNavigation } from '../hooks/useSwipeNavigation';

const StreamlinedMainView: React.FC = () => {
  const navigate = useNavigate();
  const { userData } = useAppStore();
  const [activeQuickAction, setActiveQuickAction] = useState<string | null>(null);

  // Swipe navigation naar andere features
  useSwipeNavigation({
    swipeLeft: '/active-imagination',    // < gesture naar Active Imagination
    swipeRight: '/back-to-basics',       // > gesture naar Back to Basics
    enabled: true,
    sensitivity: 100
  });

  const userName = userData?.name || 'Gebruiker';
  const mbtiType = userData?.mbtiType || 'INFP';

  // 🧭 Core Navigation Actions
  const coreNavigation = [
    {
      id: 'profile',
      title: 'Profile',
      icon: <User size={20} />,
      description: 'User settings & MBTI info',
      route: '/profile',
      color: 'from-blue-500 to-indigo-600',
      badge: null
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: <Settings size={20} />,
      description: 'App preferences & configuration',
      route: '/settings',
      color: 'from-gray-500 to-slate-600',
      badge: null
    },
    {
      id: 'upgrade',
      title: 'Upgrade',
      icon: <Star size={20} />,
      description: 'Tier management & premium features',
      route: '/upgrade-platinum',
      color: 'from-yellow-500 to-amber-600',
      badge: 'Premium'
    }
  ];

  // 🎯 Core Features
  const coreFeatures = [
    {
      id: 'journaling',
      title: 'Journaling Interface',
      icon: <BookOpen size={24} />,
      description: 'Rich editors, voice input, theme visualization',
      route: '/journaling',
      color: 'from-purple-500 to-violet-600',
      features: ['Rich Text Editor', 'Voice Input', 'MBTI Themes']
    },
    {
      id: 'wellness',
      title: 'Wellness Dashboard',
      icon: <Heart size={24} />,
      description: 'Radar charts, Likert scales, progress indicators',
      route: '/wellness-dashboard',
      color: 'from-green-500 to-emerald-600',
      features: ['Radar Charts', '9 Levensgebieden', 'Progress Tracking']
    },
    {
      id: 'ai-coaching',
      title: 'AI Coaching',
      icon: <Bot size={24} />,
      description: 'Chat interfaces, progress tracking, goal setting',
      route: '/ai-buddy',
      color: 'from-orange-500 to-red-600',
      features: ['Therapeut', 'Coach', 'Goal Setting']
    }
  ];

  // ⚡ Quick Actions
  const quickActions = [
    {
      id: 'challenges',
      title: 'Challenges',
      icon: <Target size={18} />,
      description: 'Persoonlijke uitdagingen en doelen',
      route: '/challenges',
      count: 3,
      color: 'bg-blue-500'
    },
    {
      id: 'chat',
      title: 'Chat',
      icon: <MessageSquare size={18} />,
      description: 'Direct personal messaging',
      route: '/chat',
      count: 2,
      color: 'bg-green-500'
    },
    {
      id: 'communities',
      title: "Community's",
      icon: <Users size={18} />,
      description: 'Discourse community toegang',
      route: '/communities',
      count: 5,
      color: 'bg-purple-500'
    }
  ];

  const handleNavigate = (route: string) => {
    navigate(route);
  };

  const handleQuickAction = (actionId: string, route: string) => {
    setActiveQuickAction(actionId);
    setTimeout(() => {
      navigate(route);
      setActiveQuickAction(null);
    }, 200);
  };

  return (
    <div className="min-h-screen">
      {/* Header met Core Navigation */}
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welkom terug, {userName}! 
            </h1>
            <p className="text-gray-300">
              🏠 Streamlined MainView - Perfect Balance voor {mbtiType}
            </p>
            <div className="text-sm text-gray-400 mt-2">
              👈 Swipe links naar Active Imagination | Swipe rechts naar Back to Basics 👉
            </div>
            <div className="mt-4">
              <Button
                onClick={() => navigate('/')}
                className="bg-gray-600 text-white text-sm"
                size="sm"
              >
                ← Terug naar Classic MainView
              </Button>
            </div>
          </div>

          {/* 🧭 Core Navigation */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              🧭 Core Navigation
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {coreNavigation.map((nav) => (
                <Card
                  key={nav.id}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 transition-all cursor-pointer"
                  onClick={() => handleNavigate(nav.route)}
                >
                  <CardBody className="p-4 text-center">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${nav.color} flex items-center justify-center mx-auto mb-3`}>
                      {nav.icon}
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{nav.title}</h3>
                      {nav.badge && (
                        <Badge color="warning" size="sm">{nav.badge}</Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-300">{nav.description}</p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 🎯 Core Features */}
      <div className="max-w-6xl mx-auto px-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          🎯 Core Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coreFeatures.map((feature) => (
            <Card
              key={feature.id}
              className="bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 transition-all cursor-pointer hover:scale-105"
              onClick={() => handleNavigate(feature.route)}
            >
              <CardBody className="p-6">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mx-auto mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white text-center mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-300 text-center mb-4">
                  {feature.description}
                </p>
                <div className="space-y-1">
                  {feature.features.map((feat, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs text-gray-400">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      {feat}
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* ⚡ Quick Actions */}
      <div className="max-w-6xl mx-auto px-6 pb-8">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          ⚡ Quick Actions
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Card
              key={action.id}
              className={`bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 transition-all cursor-pointer ${
                activeQuickAction === action.id ? 'scale-95' : 'hover:scale-105'
              }`}
              onClick={() => handleQuickAction(action.id, action.route)}
            >
              <CardBody className="p-4 text-center">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mx-auto mb-3`}>
                    {action.icon}
                  </div>
                  {action.count > 0 && (
                    <Badge 
                      color="danger" 
                      size="sm"
                      className="absolute -top-1 -right-1"
                    >
                      {action.count}
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold text-white text-sm mb-1">
                  {action.title}
                </h3>
                <p className="text-xs text-gray-300">
                  {action.description}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* Feature Access Cards */}
      <div className="max-w-6xl mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Active Imagination Access */}
          <Card 
            className="bg-gradient-to-r from-purple-900/30 to-pink-800/30 border border-purple-500/20 cursor-pointer hover:scale-105 transition-all"
            onClick={() => navigate('/active-imagination')}
          >
            <CardBody className="p-6 text-center">
              <div className="text-4xl mb-3">🎨</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Active Imagination
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Deep work, verbeelding en creativiteit met AI coaching
              </p>
              <Button 
                className="bg-purple-600 text-white"
                size="sm"
              >
                → Start Sessie
              </Button>
            </CardBody>
          </Card>

          {/* Back to Basics Access */}
          <Card 
            className="bg-gradient-to-r from-green-900/30 to-emerald-800/30 border border-green-500/20 cursor-pointer hover:scale-105 transition-all"
            onClick={() => navigate('/back-to-basics')}
          >
            <CardBody className="p-6 text-center">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Back to Basics
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                9 Levensgebieden management en content discovery
              </p>
              <Button 
                className="bg-green-600 text-white"
                size="sm"
              >
                → Verken Gebieden
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StreamlinedMainView;