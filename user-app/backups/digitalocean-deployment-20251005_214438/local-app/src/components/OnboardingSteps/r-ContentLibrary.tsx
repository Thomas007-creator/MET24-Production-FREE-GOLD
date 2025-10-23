import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { database, contentItemsCollection, contentPointersCollection } from '../../database';
import { logger } from '../../utils/logger';

interface ContentLibraryProps {
  onNext: (libraryData: ContentLibraryData) => void;
  onSkip: () => void;
  userData?: any;
}

interface ContentLibraryData {
  selectedLibrary: string[];
  autoSync: boolean;
  notificationPreferences: string[];
  sharingEnabled: boolean;
  analyticsEnabled: boolean;
}

const CONTENT_LIBRARIES = [
  {
    id: 'personality_insights',
    name: 'Persoonlijkheidsinzichten',
    description: 'Diepgaande analyses van je MBTI type en ontwikkelingsmogelijkheden',
    icon: '🧠',
    items: 45,
    category: 'personality'
  },
  {
    id: 'relationship_guides',
    name: 'Relatiegidsen',
    description: 'Praktische tips voor betere communicatie en relaties',
    icon: '💕',
    items: 32,
    category: 'relationships'
  },
  {
    id: 'career_resources',
    name: 'Carrièrebronnen',
    description: 'Loopbaanadvies en professionele ontwikkelingsmateriaal',
    icon: '💼',
    items: 28,
    category: 'career'
  },
  {
    id: 'wellness_practices',
    name: 'Welzijnspraktijken',
    description: 'Mindfulness, stressmanagement en emotionele gezondheid',
    icon: '🌱',
    items: 38,
    category: 'wellness'
  },
  {
    id: 'creative_exercises',
    name: 'Creatieve Oefeningen',
    description: 'Inspirerende activiteiten om je creativiteit te ontwikkelen',
    icon: '🎨',
    items: 25,
    category: 'creativity'
  },
  {
    id: 'communication_tools',
    name: 'Communicatietools',
    description: 'Technieken voor effectieve communicatie en presentatie',
    icon: '💬',
    items: 22,
    category: 'communication'
  },
  {
    id: 'leadership_development',
    name: 'Leiderschapsontwikkeling',
    description: 'Vaardigheden en inzichten voor leiderschap',
    icon: '👑',
    items: 35,
    category: 'leadership'
  },
  {
    id: 'mindfulness_collection',
    name: 'Mindfulness Collectie',
    description: 'Meditatie, reflectie en bewustzijnsoefeningen',
    icon: '🧘‍♀️',
    items: 42,
    category: 'mindfulness'
  }
];

const NOTIFICATION_PREFERENCES = [
  { id: 'new_content', label: 'Nieuwe content', description: 'Krijg notificaties over nieuwe content' },
  { id: 'recommendations', label: 'Aanbevelingen', description: 'Persoonlijke content aanbevelingen' },
  { id: 'reminders', label: 'Herinneringen', description: 'Herinneringen voor sessies en oefeningen' },
  { id: 'achievements', label: 'Prestaties', description: 'Vier je voortgang en prestaties' }
];

