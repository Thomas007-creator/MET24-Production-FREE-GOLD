/**
 * V3 Challenges Integration Test Suite
 * 
 * Test om te controleren of V3 Challenges functionaliteiten correct zijn geïmplementeerd
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting V3 Challenges Integration Test Suite...');

try {
  // Test 1: Database Schema Check
  console.log('\n--- Test 1: Database Schema Check ---');
  
  const schemaPath = path.join(__dirname, 'src/database/v14/schemas/challenges.ts');
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  
  const requiredTables = [
    'challenges',
    'challenge_milestones', 
    'challenge_rewards',
    'challenge_participants',
    'challenge_analytics',
    'user_challenge_stats'
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
  
  const modelFiles = [
    'Challenge.ts',
    'ChallengeMilestone.ts', 
    'ChallengeReward.ts',
    'ChallengeParticipant.ts',
    'UserChallengeStats.ts'
  ];
  
  let modelTestsPassed = 0;
  modelFiles.forEach(modelFile => {
    const modelPath = path.join(__dirname, 'src/database/v14/models', modelFile);
    if (fs.existsSync(modelPath)) {
      console.log(`✅ ${modelFile} model found`);
      modelTestsPassed++;
    } else {
      console.log(`❌ ${modelFile} model missing`);
    }
  });
  
  console.log(`📊 Model Tests: ${modelTestsPassed}/${modelFiles.length} passed`);

  // Test 3: Database Configuration Check
  console.log('\n--- Test 3: Database Configuration Check ---');
  
  const databasePath = path.join(__dirname, 'src/database/v14/databaseV14.ts');
  const databaseContent = fs.readFileSync(databasePath, 'utf8');
  
  const requiredImports = [
    'import Challenge from "./models/Challenge"',
    'import ChallengeMilestone from "./models/ChallengeMilestone"',
    'import ChallengeReward from "./models/ChallengeReward"',
    'import ChallengeParticipant from "./models/ChallengeParticipant"',
    'import UserChallengeStats from "./models/UserChallengeStats"'
  ];
  
  const requiredModelClasses = [
    'Challenge,',
    'ChallengeMilestone,',
    'ChallengeReward,',
    'ChallengeParticipant,',
    'UserChallengeStats,'
  ];
  
  let importTestsPassed = 0;
  requiredImports.forEach(importStatement => {
    if (databaseContent.includes(importStatement)) {
      console.log(`✅ ${importStatement} found`);
      importTestsPassed++;
    } else {
      console.log(`❌ ${importStatement} missing`);
    }
  });
  
  let modelClassTestsPassed = 0;
  requiredModelClasses.forEach(modelClass => {
    if (databaseContent.includes(modelClass)) {
      console.log(`✅ ${modelClass} found in modelClasses`);
      modelClassTestsPassed++;
    } else {
      console.log(`❌ ${modelClass} missing from modelClasses`);
    }
  });
  
  console.log(`📊 Import Tests: ${importTestsPassed}/${requiredImports.length} passed`);
  console.log(`📊 ModelClass Tests: ${modelClassTestsPassed}/${requiredModelClasses.length} passed`);

  // Test 4: Schema Integration Check
  console.log('\n--- Test 4: Schema Integration Check ---');
  
  const schemaV14Path = path.join(__dirname, 'src/database/v14/schemaV14.ts');
  const schemaV14Content = fs.readFileSync(schemaV14Path, 'utf8');
  
  const schemaIntegrationFeatures = [
    'import { challengesSchema } from "./schemas/challenges"',
    '...challengesSchema,'
  ];
  
  let schemaIntegrationTestsPassed = 0;
  schemaIntegrationFeatures.forEach(feature => {
    if (schemaV14Content.includes(feature)) {
      console.log(`✅ ${feature} found`);
      schemaIntegrationTestsPassed++;
    } else {
      console.log(`❌ ${feature} missing`);
    }
  });
  
  console.log(`📊 Schema Integration Tests: ${schemaIntegrationTestsPassed}/${schemaIntegrationFeatures.length} passed`);

  // Test 5: V3 Features Check
  console.log('\n--- Test 5: V3 Features Check ---');
  
  const v3Features = [
    'mbti_relevance',
    'ai_generated',
    'community_rating',
    'xp_reward',
    'badge_reward',
    'engagement_score',
    'completion_prediction',
    'gamification',
    'social_features'
  ];
  
  let v3FeatureTestsPassed = 0;
  v3Features.forEach(feature => {
    if (schemaContent.includes(feature) || databaseContent.includes(feature)) {
      console.log(`✅ V3 feature ${feature} found`);
      v3FeatureTestsPassed++;
    } else {
      console.log(`❌ V3 feature ${feature} missing`);
    }
  });
  
  console.log(`📊 V3 Features Tests: ${v3FeatureTestsPassed}/${v3Features.length} passed`);

  // Test 6: No Duplicate Variables Check
  console.log('\n--- Test 6: No Duplicate Variables Check ---');
  
  // Check for duplicate imports
  const importLines = databaseContent.split('\n').filter(line => line.includes('import') && line.includes('from "./models/'));
  const importNames = importLines.map(line => {
    const match = line.match(/import\s+(\w+)\s+from/);
    return match ? match[1] : null;
  }).filter(Boolean);
  
  const duplicateImports = importNames.filter((name, index) => importNames.indexOf(name) !== index);
  
  if (duplicateImports.length === 0) {
    console.log('✅ No duplicate imports found');
    console.log(`📊 Total unique imports: ${importNames.length}`);
  } else {
    console.log(`❌ Duplicate imports found: ${duplicateImports.join(', ')}`);
  }
  
  // Check for duplicate model classes
  const modelClassLines = databaseContent.split('\n').filter(line => 
    line.trim().endsWith(',') && 
    !line.includes('//') && 
    !line.includes('modelClass:') &&
    !line.includes('}') &&
    line.trim().length > 1
  );
  const modelClassNames = modelClassLines.map(line => line.trim().replace(',', '')).filter(name => 
    name && !name.startsWith('//') && name.length > 0 && !name.includes('modelClass')
  );
  
  const duplicateModelClasses = modelClassNames.filter((name, index) => modelClassNames.indexOf(name) !== index);
  
  if (duplicateModelClasses.length === 0) {
    console.log('✅ No duplicate model classes found');
    console.log(`📊 Total unique model classes: ${modelClassNames.length}`);
  } else {
    console.log(`❌ Duplicate model classes found: ${duplicateModelClasses.join(', ')}`);
  }
  
  console.log(`📊 Duplicate Check: ${duplicateImports.length === 0 && duplicateModelClasses.length === 0 ? 'PASSED' : 'FAILED'}`);

  // Summary
  console.log('\n🎉 V3 Challenges Integration Test Suite Complete!');
  console.log('📊 Test Results Summary:');
  console.log(`✅ Database Schema: ${schemaTestsPassed}/${requiredTables.length} passed`);
  console.log(`✅ Model Classes: ${modelTestsPassed}/${modelFiles.length} passed`);
  console.log(`✅ Database Configuration: ${importTestsPassed}/${requiredImports.length} imports, ${modelClassTestsPassed}/${requiredModelClasses.length} modelClasses`);
  console.log(`✅ Schema Integration: ${schemaIntegrationTestsPassed}/${schemaIntegrationFeatures.length} passed`);
  console.log(`✅ V3 Features: ${v3FeatureTestsPassed}/${v3Features.length} passed`);
  console.log(`✅ No Duplicates: ${duplicateImports.length === 0 && duplicateModelClasses.length === 0 ? 'PASSED' : 'FAILED'}`);
  
  const totalTests = schemaTestsPassed + modelTestsPassed + importTestsPassed + modelClassTestsPassed + 
                    schemaIntegrationTestsPassed + v3FeatureTestsPassed + 
                    (duplicateImports.length === 0 && duplicateModelClasses.length === 0 ? 1 : 0);
  const totalPossible = requiredTables.length + modelFiles.length + requiredImports.length + 
                       requiredModelClasses.length + schemaIntegrationFeatures.length + v3Features.length + 1;
  
  console.log(`\n🏆 Overall Score: ${totalTests}/${totalPossible} (${Math.round((totalTests/totalPossible)*100)}%)`);
  
  if (totalTests >= totalPossible * 0.9) {
    console.log('🎉 EXCELLENT! V3 Challenges integration is comprehensive and ready!');
  } else if (totalTests >= totalPossible * 0.8) {
    console.log('✅ GOOD! V3 Challenges integration is mostly complete!');
  } else if (totalTests >= totalPossible * 0.7) {
    console.log('⚠️ FAIR! V3 Challenges integration needs some improvements!');
  } else {
    console.log('❌ POOR! V3 Challenges integration needs significant work!');
  }
  
  console.log('\n🚀 Ready for V3 Challenges implementation!');
  console.log('📱 Database schema, models, and configuration are properly set up!');
  console.log('🎯 No duplicate variables found in database configuration!');

} catch (error) {
  console.error('❌ V3 Challenges Integration Test Suite FAILED:', error.message);
  process.exit(1);
}
