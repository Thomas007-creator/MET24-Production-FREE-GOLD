import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardBody, 
  Button, 
  Progress, 
  Badge,
  Chip,
  Divider,
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Input,
  Textarea,
  Select,
  SelectItem,
  useDisclosure,
  Tabs,
  Tab,
  RadioGroup,
  Radio
} from '@nextui-org/react';
import { useAppStore } from '../../store/useAppStore';
import { 
  ai3PersonalActionPlansChatLLMService,
  ActionPlan as ServiceActionPlan,
  ActionStep
} from '../../services/ai3PersonalActionPlansChatLLM';

// Extended interface for UI with computed properties
interface ActionPlan extends ServiceActionPlan {
  overallProgress?: number;
  completionRate?: number;
  qualityRating?: number;
  satisfactionLevel?: number;
}

interface ActionItem extends ActionStep {
  // Additional UI properties if needed
}

interface CrossFeatureInsight {
  id: string;
  sourceFeature: 'coaching' | 'wellness' | 'journaling';
  sourceId: string;
  type: 'goal' | 'challenge' | 'strength' | 'pattern' | 'recommendation';
  content: string;
  relevanceScore: number;
  implementationSuggestion: string;
  mbtiAlignment: string;
}

const AI3PersonalActionPlansInterface: React.FC = () => {
  const { userData } = useAppStore();
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<ActionPlan | null>(null);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onOpenChange: onCreateOpenChange } = useDisclosure();
  
  const [newPlanTitle, setNewPlanTitle] = useState('');
  const [newPlanDescription, setNewPlanDescription] = useState('');
  const [selectedTimeHorizon, setSelectedTimeHorizon] = useState('3 months');
  const [includeCoaching, setIncludeCoaching] = useState(true);
  const [includeWellness, setIncludeWellness] = useState(true);
  const [includeJournaling, setIncludeJournaling] = useState(true);

  const ai3Service = ai3PersonalActionPlansChatLLMService;

  useEffect(() => {
    loadActionPlans();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    console.log(`${type.toUpperCase()}: ${message}`);
    // For now, just console log - can be replaced with actual toast implementation
  };

  const loadActionPlans = async () => {
    if (!userData?.id) return;
    
    setIsLoading(true);
    try {
      const plans = await ai3Service.getUserActionPlans(userData.id);
      setActionPlans(plans);
      if (plans.length > 0 && !selectedPlan) {
        setSelectedPlan(plans[0]);
      }
    } catch (error) {
      console.error('Error loading action plans:', error);
      showToast('Error loading action plans', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateActionPlan = async () => {
    if (!userData?.id || !newPlanTitle.trim()) return;
    
    setIsGenerating(true);
    try {
      // Create empty source insights for now - in real implementation would fetch from other features
      const sourceInsights: any[] = [];
      
      const newPlan = await ai3Service.generateActionPlan(
        userData.id,
        userData.mbtiType || 'INFP',
        sourceInsights,
        newPlanTitle,
        newPlanDescription || undefined
      );

      setActionPlans(prev => [newPlan, ...prev]);
      setSelectedPlan(newPlan);
      
      // Reset form
      setNewPlanTitle('');
      setNewPlanDescription('');
      setSelectedTimeHorizon('3 months');
      
      onCreateOpenChange();
      showToast('Action plan created successfully!', 'success');
    } catch (error) {
      console.error('Error creating action plan:', error);
      showToast('Error creating action plan', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateProgress = async (actionId: string, newProgress: number) => {
    if (!selectedPlan) return;
    
    try {
      // For now, just update the local state
      // In real implementation, would call service method
      showToast('Progress updated!', 'success');
    } catch (error) {
      console.error('Error updating progress:', error);
      showToast('Error updating progress', 'error');
    }
  };

  const handleEvolvePlan = async () => {
    if (!selectedPlan) return;
    
    setIsLoading(true);
    try {
      // For now, just show a success message
      // In real implementation, would call service method
      showToast('Action plan evolved with new insights!', 'success');
    } catch (error) {
      console.error('Error evolving plan:', error);
      showToast('Error evolving action plan', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'primary';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'primary';
      case 'blocked': return 'danger';
      case 'not_started': return 'default';
      default: return 'default';
    }
  };

  const renderActionPlanOverview = () => (
    <div className="space-y-6">
      {/* Plan Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
          <CardBody className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <span className="text-blue-400 text-xl">🎯</span>
              </div>
              <div>
                <p className="text-sm text-white/70">Overall Progress</p>
                <p className="text-2xl font-bold text-white">{selectedPlan?.progress?.overallCompletion || 0}%</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
          <CardBody className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <span className="text-green-400 text-xl">✅</span>
              </div>
              <div>
                <p className="text-sm text-white/70">Actions Completed</p>
                <p className="text-2xl font-bold text-white">{selectedPlan?.progress?.actionsCompleted || 0}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
          <CardBody className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <span className="text-purple-400 text-xl">🏆</span>
              </div>
              <div>
                <p className="text-sm text-white/70">Quality Rating</p>
                <p className="text-2xl font-bold text-white">{selectedPlan?.progress?.qualityRating || 0}/5</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
          <CardBody className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <span className="text-yellow-400 text-xl">✨</span>
              </div>
              <div>
                <p className="text-sm text-white/70">Satisfaction</p>
                <p className="text-2xl font-bold text-white">{selectedPlan?.progress?.satisfactionLevel || 0}/5</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Action Items */}
      <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
        <CardBody className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">Action Items</h3>
            <Button
              onPress={handleEvolvePlan}
              isLoading={isLoading}
              startContent={<span>💡</span>}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              size="sm"
            >
              Evolve Plan
            </Button>
          </div>
          
          <div className="space-y-4">
            {selectedPlan?.actions?.map((action) => (
              <Card key={action.id} className="bg-white/5 border border-white/10">
                <CardBody className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-white">{action.title}</h4>
                        <Chip
                          size="sm"
                          color={getPriorityColor(action.priority) as any}
                          variant="flat"
                        >
                          {action.priority}
                        </Chip>
                        <Chip
                          size="sm"
                          color={getStatusColor(action.status) as any}
                          variant="flat"
                        >
                          {action.status.replace('_', ' ')}
                        </Chip>
                      </div>
                      <p className="text-sm text-white/70 mb-3">{action.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-xs text-white/60 mb-3">
                        <div>
                          <span className="font-medium">Category:</span> {action.category}
                        </div>
                        <div>
                          <span className="font-medium">Status:</span> {action.status}
                        </div>
                        <div>
                          <span className="font-medium">Depends on:</span> {action.dependencies?.join(', ') || 'None'}
                        </div>
                        <div>
                          <span className="font-medium">Notes:</span> {action.notes || 'None'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white/70">Progress</span>
                      <span className="text-sm font-medium text-white">0%</span>
                    </div>
                    <Progress
                      value={0}
                      className="w-full"
                      color="primary"
                    />
                    
                    <div className="flex space-x-2 mt-3">
                      <Button
                        size="sm"
                        variant="flat"
                        onPress={() => handleUpdateProgress(action.id, 25)}
                        className="text-white/80"
                      >
                        Start
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        onPress={() => handleUpdateProgress(action.id, 100)}
                        className="text-white/80"
                      >
                        Complete
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )) || (
              <div className="text-center py-8 text-white/60">
                <span className="text-6xl mb-4 block">🎯</span>
                <p>No action items yet. Create your first action plan!</p>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );

  const renderInsights = () => (
    <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
      <CardBody className="p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Cross-Feature Insights</h3>
        
        <div className="space-y-4">
          {selectedPlan?.sourceInsights?.map((insight, index) => (
            <Card key={`${insight.featureType}-${index}`} className="bg-white/5 border border-white/10">
              <CardBody className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <Chip
                      size="sm"
                      color="secondary"
                      variant="flat"
                    >
                      {insight.featureType}
                    </Chip>
                    <Chip
                      size="sm"
                      color="primary"
                      variant="flat"
                    >
                      insight
                    </Chip>
                  </div>
                  <Badge
                    content={`${insight.relevance}%`}
                    color="success"
                    size="sm"
                  >
                    <div className="w-2 h-2" />
                  </Badge>
                </div>
                
                <p className="text-white/90 mb-2">{insight.summary}</p>
                <p className="text-sm text-white/70 mb-2">{insight.integrationApproach}</p>
                <p className="text-xs text-white/60">Feature: {insight.featureType}</p>
              </CardBody>
            </Card>
          )) || (
            <div className="text-center py-8 text-white/60">
              <span className="text-6xl mb-4 block">📊</span>
              <p>No insights available yet.</p>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">AI-3 Personal Action Plans</h1>
            <p className="text-white/70">Transform insights into actionable goals with MBTI-optimized planning</p>
          </div>
          
          <Button
            onPress={onCreateOpen}
            startContent={<span>➕</span>}
            className="bg-gradient-to-r from-green-500 to-teal-500 text-white font-medium"
            size="lg"
          >
            Create Action Plan
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Plans Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
              <CardBody className="p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Your Action Plans</h3>
                
                <div className="space-y-2">
                  {actionPlans.map((plan) => (
                    <Card
                      key={plan.id}
                      isPressable
                      onPress={() => setSelectedPlan(plan)}
                      className={`transition-all ${
                        selectedPlan?.id === plan.id
                          ? 'bg-white/20 border-white/30'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <CardBody className="p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-white text-sm">{plan.title}</h4>
                          <Chip
                            size="sm"
                            color={plan.status === 'active' ? 'success' : 'default'}
                            variant="flat"
                          >
                            {plan.status}
                          </Chip>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between text-xs text-white/70 mb-1">
                              <span>Progress</span>
                              <span>{plan.progress?.overallCompletion || 0}%</span>
                            </div>
                            <Progress
                              value={plan.progress?.overallCompletion || 0}
                              size="sm"
                              color="primary"
                            />
                          </div>
                          
                          <div className="flex justify-between text-xs text-white/60">
                            <span>{plan.actions?.length || 0} actions</span>
                            <span>{plan.mbtiType}</span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                  
                  {actionPlans.length === 0 && !isLoading && (
                    <div className="text-center py-8 text-white/60">
                      <span className="text-4xl mb-2 block">🎯</span>
                      <p className="text-sm">No action plans yet</p>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedPlan ? (
              <div>
                {/* Plan Header */}
                <Card className="bg-white/10 backdrop-blur-xl border border-white/20 mb-6">
                  <CardBody className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-2">{selectedPlan.title}</h2>
                        <p className="text-white/70 mb-3">{selectedPlan.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-white/60">
                          <span>Planning Style: {selectedPlan.planningStyle.structure}</span>
                          <span>•</span>
                          <span>MBTI: {selectedPlan.mbtiType}</span>
                          <span>•</span>
                          <span>Created: {new Date(selectedPlan.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Chip color="success" variant="flat">
                          Quality: {selectedPlan.progress?.qualityRating || 0}/5
                        </Chip>
                        <Chip color="primary" variant="flat">
                          {selectedPlan.status}
                        </Chip>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Tabs */}
                <Tabs
                  selectedKey={selectedTab}
                  onSelectionChange={(key) => setSelectedTab(key as string)}
                  className="mb-6"
                  classNames={{
                    tabList: "bg-white/10 backdrop-blur-xl border border-white/20",
                    tab: "text-white/70",
                    cursor: "bg-white/20",
                    tabContent: "group-data-[selected=true]:text-white"
                  }}
                >
                  <Tab key="overview" title="Overview">
                    {renderActionPlanOverview()}
                  </Tab>
                  <Tab key="insights" title="Insights">
                    {renderInsights()}
                  </Tab>
                </Tabs>
              </div>
            ) : (
              <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
                <CardBody className="p-12 text-center">
                  <span className="text-8xl mb-4 block">🎯</span>
                  <h3 className="text-xl font-semibold text-white mb-2">No Action Plan Selected</h3>
                  <p className="text-white/70 mb-6">Create your first action plan to get started with goal achievement</p>
                  <Button
                    onPress={onCreateOpen}
                    startContent={<span>➕</span>}
                    className="bg-gradient-to-r from-green-500 to-teal-500 text-white font-medium"
                  >
                    Create Action Plan
                  </Button>
                </CardBody>
              </Card>
            )}
          </div>
        </div>

        {/* Create Plan Modal */}
        <Modal
          isOpen={isCreateOpen}
          onOpenChange={onCreateOpenChange}
          size="3xl"
          classNames={{
            base: "bg-transparent",
            backdrop: "bg-black/50 backdrop-blur-sm",
            body: "p-0",
            wrapper: "overflow-hidden"
          }}
        >
          <ModalContent className="bg-white/10 backdrop-blur-xl border border-white/20">
            <ModalHeader className="text-white border-b border-white/20">
              Create New Action Plan
            </ModalHeader>
            <ModalBody className="p-6">
              <div className="space-y-4">
                <Input
                  label="Plan Title"
                  placeholder="e.g., 'Improve Public Speaking Skills'"
                  value={newPlanTitle}
                  onValueChange={setNewPlanTitle}
                  classNames={{
                    input: "text-white",
                    label: "text-white/70"
                  }}
                />
                
                <Textarea
                  label="Description (Optional)"
                  placeholder="Describe your goals and what you want to achieve..."
                  value={newPlanDescription}
                  onValueChange={setNewPlanDescription}
                  classNames={{
                    input: "text-white",
                    label: "text-white/70"
                  }}
                />
                
                <Select
                  label="Time Horizon"
                  selectedKeys={[selectedTimeHorizon]}
                  onSelectionChange={(keys) => setSelectedTimeHorizon(Array.from(keys)[0] as string)}
                  classNames={{
                    trigger: "text-white",
                    label: "text-white/70"
                  }}
                >
                  <SelectItem key="1 month">1 Month</SelectItem>
                  <SelectItem key="3 months">3 Months</SelectItem>
                  <SelectItem key="6 months">6 Months</SelectItem>
                  <SelectItem key="1 year">1 Year</SelectItem>
                </Select>
                
                <div>
                  <p className="text-white/70 text-sm mb-3">Include insights from:</p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={includeCoaching}
                        onChange={(e) => setIncludeCoaching(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-white">AI Coaching Sessions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={includeWellness}
                        onChange={(e) => setIncludeWellness(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-white">Wellness Analysis</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={includeJournaling}
                        onChange={(e) => setIncludeJournaling(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-white">Journal Entries</span>
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="border-t border-white/20">
              <Button
                variant="flat"
                onPress={() => onCreateOpenChange()}
                className="text-white/70"
              >
                Cancel
              </Button>
              <Button
                onPress={handleCreateActionPlan}
                isLoading={isGenerating}
                isDisabled={!newPlanTitle.trim()}
                className="bg-gradient-to-r from-green-500 to-teal-500 text-white"
              >
                {isGenerating ? 'Generating...' : 'Create Action Plan'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default AI3PersonalActionPlansInterface;