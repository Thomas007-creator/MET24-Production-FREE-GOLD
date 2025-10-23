/**
 * Agent Executor - Agentic Task Planning & Execution
 * 
 * Implementeert Grok-4's agentic vision:
 * - Task decomposition & planning
 * - Tool calling framework
 * - ReAct loop (Reason + Act + Observe + Reflect)
 * - EU AI Act compliance (integreert met bestaande policy engine)
 * - Long-running autonomous execution (4-6 hours)
 * 
 * @version 1.0.0
 * @author Thomas (inspired by Grok-4)
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Types
interface Task {
  id: string;
  goal: string;
  subTasks: SubTask[];
  priority: number;
  estimatedDuration: number;
  dependencies: string[];
  toolsRequired: string[];
  mbtiOptimized?: string;
}

interface SubTask {
  id: string;
  action: string;
  toolName: string;
  params: any;
  expectedOutput: string;
  completed: boolean;
  result?: any;
}

interface ExecutionPlan {
  planId: string;
  totalTasks: number;
  estimatedDuration: number;
  riskLevel: 'low' | 'medium' | 'high';
  requiresHumanOversight: boolean;
  tasks: Task[];
  checkpoints: number[];
}

interface ReflectionResult {
  quality: number;
  insights: string[];
  nextActions: string[];
  riskAssessment: string;
  shouldContinue: boolean;
}

interface AgentExecutorRequest {
  goal: string;
  userId: string;
  mbtiType?: string;
  maxDuration?: number; // in hours
  supervisionLevel?: 'none' | 'checkpoints' | 'realtime';
  allowedTools?: string[];
}

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Tool Registry - Safe tools voor agentic execution
const TOOL_REGISTRY: Record<string, any> = {
  // Safe read-only tools
  'getWeather': {
    description: 'Get weather information',
    riskLevel: 'low',
    params: {
      type: 'object',
      properties: {
        location: { type: 'string' }
      },
      required: ['location']
    }
  },
  'analyzeText': {
    description: 'Analyze text for MBTI insights',
    riskLevel: 'low',
    params: {
      type: 'object',
      properties: {
        text: { type: 'string' },
        analysisType: { type: 'string', enum: ['mbti', 'sentiment', 'topics'] }
      },
      required: ['text']
    }
  },
  'generateInsights': {
    description: 'Generate personalized insights',
    riskLevel: 'medium',
    params: {
      type: 'object',
      properties: {
        context: { type: 'string' },
        mbtiType: { type: 'string' }
      },
      required: ['context']
    }
  },
  'scheduleReminder': {
    description: 'Schedule a personal reminder',
    riskLevel: 'low',
    params: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        timeOffset: { type: 'number' }, // minutes from now
        mbtiPersonalized: { type: 'boolean' }
      },
      required: ['message', 'timeOffset']
    }
  }
};

// Agent Executor Class
class AgentExecutor {
  private executionId: string;
  private userId: string;
  private traceId: string;

  constructor(userId: string) {
    this.userId = userId;
    this.executionId = crypto.randomUUID();
    this.traceId = crypto.randomUUID();
  }

  /**
   * Main execution entry point
   */
  async execute(request: AgentExecutorRequest): Promise<any> {
    console.log(`🤖 Agent Executor starting for goal: ${request.goal}`);

    try {
      // Step 1: Policy Gate (use existing policy engine)
      const policyDecision = await this.checkPolicy(request);
      if (policyDecision.action !== 'ALLOW') {
        return this.createResponse('refused', {
          reason: policyDecision.reasons.join(', '),
          policy: policyDecision
        });
      }

      // Step 2: Task Planning
      const executionPlan = await this.planTasks(request);
      console.log(`📋 Generated plan with ${executionPlan.tasks.length} tasks`);

      // Step 3: Execution Loop
      const results = await this.executeWithReflection(executionPlan, request);

      // Step 4: Final Reflection
      const finalReflection = await this.finalReflection(results, request);

      return this.createResponse('completed', {
        executionId: this.executionId,
        results,
        reflection: finalReflection,
        totalDuration: results.totalDuration,
        tasksCompleted: results.completedTasks
      });

    } catch (error) {
      console.error('❌ Agent execution failed:', error);
      
      await this.logAuditEvent('agent_execution_failed', {
        error: error.message,
        goal: request.goal
      });

      return this.createResponse('error', {
        error: error.message,
        executionId: this.executionId
      });
    }
  }

  /**
   * Check policy with existing policy engine
   */
  private async checkPolicy(request: AgentExecutorRequest): Promise<any> {
    try {
      const { data, error } = await supabase.rpc('evaluate_agent_policy', {
        p_goal: request.goal,
        p_user_id: request.userId,
        p_mbti_type: request.mbtiType,
        p_max_duration: request.maxDuration || 6,
        p_allowed_tools: request.allowedTools || Object.keys(TOOL_REGISTRY)
      });

      if (error) throw error;

      return data || { action: 'ALLOW', reasons: [], confidence: 1.0 };
    } catch (error) {
      console.error('Policy check failed:', error);
      // Fail safe: require human oversight
      return {
        action: 'ESCALATE',
        reasons: ['Policy engine unavailable - human oversight required'],
        confidence: 1.0
      };
    }
  }

  /**
   * Task Planning - Decompose goal into executable tasks
   */
  private async planTasks(request: AgentExecutorRequest): Promise<ExecutionPlan> {
    console.log('🧠 Planning tasks for goal:', request.goal);

    // Use existing AI orchestrator for LLM-based planning
    const planningPrompt = this.createPlanningPrompt(request);
    
    const { data: aiResponse } = await supabase.rpc('call_ai_orchestrator', {
      p_prompt: planningPrompt,
      p_user_id: request.userId,
      p_mbti_type: request.mbtiType,
      p_safety_level: 'high'
    });

    // Parse AI response into structured plan
    const plan = this.parseAIPlan(aiResponse?.response || '', request);
    
    await this.logAuditEvent('task_planning_completed', {
      goal: request.goal,
      totalTasks: plan.tasks.length,
      estimatedDuration: plan.estimatedDuration
    });

    return plan;
  }

  /**
   * Execute tasks with reflection loop
   */
  private async executeWithReflection(plan: ExecutionPlan, request: AgentExecutorRequest): Promise<any> {
    const results = {
      completedTasks: 0,
      failedTasks: 0,
      totalDuration: 0,
      checkpointReflections: [],
      finalOutputs: []
    };

    const startTime = Date.now();

    for (let i = 0; i < plan.tasks.length; i++) {
      const task = plan.tasks[i];
      console.log(`🔄 Executing task ${i + 1}/${plan.tasks.length}: ${task.goal}`);

      try {
        // Execute task
        const taskResult = await this.executeTask(task, request);
        results.finalOutputs.push(taskResult);
        results.completedTasks++;

        // Checkpoint reflection every N tasks
        if (plan.checkpoints.includes(i) || i === plan.tasks.length - 1) {
          const reflection = await this.reflect(results, task, request);
          results.checkpointReflections.push(reflection);

          if (!reflection.shouldContinue) {
            console.log('🛑 Stopping execution based on reflection');
            break;
          }
        }

        // Safety: Check total duration
        const currentDuration = (Date.now() - startTime) / (1000 * 60 * 60); // hours
        if (currentDuration > (request.maxDuration || 6)) {
          console.log('⏰ Max duration reached, stopping execution');
          break;
        }

      } catch (error) {
        console.error(`❌ Task ${i + 1} failed:`, error);
        results.failedTasks++;
        
        await this.logAuditEvent('task_execution_failed', {
          taskId: task.id,
          error: error.message
        });
      }
    }

    results.totalDuration = (Date.now() - startTime) / (1000 * 60); // minutes

    return results;
  }

  /**
   * Execute individual task with tool calling
   */
  private async executeTask(task: Task, request: AgentExecutorRequest): Promise<any> {
    const taskResults = [];

    for (const subTask of task.subTasks) {
      try {
        const toolResult = await this.executeTool(subTask.toolName, subTask.params);
        subTask.result = toolResult;
        subTask.completed = true;
        taskResults.push(toolResult);

        await this.logAuditEvent('tool_executed', {
          taskId: task.id,
          toolName: subTask.toolName,
          params: subTask.params,
          success: true
        });

      } catch (error) {
        console.error(`Tool ${subTask.toolName} failed:`, error);
        subTask.completed = false;
        
        await this.logAuditEvent('tool_execution_failed', {
          taskId: task.id,
          toolName: subTask.toolName,
          error: error.message
        });
      }
    }

    return {
      taskId: task.id,
      goal: task.goal,
      results: taskResults,
      completedSubTasks: task.subTasks.filter(st => st.completed).length,
      totalSubTasks: task.subTasks.length
    };
  }

  /**
   * Execute tool safely
   */
  private async executeTool(toolName: string, params: any): Promise<any> {
    const tool = TOOL_REGISTRY[toolName];
    
    if (!tool) {
      throw new Error(`Unknown tool: ${toolName}`);
    }

    // Validate params against schema
    this.validateToolParams(toolName, params);

    switch (toolName) {
      case 'getWeather':
        return await this.executeWeatherTool(params);
      case 'analyzeText':
        return await this.executeAnalyzeTool(params);
      case 'generateInsights':
        return await this.executeInsightsTool(params);
      case 'scheduleReminder':
        return await this.executeReminderTool(params);
      default:
        throw new Error(`Tool execution not implemented: ${toolName}`);
    }
  }

  /**
   * Reflection after task completion
   */
  private async reflect(results: any, lastTask: Task, request: AgentExecutorRequest): Promise<ReflectionResult> {
    const reflectionPrompt = `
Reflect on the task execution progress:

Goal: ${request.goal}
Last completed task: ${lastTask.goal}
Tasks completed: ${results.completedTasks}
Tasks failed: ${results.failedTasks}
Current duration: ${results.totalDuration} minutes

Assess:
1. Quality of results so far (0-1 score)
2. Key insights discovered
3. Recommended next actions
4. Risk assessment
5. Should execution continue?

Respond in JSON format:
{
  "quality": 0.8,
  "insights": ["insight1", "insight2"],
  "nextActions": ["action1", "action2"],
  "riskAssessment": "low|medium|high",
  "shouldContinue": true|false
}
`;

    try {
      const { data: aiResponse } = await supabase.rpc('call_ai_orchestrator', {
        p_prompt: reflectionPrompt,
        p_user_id: request.userId,
        p_mbti_type: request.mbtiType,
        p_safety_level: 'maximum'
      });

      const reflection = JSON.parse(aiResponse?.response || '{}');
      
      await this.logAuditEvent('reflection_completed', {
        quality: reflection.quality,
        shouldContinue: reflection.shouldContinue,
        riskAssessment: reflection.riskAssessment
      });

      return reflection;

    } catch (error) {
      console.error('Reflection failed:', error);
      // Fail safe
      return {
        quality: 0.5,
        insights: ['Reflection unavailable'],
        nextActions: ['Continue with caution'],
        riskAssessment: 'medium',
        shouldContinue: true
      };
    }
  }

  /**
   * Final reflection on entire execution
   */
  private async finalReflection(results: any, request: AgentExecutorRequest): Promise<any> {
    const finalPrompt = `
Final reflection on autonomous execution:

Original Goal: ${request.goal}
Total Tasks Completed: ${results.completedTasks}
Total Tasks Failed: ${results.failedTasks}
Total Duration: ${results.totalDuration} minutes

Provide a comprehensive summary:
1. How well was the goal achieved?
2. Most valuable insights discovered
3. Lessons learned for future executions
4. Recommendations for the user

Format as JSON with summary, insights, lessons, and recommendations.
`;

    try {
      const { data: aiResponse } = await supabase.rpc('call_ai_orchestrator', {
        p_prompt: finalPrompt,
        p_user_id: request.userId,
        p_mbti_type: request.mbtiType,
        p_safety_level: 'high'
      });

      return JSON.parse(aiResponse?.response || '{}');
    } catch (error) {
      console.error('Final reflection failed:', error);
      return {
        summary: 'Execution completed with mixed results',
        insights: ['Task execution completed'],
        lessons: ['Continue monitoring autonomous executions'],
        recommendations: ['Review results and plan next steps']
      };
    }
  }

  // Helper methods
  private createPlanningPrompt(request: AgentExecutorRequest): string {
    return `
You are an MBTI-aware task planning AI. Break down this goal into executable tasks:

Goal: ${request.goal}
User MBTI: ${request.mbtiType || 'Unknown'}
Max Duration: ${request.maxDuration || 6} hours
Available Tools: ${request.allowedTools?.join(', ') || Object.keys(TOOL_REGISTRY).join(', ')}

Create a detailed execution plan with:
1. 3-8 main tasks
2. Each task broken into 1-3 sub-tasks
3. Estimated duration for each task
4. Dependencies between tasks
5. MBTI-optimized approach

Format as JSON with tasks array containing:
{
  "tasks": [
    {
      "id": "task_1",
      "goal": "specific actionable goal",
      "subTasks": [
        {
          "action": "specific action",
          "toolName": "toolName",
          "params": {"key": "value"},
          "expectedOutput": "what to expect"
        }
      ],
      "priority": 1,
      "estimatedDuration": 30,
      "dependencies": [],
      "mbtiOptimized": "explanation for ${request.mbtiType}"
    }
  ],
  "estimatedTotalDuration": 180,
  "riskLevel": "low",
  "checkpoints": [2, 5]
}
`;
  }

  private parseAIPlan(aiResponse: string, request: AgentExecutorRequest): ExecutionPlan {
    try {
      const parsed = JSON.parse(aiResponse);
      
      return {
        planId: this.executionId,
        totalTasks: parsed.tasks?.length || 0,
        estimatedDuration: parsed.estimatedTotalDuration || 60,
        riskLevel: parsed.riskLevel || 'medium',
        requiresHumanOversight: request.supervisionLevel !== 'none',
        tasks: parsed.tasks || [],
        checkpoints: parsed.checkpoints || [Math.floor((parsed.tasks?.length || 1) / 2)]
      };
    } catch (error) {
      console.error('Failed to parse AI plan:', error);
      // Fallback plan
      return {
        planId: this.executionId,
        totalTasks: 1,
        estimatedDuration: 30,
        riskLevel: 'high',
        requiresHumanOversight: true,
        tasks: [{
          id: 'fallback_task',
          goal: request.goal,
          subTasks: [{
            id: 'fallback_subtask',
            action: 'Manual analysis required',
            toolName: 'generateInsights',
            params: { context: request.goal },
            expectedOutput: 'Basic insights',
            completed: false
          }],
          priority: 1,
          estimatedDuration: 30,
          dependencies: [],
          toolsRequired: ['generateInsights']
        }],
        checkpoints: [0]
      };
    }
  }

  private validateToolParams(toolName: string, params: any): void {
    const tool = TOOL_REGISTRY[toolName];
    if (!tool) return;

    // Basic validation - could be enhanced with JSON schema validation
    const required = tool.params.required || [];
    for (const field of required) {
      if (!(field in params)) {
        throw new Error(`Missing required parameter: ${field} for tool ${toolName}`);
      }
    }
  }

  // Tool implementations
  private async executeWeatherTool(params: any): Promise<any> {
    // Mock weather API - replace with real implementation
    return {
      location: params.location,
      temperature: Math.floor(Math.random() * 30) + 5,
      condition: 'Partly cloudy',
      timestamp: new Date().toISOString()
    };
  }

  private async executeAnalyzeTool(params: any): Promise<any> {
    // Use existing AI orchestrator for text analysis
    const analysisPrompt = `Analyze this text for ${params.analysisType}: "${params.text}"`;
    
    const { data: response } = await supabase.rpc('call_ai_orchestrator', {
      p_prompt: analysisPrompt,
      p_user_id: this.userId,
      p_safety_level: 'high'
    });

    return {
      analysisType: params.analysisType,
      text: params.text.substring(0, 100) + '...',
      result: response?.response || 'Analysis completed',
      confidence: 0.8
    };
  }

  private async executeInsightsTool(params: any): Promise<any> {
    const insightsPrompt = `Generate personalized insights for ${params.mbtiType || 'user'} based on: ${params.context}`;
    
    const { data: response } = await supabase.rpc('call_ai_orchestrator', {
      p_prompt: insightsPrompt,
      p_user_id: this.userId,
      p_mbti_type: params.mbtiType,
      p_safety_level: 'medium'
    });

    return {
      insights: response?.response || 'Insights generated',
      mbtiType: params.mbtiType,
      context: params.context.substring(0, 100) + '...',
      generated: new Date().toISOString()
    };
  }

  private async executeReminderTool(params: any): Promise<any> {
    // Store reminder in database for later processing
    const { data, error } = await supabase
      .from('agent_reminders')
      .insert({
        user_id: this.userId,
        message: params.message,
        scheduled_at: new Date(Date.now() + params.timeOffset * 60 * 1000).toISOString(),
        mbti_personalized: params.mbtiPersonalized,
        execution_id: this.executionId
      });

    if (error) throw error;

    return {
      reminderSet: true,
      message: params.message,
      scheduledFor: new Date(Date.now() + params.timeOffset * 60 * 1000).toISOString(),
      mbtiPersonalized: params.mbtiPersonalized
    };
  }

  private async logAuditEvent(eventType: string, data: any): Promise<void> {
    try {
      await supabase.rpc('create_audit_event', {
        p_trace_id: this.traceId,
        p_event_type: eventType,
        p_actor: 'agent_executor',
        p_user_id: this.userId,
        p_session_id: this.executionId,
        p_risk_signals: data
      });
    } catch (error) {
      console.error('Failed to log audit event:', error);
    }
  }

  private createResponse(status: string, data: any): any {
    return {
      status,
      executionId: this.executionId,
      traceId: this.traceId,
      timestamp: new Date().toISOString(),
      ...data
    };
  }
}

// Main handler
serve(async (req) => {
  try {
    // CORS headers
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    }

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const body = await req.json();
    const { action, ...requestData } = body;

    switch (action) {
      case 'execute': {
        const { goal, userId, mbtiType, maxDuration, supervisionLevel, allowedTools } = requestData;
        
        if (!goal || !userId) {
          return new Response(JSON.stringify({ error: 'Missing required fields: goal, userId' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const executor = new AgentExecutor(userId);
        const result = await executor.execute({
          goal,
          userId,
          mbtiType,
          maxDuration,
          supervisionLevel,
          allowedTools
        });

        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      case 'get_tools': {
        return new Response(JSON.stringify({
          availableTools: Object.keys(TOOL_REGISTRY).map(name => ({
            name,
            description: TOOL_REGISTRY[name].description,
            riskLevel: TOOL_REGISTRY[name].riskLevel,
            params: TOOL_REGISTRY[name].params
          }))
        }), {
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Unknown action' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }

  } catch (error) {
    console.error('Agent Executor error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

console.log('🤖 Agent Executor service started');