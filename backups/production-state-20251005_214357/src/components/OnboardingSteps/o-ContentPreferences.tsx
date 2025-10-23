import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { database, contentRecommendationsCollection } from '../../database';
import { logger } from '../../utils/logger';

interface ContentPreferencesProps {
  onNext: (preferences: ContentPreferencesData) => void;
  onSkip: () => void;
  userData?: any;
}

interface ContentPreferencesData {
  preferredContentTypes: string[];
  preferredTopics: string[];
  difficultyLevel: string;
  contentSources: string[];
  offlineMode: boolean;
}

const CONTENT_TYPES = [
  { id: 'article', label: 'Artikelen', icon: '📄', description: 'Diepgaande artikelen over persoonlijkheid' },
  { id: 'video', label: 'Video\'s', icon: '🎥', description: 'Educatieve video\'s en tutorials' },
  { id: 'podcast', label: 'Podcasts', icon: '🎧', description: 'Audio content voor onderweg' },
  { id: 'course', label: 'Cursussen', icon: '🎓', description: 'Gestructureerde leerprogramma\'s' },
  { id: 'interactive', label: 'Interactief', icon: '🎮', description: 'Games en oefeningen' },
  { id: 'meditation', label: 'Meditatie', icon: '🧘', description: 'Mindfulness en reflectie' }
];

const TOPICS = [
  { id: 'personality', label: 'Persoonlijkheid', icon: '🧠' },
  { id: 'relationships', label: 'Relaties', icon: '💕' },
  { id: 'career', label: 'Carrière', icon: '💼' },
  { id: 'wellness', label: 'Welzijn', icon: '🌱' },
  { id: 'creativity', label: 'Creativiteit', icon: '🎨' },
  { id: 'communication', label: 'Communicatie', icon: '💬' },
  { id: 'leadership', label: 'Leiderschap', icon: '👑' },
  { id: 'mindfulness', label: 'Mindfulness', icon: '🧘‍♀️' }
];

const DIFFICULTY_LEVELS = [
  { id: 'beginner', label: 'Beginner', description: 'Basisconcepten en introducties' },
  { id: 'intermediate', label: 'Gevorderd', description: 'Diepgaande analyses en toepassingen' },
  { id: 'advanced', label: 'Expert', description: 'Geavanceerde theorieën en onderzoek' }
];

