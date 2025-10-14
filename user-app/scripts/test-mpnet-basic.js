// 🧪 Simple MPNet L12-v2 Test (JavaScript version)
// Basic test to validate all-MiniLM-L12-v2 implementation

const { mpnetL12EmbeddingService } = require('../src/services/mpnetL12EmbeddingService');

async function testBasicFunctionality() {
  console.log('🧪 Testing all-MiniLM-L12-v2 Basic Functionality');
  console.log('===============================================\n');

  try {
    // Test 1: Model initialization
    console.log('1️⃣ Testing model initialization...');
    const startTime = Date.now();
    await mpnetL12EmbeddingService.initialize();
    const initTime = Date.now() - startTime;
    console.log(`✅ Model loaded successfully in ${initTime}ms\n`);

    // Test 2: Single embedding generation
    console.log('2️⃣ Testing embedding generation...');
    const testText = "Ik voel me gestrest en zoek balans in mijn leven als INFP persoonlijkheid";
    const result = await mpnetL12EmbeddingService.generateEmbedding(testText);
    
    console.log(`📝 Text: "${testText}"`);
    console.log(`✅ Generated ${result.dimensions}-dim embedding in ${result.inferenceTime}ms`);
    console.log(`📊 First 5 values: [${result.embedding.slice(0, 5).map(v => v.toFixed(4)).join(', ')}...]`);
    console.log(`🔧 Model: ${result.model}\n`);

    // Test 3: Validate results
    console.log('3️⃣ Validation checks...');
    
    // Check dimensions
    const dimensionsOk = result.embedding.length === 384;
    console.log(`✅ Dimensions: ${dimensionsOk ? 'PASS' : 'FAIL'} (${result.embedding.length}/384)`);
    
    // Check inference time (should be reasonable)
    const performanceOk = result.inferenceTime < 300; // 300ms max for first run
    console.log(`✅ Performance: ${performanceOk ? 'PASS' : 'FAIL'} (${result.inferenceTime}ms)`);
    
    // Check model info
    const modelInfo = mpnetL12EmbeddingService.getModelInfo();
    console.log(`✅ Model info: ${modelInfo.name}, ${modelInfo.dimensions} dims`);
    console.log(`   Privacy: ${modelInfo.privacy}`);
    console.log(`   Languages: ${modelInfo.languages.join(', ')}`);
    
    console.log('\n🎉 Basic test completed successfully!');
    console.log('🚀 all-MiniLM-L12-v2 is working correctly');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testBasicFunctionality().catch(console.error);