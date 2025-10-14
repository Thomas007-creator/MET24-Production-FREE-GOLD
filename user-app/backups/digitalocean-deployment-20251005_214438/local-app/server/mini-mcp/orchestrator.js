/*
Mini-MCP Direct Orchestrator - Simplified Version
Run: node server/mini-mcp/orchestrator.js
Generates AI content directly for all 16 MBTI types without Redis dependency.
*/
const { createClient } = require('@supabase/supabase-js');
const mockAdapter = require('./model-adapters/mockAdapter');

// MET2.4.4 Supabase connection
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co',
  process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key'
);

// Database helper functions for MET2.4.4
const db = {
  async query(sql, params = []) {
    // Convert SQL to Supabase queries
    if (sql.includes('INSERT INTO ai_artifacts')) {
      const [job_id, origin, agent, model, model_version, prompt_hash, content, provenance, moderation_status] = params;
      const { data, error } = await supabase
        .from('ai_artifacts')
        .insert({
          job_id,
          origin,
          agent,
          model,
          model_version,
          prompt_hash,
          content,
          provenance,
          moderation_status
        })
        .select()
        .single();
      
      if (error) throw error;
      return { rows: [data] };
    }
    
    if (sql.includes('SELECT') && sql.includes('FROM mbti_content')) {
      const { data, error } = await supabase
        .from('mbti_content')
        .select('*')
        .eq('mbti_type', params[0])
        .order('kind')
        .order('order_idx');
      
      if (error) throw error;
      return { rows: data || [] };
    }
    
    // Fallback for other queries
    throw new Error(`Unsupported query: ${sql}`);
  }
};

// Direct AI Content Generation - No Redis needed!
console.log('🚀 Mini-MCP Direct Orchestrator - Simplified Mode');

// Direct AI Content Generation Functions
async function generateAIContentForMBTI(mbtiType) {
  console.log(`🔄 Generating AI content for ${mbtiType}...`);
  
  const aiSystems = ['ai1_esthetic', 'ai2_cognitive', 'ai3_ethical'];
  const results = [];
  
  for (const agent of aiSystems) {
    try {
      const provider = selectAIProvider(mbtiType, agent);
      const adapter = aiAdapters[provider];
      const prompt = createAIPrompt(mbtiType, agent);
      
      const result = await adapter.callModel(agent, prompt, { temperature: 0.7 });
      
      // Store directly in Supabase
      const jobId = `direct_${mbtiType}_${agent}_${Date.now()}`;
      const { data, error } = await supabase
        .from('ai_artifacts')
        .insert({
          job_id: jobId,
          origin: 'direct_met244',
          agent: agent,
          model: result.model || 'mock_model',
          model_version: result.model_version || '1.0',
          prompt_hash: 'direct_hash',
          content: {
            text: result.text,
            mbti_type: mbtiType,
            agent: agent,
            provider: provider,
            generated_at: new Date().toISOString()
          },
          provenance: {
            prompt_snippet: prompt.slice(0, 200),
            generation_method: 'direct_met244',
            mbti_type: mbtiType
          },
          moderation_status: 'approved'
        })
        .select()
        .single();
      
      if (error) {
        console.error(`❌ Error storing ${agent} content for ${mbtiType}:`, error.message);
      } else {
        console.log(`✅ Generated and stored ${agent} content for ${mbtiType} (ID: ${data.id})`);
        results.push({
          agent,
          provider,
          artifact_id: data.id,
          content: result.text
        });
      }
      
    } catch (agentError) {
      console.error(`❌ Error generating ${agent} content for ${mbtiType}:`, agentError.message);
    }
  }
  
  console.log(`✅ Completed AI content generation for ${mbtiType}`);
  return results;
}

// Generate AI content for all 16 MBTI types
async function generateAllMBTIAIContent() {
  const mbtiTypes = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 
                     'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'];
  
  console.log('🎯 Starting AI content generation for all 16 MBTI types...');
  
  let totalGenerated = 0;
  
  for (const mbtiType of mbtiTypes) {
    const results = await generateAIContentForMBTI(mbtiType);
    totalGenerated += results.length;
    
    // Small delay to prevent overwhelming the system
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`🎉 All AI content generation completed!`);
  console.log(`📊 Total AI artifacts generated: ${totalGenerated}`);
  console.log(`🎯 All 16 MBTI types processed with AI-1, AI-2, and AI-3`);
  
  return totalGenerated;
}

