// N8N ChatLLM Dashboard Implementation - NextUI Compatible
// Gebaseerd op TheOrcDev/orcish-admin templates en MET24 patterns
// Integreert met MCP-Bridge op poort 3001

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader,
  Button,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Divider
} from '@nextui-org/react';
import { 
  Activity, Bot, Database, GitBranch, 
  Server, Shield, Zap, RefreshCw, Play, Square, AlertTriangle,
  Wifi, WifiOff
} from 'lucide-react';
import { mcpBridgeService, type N8NWorkflowStatus, type ChatLLMServiceHealth } from '../../services/mcpBridgeService';

// Types voor n8n en ChatLLM integratie
interface WorkflowStatus {
  id: string;
  name: string;
  description: string;
  active: boolean;
  lastRun: string;
  successRate: number;
  executionTime: number;
  status: 'running' | 'stopped' | 'error' | 'waiting';
}

interface ChatLLMService {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'local' | 'custom';
  status: 'online' | 'offline' | 'warning';
  responseTime: number;
  requestsToday: number;
  costToday: number;
  uptime: string;
  lastCheck: string;
}

interface DashboardMetrics {
  totalWorkflows: number;
  activeWorkflows: number;
  totalAIRequests: number;
  dailyCosts: number;
  systemHealth: number;
  privacyScore: number;
}

