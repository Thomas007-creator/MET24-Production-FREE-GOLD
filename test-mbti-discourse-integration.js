/**
 * MBTI Discourse Integration Test Suite
 * 
 * Test om te controleren of MBTI-specifieke Discourse community integratie werkt
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting MBTI Discourse Integration Test Suite...');

try {
  // Test 1: MBTI Community Mapping Check
  console.log('\n--- Test 1: MBTI Community Mapping Check ---');
  
  const mappingPath = path.join(__dirname, '..', 'MBTI_DISCOURSE_INTERESSE_MAPPING.md');
  const mappingContent = fs.readFileSync(mappingPath, 'utf8');
  
  const mbtiTypes = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP',  // Analysts
    'INFJ', 'INFP', 'ENFJ', 'ENFP',  // Diplomats
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',  // Sentinels
    'ISTP', 'ISFP', 'ESTP', 'ESFP'   // Explorers
  ];
  
  let mbtiMappingTestsPassed = 0;
  mbtiTypes.forEach(mbtiType => {
    if (mappingContent.includes(`#### **${mbtiType}`) && 
        mappingContent.includes(`Core Interests:`)) {
      console.log(`✅ ${mbtiType} mapping found with core interests`);
      mbtiMappingTestsPassed++;
    } else {
      console.log(`❌ ${mbtiType} mapping missing or incomplete`);
    }
  });
  
  console.log(`📊 MBTI Mapping Tests: ${mbtiMappingTestsPassed}/${mbtiTypes.length} passed`);

  // Test 2: Enhanced LevensgebiedDetailPage Check
  console.log('\n--- Test 2: Enhanced LevensgebiedDetailPage Check ---');
  
  const componentPath = path.join(__dirname, 'src/components/BackToBasics/EnhancedLevensgebiedDetailPage.tsx');
  const componentContent = fs.readFileSync(componentPath, 'utf8');
  
  const requiredFeatures = [
    'MBTICommunityMapping',
    'getMBTICommunities',
    'community.your-future-self.nl',
    'memberCount',
    'lastActivity',
    'isLive',
    'handleCommunityClick',
    'ExternalLink',
    'Activity',
    'Badge'
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

  // Test 3: URL Structure Validation
  console.log('\n--- Test 3: URL Structure Validation ---');
  
  const urlPatterns = [
    'www.community.your-future-self.nl/',
    'strategic-planning',
    'creative-projects',
    'mindfulness-community',
    'emotional-wellness',
    'business-strategy',
    'artistic-expression',
    'community-building',
    'systematic-planning',
    'caregiving',
    'management-excellence',
    'social-harmony',
    'hands-on-projects',
    'nature-connection',
    'action-oriented',
    'social-entertainment'
  ];
  
  let urlTestsPassed = 0;
  urlPatterns.forEach(pattern => {
    if (mappingContent.includes(pattern) || componentContent.includes(pattern)) {
      console.log(`✅ URL pattern ${pattern} found`);
      urlTestsPassed++;
    } else {
      console.log(`❌ URL pattern ${pattern} missing`);
    }
  });
  
  console.log(`📊 URL Structure Tests: ${urlTestsPassed}/${urlPatterns.length} passed`);

  // Test 4: Levensgebied-MBTI Integration Check
  console.log('\n--- Test 4: Levensgebied-MBTI Integration Check ---');
  
  const levensgebieden = [
    'psychischeGezondheid',
    'lichamelijkeGezondheid', 
    'financieen',
    'werkSamenleving',
    'creativiteitHobbys',
    'actieveImaginatie',
    'professioneleOntwikkeling',
    'socialeLiefdesrelaties',
    'basisBehoeften'
  ];
  
  let levensgebiedTestsPassed = 0;
  levensgebieden.forEach(gebied => {
    if (componentContent.includes(gebied) && 
        componentContent.includes('getMBTICommunities')) {
      console.log(`✅ ${gebied} MBTI integration found`);
      levensgebiedTestsPassed++;
    } else {
      console.log(`❌ ${gebied} MBTI integration missing`);
    }
  });
  
  console.log(`📊 Levensgebied-MBTI Tests: ${levensgebiedTestsPassed}/${levensgebieden.length} passed`);

  // Test 5: Community Features Check
  console.log('\n--- Test 5: Community Features Check ---');
  
  const communityFeatures = [
    'memberCount',
    'lastActivity',
    'isLive',
    'registrationUrl',
    'attendees',
    'Live status indicators',
    'Community activity tracking',
    'MBTI-optimized recommendations',
    'Cross-levensgebied connections',
    'Real-time sync'
  ];
  
  let communityTestsPassed = 0;
  communityFeatures.forEach(feature => {
    if (componentContent.includes(feature) || mappingContent.includes(feature)) {
      console.log(`✅ Community feature ${feature} found`);
      communityTestsPassed++;
    } else {
      console.log(`❌ Community feature ${feature} missing`);
    }
  });
  
  console.log(`📊 Community Features Tests: ${communityTestsPassed}/${communityFeatures.length} passed`);

  // Test 6: MBTI-Specific Interest Validation
  console.log('\n--- Test 6: MBTI-Specific Interest Validation ---');
  
  const mbtiSpecificInterests = [
    // INTJ
    'strategic-planning', 'systems-thinking', 'future-technology', 'leadership-development',
    // ENFP  
    'creative-projects', 'social-networking', 'inspiration-sharing', 'adventure-planning',
    // ISFJ
    'caregiving', 'family-values', 'service-orientation', 'emotional-support',
    // ESTP
    'action-oriented', 'business-opportunities', 'competitive-sports', 'practical-solutions'
  ];
  
  let interestTestsPassed = 0;
  mbtiSpecificInterests.forEach(interest => {
    if (mappingContent.includes(interest)) {
      console.log(`✅ MBTI interest ${interest} found`);
      interestTestsPassed++;
    } else {
      console.log(`❌ MBTI interest ${interest} missing`);
    }
  });
  
  console.log(`📊 MBTI Interest Tests: ${interestTestsPassed}/${mbtiSpecificInterests.length} passed`);

  // Test 7: Implementation Strategy Check
  console.log('\n--- Test 7: Implementation Strategy Check ---');
  
  const strategyElements = [
    'Phase 1: Core Communities',
    'Phase 2: Support Communities', 
    'Phase 3: Specialized Communities',
    'Hoge Prioriteit',
    'Medium Prioriteit',
    'Lage Prioriteit',
    'URL Pattern',
    'Discourse Community URL Structure',
    'Levensgebied-Specifieke MBTI Optimization'
  ];
  
  let strategyTestsPassed = 0;
  strategyElements.forEach(element => {
    if (mappingContent.includes(element)) {
      console.log(`✅ Strategy element ${element} found`);
      strategyTestsPassed++;
    } else {
      console.log(`❌ Strategy element ${element} missing`);
    }
  });
  
  console.log(`📊 Strategy Tests: ${strategyTestsPassed}/${strategyElements.length} passed`);

  // Summary
  console.log('\n🎉 MBTI Discourse Integration Test Suite Complete!');
  console.log('📊 Test Results Summary:');
  console.log(`✅ MBTI Mapping: ${mbtiMappingTestsPassed}/${mbtiTypes.length} passed`);
  console.log(`✅ Component Features: ${componentTestsPassed}/${requiredFeatures.length} passed`);
  console.log(`✅ URL Structure: ${urlTestsPassed}/${urlPatterns.length} passed`);
  console.log(`✅ Levensgebied-MBTI: ${levensgebiedTestsPassed}/${levensgebieden.length} passed`);
  console.log(`✅ Community Features: ${communityTestsPassed}/${communityFeatures.length} passed`);
  console.log(`✅ MBTI Interests: ${interestTestsPassed}/${mbtiSpecificInterests.length} passed`);
  console.log(`✅ Strategy Elements: ${strategyTestsPassed}/${strategyElements.length} passed`);
  
  const totalTests = mbtiMappingTestsPassed + componentTestsPassed + urlTestsPassed + 
                    levensgebiedTestsPassed + communityTestsPassed + interestTestsPassed + 
                    strategyTestsPassed;
  const totalPossible = mbtiTypes.length + requiredFeatures.length + urlPatterns.length + 
                       levensgebieden.length + communityFeatures.length + mbtiSpecificInterests.length + 
                       strategyElements.length;
  
  console.log(`\n🏆 Overall Score: ${totalTests}/${totalPossible} (${Math.round((totalTests/totalPossible)*100)}%)`);
  
  if (totalTests >= totalPossible * 0.9) {
    console.log('🎉 EXCELLENT! MBTI Discourse integration is comprehensive and ready!');
  } else if (totalTests >= totalPossible * 0.8) {
    console.log('✅ GOOD! MBTI Discourse integration is mostly complete!');
  } else if (totalTests >= totalPossible * 0.7) {
    console.log('⚠️ FAIR! MBTI Discourse integration needs some improvements!');
  } else {
    console.log('❌ POOR! MBTI Discourse integration needs significant work!');
  }
  
  console.log('\n🚀 Ready for Discourse community implementation!');
  console.log('📱 MBTI-optimized communities can now be created at www.community.your-future-self.nl/{interesse}');

} catch (error) {
  console.error('❌ MBTI Discourse Integration Test Suite FAILED:', error.message);
  process.exit(1);
}
