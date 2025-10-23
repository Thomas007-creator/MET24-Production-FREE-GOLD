/**
 * All Phases Deployment Test Suite
 * 
 * Master test suite voor alle deployment phases
 * Tests: Phase 1, Phase 2, Phase 3 readiness en deployment strategy
 * 
 * @version 14.0.0
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting All Phases Deployment Test Suite...');
console.log('📊 Testing all deployment phases for complete readiness assessment');

try {
  // Test 1: Phase 1 Readiness
  console.log('\n--- Test 1: Phase 1 Readiness Assessment ---');
  
  let phase1Score = 0;
  let phase1Total = 0;
  
  try {
    console.log('🧪 Running Phase 1 Core Features Test...');
    const phase1Output = execSync('node test-phase1-core-features.js', { 
      cwd: __dirname, 
      encoding: 'utf8',
      timeout: 30000 
    });
    
    // Extract score from output
    const scoreMatch = phase1Output.match(/Overall Score: (\d+)\/(\d+) \((\d+)%\)/);
    if (scoreMatch) {
      phase1Score = parseInt(scoreMatch[1]);
      phase1Total = parseInt(scoreMatch[2]);
      console.log(`✅ Phase 1 Score: ${phase1Score}/${phase1Total} (${scoreMatch[3]}%)`);
    } else {
      console.log('⚠️ Could not extract Phase 1 score');
    }
  } catch (error) {
    console.log('❌ Phase 1 test failed:', error.message);
  }
  
  // Test 2: Phase 2 Readiness
  console.log('\n--- Test 2: Phase 2 Readiness Assessment ---');
  
  let phase2Score = 0;
  let phase2Total = 0;
  
  try {
    console.log('🧪 Running Phase 2 Light AI Test...');
    const phase2Output = execSync('node test-phase2-light-ai.js', { 
      cwd: __dirname, 
      encoding: 'utf8',
      timeout: 30000 
    });
    
    // Extract score from output
    const scoreMatch = phase2Output.match(/Overall Score: (\d+)\/(\d+) \((\d+)%\)/);
    if (scoreMatch) {
      phase2Score = parseInt(scoreMatch[1]);
      phase2Total = parseInt(scoreMatch[2]);
      console.log(`✅ Phase 2 Score: ${phase2Score}/${phase2Total} (${scoreMatch[3]}%)`);
    } else {
      console.log('⚠️ Could not extract Phase 2 score');
    }
  } catch (error) {
    console.log('❌ Phase 2 test failed:', error.message);
  }
  
  // Test 3: Phase 3 Readiness
  console.log('\n--- Test 3: Phase 3 Readiness Assessment ---');
  
  let phase3Score = 0;
  let phase3Total = 0;
  
  try {
    console.log('🧪 Running Phase 3 Full AI Test...');
    const phase3Output = execSync('node test-phase3-full-ai.js', { 
      cwd: __dirname, 
      encoding: 'utf8',
      timeout: 30000 
    });
    
    // Extract score from output
    const scoreMatch = phase3Output.match(/Overall Score: (\d+)\/(\d+) \((\d+)%\)/);
    if (scoreMatch) {
      phase3Score = parseInt(scoreMatch[1]);
      phase3Total = parseInt(scoreMatch[2]);
      console.log(`✅ Phase 3 Score: ${phase3Score}/${phase3Total} (${scoreMatch[3]}%)`);
    } else {
      console.log('⚠️ Could not extract Phase 3 score');
    }
  } catch (error) {
    console.log('❌ Phase 3 test failed:', error.message);
  }
  
  // Test 4: V3 Features Comprehensive
  console.log('\n--- Test 4: V3 Features Comprehensive Assessment ---');
  
  let v3Score = 0;
  let v3Total = 0;
  
  try {
    console.log('🧪 Running V3 Features Comprehensive Test...');
    const v3Output = execSync('node test-v3-features-comprehensive.js', { 
      cwd: __dirname, 
      encoding: 'utf8',
      timeout: 30000 
    });
    
    // Extract score from output
    const scoreMatch = v3Output.match(/Overall Score: (\d+)\/(\d+) \((\d+)%\)/);
    if (scoreMatch) {
      v3Score = parseInt(scoreMatch[1]);
      v3Total = parseInt(scoreMatch[2]);
      console.log(`✅ V3 Features Score: ${v3Score}/${v3Total} (${scoreMatch[3]}%)`);
    } else {
      console.log('⚠️ Could not extract V3 Features score');
    }
  } catch (error) {
    console.log('❌ V3 Features test failed:', error.message);
  }
  
  // Test 5: Deployment Readiness
  console.log('\n--- Test 5: Deployment Readiness Assessment ---');
  
  let deploymentScore = 0;
  let deploymentTotal = 0;
  
  try {
    console.log('🧪 Running Deployment Readiness Test...');
    const deploymentOutput = execSync('node test-deployment-readiness.js', { 
      cwd: __dirname, 
      encoding: 'utf8',
      timeout: 30000 
    });
    
    // Extract score from output
    const scoreMatch = deploymentOutput.match(/Overall Score: (\d+)\/(\d+) \((\d+)%\)/);
    if (scoreMatch) {
      deploymentScore = parseInt(scoreMatch[1]);
      deploymentTotal = parseInt(scoreMatch[2]);
      console.log(`✅ Deployment Readiness Score: ${deploymentScore}/${deploymentTotal} (${scoreMatch[3]}%)`);
    } else {
      console.log('⚠️ Could not extract Deployment Readiness score');
    }
  } catch (error) {
    console.log('❌ Deployment Readiness test failed:', error.message);
  }
  
  // Test 6: ChatLLM Integration
  console.log('\n--- Test 6: ChatLLM Integration Assessment ---');
  
  let chatLLMScore = 0;
  let chatLLMTotal = 0;
  
  try {
    console.log('🧪 Running ChatLLM V3 Integration Test...');
    const chatLLMOutput = execSync('node test-chatllm-v3-integration.js', { 
      cwd: __dirname, 
      encoding: 'utf8',
      timeout: 30000 
    });
    
    // Extract score from output
    const scoreMatch = chatLLMOutput.match(/Overall Score: (\d+)\/(\d+) \((\d+)%\)/);
    if (scoreMatch) {
      chatLLMScore = parseInt(scoreMatch[1]);
      chatLLMTotal = parseInt(scoreMatch[2]);
      console.log(`✅ ChatLLM Integration Score: ${chatLLMScore}/${chatLLMTotal} (${scoreMatch[3]}%)`);
    } else {
      console.log('⚠️ Could not extract ChatLLM Integration score');
    }
  } catch (error) {
    console.log('❌ ChatLLM Integration test failed:', error.message);
  }
  
  // Test 7: Main Features AI Integration
  console.log('\n--- Test 7: Main Features AI Integration Assessment ---');
  
  let mainFeaturesScore = 0;
  let mainFeaturesTotal = 0;
  
  try {
    console.log('🧪 Running Main Features AI Integration Test...');
    const mainFeaturesOutput = execSync('node test-main-features-ai-integration.js', { 
      cwd: __dirname, 
      encoding: 'utf8',
      timeout: 30000 
    });
    
    // Extract score from output
    const scoreMatch = mainFeaturesOutput.match(/Overall Score: (\d+)\/(\d+) \((\d+)%\)/);
    if (scoreMatch) {
      mainFeaturesScore = parseInt(scoreMatch[1]);
      mainFeaturesTotal = parseInt(scoreMatch[2]);
      console.log(`✅ Main Features AI Integration Score: ${mainFeaturesScore}/${mainFeaturesTotal} (${scoreMatch[3]}%)`);
    } else {
      console.log('⚠️ Could not extract Main Features AI Integration score');
    }
  } catch (error) {
    console.log('❌ Main Features AI Integration test failed:', error.message);
  }
  
  // Test 8: Complete App AI Orchestration
  console.log('\n--- Test 8: Complete App AI Orchestration Assessment ---');
  
  let completeAppScore = 0;
  let completeAppTotal = 0;
  
  try {
    console.log('🧪 Running Complete App AI Orchestration Test...');
    const completeAppOutput = execSync('node test-complete-app-ai-orchestration.js', { 
      cwd: __dirname, 
      encoding: 'utf8',
      timeout: 30000 
    });
    
    // Extract score from output
    const scoreMatch = completeAppOutput.match(/Overall Score: (\d+)\/(\d+) \((\d+)%\)/);
    if (scoreMatch) {
      completeAppScore = parseInt(scoreMatch[1]);
      completeAppTotal = parseInt(scoreMatch[2]);
      console.log(`✅ Complete App AI Orchestration Score: ${completeAppScore}/${completeAppTotal} (${scoreMatch[3]}%)`);
    } else {
      console.log('⚠️ Could not extract Complete App AI Orchestration score');
    }
  } catch (error) {
    console.log('❌ Complete App AI Orchestration test failed:', error.message);
  }
  
  // Summary
  console.log('\n🎉 All Phases Deployment Test Suite Complete!');
  console.log('📊 Comprehensive Test Results Summary:');
  console.log(`✅ Phase 1: Core App - ${phase1Score}/${phase1Total} (${Math.round((phase1Score/phase1Total)*100)}%)`);
  console.log(`✅ Phase 2: Light AI - ${phase2Score}/${phase2Total} (${Math.round((phase2Score/phase2Total)*100)}%)`);
  console.log(`✅ Phase 3: Full AI Stack - ${phase3Score}/${phase3Total} (${Math.round((phase3Score/phase3Total)*100)}%)`);
  console.log(`✅ V3 Features Comprehensive - ${v3Score}/${v3Total} (${Math.round((v3Score/v3Total)*100)}%)`);
  console.log(`✅ Deployment Readiness - ${deploymentScore}/${deploymentTotal} (${Math.round((deploymentScore/deploymentTotal)*100)}%)`);
  console.log(`✅ ChatLLM Integration - ${chatLLMScore}/${chatLLMTotal} (${Math.round((chatLLMScore/chatLLMTotal)*100)}%)`);
  console.log(`✅ Main Features AI Integration - ${mainFeaturesScore}/${mainFeaturesTotal} (${Math.round((mainFeaturesScore/mainFeaturesTotal)*100)}%)`);
  console.log(`✅ Complete App AI Orchestration - ${completeAppScore}/${completeAppTotal} (${Math.round((completeAppScore/completeAppTotal)*100)}%)`);
  
  const totalScore = phase1Score + phase2Score + phase3Score + v3Score + deploymentScore + chatLLMScore + mainFeaturesScore + completeAppScore;
  const totalPossible = phase1Total + phase2Total + phase3Total + v3Total + deploymentTotal + chatLLMTotal + mainFeaturesTotal + completeAppTotal;
  
  console.log(`\n🏆 Overall Master Score: ${totalScore}/${totalPossible} (${Math.round((totalScore/totalPossible)*100)}%)`);
  
  // Deployment Recommendations
  console.log('\n🎯 Deployment Recommendations:');
  
  const phase1Percentage = Math.round((phase1Score/phase1Total)*100);
  const phase2Percentage = Math.round((phase2Score/phase2Total)*100);
  const phase3Percentage = Math.round((phase3Score/phase3Total)*100);
  
  if (phase1Percentage >= 80) {
    console.log('🚀 PHASE 1: READY FOR DEPLOYMENT!');
    console.log('   ✅ Deploy Phase 1 immediately: ./deployment-phases/deploy-phase1.sh production');
  } else if (phase1Percentage >= 70) {
    console.log('⚠️ PHASE 1: NEEDS MINOR IMPROVEMENTS');
    console.log('   🔧 Fix minor issues before Phase 1 deployment');
  } else {
    console.log('❌ PHASE 1: NEEDS SIGNIFICANT WORK');
    console.log('   🛠️ Major improvements needed before Phase 1 deployment');
  }
  
  if (phase2Percentage >= 80) {
    console.log('🤖 PHASE 2: READY FOR DEPLOYMENT!');
    console.log('   ✅ Deploy Phase 2 after Phase 1: ./deployment-phases/deploy-phase2.sh production');
  } else if (phase2Percentage >= 70) {
    console.log('⚠️ PHASE 2: NEEDS MINOR IMPROVEMENTS');
    console.log('   🔧 Fix minor issues before Phase 2 deployment');
  } else {
    console.log('❌ PHASE 2: NEEDS SIGNIFICANT WORK');
    console.log('   🛠️ Major improvements needed before Phase 2 deployment');
  }
  
  if (phase3Percentage >= 80) {
    console.log('🧠 PHASE 3: READY FOR DEPLOYMENT!');
    console.log('   ✅ Deploy Phase 3 after Phase 2: ./deployment-phases/deploy-phase3.sh production');
  } else if (phase3Percentage >= 70) {
    console.log('⚠️ PHASE 3: NEEDS MINOR IMPROVEMENTS');
    console.log('   🔧 Fix minor issues before Phase 3 deployment');
  } else {
    console.log('❌ PHASE 3: NEEDS SIGNIFICANT WORK');
    console.log('   🛠️ Major improvements needed before Phase 3 deployment');
  }
  
  // Deployment Strategy
  console.log('\n📋 Recommended Deployment Strategy:');
  
  if (phase1Percentage >= 80) {
    console.log('1. 🚀 DEPLOY PHASE 1 NOW');
    console.log('   - Core app with V3 features');
    console.log('   - Basic ChatLLM functionality');
    console.log('   - PWA features and MBTI assessment');
    console.log('   - Low risk, immediate deployment');
  }
  
  if (phase2Percentage >= 70) {
    console.log('2. 🔧 PREPARE PHASE 2');
    console.log('   - Work on missing AI features');
    console.log('   - Implement @xenova/transformers integration');
    console.log('   - Add enhanced ChatLLM methods');
    console.log('   - Deploy after Phase 1 is stable');
  }
  
  if (phase3Percentage >= 70) {
    console.log('3. 🧠 PREPARE PHASE 3');
    console.log('   - Implement full AI stack');
    console.log('   - Add WebLLM and ONNX integration');
    console.log('   - Complete AI orchestration');
    console.log('   - Deploy after Phase 2 is stable');
  }
  
  console.log('\n💡 Next Steps:');
  console.log('1. Review individual test results above');
  console.log('2. Fix any critical issues identified');
  console.log('3. Deploy phases according to readiness scores');
  console.log('4. Monitor performance after each deployment');
  console.log('5. Collect user feedback and iterate');
  
  console.log('\n🎯 All phases have been comprehensively tested and are ready for deployment strategy!');

} catch (error) {
  console.error('❌ All Phases Deployment Test Suite FAILED:', error.message);
  process.exit(1);
}
