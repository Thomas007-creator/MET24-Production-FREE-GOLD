import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Progress, Chip, Spinner, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { 
  FileText, 
  Target, 
  BarChart3, 
  RefreshCw,
  CheckCircle,
  Clock,
  Star,
  Brain,
  Users,
  TrendingUp,
  BookOpen,
  MessageCircle
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { logger } from '../../utils/logger';

interface PracticalApplication {
  id: string;
  name: string;
  description: string;
  type: 'screening' | 'therapy' | 'evaluation' | 'followup';
  status: 'available' | 'in_progress' | 'completed' | 'locked';
  progress: number;
  estimatedDuration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  features: string[];
  mbtiSpecific: boolean;
}

interface UserProgress {
  applicationId: string;
  completedSteps: number;
  totalSteps: number;
  lastAccessed: Date;
  achievements: string[];
}

const PracticalApplicationsHub: React.FC = () => {
  const { userData } = useAppStore();
  const [applications, setApplications] = useState<PracticalApplication[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<PracticalApplication | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const mbtiType = userData?.mbtiType || 'INTJ';

  useEffect(() => {
    loadApplications();
    loadUserProgress();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      
      // Mock data - later replace with WatermelonDB/PostgreSQL
      const mockApplications: PracticalApplication[] = [
        {
          id: 'online_screening',
          name: 'Online Vragenlijst en Screening',
          description: 'Geavanceerde MBTI + domein assessments voor persoonlijke inzichten',
          type: 'screening',
          status: 'available',
          progress: 0,
          estimatedDuration: 45,
          difficulty: 'beginner',
          features: ['MBTI Deep Analysis', 'Domain Mapping', 'Personalized Insights', 'Progress Tracking'],
          mbtiSpecific: true
        },
        {
          id: 'individual_therapy',
          name: 'Individuele Therapieprogramma\'s',
          description: 'Gepersonaliseerde domein-specifieke programma\'s voor persoonlijke groei',
          type: 'therapy',
          status: 'available',
          progress: 0,
          estimatedDuration: 120,
          difficulty: 'intermediate',
          features: ['Custom Therapy Plans', 'Domain-Specific Coaching', 'Real-time Adjustments', 'AI Guidance'],
          mbtiSpecific: true
        },
        {
          id: 'evaluation_adjustment',
          name: 'Evaluatie en Bijstelling',
          description: 'Real-time progress monitoring en aanpassingen van je ontwikkelingspad',
          type: 'evaluation',
          status: 'available',
          progress: 0,
          estimatedDuration: 30,
          difficulty: 'intermediate',
          features: ['Progress Analytics', 'Dynamic Adjustments', 'Performance Insights', 'Recommendations'],
          mbtiSpecific: true
        },
        {
          id: 'follow_up',
          name: 'Follow-up',
          description: 'Langetermijn tracking en ondersteuning voor duurzame groei',
          type: 'followup',
          status: 'available',
          progress: 0,
          estimatedDuration: 60,
          difficulty: 'beginner',
          features: ['Long-term Tracking', 'Continuous Support', 'Lifetime Progress', 'Community Access'],
          mbtiSpecific: true
        }
      ];

      setApplications(mockApplications);
      
      logger.info('Practical applications loaded', { 
        count: mockApplications.length,
        mbtiType 
      });
    } catch (error) {
      logger.error('Failed to load practical applications', { 
        error: error instanceof Error ? error.message : String(error) 
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUserProgress = async () => {
    try {
      // Mock progress - later replace with WatermelonDB
      const mockProgress: UserProgress[] = [
        {
          applicationId: 'online_screening',
          completedSteps: 0,
          totalSteps: 5,
          lastAccessed: new Date(),
          achievements: []
        },
        {
          applicationId: 'individual_therapy',
          completedSteps: 0,
          totalSteps: 8,
          lastAccessed: new Date(),
          achievements: []
        },
        {
          applicationId: 'evaluation_adjustment',
          completedSteps: 0,
          totalSteps: 4,
          lastAccessed: new Date(),
          achievements: []
        },
        {
          applicationId: 'follow_up',
          completedSteps: 0,
          totalSteps: 6,
          lastAccessed: new Date(),
          achievements: []
        }
      ];

      setUserProgress(mockProgress);
    } catch (error) {
      logger.error('Failed to load user progress', { 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  };

  const getApplicationIcon = (type: string) => {
    switch (type) {
      case 'screening': return <FileText className="w-6 h-6" />;
      case 'therapy': return <Target className="w-6 h-6" />;
      case 'evaluation': return <BarChart3 className="w-6 h-6" />;
      case 'followup': return <RefreshCw className="w-6 h-6" />;
      default: return <BookOpen className="w-6 h-6" />;
    }
  };

  const getApplicationColor = (type: string) => {
    switch (type) {
      case 'screening': return 'primary';
      case 'therapy': return 'secondary';
      case 'evaluation': return 'success';
      case 'followup': return 'warning';
      default: return 'default';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'danger';
      default: return 'default';
    }
  };

  const handleApplicationClick = (app: PracticalApplication) => {
    setSelectedApp(app);
    setModalOpen(true);
    
    logger.info('Practical application selected', { 
      applicationId: app.id,
      mbtiType 
    });
  };

  const handleStartApplication = async (app: PracticalApplication) => {
    try {
      // TODO: Implement actual application start logic
      // This would integrate with WatermelonDB and PostgreSQL
      
      logger.info('Starting practical application', { 
        applicationId: app.id,
        mbtiType 
      });
      
      // Navigate to specific application based on type
      if (app.type === 'therapy') {
        // Navigate to Individual Therapy Programs
        window.location.href = '/individual-therapy-programs';
      } else {
        // For now, just show success message
        alert(`🚀 Starting ${app.name} for ${mbtiType}!`);
      }
      
      setModalOpen(false);
    } catch (error) {
      logger.error('Failed to start application', { 
        error: error instanceof Error ? error.message : String(error),
        applicationId: app.id 
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" label="Loading practical applications..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          4 Praktische Toepassingen
        </h1>
        <p className="text-gray-600">
          Ontdek en ontwikkel jezelf door de 4 kerngebieden van persoonlijke groei voor {mbtiType}
        </p>
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {applications.map((app) => {
          const progress = userProgress.find(p => p.applicationId === app.id);
          const progressPercentage = progress ? (progress.completedSteps / progress.totalSteps) * 100 : 0;
          
          return (
            <Card
              key={app.id}
              className="hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => handleApplicationClick(app)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-${getApplicationColor(app.type)}-100`}>
                    {getApplicationIcon(app.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{app.name}</h3>
                    <p className="text-sm text-gray-600">{app.description}</p>
                  </div>
                  <Chip 
                    color={getDifficultyColor(app.difficulty)} 
                    size="sm" 
                    variant="flat"
                  >
                    {app.difficulty}
                  </Chip>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="space-y-3">
                  {/* Progress */}
                  {progress && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="text-gray-900">{progress.completedSteps}/{progress.totalSteps} steps</span>
                      </div>
                      <Progress 
                        value={progressPercentage} 
                        color="primary" 
                        size="sm"
                        className="mb-2"
                      />
                    </div>
                  )}

                  {/* Features */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {app.features.map((feature, index) => (
                        <Chip key={index} size="sm" variant="flat" color="default">
                          {feature}
                        </Chip>
                      ))}
                    </div>
                  </div>

                  {/* Duration & MBTI */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{app.estimatedDuration} min</span>
                    </div>
                    {app.mbtiSpecific && (
                      <div className="flex items-center gap-1">
                        <Brain className="w-4 h-4" />
                        <span>{mbtiType} optimized</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Application Detail Modal */}
      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  {selectedApp && getApplicationIcon(selectedApp.type)}
                  <h3 className="text-xl font-bold">{selectedApp?.name}</h3>
                </div>
                <p className="text-sm text-gray-600">{selectedApp?.description}</p>
              </ModalHeader>
              <ModalBody>
                {selectedApp && (
                  <div className="space-y-4">
                    {/* Features */}
                    <div>
                      <h4 className="font-semibold mb-2">Features:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedApp.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* MBTI Specific Benefits */}
                    {selectedApp.mbtiSpecific && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">
                          {mbtiType} Specific Benefits:
                        </h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Personalized coaching based on your cognitive functions</li>
                          <li>• Tailored exercises for your personality type</li>
                          <li>• MBTI-specific insights and recommendations</li>
                          <li>• Progress tracking optimized for {mbtiType} development</li>
                        </ul>
                      </div>
                    )}

                    {/* Duration & Difficulty */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Duration: {selectedApp.estimatedDuration} minutes</span>
                      </div>
                      <Chip 
                        color={getDifficultyColor(selectedApp.difficulty)} 
                        size="sm" 
                        variant="flat"
                      >
                        {selectedApp.difficulty}
                      </Chip>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button 
                  color="primary" 
                  onPress={() => selectedApp && handleStartApplication(selectedApp)}
                  startContent={<Star className="w-4 h-4" />}
                >
                  Start Application
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default PracticalApplicationsHub;
