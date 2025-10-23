import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import database from '../database';
import { logger } from '../utils/logger';
import ActiveImaginationEditor from './ai/ActiveImaginationEditor';
import ActiveImaginationBoundary from './ai/ActiveImaginationBoundary';
import { useFeatureParallax } from './parallax/FeatureParallaxManager';
import { useSwipeNavigation } from '../hooks/useSwipeNavigation';

interface ActiveImaginationPageProps {
  onBack?: () => void;
}

interface SessionSummary {
  id: string;
  title: string;
  date: string;
  duration: number;
  messageCount: number;
  mbtiType: string;
  summary: string;
}

const ActiveImaginationPage: React.FC<ActiveImaginationPageProps> = ({ onBack }) => {
  const { userData } = useAppStore();
  const [currentView, setCurrentView] = useState<'main' | 'editor' | 'history' | 'insights' | 'levensboom'>('main');
  const [sessionHistory, setSessionHistory] = useState<SessionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [mbtiType, setMbtiType] = useState<string>('INFP');

  // Set feature parallax voor imagination achtergrond
  const { setFeature } = useFeatureParallax();
  
  // Swipe navigation - bidirectional
  useSwipeNavigation({
    swipeRight: '/',        // > gesture terug naar mainview
    swipeLeft: '/basics',   // < gesture naar Back to Basics
    enabled: true,
    sensitivity: 100
  });

  useEffect(() => {
    // Set imagination achtergrond
    setFeature('active-imagination');
  }, [setFeature]);

  useEffect(() => {
    if (userData?.mbtiType) {
      setMbtiType(userData.mbtiType);
    }
    loadSessionHistory();
  }, [userData]);

  const loadSessionHistory = async () => {
    setIsLoading(true);
    try {
      // Load session history from database
      const sessions = await database.read(async () => {
        // This would query actual session data
        // For now, return mock data
        return [
          {
            id: 'session_1',
            title: 'Eerste Verbeeldingssessie',
            date: new Date().toISOString(),
            duration: 15,
            messageCount: 8,
            mbtiType: mbtiType,
            summary: 'Een diepgaande verkenning van innerlijke creativiteit en zelfbewustzijn.'
          },
          {
            id: 'session_2', 
            title: 'Emotionele Reflectie',
            date: new Date(Date.now() - 86400000).toISOString(),
            duration: 22,
            messageCount: 12,
            mbtiType: mbtiType,
            summary: 'Verkenning van emotionele patronen en persoonlijke groei.'
          }
        ];
      });
      setSessionHistory(sessions);
    } catch (error) {
      logger.error('Error loading session history', { error });
    } finally {
      setIsLoading(false);
    }
  };

  const startNewSession = () => {
    setSelectedSession(null);
    setCurrentView('editor');
  };

  const continueSession = (sessionId: string) => {
    setSelectedSession(sessionId);
    setCurrentView('editor');
  };

  const getMBTICoachingStyle = (mbti: string) => {
    const styles: { [key: string]: { title: string; description: string; color: string; icon: string } } = {
      'INTJ': { title: 'Strategische Verbeelding', description: 'Diepgaande analyse en toekomstvisie', color: 'blue', icon: '🎯' },
      'INTP': { title: 'Conceptuele Verbeelding', description: 'Abstracte ideeën en theorieën', color: 'purple', icon: '🧠' },
      'ENTJ': { title: 'Leiderschapsverbeelding', description: 'Visie en strategische planning', color: 'red', icon: '👑' },
      'ENTP': { title: 'Innovatieve Verbeelding', description: 'Creatieve oplossingen en mogelijkheden', color: 'orange', icon: '💡' },
      'INFJ': { title: 'Intuïtieve Verbeelding', description: 'Diep inzicht en empathie', color: 'green', icon: '🔮' },
      'INFP': { title: 'Creatieve Verbeelding', description: 'Artistieke expressie en waarden', color: 'pink', icon: '🎨' },
      'ENFJ': { title: 'Inspirerende Verbeelding', description: 'Menselijke verbinding en groei', color: 'teal', icon: '🌟' },
      'ENFP': { title: 'Enthousiaste Verbeelding', description: 'Energie en nieuwe mogelijkheden', color: 'yellow', icon: '✨' },
      'ISTJ': { title: 'Praktische Verbeelding', description: 'Gestructureerde reflectie en planning', color: 'gray', icon: '📋' },
      'ISFJ': { title: 'Zorgzame Verbeelding', description: 'Empathie en ondersteuning', color: 'rose', icon: '🤗' },
      'ESTJ': { title: 'Organisatorische Verbeelding', description: 'Efficiëntie en resultaten', color: 'indigo', icon: '📊' },
      'ESFJ': { title: 'Sociale Verbeelding', description: 'Gemeenschap en harmonie', color: 'emerald', icon: '👥' },
      'ISTP': { title: 'Analytische Verbeelding', description: 'Praktische oplossingen en vaardigheden', color: 'slate', icon: '🔧' },
      'ISFP': { title: 'Artistieke Verbeelding', description: 'Esthetiek en persoonlijke expressie', color: 'fuchsia', icon: '🌸' },
      'ESTP': { title: 'Actieve Verbeelding', description: 'Energie en directe actie', color: 'amber', icon: '⚡' },
      'ESFP': { title: 'Expressieve Verbeelding', description: 'Vreugde en sociale interactie', color: 'lime', icon: '🎭' }
    };
    return styles[mbti] || styles['INFP'];
  };

  const coachingStyle = getMBTICoachingStyle(mbtiType);

  if (currentView === 'editor') {
    return (
      <ActiveImaginationBoundary>
        <div className="min-h-screen">
          <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setCurrentView('main')}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all hover:scale-105 active:scale-95"
              >
                <span>←</span>
                <span>Terug</span>
              </button>
              
              <div className="text-center">
                <h1 className="text-2xl font-bold text-white">{coachingStyle.title}</h1>
                <p className="text-gray-300">{coachingStyle.description}</p>
              </div>
              
              <div className="w-24"></div> {/* Spacer */}
            </div>

            {/* Editor */}
            <ActiveImaginationEditor 
              userId={userData?.userId || 'temp_user'}
              mbtiType={mbtiType}
            />
          </div>
        </div>
      </ActiveImaginationBoundary>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-6 animate-fade-in">
            <div className="text-6xl mb-4">{coachingStyle.icon}</div>
            <h1 className="text-4xl font-bold text-white mb-2">{coachingStyle.title}</h1>
            <p className="text-xl text-gray-300">{coachingStyle.description}</p>
            <p className="text-sm text-gray-400 mt-2">MBTI Type: {mbtiType}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8 animate-fade-in-delay">
          <div className="glass rounded-xl p-2">
            <div className="flex space-x-2">
              {[
                { id: 'main', label: 'Overzicht', icon: '🏠' },
                { id: 'history', label: 'Geschiedenis', icon: '📚' },
                { id: 'insights', label: 'Inzichten', icon: '💡' },
                { id: 'levensboom', label: 'Levensboom', icon: '🌳' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentView(tab.id as any)}
                  className={`px-4 py-2 rounded-lg transition-all hover:scale-105 active:scale-95 ${
                    currentView === tab.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {currentView === 'main' && (
            <div key="main" className="animate-slide-in-left">
              {/* Quick Start */}
              <div className="glass rounded-xl p-6">
                <h2 className="text-2xl font-semibold text-white mb-4">Start Nieuwe Sessie</h2>
                <p className="text-gray-300 mb-6">
                  Begin een nieuwe verbeeldingssessie met je persoonlijke AI-coach. 
                  Je coach is afgestemd op je {mbtiType} persoonlijkheid en helpt je bij diepgaande reflectie en creatieve exploratie.
                </p>
                <button
                  onClick={startNewSession}
                  className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-lg transition-all hover:scale-105 active:scale-95"
                >
                  🚀 Start Nieuwe Verbeeldingssessie
                </button>
              </div>

              {/* Recent Sessions */}
              <div className="glass rounded-xl p-6">
                <h2 className="text-2xl font-semibold text-white mb-4">Recente Sessies</h2>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                    <p className="text-gray-300 mt-2">Laden...</p>
                  </div>
                ) : sessionHistory.length > 0 ? (
                  <div className="space-y-3">
                    {sessionHistory.slice(0, 3).map((session) => (
                      <div
                        key={session.id}
                        className="p-4 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-all hover:scale-102"
                        onClick={() => continueSession(session.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-white">{session.title}</h3>
                            <p className="text-sm text-gray-300">{session.summary}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(session.date).toLocaleDateString()} • {session.duration} min • {session.messageCount} berichten
                            </p>
                          </div>
                          <span className="text-2xl">→</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">Nog geen sessies. Start je eerste verbeeldingssessie!</p>
                )}
              </div>

              {/* MBTI Insights */}
              <div className="glass rounded-xl p-6">
                <h2 className="text-2xl font-semibold text-white mb-4">Jouw Verbeeldingsstijl</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-white mb-2">Sterke Punten</h3>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Diepgaande introspectie</li>
                      <li>• Creatieve probleemoplossing</li>
                      <li>• Emotionele intelligentie</li>
                      <li>• Intuïtieve inzichten</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-2">Ontwikkelingsgebieden</h3>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Praktische toepassing</li>
                      <li>• Structuur en planning</li>
                      <li>• Actie ondernemen</li>
                      <li>• Externe feedback</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === 'history' && (
            <div key="history" className="animate-slide-in-left">
              <div className="glass rounded-xl p-6">
                <h2 className="text-2xl font-semibold text-white mb-6">Sessie Geschiedenis</h2>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                    <p className="text-gray-300 mt-2">Laden...</p>
                  </div>
                ) : sessionHistory.length > 0 ? (
                  <div className="space-y-4">
                    {sessionHistory.map((session) => (
                      <div
                        key={session.id}
                        className="p-4 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-all hover:scale-102"
                        onClick={() => continueSession(session.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-white">{session.title}</h3>
                            <p className="text-sm text-gray-300 mt-1">{session.summary}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                              <span>📅 {new Date(session.date).toLocaleDateString()}</span>
                              <span>⏱️ {session.duration} min</span>
                              <span>💬 {session.messageCount} berichten</span>
                              <span>🧠 {session.mbtiType}</span>
                            </div>
                          </div>
                          <span className="text-2xl ml-4">→</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">Nog geen sessies beschikbaar.</p>
                )}
              </div>
            </div>
          )}

          {currentView === 'insights' && (
            <div key="insights" className="animate-slide-in-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Progress Overview */}
                <div className="glass rounded-xl p-6">
                  <h2 className="text-2xl font-semibold text-white mb-4">Voortgang Overzicht</h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-300 mb-1">
                        <span>Totale Sessies</span>
                        <span>{sessionHistory.length}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-purple-400 h-2 rounded-full" style={{ width: `${Math.min(100, sessionHistory.length * 10)}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-gray-300 mb-1">
                        <span>Totale Tijd</span>
                        <span>{sessionHistory.reduce((acc, s) => acc + s.duration, 0)} min</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-400 h-2 rounded-full" style={{ width: `${Math.min(100, sessionHistory.reduce((acc, s) => acc + s.duration, 0) / 10)}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* MBTI Insights */}
                <div className="glass rounded-xl p-6">
                  <h2 className="text-2xl font-semibold text-white mb-4">MBTI Inzichten</h2>
                  <div className="space-y-3">
                    <div className="p-3 bg-white/5 rounded-lg">
                      <h3 className="font-medium text-white">Verbeeldingsstijl</h3>
                      <p className="text-sm text-gray-300">{coachingStyle.description}</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <h3 className="font-medium text-white">Aanbevolen Focus</h3>
                      <p className="text-sm text-gray-300">Diepgaande introspectie en creatieve expressie</p>
                    </div>
                  </div>
                </div>

                {/* Recent Insights */}
                <div className="glass rounded-xl p-6 md:col-span-2">
                  <h2 className="text-2xl font-semibold text-white mb-4">Recente Inzichten</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-lg">
                      <h3 className="font-medium text-white mb-2">🎨 Creativiteit</h3>
                      <p className="text-sm text-gray-300">Je toont sterke creatieve impulsen in je verbeeldingssessies.</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg">
                      <h3 className="font-medium text-white mb-2">💭 Introspectie</h3>
                      <p className="text-sm text-gray-300">Diepgaande reflectie op persoonlijke waarden en doelen.</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg">
                      <h3 className="font-medium text-white mb-2">🌱 Groei</h3>
                      <p className="text-sm text-gray-300">Consistente ontwikkeling van zelfbewustzijn en empathie.</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg">
                      <h3 className="font-medium text-white mb-2">🔮 Intuïtie</h3>
                      <p className="text-sm text-gray-300">Sterke intuïtieve inzichten en toekomstvisie.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === 'levensboom' && (
            <div key="levensboom" className="animate-slide-in-left">
              <div className="glass rounded-xl p-6">
                <h2 className="text-2xl font-semibold text-white mb-6">🌳 Universele Levensboom</h2>
                <p className="text-gray-300 mb-6">
                  Integreer je verbeeldingssessies met de wijsheid van de Universele Levensboom. 
                  Gebruik DeepSeek AI om diepere verbindingen te ontdekken tussen je creativiteit en de 7 universele domeinen.
                </p>
                
                {/* Levensboom Integration Card */}
                <div className="bg-gradient-to-r from-green-900/30 to-emerald-800/30 rounded-xl p-6 border border-green-500/20 mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl">🌳</div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">AI-Gestuurde Inzichten</h3>
                      <p className="text-green-300">Verbind je verbeelding met universele patronen</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-black/20 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">🎨 Creatieve Synthese</h4>
                      <p className="text-sm text-gray-300">
                        Laat DeepSeek je verbeeldingssessies analyseren en verbindingen leggen met spirituele groei.
                      </p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">🧠 Domein Mapping</h4>
                      <p className="text-sm text-gray-300">
                        Ontdek hoe je creatieve inzichten zich verhouden tot de 7 universele levensdomeinen.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => window.open('/universele-levensboom', '_blank')}
                    className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold transition-all hover:scale-105 active:scale-95"
                  >
                    🌳 Open Universele Levensboom
                  </button>
                </div>

                {/* Integration Tips */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">💡 Integratie Tips</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      {
                        icon: "🔮",
                        title: "Verbeelding → Wijsheid",
                        tip: "Vraag DeepSeek hoe je verbeeldingssessies bijdragen aan spirituele groei"
                      },
                      {
                        icon: "🎭",
                        title: "Creativiteit → Doel",
                        tip: "Onderzoek de verbinding tussen je creatieve expressie en levensmissie"
                      },
                      {
                        icon: "🌊",
                        title: "Emotie → Inzicht",
                        tip: "Laat AI patronen ontdekken in je emotionele verbeeldingsreizen"
                      },
                      {
                        icon: "🌟",
                        title: "Intuïtie → Actie",
                        tip: "Vertaal intuïtieve inzichten naar concrete groei-acties via DeepSeek"
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                        <span className="text-lg">{item.icon}</span>
                        <div>
                          <h4 className="font-medium text-white">{item.title}</h4>
                          <p className="text-sm text-gray-300">{item.tip}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Back Button */}
        {onBack && (
          <div className="text-center mt-8 animate-fade-in-delay">
            <button
              onClick={onBack}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all hover:scale-105 active:scale-95"
            >
              ← Terug naar Hoofdmenu
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveImaginationPage;
