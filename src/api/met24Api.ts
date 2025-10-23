import { logger } from '../utils/logger';

// Types voor MET2.4 API responses
export interface MET24ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface MET24DomainResponse {
  id: string;
  domain_number: number;
  domain_name: string;
  domain_description?: string;
  philosophical_level: string;
  practical_applications?: string[];
  theoretical_framework?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface MET24DomainRelationResponse {
  id: string;
  source_domain_id: string;
  target_domain_id: string;
  relation_type: string;
  relation_strength: number;
  relation_description?: string;
  bidirectional: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface MET24InsightResponse {
  id: string;
  domain_id: string;
  insight_title: string;
  insight_description?: string;
  insight_type: string;
  evidence_level: number;
  source_reference?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface MET24ApplicationResponse {
  id: string;
  domain_id: string;
  application_name: string;
  application_description?: string;
  application_type: string;
  difficulty_level: number;
  estimated_duration_minutes?: number;
  materials_needed?: string[];
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface MET24UserProgressResponse {
  user_id: string;
  domain_id: string;
  progress_percentage: number;
  completed_insights?: string[];
  completed_applications?: string[];
  current_insight_id?: string;
  current_application_id?: string;
  learning_path?: any[];
  achievements?: any[];
  notes?: string;
  last_accessed_at?: number;
  created_at: number;
  updated_at: number;
}

export interface MET24VectorSearchRequest {
  query_vector: number[];
  content_type?: string;
  limit?: number;
  similarity_threshold?: number;
}

export interface MET24VectorSearchResponse {
  content_id: string;
  content_type: string;
  content_text: string;
  similarity_score: number;
  metadata: Record<string, any>;
}

export interface MET24RecommendationRequest {
  user_id: string;
  domain_id?: string;
  limit?: number;
  recommendation_type?: string;
}

export interface MET24RecommendationResponse {
  content_id: string;
  content_type: string;
  title: string;
  description?: string;
  recommendation_score: number;
  recommendation_reason: string;
  mbti_alignment?: Record<string, any>;
}

class MET24Api {
  private baseUrl: string;
  private apiKey: string;
  private timeout: number = 10000; // 10 seconds

  constructor() {
    this.baseUrl = process.env.REACT_APP_MET24_API_URL || 'https://api.met24.com';
    this.apiKey = process.env.REACT_APP_MET24_API_KEY || '';
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<MET24ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          logger.error('MET2.4 API request timeout', { endpoint, timeout: this.timeout });
          return {
            success: false,
            error: 'Request timeout',
            timestamp: new Date().toISOString(),
          };
        }
        
        logger.error('MET2.4 API request failed', { 
          endpoint, 
          error: error.message 
        });
        return {
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        };
      }

      return {
        success: false,
        error: 'Unknown error occurred',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // ===== DOMAIN ENDPOINTS =====

  async getDomains(): Promise<MET24ApiResponse<MET24DomainResponse[]>> {
    return this.makeRequest<MET24DomainResponse[]>('/api/met24/domains');
  }

  async getDomain(domainId: string): Promise<MET24ApiResponse<MET24DomainResponse>> {
    return this.makeRequest<MET24DomainResponse>(`/api/met24/domains/${domainId}`);
  }

  async getDomainByNumber(domainNumber: number): Promise<MET24ApiResponse<MET24DomainResponse>> {
    return this.makeRequest<MET24DomainResponse>(`/api/met24/domains/number/${domainNumber}`);
  }

  async getRelatedDomains(domainId: string): Promise<MET24ApiResponse<MET24DomainRelationResponse[]>> {
    return this.makeRequest<MET24DomainRelationResponse[]>(`/api/met24/domains/${domainId}/relations`);
  }

  // ===== INSIGHT ENDPOINTS =====

  async getInsights(): Promise<MET24ApiResponse<MET24InsightResponse[]>> {
    return this.makeRequest<MET24InsightResponse[]>('/api/met24/insights');
  }

  async getInsightsByDomain(domainId: string): Promise<MET24ApiResponse<MET24InsightResponse[]>> {
    return this.makeRequest<MET24InsightResponse[]>(`/api/met24/insights/domain/${domainId}`);
  }

  async getInsight(insightId: string): Promise<MET24ApiResponse<MET24InsightResponse>> {
    return this.makeRequest<MET24InsightResponse>(`/api/met24/insights/${insightId}`);
  }

  // ===== APPLICATION ENDPOINTS =====

  async getApplications(): Promise<MET24ApiResponse<MET24ApplicationResponse[]>> {
    return this.makeRequest<MET24ApplicationResponse[]>('/api/met24/applications');
  }

  async getApplicationsByDomain(domainId: string): Promise<MET24ApiResponse<MET24ApplicationResponse[]>> {
    return this.makeRequest<MET24ApplicationResponse[]>(`/api/met24/applications/domain/${domainId}`);
  }

  async getApplication(applicationId: string): Promise<MET24ApiResponse<MET24ApplicationResponse>> {
    return this.makeRequest<MET24ApplicationResponse>(`/api/met24/applications/${applicationId}`);
  }

  // ===== USER PROGRESS ENDPOINTS =====

  async getUserProgress(userId: string): Promise<MET24ApiResponse<MET24UserProgressResponse[]>> {
    return this.makeRequest<MET24UserProgressResponse[]>(`/api/met24/user-progress/${userId}`);
  }

  async getUserProgressByDomain(userId: string, domainId: string): Promise<MET24ApiResponse<MET24UserProgressResponse>> {
    return this.makeRequest<MET24UserProgressResponse>(`/api/met24/user-progress/${userId}/domain/${domainId}`);
  }

  async updateUserProgress(
    userId: string,
    domainId: string,
    progress: Partial<MET24UserProgressResponse>
  ): Promise<MET24ApiResponse<MET24UserProgressResponse>> {
    return this.makeRequest<MET24UserProgressResponse>(
      `/api/met24/user-progress/${userId}/domain/${domainId}`,
      {
        method: 'PUT',
        body: JSON.stringify(progress),
      }
    );
  }

  async createUserProgress(
    userId: string,
    progress: Omit<MET24UserProgressResponse, 'user_id' | 'created_at' | 'updated_at'>
  ): Promise<MET24ApiResponse<MET24UserProgressResponse>> {
    return this.makeRequest<MET24UserProgressResponse>(
      `/api/met24/user-progress/${userId}`,
      {
        method: 'POST',
        body: JSON.stringify(progress),
      }
    );
  }

  // ===== VECTOR SEARCH ENDPOINTS =====

  async searchSimilarContent(
    request: MET24VectorSearchRequest
  ): Promise<MET24ApiResponse<MET24VectorSearchResponse[]>> {
    return this.makeRequest<MET24VectorSearchResponse[]>(
      '/api/met24/vector-search',
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  }

  async getContentRecommendations(
    request: MET24RecommendationRequest
  ): Promise<MET24ApiResponse<MET24RecommendationResponse[]>> {
    return this.makeRequest<MET24RecommendationResponse[]>(
      '/api/met24/recommendations',
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  }

  // ===== SYNC ENDPOINTS =====

  async syncData(
    tableName: string,
    recordId: string,
    operation: string,
    data: any
  ): Promise<MET24ApiResponse<any>> {
    return this.makeRequest<any>(
      '/api/met24/sync',
      {
        method: 'POST',
        body: JSON.stringify({
          table_name: tableName,
          record_id: recordId,
          operation,
          data,
        }),
      }
    );
  }

  async getSyncStatus(userId: string): Promise<MET24ApiResponse<any>> {
    return this.makeRequest<any>(`/api/met24/sync-status/${userId}`);
  }

  // ===== HEALTH CHECK ENDPOINTS =====

  async healthCheck(): Promise<MET24ApiResponse<any>> {
    return this.makeRequest<any>('/api/met24/health');
  }

  async getMetrics(): Promise<MET24ApiResponse<any>> {
    return this.makeRequest<any>('/api/met24/metrics');
  }

  // ===== UTILITY METHODS =====

  async testConnection(): Promise<boolean> {
    try {
      const response = await this.healthCheck();
      return response.success;
    } catch (error) {
      logger.error('MET2.4 API connection test failed', { 
        error: error instanceof Error ? error.message : String(error) 
      });
      return false;
    }
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
  }

  setTimeout(timeout: number): void {
    this.timeout = timeout;
  }
}

// Export singleton instance
export const met24Api = new MET24Api();
export default met24Api;
