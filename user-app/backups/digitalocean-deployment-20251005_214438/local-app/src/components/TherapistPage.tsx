import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Chip, Progress, Input, Textarea } from '@nextui-org/react';
import { 
  ArrowLeft, 
  Home, 
  Brain, 
  Heart, 
  Users, 
  Video, 
  MessageCircle, 
  Star, 
  MapPin, 
  Clock,
  Filter,
  Search,
  Send
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { logger } from '../utils/logger';
import AICoachingWithContext from './AICoachingWithContext';

interface Therapist {
  id: string;
  name: string;
  specialty: string;
  mbtiSpecialization: string[];
  rating: number;
  experience: number;
  location: string;
  online: boolean;
  price: number;
  description: string;
  image: string;
  languages: string[];
  availability: string;
}

interface TherapySession {
  id: string;
  type: 'ai' | 'human';
  title: string;
  description: string;
  duration: number;
  mbtiFocus: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'therapy' | 'coaching' | 'wellness' | 'specialized';
}

const TherapistPage: React.FC = () => {
  const { userData } = useAppStore();
  const [currentView, setCurrentView] = useState<'overview' | 'ai-therapy' | 'find-therapist' | 'sessions'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [therapySessions, setTherapySessions] = useState<TherapySession[]>([]);

  const mbtiType = userData?.mbtiType || 'INFP';
  const userName = userData?.name || 'Gebruiker';

  // Load mock data
  useEffect(() => {
    // Mock therapists data
    const mockTherapists: Therapist[] = [
      {
        id: '1',
        name: 'Dr. Sarah van der Berg',
        specialty: 'Psychotherapie & MBTI Coaching',
        mbtiSpecialization: ['INFP', 'ENFP', 'ISFP', 'ESFP'],
        rating: 4.9,
        experience: 8,
        location: 'Amsterdam',
        online: true,
        price: 120,
        description: 'Gespecialiseerd in creatieve therapie en persoonlijkheidsontwikkeling voor gevoelige types.',
        image: '👩‍⚕️',
        languages: ['Nederlands', 'Engels'],
        availability: 'Ma-Vr 9:00-17:00'
      },
      {
        id: '2',
        name: 'Mark de Vries',
        specialty: 'Life Coaching & Persoonlijke Groei',
        mbtiSpecialization: ['INTJ', 'ENTJ', 'INTP', 'ENTP'],
        rating: 4.8,
        experience: 12,
        location: 'Utrecht',
        online: true,
        price: 100,
        description: 'Expert in strategische planning en persoonlijke ontwikkeling voor analytische types.',
        image: '👨‍💼',
        languages: ['Nederlands'],
        availability: 'Ma-Do 10:00-18:00'
      },
      {
        id: '3',
        name: 'Lisa Chen',
        specialty: 'Mindfulness & Emotionele Intelligentie',
        mbtiSpecialization: ['INFJ', 'ENFJ', 'ISFJ', 'ESFJ'],
        rating: 4.9,
        experience: 6,
        location: 'Rotterdam',
        online: true,
        price: 90,
        description: 'Gespecialiseerd in empathie en sociale vaardigheden voor zorgzame persoonlijkheden.',
        image: '👩‍🎓',
        languages: ['Nederlands', 'Engels', 'Mandarijn'],
        availability: 'Di-Vr 9:00-16:00'
      }
    ];

    // Mock therapy sessions
    const mockSessions: TherapySession[] = [
      {
        id: '1',
        type: 'ai',
        title: 'INFP Emotionele Expressie Sessie',
        description: 'AI-gestuurde sessie voor het ontwikkelen van emotionele expressie en creativiteit.',
        duration: 30,
        mbtiFocus: ['INFP', 'ENFP', 'ISFP'],
        difficulty: 'beginner',
        category: 'therapy'
      },
      {
        id: '2',
        type: 'ai',
        title: 'Grenzen Stellen Workshop',
        description: 'Leer gezonde grenzen stellen met AI-coaching afgestemd op je persoonlijkheidstype.',
        duration: 45,
        mbtiFocus: ['INFP', 'ISFP', 'ENFP', 'ESFP'],
        difficulty: 'intermediate',
        category: 'coaching'
      },
      {
        id: '3',
        type: 'ai',
        title: 'MBTI Stress Management',
        description: 'Persoonlijke stress management technieken gebaseerd op je MBTI type.',
        duration: 25,
        mbtiFocus: ['ALL'],
        difficulty: 'beginner',
        category: 'wellness'
      }
    ];

    setTherapists(mockTherapists);
    setTherapySessions(mockSessions);
  }, [mbtiType]);

  const handleBackToMain = () => {
    window.history.back();
  };

  const getMBTITherapyFocus = (mbti: string) => {
    const focuses: { [key: string]: string } = {
      'INFP': 'Emotionele expressie, creativiteit en authenticiteit',
      'ENFP': 'Energie management, focus en actie ondernemen',
      'INFJ': 'Intuïtie ontwikkelen, visie en leiderschap',
      'ENFJ': 'Empathie balanceren, grenzen en zelfzorg',
      'INTJ': 'Strategische planning, perfectionisme en flexibiliteit',
      'ENTJ': 'Leiderschap, stress management en werk-privé balans',
      'INTP': 'Besluitvorming, sociale vaardigheden en praktische toepassing',
      'ENTP': 'Focus, follow-through en detailgerichtheid'
    };
    return focuses[mbti] || 'Persoonlijke groei en zelfontwikkeling';
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-white mb-2'>
              👨‍⚕️ AI Therapist & Professional Coaching
            </h1>
            <p className='text-gray-300'>
              Welkom {userName}! Ontdek gepersonaliseerde therapie en coaching voor jouw {mbtiType} persoonlijkheidstype
            </p>
          </div>
          <div className='flex gap-3'>
            <Button
              color='secondary'
              variant='bordered'
              startContent={<ArrowLeft />}
              onClick={handleBackToMain}
              className='bg-white/10 border-white/20 text-white hover:bg-white/20'
            >
              Terug
            </Button>
            <Button
              color='primary'
              variant='bordered'
              startContent={<Home />}
              onClick={() => window.location.href = '/'}
              className='bg-white/10 border-white/20 text-white hover:bg-white/20'
            >
              Hoofdmenu
            </Button>
          </div>
        </div>

        {/* MBTI Therapy Focus */}
        <div className='glass rounded-xl p-6 mb-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-xl font-semibold text-white mb-2'>
                🧠 Jouw {mbtiType} Therapie Focus
              </h2>
              <p className='text-gray-300'>
                {getMBTITherapyFocus(mbtiType)}
              </p>
            </div>
            <div className='text-right'>
              <div className='text-2xl font-bold text-purple-400'>{mbtiType}</div>
              <div className='text-sm text-gray-400'>Persoonlijkheidstype</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className='flex justify-center mb-8'>
          <div className='glass rounded-xl p-2'>
            <div className='flex space-x-2'>
              {[
                { id: 'overview', label: 'Overzicht', icon: '🏠' },
                { id: 'ai-therapy', label: 'AI Therapie', icon: '🤖' },
                { id: 'find-therapist', label: 'Vind Therapeut', icon: '👨‍⚕️' },
                { id: 'sessions', label: 'Sessies', icon: '📅' }
              ].map((tab) => (
                <Button
                  key={tab.id}
                  onClick={() => setCurrentView(tab.id as any)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    currentView === tab.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <span className='mr-2'>{tab.icon}</span>
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        {currentView === 'overview' && (
          <div className='space-y-6'>
            {/* Quick Actions */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              <Card className='glass border border-white/10 hover:bg-white/10 transition-all cursor-pointer' onClick={() => setCurrentView('ai-therapy')}>
                <CardBody className='p-6 text-center'>
                  <div className='text-4xl mb-3'>🤖</div>
                  <h3 className='font-semibold text-white mb-2'>AI Therapie</h3>
                  <p className='text-sm text-gray-300'>Directe AI-coaching sessies</p>
                </CardBody>
              </Card>
              <Card className='glass border border-white/10 hover:bg-white/10 transition-all cursor-pointer' onClick={() => setCurrentView('find-therapist')}>
                <CardBody className='p-6 text-center'>
                  <div className='text-4xl mb-3'>👨‍⚕️</div>
                  <h3 className='font-semibold text-white mb-2'>Vind Therapeut</h3>
                  <p className='text-sm text-gray-300'>Professionele begeleiding</p>
                </CardBody>
              </Card>
              <Card className='glass border border-white/10 hover:bg-white/10 transition-all cursor-pointer' onClick={() => setCurrentView('sessions')}>
                <CardBody className='p-6 text-center'>
                  <div className='text-4xl mb-3'>📅</div>
                  <h3 className='font-semibold text-white mb-2'>Sessies</h3>
                  <p className='text-sm text-gray-300'>Geplande afspraken</p>
                </CardBody>
              </Card>
              <Card className='glass border border-white/10 hover:bg-white/10 transition-all cursor-pointer'>
                <CardBody className='p-6 text-center'>
                  <div className='text-4xl mb-3'>📚</div>
                  <h3 className='font-semibold text-white mb-2'>Resources</h3>
                  <p className='text-sm text-gray-300'>Therapie materialen</p>
                </CardBody>
              </Card>
            </div>

            {/* MBTI-Specific Therapy Recommendations */}
            <div className='glass rounded-xl p-6'>
              <h2 className='text-2xl font-semibold text-white mb-4'>
                🎯 Aanbevolen voor {mbtiType}
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='p-4 bg-white/5 rounded-lg'>
                  <h3 className='font-medium text-white mb-2'>Emotionele Expressie</h3>
                  <p className='text-sm text-gray-300'>Leer je gevoelens creatief te uiten en te verwerken.</p>
                </div>
                <div className='p-4 bg-white/5 rounded-lg'>
                  <h3 className='font-medium text-white mb-2'>Grenzen Stellen</h3>
                  <p className='text-sm text-gray-300'>Ontwikkel gezonde grenzen zonder je authenticiteit te verliezen.</p>
                </div>
                <div className='p-4 bg-white/5 rounded-lg'>
                  <h3 className='font-medium text-white mb-2'>Creativiteit & Zelfexpressie</h3>
                  <p className='text-sm text-gray-300'>Verbind je innerlijke wereld met creatieve uitdrukking.</p>
                </div>
                <div className='p-4 bg-white/5 rounded-lg'>
                  <h3 className='font-medium text-white mb-2'>Waarden & Authenticiteit</h3>
                  <p className='text-sm text-gray-300'>Verken je kernwaarden en leef authentiek.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Therapy View */}
        {currentView === 'ai-therapy' && (
          <AICoachingWithContext
            userId={userData?.userId || 'temp_user'}
            mbtiType={mbtiType}
          />
        )}

        {/* Find Therapist View */}
        {currentView === 'find-therapist' && (
          <div className='space-y-6'>
            {/* Search and Filters */}
            <div className='glass rounded-xl p-6'>
              <div className='flex flex-col md:flex-row gap-4 mb-4'>
                <Input
                  placeholder='Zoek therapeuten...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  startContent={<Search className='w-4 h-4' />}
                  className='flex-1'
                />
                <Button
                  color='primary'
                  variant='bordered'
                  startContent={<Filter className='w-4 h-4' />}
                  className='border-purple-400 text-purple-400'
                >
                  Filters
                </Button>
              </div>
            </div>

            {/* Therapists List */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {therapists
                .filter(therapist => 
                  therapist.mbtiSpecialization.includes(mbtiType) || 
                  therapist.mbtiSpecialization.includes('ALL')
                )
                .map((therapist) => (
                <Card key={therapist.id} className='glass border border-white/10 hover:bg-white/10 transition-all'>
                  <CardBody className='p-6'>
                    <div className='flex items-start justify-between mb-4'>
                      <div className='flex items-center space-x-3'>
                        <div className='text-3xl'>{therapist.image}</div>
                        <div>
                          <h3 className='font-semibold text-white'>{therapist.name}</h3>
                          <p className='text-sm text-gray-300'>{therapist.specialty}</p>
                        </div>
                      </div>
                      <div className='text-right'>
                        <div className='flex items-center text-yellow-400'>
                          <Star className='w-4 h-4 mr-1' />
                          {therapist.rating}
                        </div>
                        <div className='text-sm text-gray-400'>{therapist.experience} jaar</div>
                      </div>
                    </div>
                    
                    <p className='text-sm text-gray-300 mb-4'>{therapist.description}</p>
                    
                    <div className='space-y-2 mb-4'>
                      <div className='flex items-center text-sm text-gray-400'>
                        <MapPin className='w-4 h-4 mr-2' />
                        {therapist.location}
                      </div>
                      <div className='flex items-center text-sm text-gray-400'>
                        <Clock className='w-4 h-4 mr-2' />
                        {therapist.availability}
                      </div>
                      <div className='flex items-center text-sm text-gray-400'>
                        <Video className='w-4 h-4 mr-2' />
                        {therapist.online ? 'Online beschikbaar' : 'Alleen offline'}
                      </div>
                    </div>

                    <div className='flex items-center justify-between'>
                      <div className='text-lg font-bold text-white'>€{therapist.price}/uur</div>
                      <Button
                        color='primary'
                        variant='solid'
                        size='sm'
                        className='bg-purple-600 hover:bg-purple-700'
                      >
                        Boek Sessie
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Sessions View */}
        {currentView === 'sessions' && (
          <div className='space-y-6'>
            <div className='glass rounded-xl p-6'>
              <h2 className='text-2xl font-semibold text-white mb-4'>
                📅 Therapie Sessies
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {therapySessions
                  .filter(session => 
                    session.mbtiFocus.includes(mbtiType) || 
                    session.mbtiFocus.includes('ALL')
                  )
                  .map((session) => (
                  <Card key={session.id} className='glass border border-white/10 hover:bg-white/10 transition-all'>
                    <CardBody className='p-4'>
                      <div className='flex items-start justify-between mb-3'>
                        <div>
                          <h3 className='font-semibold text-white'>{session.title}</h3>
                          <p className='text-sm text-gray-300'>{session.description}</p>
                        </div>
                        <div className='text-right'>
                          <div className='text-sm text-gray-400'>{session.duration} min</div>
                          <Chip
                            size='sm'
                            variant='flat'
                            className='bg-white/10 text-white'
                          >
                            {session.difficulty}
                          </Chip>
                        </div>
                      </div>
                      <Button
                        color='primary'
                        variant='solid'
                        size='sm'
                        className='w-full bg-purple-600 hover:bg-purple-700'
                      >
                        Start Sessie
                      </Button>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Service Types Preview */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <Card className='bg-white/10 backdrop-blur-xl border border-white/20 text-white'>
            <CardHeader>
              <h3 className='text-xl font-bold flex items-center gap-2'>
                👤 Psychotherapie
              </h3>
            </CardHeader>
            <CardBody>
              <p className='text-white/80'>
                Professionele therapie voor mentale gezondheid en welzijn.
              </p>
            </CardBody>
          </Card>

          <Card className='bg-white/10 backdrop-blur-xl border border-white/20 text-white'>
            <CardHeader>
              <h3 className='text-xl font-bold flex items-center gap-2'>
                💬 Life Coaching
              </h3>
            </CardHeader>
            <CardBody>
              <p className='text-white/80'>
                Persoonlijke begeleiding voor doelen en persoonlijke groei.
              </p>
            </CardBody>
          </Card>

          <Card className='bg-white/10 backdrop-blur-xl border border-white/20 text-white'>
            <CardHeader>
              <h3 className='text-xl font-bold flex items-center gap-2'>
                📅 Online Sessies
              </h3>
            </CardHeader>
            <CardBody>
              <p className='text-white/80'>
                Flexibele online begeleiding vanuit je eigen omgeving.
              </p>
            </CardBody>
          </Card>

          <Card className='bg-white/10 backdrop-blur-xl border border-white/20 text-white'>
            <CardHeader>
              <h3 className='text-xl font-bold flex items-center gap-2'>
                ⭐ MBTI Specialisten
              </h3>
            </CardHeader>
            <CardBody>
              <p className='text-white/80'>
                Coaches gespecialiseerd in persoonlijkheidstype ontwikkeling.
              </p>
            </CardBody>
          </Card>

          <Card className='bg-white/10 backdrop-blur-xl border border-white/20 text-white'>
            <CardHeader>
              <h3 className='text-xl font-bold flex items-center gap-2'>
                📍 Lokale Praktijken
              </h3>
            </CardHeader>
            <CardBody>
              <p className='text-white/80'>
                Therapeuten en coaches in jouw buurt.
              </p>
            </CardBody>
          </Card>

          <Card className='bg-white/10 backdrop-blur-xl border border-white/20 text-white'>
            <CardHeader>
              <h3 className='text-xl font-bold flex items-center gap-2'>
                ❤️ Wellness Coaches
              </h3>
            </CardHeader>
            <CardBody>
              <p className='text-white/80'>
                Specialisten in holistische gezondheid en welzijn.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>{' '}
      {/* Sluit content container */}
    </div>
  );
};

export default TherapistPage;
