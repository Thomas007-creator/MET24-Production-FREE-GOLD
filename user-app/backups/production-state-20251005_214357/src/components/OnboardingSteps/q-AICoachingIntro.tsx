import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { logger } from '../../utils/logger';

interface AICoachingIntroProps {
  onNext: (coachingData: AICoachingData) => void;
  onSkip: () => void;
  userData?: any;
}

interface AICoachingData {
  enableAICoaching: boolean;
  coachingStyle: string;
  sessionFrequency: string;
  voiceEnabled: boolean;
  privacyLevel: string;
  coachingGoals: string[];
}

const COACHING_STYLES = [
  {
    id: 'gentle',
    label: 'Zachtmoedig',
    description: 'Empathische en ondersteunende begeleiding',
    icon: '🤗',
    traits: ['Empathisch', 'Ondersteunend', 'Geduldig']
  },
  {
    id: 'direct',
    label: 'Direct',
    description: 'Eerlijke en directe feedback',
    icon: '💪',
    traits: ['Eerlijk', 'Direct', 'Motiverend']
  },
  {
    id: 'analytical',
    label: 'Analytisch',
    description: 'Diepgaande analyse en inzichten',
    icon: '🧠',
    traits: ['Analytisch', 'Logisch', 'Inzichtelijk']
  },
  {
    id: 'creative',
    label: 'Creatief',
    description: 'Innovatieve en creatieve benadering',
    icon: '🎨',
    traits: ['Creatief', 'Innovatief', 'Inspirerend']
  }
];

const SESSION_FREQUENCIES = [
  { id: 'daily', label: 'Dagelijks', description: 'Elke dag een korte sessie' },
  { id: 'weekly', label: 'Wekelijks', description: 'Een uitgebreide sessie per week' },
  { id: 'as_needed', label: 'Op verzoek', description: 'Alleen wanneer je het nodig hebt' }
];

const COACHING_GOALS = [
  { id: 'self_awareness', label: 'Zelfbewustzijn', icon: '🔍' },
  { id: 'emotional_regulation', label: 'Emotieregulatie', icon: '💚' },
  { id: 'communication', label: 'Communicatie', icon: '💬' },
  { id: 'decision_making', label: 'Besluitvorming', icon: '⚖️' },
  { id: 'stress_management', label: 'Stressmanagement', icon: '🧘' },
  { id: 'creativity', label: 'Creativiteit', icon: '🎨' },
  { id: 'leadership', label: 'Leiderschap', icon: '👑' },
  { id: 'relationships', label: 'Relaties', icon: '💕' }
];

const PRIVACY_LEVELS = [
  {
    id: 'minimal',
    label: 'Minimaal',
    description: 'Alleen basisgegevens voor coaching',
    icon: '🔒'
  },
  {
    id: 'standard',
    label: 'Standaard',
    description: 'Persoonlijke voorkeuren en doelen',
    icon: '🛡️'
  },
  {
    id: 'comprehensive',
    label: 'Uitgebreid',
    description: 'Volledige persoonlijkheidsanalyse',
    icon: '🔐'
  }
];

