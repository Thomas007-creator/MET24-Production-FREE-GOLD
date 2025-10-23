import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { database, offlinePacksCollection } from '../../database';
import { logger } from '../../utils/logger';

interface OfflineSetupProps {
  onNext: (setupData: OfflineSetupData) => void;
  onSkip: () => void;
  userData?: any;
}

interface OfflineSetupData {
  selectedPacks: string[];
  downloadSize: number;
  autoDownload: boolean;
  syncFrequency: string;
  storageLimit: number;
}

const OFFLINE_PACKS = [
  {
    id: 'mbti_essentials',
    name: 'MBTI Essentials',
    description: 'Basis MBTI content voor jouw persoonlijkheidstype',
    size: 45, // MB
    items: 25,
    mbtiTypes: ['ALL'],
    icon: '🧠'
  },
  {
    id: 'personality_development',
    name: 'Persoonlijkheidsontwikkeling',
    description: 'Diepgaande content over persoonlijke groei',
    size: 78,
    items: 40,
    mbtiTypes: ['ALL'],
    icon: '🌱'
  },
  {
    id: 'relationship_skills',
    name: 'Relatievaardigheden',
    description: 'Content over communicatie en relaties',
    size: 62,
    items: 35,
    mbtiTypes: ['ALL'],
    icon: '💕'
  },
  {
    id: 'career_guidance',
    name: 'Carrièrebegeleiding',
    description: 'Loopbaanadvies en professionele ontwikkeling',
    size: 89,
    items: 50,
    mbtiTypes: ['ALL'],
    icon: '💼'
  },
  {
    id: 'mindfulness_meditation',
    name: 'Mindfulness & Meditatie',
    description: 'Meditatie en mindfulness oefeningen',
    size: 34,
    items: 20,
    mbtiTypes: ['ALL'],
    icon: '🧘‍♀️'
  }
];

const SYNC_FREQUENCIES = [
  { id: 'daily', label: 'Dagelijks', description: 'Elke dag nieuwe content' },
  { id: 'weekly', label: 'Wekelijks', description: 'Elke week nieuwe content' },
  { id: 'manual', label: 'Handmatig', description: 'Alleen wanneer je het vraagt' }
];

