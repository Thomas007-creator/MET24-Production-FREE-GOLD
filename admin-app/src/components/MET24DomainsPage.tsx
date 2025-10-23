import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Progress, Chip, Spinner } from '@nextui-org/react';
import { 
  BookOpen, 
  Brain, 
  Target, 
  TrendingUp, 
  Users, 
  Lightbulb,
  CheckCircle,
  Clock,
  Star,
  RefreshCw
} from 'lucide-react';
import { met24SyncService } from '../services/met24SyncService';
import { met24Api } from '../api/met24Api';
import { useAppStore } from '../store/useAppStore';
import { logger } from '../utils/logger';

interface MET24Domain {
  domain_id: string;
  domain_number: number;
  domain_name: string;
  domain_description?: string;
  philosophical_level: string;
  practical_applications?: string[];
  theoretical_framework?: string;
  metadata?: Record<string, any>;
}

interface MET24UserProgress {
  domain_id: string;
  progress_percentage: number;
  completed_insights?: string[];
  completed_applications?: string[];
  current_insight_id?: string;
  current_application_id?: string;
  achievements?: any[];
}

const MET24DomainsPage: React.FC = () => {
  const { userData } = useAppStore();
  const [domains, setDomains] = useState<MET24Domain[]>([]);
  const [userProgress, setUserProgress] = useState<MET24UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDomains();
  }, []);

  const loadDomains = async () => {
    try {
      setLoading(true);
      setError(null);

      // Probeer eerst lokale data te laden
      const localDomains = await loadLocalDomains();
      if (localDomains.length > 0) {
        setDomains(localDomains);
        setLoading(false);
      }

      // Probeer dan server data te synchroniseren
      if (userData?.id) {
        await syncWithServer();
      }
    } catch (err) {
      logger.error('Failed to load MET2.4 domains', { 
        error: err instanceof Error ? err.message : String(err) 
      });
      setError('Failed to load domains. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadLocalDomains = async (): Promise<MET24Domain[]> => {
    try {
      // Implementeer lokale data loading vanuit WatermelonDB
      // Dit zou normaal gesproken via dbHelpers gaan
      return [];
    } catch (error) {
      logger.error('Failed to load local domains', { 
        error: error instanceof Error ? error.message : String(error) 
      });
      return [];
    }
  };

  const syncWithServer = async () => {
    if (!userData?.id) return;

    try {
      setSyncing(true);
      
      // Voer volledige synchronisatie uit
      const result = await met24SyncService.performFullSync(userData.id);
      
      if (result.success) {
        // Herlaad lokale data na succesvolle sync
        const localDomains = await loadLocalDomains();
        setDomains(localDomains);
        
        logger.info('MET2.4 domains sync completed successfully', { 
          userId: userData.id 
        });
      } else {
        setError(result.error || 'Sync failed');
      }
    } catch (err) {
      logger.error('Failed to sync MET2.4 domains', { 
        error: err instanceof Error ? err.message : String(err) 
      });
      setError('Sync failed. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  const getProgressForDomain = (domainId: string): MET24UserProgress | undefined => {
    return userProgress.find(p => p.domain_id === domainId);
  };

  const getPhilosophicalLevelColor = (level: string): "danger" | "warning" | "primary" | "secondary" | "default" | "success" => {
    switch (level) {
      case 'Fundamenteel': return 'primary';
      case 'Toegepast': return 'secondary';
      case 'Geavanceerd': return 'warning';
      case 'Expert': return 'danger';
      default: return 'default';
    }
  };

  const getPhilosophicalLevelIcon = (level: string) => {
    switch (level) {
      case 'Fundamenteel': return <BookOpen className="w-4 h-4" />;
      case 'Toegepast': return <Target className="w-4 h-4" />;
      case 'Geavanceerd': return <Brain className="w-4 h-4" />;
      case 'Expert': return <Star className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading MET2.4 domains...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardBody className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button 
              color="primary" 
              onPress={loadDomains}
              startContent={<RefreshCw className="w-4 h-4" />}
            >
              Try Again
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              MET2.4 Domains
            </h1>
            <p className="text-gray-600">
              Ontdek en ontwikkel jezelf door de 5 kerngebieden van persoonlijke groei
            </p>
          </div>
          <Button
            color="primary"
            variant="bordered"
            onPress={syncWithServer}
            isLoading={syncing}
            startContent={!syncing && <RefreshCw className="w-4 h-4" />}
          >
            {syncing ? 'Syncing...' : 'Sync'}
          </Button>
        </div>
      </div>

      {/* Domains Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {domains.map((domain) => {
          const progress = getProgressForDomain(domain.domain_id);
          const progressPercentage = progress?.progress_percentage || 0;
          const completedInsights = progress?.completed_insights?.length || 0;
          const completedApplications = progress?.completed_applications?.length || 0;
          const achievements = progress?.achievements?.length || 0;

          return (
            <Card key={domain.domain_id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    {getPhilosophicalLevelIcon(domain.philosophical_level)}
                    <span className="text-sm font-medium text-gray-500">
                      Domain {domain.domain_number}
                    </span>
                  </div>
                  <Chip
                    size="sm"
                    color={getPhilosophicalLevelColor(domain.philosophical_level)}
                    variant="flat"
                  >
                    {domain.philosophical_level}
                  </Chip>
                </div>
              </CardHeader>
              
              <CardBody className="pt-0">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {domain.domain_name}
                </h3>
                
                {domain.domain_description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {domain.domain_description}
                  </p>
                )}

                {/* Progress Section */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm text-gray-500">{progressPercentage}%</span>
                  </div>
                  <Progress
                    value={progressPercentage}
                    color="primary"
                    className="mb-2"
                  />
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Lightbulb className="w-3 h-3" />
                      <span>{completedInsights} insights</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      <span>{completedApplications} applications</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      <span>{achievements} achievements</span>
                    </div>
                  </div>
                </div>

                {/* Practical Applications */}
                {domain.practical_applications && domain.practical_applications.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Key Applications</h4>
                    <div className="flex flex-wrap gap-1">
                      {domain.practical_applications.slice(0, 3).map((app, index) => (
                        <Chip key={index} size="sm" variant="flat" color="default">
                          {app}
                        </Chip>
                      ))}
                      {domain.practical_applications.length > 3 && (
                        <Chip size="sm" variant="flat" color="default">
                          +{domain.practical_applications.length - 3} more
                        </Chip>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    color="primary"
                    variant="flat"
                    className="flex-1"
                    startContent={<BookOpen className="w-4 h-4" />}
                  >
                    Explore
                  </Button>
                  <Button
                    size="sm"
                    color="secondary"
                    variant="flat"
                    startContent={<TrendingUp className="w-4 h-4" />}
                  >
                    Progress
                  </Button>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {domains.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No domains available
          </h3>
          <p className="text-gray-600 mb-4">
            Unable to load MET2.4 domains. Please check your connection and try again.
          </p>
          <Button
            color="primary"
            onPress={loadDomains}
            startContent={<RefreshCw className="w-4 h-4" />}
          >
            Reload
          </Button>
        </div>
      )}

      {/* Sync Status */}
      {syncing && (
        <div className="fixed bottom-4 right-4">
          <Card className="shadow-lg">
            <CardBody className="flex items-center gap-3">
              <Spinner size="sm" />
              <span className="text-sm">Syncing with server...</span>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MET24DomainsPage;