const AICoachingIntro: React.FC<AICoachingIntroProps> = ({ onNext, onSkip, userData }) => {
  const [coachingData, setCoachingData] = useState<AICoachingData>({
    enableAICoaching: true,
    coachingStyle: 'gentle',
    sessionFrequency: 'weekly',
    voiceEnabled: true,
    privacyLevel: 'standard',
    coachingGoals: []
  });

  const [mbtiType, setMbtiType] = useState<string>('');

  useEffect(() => {
    if (userData?.mbtiType) {
      setMbtiType(userData.mbtiType);
      // Auto-select coaching style based on MBTI
      const mbtiCoachingStyle = getMBTICoachingStyle(userData.mbtiType);
      setCoachingData(prev => ({
        ...prev,
        coachingStyle: mbtiCoachingStyle.style,
        coachingGoals: mbtiCoachingStyle.goals
      }));
    }
  }, [userData]);

  const getMBTICoachingStyle = (mbti: string) => {
    const styles: { [key: string]: { style: string; goals: string[] } } = {
      'INTJ': { style: 'analytical', goals: ['self_awareness', 'decision_making', 'leadership'] },
      'INTP': { style: 'analytical', goals: ['self_awareness', 'creativity', 'communication'] },
      'ENTJ': { style: 'direct', goals: ['leadership', 'decision_making', 'communication'] },
      'ENTP': { style: 'creative', goals: ['creativity', 'communication', 'self_awareness'] },
      'INFJ': { style: 'gentle', goals: ['self_awareness', 'emotional_regulation', 'relationships'] },
      'INFP': { style: 'gentle', goals: ['emotional_regulation', 'creativity', 'self_awareness'] },
      'ENFJ': { style: 'gentle', goals: ['relationships', 'communication', 'leadership'] },
      'ENFP': { style: 'creative', goals: ['creativity', 'relationships', 'emotional_regulation'] },
      'ISTJ': { style: 'direct', goals: ['decision_making', 'stress_management', 'self_awareness'] },
      'ISFJ': { style: 'gentle', goals: ['relationships', 'emotional_regulation', 'stress_management'] },
      'ESTJ': { style: 'direct', goals: ['leadership', 'decision_making', 'communication'] },
      'ESFJ': { style: 'gentle', goals: ['relationships', 'communication', 'emotional_regulation'] },
      'ISTP': { style: 'analytical', goals: ['self_awareness', 'stress_management', 'creativity'] },
      'ISFP': { style: 'gentle', goals: ['creativity', 'emotional_regulation', 'self_awareness'] },
      'ESTP': { style: 'direct', goals: ['communication', 'stress_management', 'decision_making'] },
      'ESFP': { style: 'creative', goals: ['relationships', 'creativity', 'emotional_regulation'] }
    };
    return styles[mbti] || { style: 'gentle', goals: ['self_awareness', 'emotional_regulation'] };
  };

  const toggleGoal = (goalId: string) => {
    setCoachingData(prev => ({
      ...prev,
      coachingGoals: prev.coachingGoals.includes(goalId)
        ? prev.coachingGoals.filter(id => id !== goalId)
        : [...prev.coachingGoals, goalId]
    }));
  };

  const handleNext = async () => {
    try {
      logger.info('AI Coaching preferences saved', { coachingData, mbtiType });
      onNext(coachingData);
    } catch (error) {
      logger.error('Error saving AI coaching preferences', { error });
      onNext(coachingData); // Continue anyway
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold text-white mb-4"
          >
            AI Coaching Introductie
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 text-lg"
          >
            Personaliseer je AI-coach voor {mbtiType} persoonlijkheid
          </motion.p>
        </div>

        {/* AI Coaching Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">AI Coaching Inschakelen</h2>
              <p className="text-gray-300">
                Krijg persoonlijke begeleiding van een AI-coach die je persoonlijkheid begrijpt
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCoachingData(prev => ({ ...prev, enableAICoaching: !prev.enableAICoaching }))}
              className={`w-16 h-8 rounded-full transition-all ${
                coachingData.enableAICoaching ? 'bg-purple-400' : 'bg-gray-600'
              }`}
            >
              <motion.div
                animate={{ x: coachingData.enableAICoaching ? 32 : 0 }}
                className="w-8 h-8 bg-white rounded-full shadow-lg"
              />
            </motion.button>
          </div>
        </motion.div>

        {coachingData.enableAICoaching && (
          <>
            {/* Coaching Style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-xl p-6 mb-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Coaching Stijl</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {COACHING_STYLES.map((style) => (
                  <motion.button
                    key={style.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCoachingData(prev => ({ ...prev, coachingStyle: style.id }))}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      coachingData.coachingStyle === style.id
                        ? 'border-purple-400 bg-purple-400/20 text-white'
                        : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <div className="text-2xl mb-2">{style.icon}</div>
                    <div className="font-medium">{style.label}</div>
                    <div className="text-sm opacity-75 mb-2">{style.description}</div>
                    <div className="text-xs opacity-60">
                      {style.traits.join(' • ')}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Coaching Goals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass rounded-xl p-6 mb-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Coaching Doelen</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {COACHING_GOALS.map((goal) => (
                  <motion.button
                    key={goal.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleGoal(goal.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      coachingData.coachingGoals.includes(goal.id)
                        ? 'border-purple-400 bg-purple-400/20 text-white'
                        : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <div className="text-xl mb-1">{goal.icon}</div>
                    <div className="text-sm font-medium">{goal.label}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Session Frequency */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass rounded-xl p-6 mb-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Sessie Frequentie</h2>
              <div className="space-y-3">
                {SESSION_FREQUENCIES.map((freq) => (
                  <motion.button
                    key={freq.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCoachingData(prev => ({ ...prev, sessionFrequency: freq.id }))}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      coachingData.sessionFrequency === freq.id
                        ? 'border-purple-400 bg-purple-400/20 text-white'
                        : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <div className="font-medium">{freq.label}</div>
                    <div className="text-sm opacity-75">{freq.description}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Voice & Privacy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="glass rounded-xl p-6 mb-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Voorkeuren</h2>
              
              {/* Voice Enabled */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="font-medium text-white">Spraakherkenning</div>
                  <div className="text-sm text-gray-300">Praat met je AI-coach</div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCoachingData(prev => ({ ...prev, voiceEnabled: !prev.voiceEnabled }))}
                  className={`w-12 h-6 rounded-full transition-all ${
                    coachingData.voiceEnabled ? 'bg-purple-400' : 'bg-gray-600'
                  }`}
                >
                  <motion.div
                    animate={{ x: coachingData.voiceEnabled ? 24 : 0 }}
                    className="w-6 h-6 bg-white rounded-full shadow-lg"
                  />
                </motion.button>
              </div>

              {/* Privacy Level */}
              <div>
                <div className="font-medium text-white mb-3">Privacy Niveau</div>
                <div className="space-y-2">
                  {PRIVACY_LEVELS.map((level) => (
                    <motion.button
                      key={level.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCoachingData(prev => ({ ...prev, privacyLevel: level.id }))}
                      className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                        coachingData.privacyLevel === level.id
                          ? 'border-purple-400 bg-purple-400/20 text-white'
                          : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-xl">{level.icon}</div>
                        <div>
                          <div className="font-medium">{level.label}</div>
                          <div className="text-sm opacity-75">{level.description}</div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex justify-between items-center"
        >
          <button
            onClick={onSkip}
            className="px-6 py-3 text-gray-300 hover:text-white transition-colors"
          >
            Overslaan
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="px-8 py-3 bg-purple-600 text-white rounded-lg font-medium"
          >
            Volgende
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AICoachingIntro;
