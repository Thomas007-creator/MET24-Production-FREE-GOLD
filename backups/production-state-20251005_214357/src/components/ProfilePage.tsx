import React, { useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Avatar,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  Select,
  SelectItem,
} from '@nextui-org/react';
import { logger } from '../utils/logger';
import {
  User as UserIcon,
  Edit,
  Camera,
  Calendar,
  Settings,
  Share2,
  Shield,
  Save,
  X,
  TrendingUp,
  ArrowLeft,
  Home,
  Globe,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  Award,
  Zap,
  Users,
  BookOpen,
  MessageCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'journaling' | 'challenges' | 'social' | 'growth' | 'streak';
  points: number;
}

interface PersonalStat {
  id: string;
  label: string;
  value: string | number;
  icon: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

interface MBTIInsight {
  type: string;
  strength: string;
  growth: string;
  compatibility: string[];
  description: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { userData, updateUserData } = useAppStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showPrivateInfo] = useState(false);

  // Mock data voor achievements
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Journaling Master',
      description: '30 dagen achter elkaar journaling voltooid',
      icon: '📖',
      unlockedAt: '2024-01-15',
      rarity: 'epic',
      category: 'journaling',
      points: 500
    },
    {
      id: '2',
      title: 'Challenge Champion',
      description: '5 challenges succesvol voltooid',
      icon: '🏆',
      unlockedAt: '2024-01-10',
      rarity: 'rare',
      category: 'challenges',
      points: 300
    },
    {
      id: '3',
      title: 'MBTI Explorer',
      description: 'Alle 16 MBTI types bestudeerd',
      icon: '🧠',
      unlockedAt: '2024-01-05',
      rarity: 'legendary',
      category: 'growth',
      points: 1000
    },
    {
      id: '4',
      title: 'Streak Keeper',
      description: '7 dagen streak behouden',
      icon: '🔥',
      unlockedAt: '2024-01-20',
      rarity: 'common',
      category: 'streak',
      points: 100
    }
  ];

  // Mock data voor personal stats
  const personalStats: PersonalStat[] = [
    {
      id: '1',
      label: 'Journal Entries',
      value: 47,
      icon: '📝',
      trend: 'up',
      color: 'text-blue-500'
    },
    {
      id: '2',
      label: 'Challenges Completed',
      value: 8,
      icon: '🎯',
      trend: 'up',
      color: 'text-green-500'
    },
    {
      id: '3',
      label: 'Current Streak',
      value: '15 days',
      icon: '🔥',
      trend: 'up',
      color: 'text-orange-500'
    },
    {
      id: '4',
      label: 'Total Points',
      value: 2450,
      icon: '⭐',
      trend: 'up',
      color: 'text-purple-500'
    },
    {
      id: '5',
      label: 'MBTI Insights',
      value: 12,
      icon: '🧠',
      trend: 'stable',
      color: 'text-indigo-500'
    },
    {
      id: '6',
      label: 'Community Posts',
      value: 23,
      icon: '💬',
      trend: 'up',
      color: 'text-pink-500'
    }
  ];

  // Mock MBTI insights
  const mbtiInsights: MBTIInsight = {
    type: userData?.mbtiType || 'INFP',
    strength: 'Creativiteit en empathie',
    growth: 'Besluitvorming en planning',
    compatibility: ['ENFJ', 'ENFP', 'INFJ'],
    description: 'Je bent een creatieve idealist met een diep begrip van menselijke emoties. Je excellert in het vinden van betekenis en het helpen van anderen.'
  };

  const [editForm, setEditForm] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    bio: userData?.bio || '',
    location: userData?.location || '',
    website: userData?.website || '',
    mbtiType: userData?.mbtiType || 'INFP',
    privacy: userData?.privacy || 'public'
  });

  const handleSaveProfile = () => {
    updateUserData(editForm);
    setIsEditModalOpen(false);
    logger.info('Profile updated', { userId: userData?.id || 'unknown' });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'default';
      case 'rare': return 'primary';
      case 'epic': return 'secondary';
      case 'legendary': return 'warning';
      default: return 'default';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default: return <div className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              color="secondary"
              variant="bordered"
              startContent={<ArrowLeft />}
              onClick={() => navigate(-1)}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Terug
            </Button>
            <Button
              color="primary"
              variant="bordered"
              startContent={<Home />}
              onClick={() => navigate('/')}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Hoofdmenu
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Button
              color="warning"
              variant="bordered"
              startContent={<Settings />}
              onClick={() => navigate('/settings')}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Instellingen
            </Button>
          </div>
        </div>

        {/* Profile Header */}
        <Card className="bg-[rgba(27,38,59,0.8)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)] mb-6">
          <CardBody className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar Section */}
              <div className="relative">
                <Avatar
                  src={userData?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.name}`}
                  className="w-32 h-32 text-large"
                  name={userData?.name}
                />
                <Button
                  isIconOnly
                  color="primary"
                  variant="solid"
                  className="absolute -bottom-2 -right-2 w-8 h-8"
                  onClick={() => setIsAvatarModalOpen(true)}
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-white">
                    {userData?.name}
                  </h1>
                  <Chip
                    color="primary"
                    variant="flat"
                    size="lg"
                    className="bg-blue-500/20 text-blue-300"
                  >
                    {mbtiInsights.type}
                  </Chip>
                </div>
                
                <p className="text-gray-300 mb-4 max-w-md">
                  {userData?.bio || 'Passionate about personal growth and MBTI insights. Always learning and evolving.'}
                </p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-400">
                  {userData?.location && (
                    <div className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      {userData.location}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Lid sinds {new Date().getFullYear()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    {editForm.privacy === 'public' ? 'Openbaar' : 'Privé'}
                  </div>
                </div>

                <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
                  <Button
                    color="primary"
                    startContent={<Edit />}
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    Profiel Bewerken
                  </Button>
                  <Button
                    color="secondary"
                    variant="bordered"
                    startContent={<Share2 />}
                  >
                    Delen
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-6">
          <div className="glass rounded-xl p-2">
            <div className="flex space-x-2">
              {[
                { id: 'overview', label: 'Overzicht', icon: '📊' },
                { id: 'achievements', label: 'Prestaties', icon: '🏆' },
                { id: 'insights', label: 'MBTI Inzichten', icon: '🧠' },
                { id: 'activity', label: 'Activiteit', icon: '📈' }
              ].map((tab) => (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {personalStats.map((stat) => (
              <Card key={stat.id} className="bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)]">
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{stat.icon}</div>
                      <div>
                        <p className="text-sm text-gray-400">{stat.label}</p>
                        <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                      </div>
                    </div>
                    {getTrendIcon(stat.trend)}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)]">
                <CardBody className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-white">{achievement.title}</h3>
                        <Chip
                          color={getRarityColor(achievement.rarity)}
                          size="sm"
                          variant="flat"
                        >
                          {achievement.rarity}
                        </Chip>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">{achievement.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>+{achievement.points} punten</span>
                        <span>{new Date(achievement.unlockedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            <Card className="bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)]">
              <CardHeader>
                <h3 className="text-xl font-semibold text-white">MBTI Type: {mbtiInsights.type}</h3>
              </CardHeader>
              <CardBody>
                <p className="text-gray-300 mb-4">{mbtiInsights.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-400 mb-2">Sterke Punten</h4>
                    <p className="text-gray-300">{mbtiInsights.strength}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-400 mb-2">Groeigebieden</h4>
                    <p className="text-gray-300">{mbtiInsights.growth}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold text-blue-400 mb-2">Compatibele Types</h4>
                  <div className="flex flex-wrap gap-2">
                    {mbtiInsights.compatibility.map((type) => (
                      <Chip key={type} color="primary" variant="flat" size="sm">
                        {type}
                      </Chip>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-6">
            <Card className="bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)]">
              <CardHeader>
                <h3 className="text-xl font-semibold text-white">Recente Activiteit</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  {[
                    { action: 'Journal entry geschreven', time: '2 uur geleden', icon: '📝' },
                    { action: 'Challenge voltooid', time: '1 dag geleden', icon: '🏆' },
                    { action: 'MBTI insight gelezen', time: '2 dagen geleden', icon: '🧠' },
                    { action: 'Community post gemaakt', time: '3 dagen geleden', icon: '💬' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                      <div className="text-xl">{activity.icon}</div>
                      <div className="flex-1">
                        <p className="text-white">{activity.action}</p>
                        <p className="text-sm text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Edit Profile Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          size="2xl"
          className="bg-[rgba(27,38,59,0.95)] backdrop-blur-xl"
        >
          <ModalContent>
            <ModalHeader>
              <h2 className="text-xl font-semibold text-white">Profiel Bewerken</h2>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Naam"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="text-white"
                  />
                </div>
                <Input
                  label="Email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className="text-white"
                />
                <Textarea
                  label="Bio"
                  value={editForm.bio}
                  onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                  placeholder="Vertel iets over jezelf..."
                  className="text-white"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Locatie"
                    value={editForm.location}
                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                    className="text-white"
                  />
                  <Input
                    label="Website"
                    value={editForm.website}
                    onChange={(e) => setEditForm({...editForm, website: e.target.value})}
                    className="text-white"
                  />
                </div>
                <Select
                  label="MBTI Type"
                  selectedKeys={[editForm.mbtiType]}
                  onSelectionChange={(keys) => setEditForm({...editForm, mbtiType: Array.from(keys)[0] as string})}
                  className="text-white"
                >
                  {['INFP', 'INFJ', 'ENFP', 'ENFJ', 'INTJ', 'INTP', 'ENTP', 'ENTJ', 'ISFP', 'ISFJ', 'ESFP', 'ESFJ', 'ISTP', 'ISTJ', 'ESTP', 'ESTJ'].map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  label="Privacy"
                  selectedKeys={[editForm.privacy]}
                  onSelectionChange={(keys) => setEditForm({...editForm, privacy: Array.from(keys)[0] as 'public' | 'private' | 'friends'})}
                  className="text-white"
                >
                  <SelectItem key="public" value="public">Openbaar</SelectItem>
                  <SelectItem key="private" value="private">Privé</SelectItem>
                </Select>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onClick={() => setIsEditModalOpen(false)}
                startContent={<X />}
              >
                Annuleren
              </Button>
              <Button
                color="primary"
                onClick={handleSaveProfile}
                startContent={<Save />}
              >
                Opslaan
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Avatar Modal */}
        <Modal
          isOpen={isAvatarModalOpen}
          onClose={() => setIsAvatarModalOpen(false)}
          size="md"
          className="bg-[rgba(27,38,59,0.95)] backdrop-blur-xl"
        >
          <ModalContent>
            <ModalHeader>
              <h2 className="text-xl font-semibold text-white">Avatar Wijzigen</h2>
            </ModalHeader>
            <ModalBody>
              <div className="text-center">
                <p className="text-gray-300 mb-4">Avatar functionaliteit komt binnenkort beschikbaar!</p>
                <div className="grid grid-cols-4 gap-4">
                  {['👤', '👨', '👩', '🧑', '👨‍💼', '👩‍💼', '👨‍🎨', '👩‍🎨'].map((emoji, index) => (
                    <Button
                      key={index}
                      variant="bordered"
                      className="w-16 h-16 text-2xl hover:bg-white/10"
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={() => setIsAvatarModalOpen(false)}
              >
                Sluiten
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default ProfilePage;