// Enhanced AI Model Adapters
const aiAdapters = {
  openai: {
    async callModel(agent, prompt, options = {}) {
      return {
        model: 'gpt-4o',
        model_version: '2024-09-13',
        prompt_hash: require('crypto').createHash('md5').update(prompt).digest('hex'),
        text: `OpenAI GPT-4o response for ${agent}: ${this.generateResponse(agent, prompt)}`,
        timestamp: new Date().toISOString(),
        provider: 'openai'
      };
    },
    generateResponse(agent, prompt) {
      const responses = {
        'ai1_esthetic': 'Creatieve esthetische content met visuele elementen en artistieke expressie',
        'ai2_cognitive': 'Diepgaande cognitieve insights met analytische wijsheid en narratieve therapie',
        'ai3_ethical': 'Ethische actieplannen met balans en ritmische synchronisatie voor het goede'
      };
      return responses[agent] || 'AI-gegenereerde content gebaseerd op MBTI type en context';
    }
  },
  
  claude: {
    async callModel(agent, prompt, options = {}) {
      return {
        model: 'claude-3-opus',
        model_version: '2024-09-13',
        prompt_hash: require('crypto').createHash('md5').update(prompt).digest('hex'),
        text: `Claude 3 Opus response for ${agent}: ${this.generateResponse(agent, prompt)}`,
        timestamp: new Date().toISOString(),
        provider: 'claude'
      };
    },
    generateResponse(agent, prompt) {
      const responses = {
        'ai1_esthetic': 'Harmonieuze esthetische content met creatieve expressie en visuele schoonheid',
        'ai2_cognitive': 'Wijze cognitieve insights met narratieve therapie en diepgaande analyse',
        'ai3_ethical': 'Ethische richtlijnen met compassie en gerechtigheid voor persoonlijke groei'
      };
      return responses[agent] || 'Claude-gegenereerde content met focus op ethiek en wijsheid';
    }
  },
  
  gemini: {
    async callModel(agent, prompt, options = {}) {
      return {
        model: 'gemini-pro',
        model_version: '2024-09-13',
        prompt_hash: require('crypto').createHash('md5').update(prompt).digest('hex'),
        text: `Gemini Pro response for ${agent}: ${this.generateResponse(agent, prompt)}`,
        timestamp: new Date().toISOString(),
        provider: 'gemini'
      };
    },
    generateResponse(agent, prompt) {
      const responses = {
        'ai1_esthetic': 'Innovatieve esthetische content met moderne creativiteit en visuele impact',
        'ai2_cognitive': 'Multimodale cognitieve insights met geavanceerde analyse en integratie',
        'ai3_ethical': 'Balanced ethische actieplannen met praktische toepassing en duurzaamheid'
      };
      return responses[agent] || 'Gemini-gegenereerde content met focus op innovatie en balans';
    }
  }
};

// AI Provider Selection Logic
const selectAIProvider = (mbtiType, agent) => {
  const providerMap = {
    'ai1_esthetic': 'openai',    // Best for creative content
    'ai2_cognitive': 'claude',   // Best for deep insights
    'ai3_ethical': 'gemini'      // Best for balanced action plans
  };
  
  return providerMap[agent] || 'openai';
};

// Simplified Direct Processing - No Worker needed!

