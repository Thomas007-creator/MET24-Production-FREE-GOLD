const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const preloadRoutes = require('./routes/preload');
const devMbtiRoutes = require('./routes/dev-mbti');
const uploadsRoutes = require('./routes/uploads');

const app = express();

app.use(bodyParser.json());

// public endpoints
app.use('/api/preload', preloadRoutes);

// dev/admin endpoints
app.use('/api/dev/mbti', devMbtiRoutes);

// uploads
app.use('/api/uploads', uploadsRoutes);

// health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Mini-MCP Orchestrator endpoints
app.post('/api/mini-mcp/start-orchestrator', async (req, res) => {
  try {
    const { startMiniMCPOrchestrator } = require('./mini-mcp/orchestrator');
    await startMiniMCPOrchestrator();
    
    res.status(200).json({
      success: true,
      message: 'Mini-MCP Orchestrator started successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.post('/api/mini-mcp/generate-ai-content/:mbtiType', async (req, res) => {
  try {
    const { mbtiType } = req.params;
    const { enqueueAIContentGenerationJob } = require('./mini-mcp/orchestrator');
    
    const jobId = await enqueueAIContentGenerationJob(mbtiType);
    
    res.status(200).json({
      success: true,
      message: `AI content generation job enqueued for ${mbtiType}`,
      jobId,
      mbtiType,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.post('/api/mini-mcp/generate-all-ai-content', async (req, res) => {
  try {
    const { enqueueAllMBTIAIContent } = require('./mini-mcp/orchestrator');
    await enqueueAllMBTIAIContent();
    
    res.status(200).json({
      success: true,
      message: 'AI content generation jobs enqueued for all 16 MBTI types',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// AI content generation endpoints
app.post('/api/ai/generate-content', async (req, res) => {
  try {
    console.log('🚀 Starting AI content generation...');
    
    // Mock AI content generation for now
    const mbtiTypes = ['ISTP', 'ISFP', 'ESTP', 'ESFP'];
    const results = [];
    
    for (const mbtiType of mbtiTypes) {
      console.log(`🔄 Generating content for ${mbtiType}...`);
      
      // Simulate AI content generation
      const aiContent = {
        mbtiType,
        ai1Content: {
          visualRepresentation: {
            title: `${mbtiType} - Visuele Representatie`,
            description: `Een visuele representatie van de ${mbtiType} archetype`,
            elements: ['Geometrische vormen', 'Diepe kleuren', 'Architecturale lijnen'],
            colorPalette: ['#2C3E50', '#3498DB', '#E74C3C', '#F39C12']
          },
          creativeMethods: [
            'Strategische visualisatie oefeningen',
            'Architecturale design als creatieve uitlaatklep',
            'Geometrische kunst als expressie'
          ],
          aestheticExercises: [
            'Ontwerp je ideale toekomst visueel',
            'Creëer een architecturale representatie van je doelen',
            'Visualiseer je strategische plannen'
          ]
        },
        ai2Insights: {
          personalityAnalysis: {
            coreTraits: ['analytical', 'independent', 'decisive', 'strategic'],
            cognitiveFunctions: {
              dominant: 'Ni - Dominant',
              auxiliary: 'Te - Auxiliary',
              tertiary: 'Fi - Tertiary',
              inferior: 'Se - Inferior'
            },
            strengths: ['analytical', 'independent', 'decisive', 'strategic'],
            challenges: ['perfectionism', 'social_situations', 'details']
          },
          developmentStrategies: [
            'Ontwikkel sociale vaardigheden door praktische oefening',
            'Oefen met communicatie in dagelijkse situaties',
            'Integreer geduld in je routine'
          ]
        },
        ai3ActionPlan: {
          ethicalGoals: [
            'Gebruik je analytische vaardigheden voor het algemeen welzijn',
            'Ontwikkel empathie voor anderen hun perspectieven',
            'Balans tussen perfectionisme en pragmatisme'
          ],
          rhythmicExercises: [
            'Dagelijkse strategische reflectie (15 minuten)',
            'Wekelijkse sociale interactie oefening',
            'Maandelijkse visie herziening en aanpassing'
          ],
          balanceStrategies: [
            'Balans tussen werk en privé',
            'Balans tussen denken en voelen',
            'Balans tussen planning en spontaniteit'
          ]
        },
        generatedAt: new Date().toISOString(),
        quality: 0.9
      };
      
      results.push(aiContent);
      console.log(`✅ Content generated for ${mbtiType}`);
    }
    
    console.log('🎉 AI content generation completed for first batch!');
    
    res.status(200).json({
      success: true,
      message: 'AI content generation completed successfully',
      batch: 4,
      types: mbtiTypes,
      results: results.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ AI content generation failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/ai/generation-progress', (req, res) => {
  res.json({
    success: true,
    progress: {
      currentType: 'ENTP',
      currentBatch: 1,
      totalTypes: 16,
      completedTypes: 4,
      estimatedTimeRemaining: 72
    },
    isRunning: false,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