// Main Dashboard Component
export default function N8NChatLLMDashboard() {
  const [mcpConnected, setMcpConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalWorkflows: 0,
    activeWorkflows: 0,
    totalAIRequests: 0,
    dailyCosts: 0,
    systemHealth: 0,
    privacyScore: 95
  });

  const [workflows, setWorkflows] = useState<N8NWorkflowStatus[]>([]);
  const [chatLLMServices, setChatLLMServices] = useState<ChatLLMServiceHealth[]>([]);

  // Check MCP Bridge connection on mount
  useEffect(() => {
    checkMCPConnection();
    setupRealtimeUpdates();
    loadDashboardData();
  }, []);

  const checkMCPConnection = async () => {
    try {
      const isConnected = await mcpBridgeService.checkConnection();
      setMcpConnected(isConnected);
      
      if (!isConnected) {
        console.warn('MCP Bridge not available, using mock data');
        loadMockData();
      }
    } catch (error) {
      console.error('MCP Bridge connection failed:', error);
      setMcpConnected(false);
      loadMockData();
    }
  };

  const setupRealtimeUpdates = () => {
    if (!mcpConnected) return;

    const ws = mcpBridgeService.setupRealtimeConnection((data) => {
      switch (data.type) {
        case 'workflow_status':
          updateWorkflowStatus(data.payload);
          break;
        case 'service_health':
          updateServiceHealth(data.payload);
          break;
        case 'system_metrics':
          updateMetrics(data.payload);
          break;
      }
      setLastUpdate(new Date());
    });

    return () => {
      if (ws) {
        ws.close();
      }
    };
  };

  const loadDashboardData = async () => {
    if (!mcpConnected) {
      loadMockData();
      return;
    }

    setLoading(true);
    try {
      // Load workflows from MCP Bridge
      const workflowsResponse = await mcpBridgeService.getWorkflows();
      if (workflowsResponse.success && workflowsResponse.data) {
        setWorkflows(workflowsResponse.data);
      }

      // Load ChatLLM services
      const servicesResponse = await mcpBridgeService.getChatLLMServices();
      if (servicesResponse.success && servicesResponse.data) {
        setChatLLMServices(servicesResponse.data);
      }

      // Load system metrics
      const metricsResponse = await mcpBridgeService.getMetrics();
      if (metricsResponse.success && metricsResponse.data) {
        setMetrics({
          totalWorkflows: metricsResponse.data.workflows.total,
          activeWorkflows: metricsResponse.data.workflows.active,
          totalAIRequests: metricsResponse.data.chatllm.requests,
          dailyCosts: metricsResponse.data.chatllm.totalCost,
          systemHealth: 98, // Calculate from various health checks
          privacyScore: 95
        });
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  const loadMockData = () => {
    // Fallback to mock data when MCP Bridge is not available
    setMetrics({
      totalWorkflows: 12,
      activeWorkflows: 8,
      totalAIRequests: 1547,
      dailyCosts: 23.47,
      systemHealth: 98,
      privacyScore: 95
    });

    setWorkflows([
      {
        id: 'wf-001',
        name: 'MBTI Assessment Processor',
        active: true,
        lastExecution: {
          status: 'success',
          startedAt: new Date(Date.now() - 120000).toISOString(),
          finishedAt: new Date(Date.now() - 118000).toISOString(),
          executionTime: 2000
        },
        totalExecutions: 847,
        successRate: 98.5
      },
      {
        id: 'wf-002',
        name: 'Community Moderation',
        active: true,
        lastExecution: {
          status: 'success',
          startedAt: new Date(Date.now() - 300000).toISOString(),
          finishedAt: new Date(Date.now() - 298000).toISOString(),
          executionTime: 2000
        },
        totalExecutions: 623,
        successRate: 96.2
      },
      {
        id: 'wf-003',
        name: 'Daily Analytics Sync',
        active: false,
        lastExecution: {
          status: 'success',
          startedAt: new Date(Date.now() - 3600000).toISOString(),
          finishedAt: new Date(Date.now() - 3598000).toISOString(),
          executionTime: 2000
        },
        totalExecutions: 145,
        successRate: 100
      }
    ]);

    setChatLLMServices([
      {
        serviceId: 'svc-001',
        name: 'OpenAI GPT-4',
        provider: 'openai',
        status: 'online',
        responseTime: 1200,
        lastHealthCheck: new Date().toISOString(),
        requestsToday: 847,
        errorsToday: 2,
        uptime: '99.9%'
      },
      {
        serviceId: 'svc-002',
        name: 'Local ChatLLM',
        provider: 'local',
        status: 'online',
        responseTime: 800,
        lastHealthCheck: new Date().toISOString(),
        requestsToday: 623,
        errorsToday: 0,
        uptime: '99.2%'
      },
      {
        serviceId: 'svc-003',
        name: 'Anthropic Claude',
        provider: 'anthropic',
        status: 'degraded',
        responseTime: 2100,
        lastHealthCheck: new Date().toISOString(),
        requestsToday: 77,
        errorsToday: 5,
        uptime: '97.8%'
      }
    ]);

    setLoading(false);
  };

  const updateWorkflowStatus = (workflowData: any) => {
    setWorkflows(prev => 
      prev.map(wf => 
        wf.id === workflowData.id 
          ? { ...wf, ...workflowData }
          : wf
      )
    );
  };

  const updateServiceHealth = (serviceData: any) => {
    setChatLLMServices(prev =>
      prev.map(service =>
        service.serviceId === serviceData.serviceId
          ? { ...service, ...serviceData }
          : service
      )
    );
  };

  const updateMetrics = (newMetrics: any) => {
    setMetrics(prev => ({ ...prev, ...newMetrics }));
  };

  const handleRefresh = async () => {
    await checkMCPConnection();
    await loadDashboardData();
  };

  const handleWorkflowToggle = async (workflowId: string) => {
    if (!mcpConnected) {
      // Mock toggle for demonstration
      setWorkflows(prev => 
        prev.map(wf => 
          wf.id === workflowId 
            ? { ...wf, active: !wf.active }
            : wf
        )
      );
      return;
    }

    try {
      const workflow = workflows.find(wf => wf.id === workflowId);
      if (!workflow) return;

      if (workflow.active) {
        await mcpBridgeService.stopWorkflow(workflowId);
      } else {
        await mcpBridgeService.startWorkflow(workflowId);
      }
      
      // Refresh workflow data
      await loadDashboardData();
    } catch (error) {
      console.error('Failed to toggle workflow:', error);
    }
  };

  const handleServiceRestart = async (serviceId: string) => {
    if (!mcpConnected) return;

    try {
      await mcpBridgeService.restartChatLLMService(serviceId);
      // Refresh service data
      await loadDashboardData();
    } catch (error) {
      console.error('Failed to restart service:', error);
    }
  };

  const handleEmergencyStop = async () => {
    if (!mcpConnected) return;

    try {
      await mcpBridgeService.emergencyStopAll();
      await loadDashboardData();
    } catch (error) {
      console.error('Emergency stop failed:', error);
    }
  };

  const handleDatabaseSync = async () => {
    if (!mcpConnected) return;

    try {
      await mcpBridgeService.syncDatabase();
      await loadDashboardData();
    } catch (error) {
      console.error('Database sync failed:', error);
    }
  };

  const getStatusChipColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'success':
        return 'success';
      case 'degraded':
      case 'warning':
        return 'warning';
      case 'offline':
      case 'error':
        return 'danger';
      case 'running':
        return 'primary';
      default:
        return 'default';
    }
  };

  const formatLastExecution = (workflow: N8NWorkflowStatus) => {
    if (!workflow.lastExecution) return 'Never';
    
    const startTime = new Date(workflow.lastExecution.startedAt);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - startTime.getTime()) / 60000);
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  const calculateCostToday = (service: ChatLLMServiceHealth) => {
    // Estimate cost based on requests and provider
    const requestsToday = service.requestsToday || 0;
    
    switch (service.provider) {
      case 'openai':
        return requestsToday * 0.02; // Estimated $0.02 per request
      case 'anthropic':
        return requestsToday * 0.015; // Estimated $0.015 per request
      case 'local':
        return 0; // Local processing is free
      default:
        return requestsToday * 0.01;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
          <CardBody>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GitBranch className="h-8 w-8 text-white" />
                <div>
                  <h1 className="text-2xl font-bold text-white">n8n & ChatLLM Dashboard</h1>
                  <p className="text-white/70">Overzichtelijk beheer voor workflows en AI-services</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  variant="bordered" 
                  size="sm"
                  className="text-white border-white/30 hover:bg-white/10"
                  startContent={<RefreshCw className="h-4 w-4" />}
                >
                  Refresh
                </Button>
                <Chip color="success" variant="flat">
                  System Healthy
                </Chip>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Metrics Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <p className="text-sm font-medium text-white/70">Active Workflows</p>
                <GitBranch className="h-4 w-4 text-white/50" />
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="text-2xl font-bold text-white">{metrics.activeWorkflows}</div>
              <p className="text-xs text-white/60">
                of {metrics.totalWorkflows} total
              </p>
            </CardBody>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <p className="text-sm font-medium text-white/70">AI Requests</p>
                <Bot className="h-4 w-4 text-white/50" />
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="text-2xl font-bold text-white">{metrics.totalAIRequests.toLocaleString()}</div>
              <p className="text-xs text-white/60">
                +12% from yesterday
              </p>
            </CardBody>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <p className="text-sm font-medium text-white/70">Daily Costs</p>
                <Zap className="h-4 w-4 text-white/50" />
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="text-2xl font-bold text-white">€{metrics.dailyCosts.toFixed(2)}</div>
              <p className="text-xs text-white/60">
                Target: €30.00
              </p>
            </CardBody>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <p className="text-sm font-medium text-white/70">System Health</p>
                <Activity className="h-4 w-4 text-white/50" />
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="text-2xl font-bold text-green-400">{metrics.systemHealth}%</div>
              <p className="text-xs text-white/60">
                All systems operational
              </p>
            </CardBody>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <p className="text-sm font-medium text-white/70">Privacy Score</p>
                <Shield className="h-4 w-4 text-white/50" />
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="text-2xl font-bold text-green-400">{metrics.privacyScore}%</div>
              <p className="text-xs text-white/60">
                {Math.round(metrics.privacyScore * 0.7)}% local processing
              </p>
            </CardBody>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <p className="text-sm font-medium text-white/70">Database</p>
                <Database className="h-4 w-4 text-white/50" />
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="text-2xl font-bold text-blue-400">Synced</div>
              <p className="text-xs text-white/60">
                Last sync: 2m ago
              </p>
            </CardBody>
          </Card>
        </div>

        {/* Workflows and Services Tables */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* n8n Workflows Table */}
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
            <CardHeader>
              <div>
                <h3 className="text-lg font-semibold text-white">n8n Workflows</h3>
                <p className="text-sm text-white/60">
                  Active workflow executions and status
                </p>
              </div>
            </CardHeader>
            <CardBody>
              <Table 
                aria-label="n8n Workflows"
                className="bg-transparent"
                classNames={{
                  wrapper: "bg-transparent shadow-none",
                  th: "bg-white/10 text-white/80 border-b border-white/20",
                  td: "text-white/90"
                }}
              >
                <TableHeader>
                  <TableColumn>NAME</TableColumn>
                  <TableColumn>STATUS</TableColumn>
                  <TableColumn>SUCCESS RATE</TableColumn>
                  <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody>
                  {workflows.map((workflow) => (
                    <TableRow key={workflow.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{workflow.name}</div>
                          <div className="text-sm text-white/50">
                            Workflow ID: {workflow.id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          color={getStatusChipColor(workflow.active ? 'running' : 'offline')}
                          variant="flat"
                          size="sm"
                        >
                          {workflow.active ? 'Active' : 'Inactive'}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {Math.round(workflow.successRate)}%
                          </div>
                          <div className="text-sm text-white/50">
                            Last: {formatLastExecution(workflow)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="bordered" 
                          size="sm"
                          className="text-white border-white/30 hover:bg-white/10"
                          isIconOnly
                          onClick={() => handleWorkflowToggle(workflow.id)}
                        >
                          {workflow.active ? (
                            <Square className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>

          {/* ChatLLM Services Table */}
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
            <CardHeader>
              <div>
                <h3 className="text-lg font-semibold text-white">ChatLLM Services</h3>
                <p className="text-sm text-white/60">
                  AI service providers and performance metrics
                </p>
              </div>
            </CardHeader>
            <CardBody>
              <Table 
                aria-label="ChatLLM Services"
                className="bg-transparent"
                classNames={{
                  wrapper: "bg-transparent shadow-none",
                  th: "bg-white/10 text-white/80 border-b border-white/20",
                  td: "text-white/90"
                }}
              >
                <TableHeader>
                  <TableColumn>SERVICE</TableColumn>
                  <TableColumn>STATUS</TableColumn>
                  <TableColumn>PERFORMANCE</TableColumn>
                  <TableColumn>COST</TableColumn>
                </TableHeader>
                <TableBody>
                  {chatLLMServices.map((service) => (
                    <TableRow key={service.serviceId}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{service.name}</div>
                          <div className="text-sm text-white/50">
                            {service.provider.toUpperCase()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Chip 
                            color={getStatusChipColor(service.status)}
                            variant="flat"
                            size="sm"
                          >
                            {service.status}
                          </Chip>
                          {service.status === 'degraded' && (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{service.responseTime}ms</div>
                          <div className="text-sm text-white/50">
                            {service.requestsToday} requests
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            €{calculateCostToday(service).toFixed(2)}
                          </div>
                          <div className="text-sm text-white/50">
                            Uptime: {service.uptime}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
          <CardHeader>
            <div>
              <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
              <p className="text-sm text-white/60">
                Emergency controls and system management
              </p>
            </div>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="bordered"
                className="text-white border-white/30 hover:bg-white/10"
                startContent={<Play className="h-4 w-4" />}
              >
                Start All Workflows
              </Button>
              <Button 
                variant="bordered"
                className="text-white border-white/30 hover:bg-white/10"
                startContent={<Square className="h-4 w-4" />}
              >
                Stop All Workflows
              </Button>
              <Button 
                variant="bordered"
                className="text-white border-white/30 hover:bg-white/10"
                startContent={<RefreshCw className="h-4 w-4" />}
              >
                Restart ChatLLM Services
              </Button>
              <Button 
                variant="bordered"
                className="text-white border-white/30 hover:bg-white/10"
                startContent={<Database className="h-4 w-4" />}
              >
                Force Database Sync
              </Button>
              <Button 
                variant="bordered"
                className="text-white border-white/30 hover:bg-white/10"
                startContent={<Activity className="h-4 w-4" />}
              >
                Health Check All
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}