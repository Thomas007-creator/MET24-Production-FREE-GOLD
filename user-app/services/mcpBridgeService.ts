// MCP Bridge Service - Dashboard Integration
// Connects N8N ChatLLM Dashboard with MCP-Bridge on port 3001

interface MCPBridgeConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
}

interface MCPBridgeResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

interface N8NWorkflowStatus {
  id: string;
  name: string;
  active: boolean;
  lastExecution: {
    status: 'success' | 'error' | 'running' | 'waiting';
    startedAt: string;
    finishedAt?: string;
    executionTime?: number;
  };
  totalExecutions: number;
  successRate: number;
}

interface ChatLLMServiceHealth {
  serviceId: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'local' | 'mcp';
  status: 'online' | 'offline' | 'degraded';
  responseTime: number;
  lastHealthCheck: string;
  requestsToday: number;
  errorsToday: number;
  uptime: string;
}

class MCPBridgeService {
  private config: MCPBridgeConfig;
  private baseUrl: string;

  constructor(config?: Partial<MCPBridgeConfig>) {
    this.config = {
      baseUrl: 'http://localhost:3001',
      timeout: 5000,
      retryAttempts: 3,
      ...config
    };
    this.baseUrl = this.config.baseUrl;
  }

  // === N8N Workflow Management ===
  