const OfflineSetup: React.FC<OfflineSetupProps> = ({ onNext, onSkip, userData }) => {
  const [setupData, setSetupData] = useState<OfflineSetupData>({
    selectedPacks: [],
    downloadSize: 0,
    autoDownload: true,
    syncFrequency: 'weekly',
    storageLimit: 500 // MB
  });

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [mbtiType, setMbtiType] = useState<string>('');

  useEffect(() => {
    if (userData?.mbtiType) {
      setMbtiType(userData.mbtiType);
      // Auto-select MBTI-specific packs
      const mbtiPacks = OFFLINE_PACKS.filter(pack => 
        pack.mbtiTypes.includes('ALL') || pack.mbtiTypes.includes(userData.mbtiType)
      );
      setSetupData(prev => ({
        ...prev,
        selectedPacks: mbtiPacks.map(pack => pack.id)
      }));
    }
  }, [userData]);

  useEffect(() => {
    // Calculate total download size
    const totalSize = setupData.selectedPacks.reduce((total, packId) => {
      const pack = OFFLINE_PACKS.find(p => p.id === packId);
      return total + (pack?.size || 0);
    }, 0);
    setSetupData(prev => ({ ...prev, downloadSize: totalSize }));
  }, [setupData.selectedPacks]);

  const togglePack = (packId: string) => {
    setSetupData(prev => ({
      ...prev,
      selectedPacks: prev.selectedPacks.includes(packId)
        ? prev.selectedPacks.filter(id => id !== packId)
        : [...prev.selectedPacks, packId]
    }));
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      // Simulate download progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setDownloadProgress(i);
      }

      // Save offline packs to database
      await database.write(async () => {
        for (const packId of setupData.selectedPacks) {
          const pack = OFFLINE_PACKS.find(p => p.id === packId);
          if (pack) {
            await offlinePacksCollection.create((item: any) => {
              item.userId = userData?.userId || 'temp_user';
              item.packName = pack.name;
              item.packType = 'mbti_specific';
              item.mbtiType = mbtiType;
              item.itemIds = JSON.stringify([]); // Mock item IDs
              item.packSize = pack.size * 1024 * 1024; // Convert to bytes
              item.downloadStatus = 'completed';
              item.createdAt = Date.now();
              item.downloadedAt = Date.now();
              item.updatedAt = Date.now();
            });
          }
        }
      });

      logger.info('Offline packs downloaded successfully', { 
        packs: setupData.selectedPacks, 
        size: setupData.downloadSize 
      });

      onNext(setupData);
    } catch (error) {
      logger.error('Error downloading offline packs', { error });
      setIsDownloading(false);
    }
  };

  const formatSize = (sizeInMB: number) => {
    if (sizeInMB < 1024) return `${sizeInMB} MB`;
    return `${(sizeInMB / 1024).toFixed(1)} GB`;
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
            Offline Setup
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 text-lg"
          >
            Download content voor offline gebruik
          </motion.p>
        </div>

        {/* Storage Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Opslag Overzicht</h2>
            <div className="text-sm text-gray-300">
              {formatSize(setupData.downloadSize)} / {formatSize(setupData.storageLimit)}
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-purple-400 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(setupData.downloadSize / setupData.storageLimit) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Offline Packs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-xl p-6 mb-6"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Beschikbare Content Packs</h2>
          <div className="space-y-4">
            {OFFLINE_PACKS.map((pack) => (
              <motion.div
                key={pack.id}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  setupData.selectedPacks.includes(pack.id)
                    ? 'border-purple-400 bg-purple-400/20'
                    : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                }`}
                onClick={() => togglePack(pack.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{pack.icon}</div>
                    <div>
                      <h3 className="font-medium text-white">{pack.name}</h3>
                      <p className="text-sm text-gray-300">{pack.description}</p>
                      <div className="text-xs text-gray-400 mt-1">
                        {pack.items} items • {formatSize(pack.size)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      setupData.selectedPacks.includes(pack.id)
                        ? 'border-purple-400 bg-purple-400'
                        : 'border-gray-500'
                    }`}>
                      {setupData.selectedPacks.includes(pack.id) && (
                        <div className="w-full h-full rounded-full bg-white scale-50" />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sync Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-xl p-6 mb-6"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Sync Instellingen</h2>
          
          {/* Auto Download */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="font-medium text-white">Automatisch downloaden</div>
              <div className="text-sm text-gray-300">Download nieuwe content automatisch</div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSetupData(prev => ({ ...prev, autoDownload: !prev.autoDownload }))}
              className={`w-12 h-6 rounded-full transition-all ${
                setupData.autoDownload ? 'bg-purple-400' : 'bg-gray-600'
              }`}
            >
              <motion.div
                animate={{ x: setupData.autoDownload ? 24 : 0 }}
                className="w-6 h-6 bg-white rounded-full shadow-lg"
              />
            </motion.button>
          </div>

          {/* Sync Frequency */}
          <div>
            <div className="font-medium text-white mb-3">Sync Frequentie</div>
            <div className="space-y-2">
              {SYNC_FREQUENCIES.map((freq) => (
                <motion.button
                  key={freq.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSetupData(prev => ({ ...prev, syncFrequency: freq.id }))}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                    setupData.syncFrequency === freq.id
                      ? 'border-purple-400 bg-purple-400/20 text-white'
                      : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <div className="font-medium">{freq.label}</div>
                  <div className="text-sm opacity-75">{freq.description}</div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Download Progress */}
        {isDownloading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-6 mb-6"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Downloaden...</h2>
            <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
              <motion.div
                className="bg-purple-400 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${downloadProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="text-center text-gray-300">
              {downloadProgress}% voltooid
            </div>
          </motion.div>
        )}

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
            onClick={handleDownload}
            disabled={isDownloading || setupData.selectedPacks.length === 0}
            className="px-8 py-3 bg-purple-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? 'Downloaden...' : 'Download & Volgende'}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OfflineSetup;
