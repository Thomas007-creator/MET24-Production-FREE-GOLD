import React, { useRef, useEffect } from 'react';
import { Card, CardBody, CardHeader, Textarea, Button } from '@nextui-org/react';
import { Brain, Send } from 'lucide-react';

// Providers
import { SessionProvider, useSession } from './SessionProvider';
import { ChatProvider, useChat } from './ChatProvider';
import { MBTIConfigProvider, useMBTIConfig } from './MBTIConfigProvider';
import { MoodProvider } from './MoodProvider';
import { FocusAreaProvider } from './FocusAreaProvider';

// Components
import { ChatMessage } from './ChatMessage';
import { CoachingSetup } from './CoachingSetup';
import { SessionRating } from './SessionRating';
import { WelcomeScreen } from './WelcomeScreen';

const ChatInterface: React.FC = () => {
  const { currentSession, rateSession } = useSession();
  const { messages, userInput, setUserInput, sendMessage, isTyping } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!currentSession) return null;

  return (
    <div className="space-y-4">
      {/* Chat Messages */}
      <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
        <CardBody className="p-4 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onFollowUpClick={setUserInput}
              />
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    <span className="text-gray-300 text-sm">Coach denkt na...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </CardBody>
      </Card>

      {/* Input Area */}
      <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
        <CardBody className="p-4">
          <div className="flex gap-2">
            <Textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type je vraag of situatie hier... (Enter om te verzenden, Shift+Enter voor nieuwe regel)"
              className="flex-1"
              minRows={1}
              maxRows={4}
              disabled={isTyping}
            />
            <Button
              color="primary"
              isIconOnly
              onClick={sendMessage}
              disabled={!userInput.trim() || isTyping}
              className="self-end"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Session Rating */}
          {currentSession.messages.length > 2 && (
            <div className="mt-3">
              <SessionRating
                currentRating={currentSession.effectiveness}
                onRate={rateSession}
              />
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

const AICoachingInterface: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20 mb-6">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">AI MBTI Coach</h1>
                <p className="text-gray-300">Persoonlijke coaching gebaseerd op je MBTI type</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Main Content */}
        <SessionProvider>
          <MBTIConfigProvider>
            <MoodProvider>
              <FocusAreaProvider>
                <ChatProvider>
                  <MainContent />
                </ChatProvider>
              </FocusAreaProvider>
            </MoodProvider>
          </MBTIConfigProvider>
        </SessionProvider>
      </div>
    </div>
  );
};

const MainContent: React.FC = () => {
  const { currentSession, startNewSession, endSession } = useSession();
  const { selectedMbtiType } = useMBTIConfig();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Settings Panel */}
      <div className="lg:col-span-1">
        <CoachingSetup
          onStartSession={startNewSession}
          onEndSession={endSession}
        />
      </div>

      {/* Chat Area */}
      <div className="lg:col-span-3">
        {currentSession ? (
          <ChatInterface />
        ) : (
          <WelcomeScreen
            selectedMbtiType={selectedMbtiType}
            onStartSession={startNewSession}
          />
        )}
      </div>
    </div>
  );
};

export default AICoachingInterface;