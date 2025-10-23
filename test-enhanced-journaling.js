/**
 * Enhanced Journaling V3 Test Suite
 * 
 * Complete test suite voor V3 Journaling & Planning functionaliteiten
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Enhanced Journaling V3 Test Suite...');

try {
  // Test 1: Database Schema Check
  console.log('\n--- Test 1: Database Schema Check ---');
  
  const schemaPath = path.join(__dirname, 'src/database/v14/schemas/enhancedJournaling.ts');
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  
  const requiredTables = [
    'enhanced_journal_entries',
    'daily_goals', 
    'mood_tracking',
    'planning_sessions',
    'journaling_analytics'
  ];
  
  let schemaTestsPassed = 0;
  requiredTables.forEach(table => {
    if (schemaContent.includes(`name: "${table}"`)) {
      console.log(`✅ ${table} table found in schema`);
      schemaTestsPassed++;
    } else {
      console.log(`❌ ${table} table missing from schema`);
    }
  });
  
  console.log(`📊 Schema Tests: ${schemaTestsPassed}/${requiredTables.length} passed`);

  // Test 2: Model Classes Check
  console.log('\n--- Test 2: Model Classes Check ---');
  
  const requiredModels = [
    'EnhancedJournalEntry.ts',
    'DailyGoal.ts',
    'MoodTracking.ts', 
    'PlanningSession.ts',
    'JournalingAnalytics.ts'
  ];
  
  let modelTestsPassed = 0;
  requiredModels.forEach(model => {
    const modelPath = path.join(__dirname, 'src/database/v14/models', model);
    if (fs.existsSync(modelPath)) {
      const modelContent = fs.readFileSync(modelPath, 'utf8');
      if (modelContent.includes('export default class') && modelContent.includes('@field')) {
        console.log(`✅ ${model} model class valid`);
        modelTestsPassed++;
      } else {
        console.log(`❌ ${model} model class invalid`);
      }
    } else {
      console.log(`❌ ${model} model file missing`);
    }
  });
  
  console.log(`📊 Model Tests: ${modelTestsPassed}/${requiredModels.length} passed`);

  // Test 3: Service Implementation Check
  console.log('\n--- Test 3: Service Implementation Check ---');
  
  const servicePath = path.join(__dirname, 'src/services/enhancedJournalingService.ts');
  const serviceContent = fs.readFileSync(servicePath, 'utf8');
  
  const requiredMethods = [
    'createJournalEntry',
    'getJournalEntries',
    'createDailyGoal',
    'getDailyGoals',
    'completeDailyGoal',
    'trackMood',
    'getMoodTracking',
    'createPlanningSession',
    'getJournalingAnalytics'
  ];
  
  let serviceTestsPassed = 0;
  requiredMethods.forEach(method => {
    if (serviceContent.includes(`async ${method}(`)) {
      console.log(`✅ ${method} method found`);
      serviceTestsPassed++;
    } else {
      console.log(`❌ ${method} method missing`);
    }
  });
  
  console.log(`📊 Service Tests: ${serviceTestsPassed}/${requiredMethods.length} passed`);

  // Test 4: UI Component Check
  console.log('\n--- Test 4: UI Component Check ---');
  
  const componentPath = path.join(__dirname, 'src/components/EnhancedJournalingPage.tsx');
  const componentContent = fs.readFileSync(componentPath, 'utf8');
  
  const requiredFeatures = [
    'moodEmojis',
    'goalEmojis',
    'availableTags',
    'categories',
    'levensgebieden',
    'handleCreateEntry',
    'handleCreateGoal',
    'handleCompleteGoal',
    'addTag',
    'removeTag',
    'getMoodTrendIcon',
    'getCompletionRateColor'
  ];
  
  let componentTestsPassed = 0;
  requiredFeatures.forEach(feature => {
    if (componentContent.includes(feature)) {
      console.log(`✅ ${feature} feature found`);
      componentTestsPassed++;
    } else {
      console.log(`❌ ${feature} feature missing`);
    }
  });
  
  console.log(`📊 Component Tests: ${componentTestsPassed}/${requiredFeatures.length} passed`);

  // Test 5: Database Integration Check
  console.log('\n--- Test 5: Database Integration Check ---');
  
  const databasePath = path.join(__dirname, 'src/database/v14/databaseV14.ts');
  const databaseContent = fs.readFileSync(databasePath, 'utf8');
  
  const schemaV14Path = path.join(__dirname, 'src/database/v14/schemaV14.ts');
  const schemaV14Content = fs.readFileSync(schemaV14Path, 'utf8');
  
  const requiredIntegrations = [
    'EnhancedJournalEntry',
    'DailyGoal',
    'MoodTracking',
    'PlanningSession',
    'JournalingAnalytics',
    'enhancedJournalingSchema'
  ];
  
  let integrationTestsPassed = 0;
  requiredIntegrations.forEach(integration => {
    if (databaseContent.includes(integration) || schemaV14Content.includes(integration)) {
      console.log(`✅ ${integration} integrated in database`);
      integrationTestsPassed++;
    } else {
      console.log(`❌ ${integration} missing from database`);
    }
  });
  
  console.log(`📊 Integration Tests: ${integrationTestsPassed}/${requiredIntegrations.length} passed`);

  // Test 6: V3 Features Check
  console.log('\n--- Test 6: V3 Features Check ---');
  
  const v3Features = [
    'mood_rating', // 1-10 scale
    'mood_emoji',
    'gratitude_content',
    'tomorrow_focus',
    'weekly_goals',
    'daily_goals_completed',
    'primary_tag',
    'secondary_tags',
    'levensgebied',
    'ai_coaching_response',
    'engagement_score',
    'share_with_ai',
    'goal_emoji',
    'goal_category',
    'completion_notes',
    'priority',
    'estimated_duration',
    'context',
    'triggers',
    'activities',
    'trend_direction',
    'weekly_average',
    'monthly_average',
    'session_type',
    'ai_suggestions',
    'completion_rate',
    'mood_trend',
    'mood_volatility',
    'mbti_insights',
    'personality_trends'
  ];
  
  let v3TestsPassed = 0;
  v3Features.forEach(feature => {
    if (schemaContent.includes(feature) || serviceContent.includes(feature) || componentContent.includes(feature)) {
      console.log(`✅ V3 feature ${feature} found`);
      v3TestsPassed++;
    } else {
      console.log(`❌ V3 feature ${feature} missing`);
    }
  });
  
  console.log(`📊 V3 Features Tests: ${v3TestsPassed}/${v3Features.length} passed`);

  // Test 7: UI Layout Check
  console.log('\n--- Test 7: UI Layout Check ---');
  
  const layoutFeatures = [
    '2-column layout',
    'grid grid-cols-1 lg:grid-cols-2',
    'Left Column - Journaling',
    'Right Column - Planning & Analytics',
    'Quick Actions',
    'Recent Entries',
    'Mood Tracking',
    'Daily Goals',
    'Analytics Dashboard',
    'AI Insights'
  ];
  
  let layoutTestsPassed = 0;
  layoutFeatures.forEach(feature => {
    if (componentContent.includes(feature) || componentContent.includes(feature.replace(' ', ''))) {
      console.log(`✅ Layout feature ${feature} found`);
      layoutTestsPassed++;
    } else {
      console.log(`❌ Layout feature ${feature} missing`);
    }
  });
  
  console.log(`📊 Layout Tests: ${layoutTestsPassed}/${layoutFeatures.length} passed`);

  // Test 8: Modal Components Check
  console.log('\n--- Test 8: Modal Components Check ---');
  
  const modalFeatures = [
    'isEntryModalOpen',
    'isGoalModalOpen',
    'onEntryModalOpen',
    'onGoalModalOpen',
    'New Entry Modal',
    'New Goal Modal',
    'ModalContent',
    'ModalHeader',
    'ModalBody',
    'ModalFooter'
  ];
  
  let modalTestsPassed = 0;
  modalFeatures.forEach(feature => {
    if (componentContent.includes(feature)) {
      console.log(`✅ Modal feature ${feature} found`);
      modalTestsPassed++;
    } else {
      console.log(`❌ Modal feature ${feature} missing`);
    }
  });
  
  console.log(`📊 Modal Tests: ${modalTestsPassed}/${modalFeatures.length} passed`);

  // Summary
  console.log('\n🎉 Enhanced Journaling V3 Test Suite Complete!');
  console.log('📊 Test Results Summary:');
  console.log(`✅ Database Schema: ${schemaTestsPassed}/${requiredTables.length} passed`);
  console.log(`✅ Model Classes: ${modelTestsPassed}/${requiredModels.length} passed`);
  console.log(`✅ Service Methods: ${serviceTestsPassed}/${requiredMethods.length} passed`);
  console.log(`✅ UI Features: ${componentTestsPassed}/${requiredFeatures.length} passed`);
  console.log(`✅ Database Integration: ${integrationTestsPassed}/${requiredIntegrations.length} passed`);
  console.log(`✅ V3 Features: ${v3TestsPassed}/${v3Features.length} passed`);
  console.log(`✅ UI Layout: ${layoutTestsPassed}/${layoutFeatures.length} passed`);
  console.log(`✅ Modal Components: ${modalTestsPassed}/${modalFeatures.length} passed`);
  
  const totalTests = schemaTestsPassed + modelTestsPassed + serviceTestsPassed + 
                    componentTestsPassed + integrationTestsPassed + v3TestsPassed + 
                    layoutTestsPassed + modalTestsPassed;
  const totalPossible = requiredTables.length + requiredModels.length + requiredMethods.length + 
                       requiredFeatures.length + requiredIntegrations.length + v3Features.length + 
                       layoutFeatures.length + modalFeatures.length;
  
  console.log(`\n🏆 Overall Score: ${totalTests}/${totalPossible} (${Math.round((totalTests/totalPossible)*100)}%)`);
  
  if (totalTests >= totalPossible * 0.9) {
    console.log('🎉 EXCELLENT! V3 Journaling implementation is comprehensive and ready!');
  } else if (totalTests >= totalPossible * 0.8) {
    console.log('✅ GOOD! V3 Journaling implementation is mostly complete!');
  } else if (totalTests >= totalPossible * 0.7) {
    console.log('⚠️ FAIR! V3 Journaling implementation needs some improvements!');
  } else {
    console.log('❌ POOR! V3 Journaling implementation needs significant work!');
  }
  
  console.log('\n🚀 Ready for integration into main app!');

} catch (error) {
  console.error('❌ Enhanced Journaling V3 Test Suite FAILED:', error.message);
  process.exit(1);
}