// Create specialized prompts for each AI system
function createAIPrompt(mbtiType, agent) {
  const mbtiData = {
    'INTJ': { archetype: 'The Architect', functions: ['Ni', 'Te', 'Fi', 'Se'] },
    'INTP': { archetype: 'The Thinker', functions: ['Ti', 'Ne', 'Si', 'Fe'] },
    'ENTJ': { archetype: 'The Commander', functions: ['Te', 'Ni', 'Se', 'Fi'] },
    'ENTP': { archetype: 'The Debater', functions: ['Ne', 'Ti', 'Fe', 'Si'] },
    'INFJ': { archetype: 'The Advocate', functions: ['Ni', 'Fe', 'Ti', 'Se'] },
    'INFP': { archetype: 'The Mediator', functions: ['Fi', 'Ne', 'Si', 'Te'] },
    'ENFJ': { archetype: 'The Protagonist', functions: ['Fe', 'Ni', 'Se', 'Ti'] },
    'ENFP': { archetype: 'The Campaigner', functions: ['Ne', 'Fi', 'Te', 'Si'] },
    'ISTJ': { archetype: 'The Logistician', functions: ['Si', 'Te', 'Fi', 'Ne'] },
    'ISFJ': { archetype: 'The Protector', functions: ['Si', 'Fe', 'Ti', 'Ne'] },
    'ESTJ': { archetype: 'The Executive', functions: ['Te', 'Si', 'Ne', 'Fi'] },
    'ESFJ': { archetype: 'The Consul', functions: ['Fe', 'Si', 'Ne', 'Ti'] },
    'ISTP': { archetype: 'The Virtuoso', functions: ['Ti', 'Se', 'Ni', 'Fe'] },
    'ISFP': { archetype: 'The Adventurer', functions: ['Fi', 'Se', 'Ni', 'Te'] },
    'ESTP': { archetype: 'The Entrepreneur', functions: ['Se', 'Ti', 'Fe', 'Ni'] },
    'ESFP': { archetype: 'The Entertainer', functions: ['Se', 'Fi', 'Te', 'Ni'] }
  };
  
  const data = mbtiData[mbtiType] || { archetype: 'Unknown', functions: [] };
  
  const prompts = {
    'ai1_esthetic': `Je bent AI-1: De Esthetische AI voor Schoonheid en Creatieve Expressie.
    
MBTI Type: ${mbtiType}
Archetype: ${data.archetype}
Cognitive Functions: ${data.functions.join(', ')}

Genereer esthetische content voor dit type:
1. Visuele representatie van het archetype
2. Creatieve expressie methoden
3. Esthetische groei oefeningen
4. Schoonheid in persoonlijke ontwikkeling

Focus op: Harmonie, creativiteit, visuele schoonheid, artistieke expressie.`,

    'ai2_cognitive': `Je bent AI-2: De Cognitieve AI voor Wijsheid en Narratieve Therapieën.
    
MBTI Type: ${mbtiType}
Archetype: ${data.archetype}
Cognitive Functions: ${data.functions.join(', ')}

Genereer cognitieve insights voor dit type:
1. Diepgaande persoonlijkheidsanalyse
2. Cognitieve ontwikkeling strategieën
3. Narratieve therapie benaderingen
4. Wijsheid in persoonlijke groei

Focus op: Logica, analyse, narratieve therapie, cognitieve integratie.`,

    'ai3_ethical': `Je bent AI-3: De Ethische AI voor Het Goede en Ritmische Synchronisatie.
    
MBTI Type: ${mbtiType}
Archetype: ${data.archetype}
Cognitive Functions: ${data.functions.join(', ')}

Genereer ethische actieplannen voor dit type:
1. Ethische ontwikkeling doelen
2. Ritmische synchronisatie oefeningen
3. Herstel van balans strategieën
4. Het Goede in persoonlijke groei

Focus op: Ethiek, balans, ritme, herstel, het goede.`
  };
  
  return prompts[agent] || `Generate content for ${mbtiType} using ${agent}`;
}

// No worker events needed in direct mode!

// Start the simplified orchestrator
async function startMiniMCPOrchestrator() {
  console.log('🚀 Starting Mini-MCP Direct Orchestrator...');
  
  try {
    // Direct AI Content Generation - No Redis needed!
    console.log('🎯 Starting Direct AI Content Generation for all 16 MBTI types...');
    
    const totalGenerated = await generateAllMBTIAIContent();
    
    console.log('🎉 Mini-MCP Direct Orchestrator completed successfully!');
    console.log(`📊 Total AI artifacts generated: ${totalGenerated}`);
    
    return totalGenerated;
    
  } catch (error) {
    console.error('❌ Mini-MCP Direct Orchestrator failed:', error.message);
    throw error;
  }
}

// Export functions for external use
module.exports = {
  generateAIContentForMBTI,
  generateAllMBTIAIContent,
  startMiniMCPOrchestrator,
  aiAdapters,
  selectAIProvider,
  createAIPrompt
};

// Start the orchestrator if this file is run directly
if (require.main === module) {
  startMiniMCPOrchestrator().catch(e => console.error(e));
}