const ContentPreferences: React.FC<ContentPreferencesProps> = ({ onNext, onSkip, userData }) => {
  const [preferences, setPreferences] = useState<ContentPreferencesData>({
    preferredContentTypes: [],
    preferredTopics: [],
    difficultyLevel: 'intermediate',
    contentSources: ['curated', 'ai_recommended'],
    offlineMode: true
  });

  const [isLoading, setIsLoading] = useState(false);
  const [mbtiType, setMbtiType] = useState<string>('');

  useEffect(() => {
    if (userData?.mbtiType) {
      setMbtiType(userData.mbtiType);
      // Auto-select content types based on MBTI
      const mbtiPreferences = getMBTIPreferences(userData.mbtiType);
      setPreferences(prev => ({
        ...prev,
        preferredContentTypes: mbtiPreferences.contentTypes,
        preferredTopics: mbtiPreferences.topics
      }));
    }
  }, [userData]);

  const getMBTIPreferences = (mbti: string) => {
    const preferences: { [key: string]: { contentTypes: string[]; topics: string[] } } = {
      'INTJ': { contentTypes: ['article', 'course'], topics: ['personality', 'leadership', 'creativity'] },
      'INTP': { contentTypes: ['article', 'interactive'], topics: ['personality', 'creativity', 'communication'] },
      'ENTJ': { contentTypes: ['video', 'course'], topics: ['leadership', 'career', 'communication'] },
      'ENTP': { contentTypes: ['podcast', 'interactive'], topics: ['creativity', 'communication', 'personality'] },
      'INFJ': { contentTypes: ['meditation', 'article'], topics: ['wellness', 'relationships', 'mindfulness'] },
      'INFP': { contentTypes: ['meditation', 'article'], topics: ['creativity', 'wellness', 'relationships'] },
      'ENFJ': { contentTypes: ['video', 'course'], topics: ['relationships', 'leadership', 'communication'] },
      'ENFP': { contentTypes: ['podcast', 'interactive'], topics: ['creativity', 'relationships', 'wellness'] },
      'ISTJ': { contentTypes: ['article', 'course'], topics: ['career', 'personality', 'communication'] },
      'ISFJ': { contentTypes: ['article', 'meditation'], topics: ['relationships', 'wellness', 'personality'] },
      'ESTJ': { contentTypes: ['video', 'course'], topics: ['leadership', 'career', 'communication'] },
      'ESFJ': { contentTypes: ['video', 'meditation'], topics: ['relationships', 'wellness', 'communication'] },
      'ISTP': { contentTypes: ['interactive', 'article'], topics: ['creativity', 'personality', 'career'] },
      'ISFP': { contentTypes: ['meditation', 'interactive'], topics: ['creativity', 'wellness', 'relationships'] },
      'ESTP': { contentTypes: ['video', 'interactive'], topics: ['career', 'communication', 'creativity'] },
      'ESFP': { contentTypes: ['video', 'meditation'], topics: ['relationships', 'wellness', 'creativity'] }
    };
    return preferences[mbti] || { contentTypes: ['article', 'video'], topics: ['personality', 'wellness'] };
  };

  const toggleContentType = (typeId: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredContentTypes: prev.preferredContentTypes.includes(typeId)
        ? prev.preferredContentTypes.filter(id => id !== typeId)
        : [...prev.preferredContentTypes, typeId]
    }));
  };

  const toggleTopic = (topicId: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredTopics: prev.preferredTopics.includes(topicId)
        ? prev.preferredTopics.filter(id => id !== topicId)
        : [...prev.preferredTopics, topicId]
    }));
  };

  const handleNext = async () => {
    setIsLoading(true);
    try {
      // Save preferences to database
      await database.write(async () => {
        // Create content recommendations based on preferences
        const recommendations = await generateContentRecommendations(preferences, mbtiType);
        
        // Save to database
        for (const rec of recommendations) {
          await contentRecommendationsCollection.create((item: any) => {
            item.userId = userData?.userId || 'temp_user';
            item.itemId = rec.itemId;
            item.score = rec.score;
            item.reason = rec.reason;
            item.mbtiAlignment = JSON.stringify(rec.mbtiAlignment);
            item.recommendationType = 'mbti_based';
            item.isViewed = false;
            item.createdAt = Date.now();
            item.updatedAt = Date.now();
          });
        }
      });

      logger.info('Content preferences saved', { preferences, mbtiType });
      onNext(preferences);
    } catch (error) {
      logger.error('Error saving content preferences', { error });
      onNext(preferences); // Continue anyway
    } finally {
      setIsLoading(false);
    }
  };

  const generateContentRecommendations = async (prefs: ContentPreferencesData, mbti: string) => {
    // Mock content recommendations - in production this would query real content
    const mockRecommendations = [
      {
        itemId: `content_${mbti}_1`,
        score: 95,
        reason: `Perfecte match voor ${mbti} persoonlijkheid`,
        mbtiAlignment: { type: mbti, relevance: 95, traits: ['analytical', 'introspective'] }
      },
      {
        itemId: `content_${mbti}_2`,
        score: 88,
        reason: `Aanbevolen voor ${mbti} ontwikkelingsgebieden`,
        mbtiAlignment: { type: mbti, relevance: 88, traits: ['growth', 'development'] }
      }
    ];
    return mockRecommendations;
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
            Content Voorkeuren
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 text-lg"
          >
            Personaliseer je content ervaring voor {mbtiType} persoonlijkheid
          </motion.p>
        </div>

        {/* Content Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl p-6 mb-6"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Voorkeur Content Types</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {CONTENT_TYPES.map((type) => (
              <motion.button
                key={type.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleContentType(type.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  preferences.preferredContentTypes.includes(type.id)
                    ? 'border-purple-400 bg-purple-400/20 text-white'
                    : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="text-2xl mb-2">{type.icon}</div>
                <div className="font-medium">{type.label}</div>
                <div className="text-sm opacity-75">{type.description}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Topics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-xl p-6 mb-6"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Interessegebieden</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TOPICS.map((topic) => (
              <motion.button
                key={topic.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleTopic(topic.id)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  preferences.preferredTopics.includes(topic.id)
                    ? 'border-purple-400 bg-purple-400/20 text-white'
                    : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="text-xl mb-1">{topic.icon}</div>
                <div className="text-sm font-medium">{topic.label}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Difficulty Level */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-xl p-6 mb-6"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Moeilijkheidsgraad</h2>
          <div className="space-y-3">
            {DIFFICULTY_LEVELS.map((level) => (
              <motion.button
                key={level.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPreferences(prev => ({ ...prev, difficultyLevel: level.id }))}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  preferences.difficultyLevel === level.id
                    ? 'border-purple-400 bg-purple-400/20 text-white'
                    : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="font-medium">{level.label}</div>
                <div className="text-sm opacity-75">{level.description}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Offline Mode */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-xl p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Offline Modus</h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-white">Download content voor offline gebruik</div>
              <div className="text-sm text-gray-300">Toegang tot content zonder internetverbinding</div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPreferences(prev => ({ ...prev, offlineMode: !prev.offlineMode }))}
              className={`w-12 h-6 rounded-full transition-all ${
                preferences.offlineMode ? 'bg-purple-400' : 'bg-gray-600'
              }`}
            >
              <motion.div
                animate={{ x: preferences.offlineMode ? 24 : 0 }}
                className="w-6 h-6 bg-white rounded-full shadow-lg"
              />
            </motion.button>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
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
            disabled={isLoading || preferences.preferredContentTypes.length === 0}
            className="px-8 py-3 bg-purple-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Opslaan...' : 'Volgende'}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ContentPreferences;