  async getWorkflows(): Promise<MCPBridgeResponse<N8NWorkflowStatus[]>> {
    try {
      const response = await this.makeRequest('/api/n8n/workflows');
      return {
        success: true,
        data: response.workflows,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return this.handleError('Failed to fetch N8N workflows', error);
    }
  }

  async getWorkflowStatus(workflowId: string): Promise<MCPBridgeResponse<N8NWorkflowStatus>> {
    try {
      const response = await this.makeRequest(`/api/n8n/workflows/${workflowId}`);
      return {
        success: true,
        data: response.workflow,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return this.handleError(`Failed to fetch workflow ${workflowId}`, error);
    }
  }

  async startWorkflow(workflowId: string): Promise<MCPBridgeResponse<{ executionId: string }>> {
    try {
      const response = await this.makeRequest(`/api/n8n/workflows/${workflowId}/start`, {
        method: 'POST'
      });
      return {
        success: true,
        data: { executionId: response.executionId },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return this.handleError(`Failed to start workflow ${workflowId}`, error);
    }
  }

  async stopWorkflow(workflowId: string): Promise<MCPBridgeResponse<{ stopped: boolean }>> {
    try {
      const response = await this.makeRequest(`/api/n8n/workflows/${workflowId}/stop`, {
        method: 'POST'
      });
      return {
        success: true,
        data: { stopped: response.stopped },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return this.handleError(`Failed to stop workflow ${workflowId}`, error);
    }
  }

  async getWorkflowExecutions(workflowId: string, limit = 10): Promise<MCPBridgeResponse<any[]>> {
    try {
      const response = await this.makeRequest(`/api/n8n/workflows/${workflowId}/executions?limit=${limit}`);
      return {
        success: true,
        data: response.executions,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return this.handleError(`Failed to fetch executions for workflow ${workflowId}`, error);
    }
  }

  // === ChatLLM Service Management ===

  async getChatLLMServices(): Promise<MCPBridgeResponse<ChatLLMServiceHealth[]>> {
    try {
      const response = await this.makeRequest('/api/chatllm/services');
      return {
        success: true,
        data: response.services,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return this.handleError('Failed to fetch ChatLLM services', error);
    }
  }

  async getChatLLMServiceHealth(serviceId: string): Promise<MCPBridgeResponse<ChatLLMServiceHealth>> {
    try {
      const response = await this.makeRequest(`/api/chatllm/services/${serviceId}/health`);
      return {
        success: true,
        data: response.service,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return this.handleError(`Failed to check health for service ${serviceId}`, error);
    }
  }

  async restartChatLLMService(serviceId: string): Promise<MCPBridgeResponse<{ restarted: boolean }>> {
    try {
      const response = await this.makeRequest(`/api/chatllm/services/${serviceId}/restart`, {
        method: 'POST'
      });
      return {
        success: true,
        data: { restarted: response.restarted },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return this.handleError(`Failed to restart service ${serviceId}`, error);
    }
  }

  // === System Health & Metrics ===

  async getSystemHealth(): Promise<MCPBridgeResponse<{
    overall: 'healthy' | 'degraded' | 'critical';
    services: Record<string, 'up' | 'down' | 'warning'>;
    uptime: number;
    lastUpdate: string;
  }>> {
    try {
      const response = await this.makeRequest('/api/system/health');
      return {
        success: true,
        data: response.health,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return this.handleError('Failed to fetch system health', error);
    }
  }

  async getMetrics(timeRange = '24h'): Promise<MCPBridgeResponse<{
    workflows: {
      total: number;
      active: number;
      executions: number;
      successRate: number;
    };
    chatllm: {
      requests: number;
      errors: number;
      avgResponseTime: number;
      totalCost: number;
    };
    system: {
      cpu: number;
      memory: number;
      disk: number;
    };
  }>> {
    try {
      const response = await this.makeRequest(`/api/metrics?range=${timeRange}`);
      return {
        success: true,
        data: response.metrics,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return this.handleError('Failed to fetch metrics', error);
    }
  }

  // === WebSocket for Real-time Updates ===

  setupRealtimeConnection(onMessage: (data: any) => void): WebSocket | null {
    try {
      const wsUrl = this.baseUrl.replace('http', 'ws') + '/ws/dashboard';
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('MCP Bridge WebSocket connected');
        // Subscribe to real-time updates
        ws.send(JSON.stringify({
          type: 'subscribe',
          channels: ['workflows', 'chatllm', 'system']
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('MCP Bridge WebSocket disconnected');
        // Attempt reconnection after 5 seconds
        setTimeout(() => this.setupRealtimeConnection(onMessage), 5000);
      };

      ws.onerror = (error) => {
        console.error('MCP Bridge WebSocket error:', error);
      };

      return ws;
    } catch (error) {
      console.error('Failed to setup WebSocket connection:', error);
      return null;
    }
  }

  // === Database Operations ===

  async syncDatabase(): Promise<MCPBridgeResponse<{ synced: boolean; records: number }>> {
    try {
      const response = await this.makeRequest('/api/database/sync', {
        method: 'POST'
      });
      return {
        success: true,
        data: {
          synced: response.success,
          records: response.recordsProcessed
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return this.handleError('Failed to sync database', error);
    }
  }

  async getDatabaseStatus(): Promise<MCPBridgeResponse<{
    watermelon: 'connected' | 'disconnected';
    supabase: 'connected' | 'disconnected' | 'syncing';
    lastSync: string;
    pendingOperations: number;
  }>> {
    try {
      const response = await this.makeRequest('/api/database/status');
      return {
        success: true,
        data: response.status,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return this.handleError('Failed to fetch database status', error);
    }
  }

  // === Emergency Controls ===

  async emergencyStopAll(): Promise<MCPBridgeResponse<{
    workflowsStopped: number;
    servicesPaused: number;
  }>> {
    try {
      const response = await this.makeRequest('/api/emergency/stop-all', {
        method: 'POST'
      });
      return {
        success: true,
        data: {
          workflowsStopped: response.workflowsStopped,
          servicesPaused: response.servicesPaused
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return this.handleError('Failed to execute emergency stop', error);
    }
  }

  async restartAllServices(): Promise<MCPBridgeResponse<{
    servicesRestarted: string[];
    failures: string[];
  }>> {
    try {
      const response = await this.makeRequest('/api/emergency/restart-all', {
        method: 'POST'
      });
      return {
        success: true,
        data: {
          servicesRestarted: response.restarted,
          failures: response.failed
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return this.handleError('Failed to restart all services', error);
    }
  }

  // === Utility Methods ===

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private handleError(message: string, error: any): MCPBridgeResponse {
    console.error(message, error);
    return {
      success: false,
      error: `${message}: ${error.message || error}`,
      timestamp: new Date().toISOString()
    };
  }

  // === Connection Health Check ===

  async checkConnection(): Promise<boolean> {
    try {
      const response = await this.makeRequest('/api/health');
      return response.status === 'ok';
    } catch (error) {
      console.error('MCP Bridge connection check failed:', error);
      return false;
    }
  }
}

// Singleton instance
export const mcpBridgeService = new MCPBridgeService();

// Export types for use in components
export type { 
  N8NWorkflowStatus, 
  ChatLLMServiceHealth, 
  MCPBridgeResponse 
};