const ContentLibrary: React.FC<ContentLibraryProps> = ({ onNext, onSkip, userData }) => {
  const [libraryData, setLibraryData] = useState<ContentLibraryData>({
    selectedLibrary: [],
    autoSync: true,
    notificationPreferences: ['new_content', 'recommendations'],
    sharingEnabled: false,
    analyticsEnabled: true
  });

  const [isLoading, setIsLoading] = useState(false);
  const [mbtiType, setMbtiType] = useState<string>('');

  useEffect(() => {
    if (userData?.mbtiType) {
      setMbtiType(userData.mbtiType);
      // Auto-select relevant libraries based on MBTI
      const mbtiLibraries = getMBTILibraries(userData.mbtiType);
      setLibraryData(prev => ({
        ...prev,
        selectedLibrary: mbtiLibraries
      }));
    }
  }, [userData]);

  const getMBTILibraries = (mbti: string) => {
    const libraries: { [key: string]: string[] } = {
      'INTJ': ['personality_insights', 'leadership_development', 'creative_exercises'],
      'INTP': ['personality_insights', 'creative_exercises', 'communication_tools'],
      'ENTJ': ['leadership_development', 'career_resources', 'communication_tools'],
      'ENTP': ['creative_exercises', 'communication_tools', 'personality_insights'],
      'INFJ': ['mindfulness_collection', 'personality_insights', 'relationship_guides'],
      'INFP': ['mindfulness_collection', 'creative_exercises', 'wellness_practices'],
      'ENFJ': ['relationship_guides', 'leadership_development', 'communication_tools'],
      'ENFP': ['creative_exercises', 'relationship_guides', 'wellness_practices'],
      'ISTJ': ['career_resources', 'personality_insights', 'communication_tools'],
      'ISFJ': ['relationship_guides', 'wellness_practices', 'personality_insights'],
      'ESTJ': ['leadership_development', 'career_resources', 'communication_tools'],
      'ESFJ': ['relationship_guides', 'wellness_practices', 'communication_tools'],
      'ISTP': ['creative_exercises', 'personality_insights', 'career_resources'],
      'ISFP': ['mindfulness_collection', 'creative_exercises', 'wellness_practices'],
      'ESTP': ['career_resources', 'communication_tools', 'creative_exercises'],
      'ESFP': ['relationship_guides', 'wellness_practices', 'creative_exercises']
    };
    return libraries[mbti] || ['personality_insights', 'wellness_practices'];
  };

  const toggleLibrary = (libraryId: string) => {
    setLibraryData(prev => ({
      ...prev,
      selectedLibrary: prev.selectedLibrary.includes(libraryId)
        ? prev.selectedLibrary.filter(id => id !== libraryId)
        : [...prev.selectedLibrary, libraryId]
    }));
  };

  const toggleNotification = (notificationId: string) => {
    setLibraryData(prev => ({
      ...prev,
      notificationPreferences: prev.notificationPreferences.includes(notificationId)
        ? prev.notificationPreferences.filter(id => id !== notificationId)
        : [...prev.notificationPreferences, notificationId]
    }));
  };

  const handleNext = async () => {
    setIsLoading(true);
    try {
      // Create content items for selected libraries
      await database.write(async () => {
        for (const libraryId of libraryData.selectedLibrary) {
          const library = CONTENT_LIBRARIES.find(l => l.id === libraryId);
          if (library) {
            // Create content item
            const contentItem = await contentItemsCollection.create((item: any) => {
              item.type = 'library';
              item.title = library.name;
              item.url = `#library/${libraryId}`;
              item.summary = library.description;
              item.mbtiRelevance = JSON.stringify([mbtiType]);
              item.duration = 0;
              item.tags = JSON.stringify([library.category]);
              item.difficultyLevel = 'intermediate';
              item.contentEncrypted = null;
              item.contentEncryptedKeyId = null;
              item.embeddingData = null;
              item.sourceId = libraryId;
              item.createdAt = Date.now();
              item.updatedAt = Date.now();
            });

            // Create content pointer for user
            await contentPointersCollection.create((pointer: any) => {
              pointer.itemId = contentItem.id;
              pointer.userId = userData?.userId || 'temp_user';
              pointer.downloadedAt = Date.now();
              pointer.lastViewedAt = null;
              pointer.isFavorite = false;
              pointer.progress = 0;
              pointer.rating = null;
              pointer.notes = null;
              pointer.createdAt = Date.now();
              pointer.updatedAt = Date.now();
            });
          }
        }
      });

      logger.info('Content library setup completed', { 
        libraries: libraryData.selectedLibrary, 
        mbtiType 
      });
      onNext(libraryData);
    } catch (error) {
      logger.error('Error setting up content library', { error });
      onNext(libraryData); // Continue anyway
    } finally {
      setIsLoading(false);
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
            Content Library Setup
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 text-lg"
          >
            Kies je persoonlijke content collecties voor {mbtiType} ontwikkeling
          </motion.p>
        </div>

        {/* Content Libraries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl p-6 mb-6"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Beschikbare Content Collecties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CONTENT_LIBRARIES.map((library) => (
              <motion.div
                key={library.id}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  libraryData.selectedLibrary.includes(library.id)
                    ? 'border-purple-400 bg-purple-400/20'
                    : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                }`}
                onClick={() => toggleLibrary(library.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{library.icon}</div>
                    <div>
                      <h3 className="font-medium text-white">{library.name}</h3>
                      <p className="text-sm text-gray-300">{library.description}</p>
                      <div className="text-xs text-gray-400 mt-1">
                        {library.items} items
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      libraryData.selectedLibrary.includes(library.id)
                        ? 'border-purple-400 bg-purple-400'
                        : 'border-gray-500'
                    }`}>
                      {libraryData.selectedLibrary.includes(library.id) && (
                        <div className="w-full h-full rounded-full bg-white scale-50" />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-xl p-6 mb-6"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Instellingen</h2>
          
          {/* Auto Sync */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="font-medium text-white">Automatische synchronisatie</div>
              <div className="text-sm text-gray-300">Download nieuwe content automatisch</div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLibraryData(prev => ({ ...prev, autoSync: !prev.autoSync }))}
              className={`w-12 h-6 rounded-full transition-all ${
                libraryData.autoSync ? 'bg-purple-400' : 'bg-gray-600'
              }`}
            >
              <motion.div
                animate={{ x: libraryData.autoSync ? 24 : 0 }}
                className="w-6 h-6 bg-white rounded-full shadow-lg"
              />
            </motion.button>
          </div>

          {/* Sharing */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="font-medium text-white">Content delen</div>
              <div className="text-sm text-gray-300">Deel interessante content met anderen</div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLibraryData(prev => ({ ...prev, sharingEnabled: !prev.sharingEnabled }))}
              className={`w-12 h-6 rounded-full transition-all ${
                libraryData.sharingEnabled ? 'bg-purple-400' : 'bg-gray-600'
              }`}
            >
              <motion.div
                animate={{ x: libraryData.sharingEnabled ? 24 : 0 }}
                className="w-6 h-6 bg-white rounded-full shadow-lg"
              />
            </motion.button>
          </div>

          {/* Analytics */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="font-medium text-white">Analytics</div>
              <div className="text-sm text-gray-300">Help de app verbeteren met anonieme data</div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLibraryData(prev => ({ ...prev, analyticsEnabled: !prev.analyticsEnabled }))}
              className={`w-12 h-6 rounded-full transition-all ${
                libraryData.analyticsEnabled ? 'bg-purple-400' : 'bg-gray-600'
              }`}
            >
              <motion.div
                animate={{ x: libraryData.analyticsEnabled ? 24 : 0 }}
                className="w-6 h-6 bg-white rounded-full shadow-lg"
              />
            </motion.button>
          </div>
        </motion.div>

        {/* Notification Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-xl p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Notificatie Voorkeuren</h2>
          <div className="space-y-3">
            {NOTIFICATION_PREFERENCES.map((pref) => (
              <motion.button
                key={pref.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleNotification(pref.id)}
                className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                  libraryData.notificationPreferences.includes(pref.id)
                    ? 'border-purple-400 bg-purple-400/20 text-white'
                    : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="font-medium">{pref.label}</div>
                <div className="text-sm opacity-75">{pref.description}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
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
            disabled={isLoading || libraryData.selectedLibrary.length === 0}
            className="px-8 py-3 bg-purple-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Opslaan...' : 'Voltooien'}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ContentLibrary;
