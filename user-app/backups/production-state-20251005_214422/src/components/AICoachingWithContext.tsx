import React, { useState, useEffect } from 'react';
import { Card, CardBody, Button, Textarea } from '@nextui-org/react';
import { useAppStore } from '../store/useAppStore';
import { logger } from '../utils/logger';
import HogerZelfAIService from '../services/hogerZelfAIService';

interface CoachingContext {
  recentContent: string[];
  currentMood: string;
  goals: string[];
  challenges: string[];
  mbtiInsights: string[];
}

interface AICoachingWithContextProps {
  userId: string;
  mbtiType: string;
}

const AICoachingWithContext: React.FC<AICoachingWithContextProps> = ({
  userId,
  mbtiType
}) => {
  const { userData } = useAppStore();
  const [coachingContext, setCoachingContext] = useState<CoachingContext>({
    recentContent: [],
    currentMood: '',
    goals: [],
    challenges: [],
    mbtiInsights: []
  });
  const [userMessage, setUserMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [coachingHistory, setCoachingHistory] = useState<Array<{
    id: string;
    type: 'user' | 'ai';
    message: string;
    timestamp: string;
    context?: string;
  }>>([]);

  useEffect(() => {
    loadCoachingContext();
    loadCoachingHistory();
  }, [userId, mbtiType]);

  const loadCoachingContext = async () => {
    try {
      // Mock context data - later vervangen door echte database queries
      const mockContext: CoachingContext = {
        recentContent: [
          'Mindfulness oefening voltooid',
          'Creatieve journaling sessie',
          'MBTI zelfreflectie oefening'
        ],
        currentMood: 'Gefocust en creatief',
        goals: [
          'Emotionele intelligentie ontwikkelen',
          'Creativiteit versterken',
          'Zelfbewustzijn vergroten'
        ],
        challenges: [
          'Grenzen stellen aan anderen',
          'Perfectionisme overwinnen',
          'Energie balanceren'
        ],
        mbtiInsights: [
          'INFP: Sterke waarden en creativiteit',
          'Natuurlijke empathie en intuïtie',
          'Behoefte aan authenticiteit en betekenis'
        ]
      };
      setCoachingContext(mockContext);
    } catch (error) {
      logger.error('Error loading coaching context', { error });
    }
  };

  const loadCoachingHistory = async () => {
    try {
      // Mock coaching history
      const mockHistory = [
        {
          id: 'msg_1',
          type: 'ai' as const,
          message: 'Hallo! Ik zie dat je recent een mindfulness oefening hebt voltooid. Hoe voel je je daarna?',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          context: 'Mindfulness follow-up'
        },
        {
          id: 'msg_2',
          type: 'user' as const,
          message: 'Ik voel me meer gefocust en rustig. Het hielp me om mijn gedachten te ordenen.',
          timestamp: new Date(Date.now() - 3500000).toISOString()
        },
        {
          id: 'msg_3',
          type: 'ai' as const,
          message: 'Dat is geweldig! Als INFP kun je baat hebben bij regelmatige mindfulness. Wil je een specifieke oefening proberen voor je creativiteit?',
          timestamp: new Date(Date.now() - 3400000).toISOString(),
          context: 'Creativiteit coaching'
        }
      ];
      setCoachingHistory(mockHistory);
    } catch (error) {
      logger.error('Error loading coaching history', { error });
    }
  };

  const sendMessage = async () => {
    if (!userMessage.trim()) return;

    setIsLoading(true);
    const userMsg = {
      id: `msg_${Date.now()}`,
      type: 'user' as const,
      message: userMessage,
      timestamp: new Date().toISOString()
    };

    setCoachingHistory(prev => [...prev, userMsg]);
    setUserMessage('');

    try {
      // Gebruik Hogere Zelf AI voor diepere begeleiding
      const aiResponse = await generateAIResponse(userMessage, coachingContext, mbtiType);
      const aiMsg = {
        id: `msg_${Date.now() + 1}`,
        type: 'ai' as const,
        message: aiResponse,
        timestamp: new Date().toISOString(),
        context: 'Hogere Zelf AI Coaching'
      };

      setCoachingHistory(prev => [...prev, aiMsg]);
    } catch (error) {
      logger.error('Error sending message', { error });
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = async (userMessage: string, context: CoachingContext, mbtiType: string): Promise<string> => {
    try {
      // Gebruik Hogere Zelf AI voor diepere, archetypische begeleiding
      const hogerZelfAI = HogerZelfAIService.getInstance();
      const response = await hogerZelfAI.orchestrateHogerZelfResponse(context, mbtiType, userMessage);
      return response;
    } catch (error) {
      logger.error('Hoger Zelf AI response failed, using fallback', { error });
      
      // Fallback naar eenvoudige responses
      const responses = [
        `Als ${mbtiType} begrijp ik je uitdaging. Gezien je recente focus op ${context.recentContent[0]}, zou ik je willen vragen: wat is je grootste prioriteit op dit moment?`,
        `Interessant! Je ${mbtiType} persoonlijkheid helpt me te begrijpen waarom je dit zo ervaart. Laten we dit verder verkennen.`,
        `Ik zie een patroon in je verhaal dat typisch is voor ${mbtiType} types. Hoe voel je je over deze situatie?`,
        `Gebaseerd op je doelen om ${context.goals[0]} te ontwikkelen, denk ik dat we hier een mooie kans hebben. Wat denk je?`,
        `Je uitdaging met ${context.challenges[0]} is herkenbaar voor veel ${mbtiType} types. Laten we een strategie bedenken.`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  };

  const getMBTICoachingStyle = (mbti: string) => {
    const styles: { [key: string]: { title: string; description: string; color: string } } = {
      'INFP': { title: 'Waarden-Gerichte Coaching', description: 'Focus op authenticiteit en persoonlijke groei', color: 'purple' },
      'INTJ': { title: 'Strategische Coaching', description: 'Systematische aanpak voor doelen', color: 'blue' },
      'ENFP': { title: 'Energie-Gerichte Coaching', description: 'Inspirerende en motiverende aanpak', color: 'orange' },
      'INFJ': { title: 'Intuïtieve Coaching', description: 'Diepgaande inzichten en empathie', color: 'green' }
    };
    return styles[mbti] || styles['INFP'];
  };

  const coachingStyle = getMBTICoachingStyle(mbtiType);

  return (
    <div className="glass rounded-xl p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white mb-2">AI Coaching met Context</h2>
        <p className="text-gray-300 text-sm">
          {coachingStyle.title} - {coachingStyle.description}
        </p>
      </div>

      {/* Context Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="bg-white/5 border border-white/10">
          <CardBody className="p-4">
            <h3 className="font-medium text-white mb-2">📊 Huidige Context</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-400">Mood:</span>
                <span className="text-white ml-2">{coachingContext.currentMood}</span>
              </div>
              <div>
                <span className="text-gray-400">Recent:</span>
                <span className="text-white ml-2">{coachingContext.recentContent[0]}</span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white/5 border border-white/10">
          <CardBody className="p-4">
            <h3 className="font-medium text-white mb-2">🎯 Actieve Doelen</h3>
            <div className="space-y-1 text-sm">
              {coachingContext.goals.slice(0, 2).map((goal, index) => (
                <div key={index} className="text-gray-300">
                  • {goal}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Chat History */}
      <div className="mb-6">
        <h3 className="font-medium text-white mb-3">Coaching Gesprek</h3>
        <div className="max-h-64 overflow-y-auto space-y-3">
          {coachingHistory.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg ${
                  msg.type === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-gray-300'
                }`}
              >
                <p className="text-sm">{msg.message}</p>
                {msg.context && (
                  <p className="text-xs opacity-70 mt-1">{msg.context}</p>
                )}
                <p className="text-xs opacity-50 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/10 text-gray-300 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span className="text-sm">AI denkt na...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Message Input */}
      <div className="flex space-x-3">
        <Textarea
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Stel je vraag of deel je gedachten..."
          className="flex-1"
          minRows={1}
          maxRows={3}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <Button
          color="primary"
          variant="solid"
          onClick={sendMessage}
          disabled={!userMessage.trim() || isLoading}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Verstuur
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="bordered"
          className="border-purple-400 text-purple-400 hover:bg-purple-400/10"
          onClick={() => setUserMessage('Ik wil werken aan mijn creativiteit')}
        >
          🎨 Creativiteit
        </Button>
        <Button
          size="sm"
          variant="bordered"
          className="border-purple-400 text-purple-400 hover:bg-purple-400/10"
          onClick={() => setUserMessage('Hoe kan ik beter grenzen stellen?')}
        >
          🛡️ Grenzen
        </Button>
        <Button
          size="sm"
          variant="bordered"
          className="border-purple-400 text-purple-400 hover:bg-purple-400/10"
          onClick={() => setUserMessage('Ik voel me overweldigd')}
        >
          😰 Emoties
        </Button>
      </div>
    </div>
  );
};

export default AICoachingWithContext;
