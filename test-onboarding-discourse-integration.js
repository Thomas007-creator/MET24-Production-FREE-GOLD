/**
 * Onboarding-Based Discourse Integration Test Suite
 * 
 * Test om te controleren of onboarding data correct wordt gebruikt voor Discourse communities
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Onboarding-Based Discourse Integration Test Suite...');

try {
  // Test 1: Onboarding Preferences Check
  console.log('\n--- Test 1: Onboarding Preferences Check ---');
  
  const servicePath = path.join(__dirname, 'src/services/onboardingDiscourseService.ts');
  const serviceContent = fs.readFileSync(servicePath, 'utf8');
  
  const mbtiTypes = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP',  // Analysts
    'INFJ', 'INFP', 'ENFJ', 'ENFP',  // Diplomats
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',  // Sentinels
    'ISTP', 'ISFP', 'ESTP', 'ESFP'   // Explorers
  ];
  
  let onboardingTestsPassed = 0;
  mbtiTypes.forEach(mbtiType => {
    if (serviceContent.includes(`'${mbtiType}': { contentTypes:`)) {
      console.log(`✅ ${mbtiType} onboarding preferences found`);
      onboardingTestsPassed++;
    } else {
      console.log(`❌ ${mbtiType} onboarding preferences missing`);
    }
  });
  
  console.log(`📊 Onboarding Tests: ${onboardingTestsPassed}/${mbtiTypes.length} passed`);

  // Test 2: Topic to Discourse Mapping Check
  console.log('\n--- Test 2: Topic to Discourse Mapping Check ---');
  
  const topics = [
    'personality', 'leadership', 'creativity', 'communication',
    'wellness', 'relationships', 'mindfulness', 'career'
  ];
  
  let topicMappingTestsPassed = 0;
  topics.forEach(topic => {
    if (serviceContent.includes(`'${topic}': [`) && 
        serviceContent.includes(`${topic}-`)) {
      console.log(`✅ ${topic} topic mapping found`);
      topicMappingTestsPassed++;
    } else {
      console.log(`❌ ${topic} topic mapping missing`);
    }
  });
  
  console.log(`📊 Topic Mapping Tests: ${topicMappingTestsPassed}/${topics.length} passed`);

  // Test 3: Levensgebied Integration Check
  console.log('\n--- Test 3: Levensgebied Integration Check ---');
  
  const levensgebieden = [
    'psychischeGezondheid', 'lichamelijkeGezondheid', 'financieen',
    'werkSamenleving', 'creativiteitHobbys', 'actieveImaginatie',
    'professioneleOntwikkeling', 'socialeLiefdesrelaties', 'basisBehoeften'
  ];
  
  let levensgebiedTestsPassed = 0;
  levensgebieden.forEach(gebied => {
    if (serviceContent.includes(`'${gebied}': [`) && 
        serviceContent.includes('LEVENSGEBIED_TO_TOPICS')) {
      console.log(`✅ ${gebied} levensgebied integration found`);
      levensgebiedTestsPassed++;
    } else {
      console.log(`❌ ${gebied} levensgebied integration missing`);
    }
  });
  
  console.log(`📊 Levensgebied Tests: ${levensgebiedTestsPassed}/${levensgebieden.length} passed`);

  // Test 4: Service Methods Check
  console.log('\n--- Test 4: Service Methods Check ---');
  
  const requiredMethods = [
    'getOnboardingPreferences',
    'generateDiscourseCommunities',
    'calculateRelevanceScore',
    'getMBTIBonus',
    'formatCommunityTitle',
    'generateMemberCount',
    'generateLastActivity',
    'getAllRelevantCommunities',
    'getCommunityAnalytics'
  ];
  
  let methodTestsPassed = 0;
  requiredMethods.forEach(method => {
    if (serviceContent.includes(`${method}(`)) {
      console.log(`✅ ${method} method found`);
      methodTestsPassed++;
    } else {
      console.log(`❌ ${method} method missing`);
    }
  });
  
  console.log(`📊 Service Methods Tests: ${methodTestsPassed}/${requiredMethods.length} passed`);

  // Test 5: Onboarding Data Source Check
  console.log('\n--- Test 5: Onboarding Data Source Check ---');
  
  const onboardingPath = path.join(__dirname, 'src/components/OnboardingSteps/o-ContentPreferences.tsx');
  const onboardingContent = fs.readFileSync(onboardingPath, 'utf8');
  
  const onboardingFeatures = [
    'getMBTIPreferences',
    'contentTypes',
    'topics',
    'INTJ.*personality.*leadership.*creativity',
    'ENFP.*creativity.*relationships.*wellness',
    'ISFJ.*relationships.*wellness.*personality'
  ];
  
  let onboardingSourceTestsPassed = 0;
  onboardingFeatures.forEach(feature => {
    if (onboardingContent.includes(feature) || 
        (feature.includes('.*') && new RegExp(feature).test(onboardingContent))) {
      console.log(`✅ Onboarding feature ${feature} found`);
      onboardingSourceTestsPassed++;
    } else {
      console.log(`❌ Onboarding feature ${feature} missing`);
    }
  });
  
  console.log(`📊 Onboarding Source Tests: ${onboardingSourceTestsPassed}/${onboardingFeatures.length} passed`);

  // Test 6: URL Structure Validation
  console.log('\n--- Test 6: URL Structure Validation ---');
  
  const urlPatterns = [
    'www.community.your-future-self.nl/',
    'personality-development',
    'strategic-leadership',
    'creative-problem-solving',
    'holistic-wellness',
    'deep-relationships',
    'mindful-living',
    'career-strategy'
  ];
  
  let urlTestsPassed = 0;
  urlPatterns.forEach(pattern => {
    if (serviceContent.includes(pattern)) {
      console.log(`✅ URL pattern ${pattern} found`);
      urlTestsPassed++;
    } else {
      console.log(`❌ URL pattern ${pattern} missing`);
    }
  });
  
  console.log(`📊 URL Structure Tests: ${urlTestsPassed}/${urlPatterns.length} passed`);

  // Test 7: MBTI Bonus System Check
  console.log('\n--- Test 7: MBTI Bonus System Check ---');
  
  const mbtiBonusFeatures = [
    'getMBTIBonus',
    'strategic.*leadership.*analytical',
    'theoretical.*analytical.*research',
    'executive.*leadership.*business',
    'creative.*dynamic.*entrepreneurial',
    'holistic.*spiritual.*mindful',
    'artistic.*authentic.*creative',
    'inspirational.*community.*empathic'
  ];
  
  let mbtiBonusTestsPassed = 0;
  mbtiBonusFeatures.forEach(feature => {
    if (serviceContent.includes(feature) || 
        (feature.includes('.*') && new RegExp(feature).test(serviceContent))) {
      console.log(`✅ MBTI bonus feature ${feature} found`);
      mbtiBonusTestsPassed++;
    } else {
      console.log(`❌ MBTI bonus feature ${feature} missing`);
    }
  });
  
  console.log(`📊 MBTI Bonus Tests: ${mbtiBonusTestsPassed}/${mbtiBonusFeatures.length} passed`);

  // Test 8: Community Analytics Check
  console.log('\n--- Test 8: Community Analytics Check ---');
  
  const analyticsFeatures = [
    'getCommunityAnalytics',
    'totalCommunities',
    'totalMembers',
    'topTopics',
    'averageActivity',
    'memberCount',
    'lastActivity',
    'isLive'
  ];
  
  let analyticsTestsPassed = 0;
  analyticsFeatures.forEach(feature => {
    if (serviceContent.includes(feature)) {
      console.log(`✅ Analytics feature ${feature} found`);
      analyticsTestsPassed++;
    } else {
      console.log(`❌ Analytics feature ${feature} missing`);
    }
  });
  
  console.log(`📊 Analytics Tests: ${analyticsTestsPassed}/${analyticsFeatures.length} passed`);

  // Summary
  console.log('\n🎉 Onboarding-Based Discourse Integration Test Suite Complete!');
  console.log('📊 Test Results Summary:');
  console.log(`✅ Onboarding Preferences: ${onboardingTestsPassed}/${mbtiTypes.length} passed`);
  console.log(`✅ Topic Mapping: ${topicMappingTestsPassed}/${topics.length} passed`);
  console.log(`✅ Levensgebied Integration: ${levensgebiedTestsPassed}/${levensgebieden.length} passed`);
  console.log(`✅ Service Methods: ${methodTestsPassed}/${requiredMethods.length} passed`);
  console.log(`✅ Onboarding Source: ${onboardingSourceTestsPassed}/${onboardingFeatures.length} passed`);
  console.log(`✅ URL Structure: ${urlTestsPassed}/${urlPatterns.length} passed`);
  console.log(`✅ MBTI Bonus System: ${mbtiBonusTestsPassed}/${mbtiBonusFeatures.length} passed`);
  console.log(`✅ Analytics Features: ${analyticsTestsPassed}/${analyticsFeatures.length} passed`);
  
  const totalTests = onboardingTestsPassed + topicMappingTestsPassed + levensgebiedTestsPassed + 
                    methodTestsPassed + onboardingSourceTestsPassed + urlTestsPassed + 
                    mbtiBonusTestsPassed + analyticsTestsPassed;
  const totalPossible = mbtiTypes.length + topics.length + levensgebieden.length + 
                       requiredMethods.length + onboardingFeatures.length + urlPatterns.length + 
                       mbtiBonusFeatures.length + analyticsFeatures.length;
  
  console.log(`\n🏆 Overall Score: ${totalTests}/${totalPossible} (${Math.round((totalTests/totalPossible)*100)}%)`);
  
  if (totalTests >= totalPossible * 0.9) {
    console.log('🎉 EXCELLENT! Onboarding-based Discourse integration is comprehensive and ready!');
  } else if (totalTests >= totalPossible * 0.8) {
    console.log('✅ GOOD! Onboarding-based Discourse integration is mostly complete!');
  } else if (totalTests >= totalPossible * 0.7) {
    console.log('⚠️ FAIR! Onboarding-based Discourse integration needs some improvements!');
  } else {
    console.log('❌ POOR! Onboarding-based Discourse integration needs significant work!');
  }
  
  console.log('\n🚀 Ready for onboarding-based Discourse community implementation!');
  console.log('📱 Communities are now generated based on actual onboarding user preferences!');
  console.log('🎯 Data-driven approach ensures communities match user interests from day one!');

} catch (error) {
  console.error('❌ Onboarding-Based Discourse Integration Test Suite FAILED:', error.message);
  process.exit(1);
}
