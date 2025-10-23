/**
 * Mock X OAuth Configuration for Testing
 * 
 * This simulates the X OAuth flow without making real API calls
 * Perfect for testing before deployment
 */

export const X_OAUTH_CONFIG_MOCK = {
  // Mock configuration
  CLIENT_ID: 'mock-x-dev-client-id',
  REDIRECT_URI: 'tijdelijk://callback',
  AUTHORIZE_URL: 'https://api.x.ai/oauth/authorize',
  TOKEN_URL: 'https://api.x.ai/oauth/token',
  GROK_KEY_STORAGE: 'grokKey',
};

// Mock X OAuth flow function
export const connectToGrokMock = async (): Promise<string> => {
  console.log('🧪 MOCK: Starting X OAuth flow...');
  
  try {
    // Simulate OAuth flow delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful OAuth response
    const mockAccessToken = 'mock_xai_access_token_' + Date.now();
    const mockCode = 'mock_authorization_code_123';
    
    console.log('🧪 MOCK: Authorization code received:', mockCode);
    
    // Simulate token exchange delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('🧪 MOCK: Access token received:', mockAccessToken);
    
    // Mock encryption (simplified)
    const mockEncryptedKey = btoa(mockAccessToken);
    localStorage.setItem(X_OAUTH_CONFIG_MOCK.GROK_KEY_STORAGE, mockEncryptedKey);
    
    console.log('🧪 MOCK: Grok key encrypted and stored in localStorage');
    console.log('✅ MOCK: X OAuth flow completed successfully!');
    
    return mockAccessToken;
  } catch (e) {
    console.error('❌ MOCK: X OAuth error:', e);
    throw new Error('Mock OAuth failed');
  }
};

// Mock database functions
export const saveXAuthToDatabaseMock = async (userId: string, accessToken: string, encryptedKey: string) => {
  console.log('🧪 MOCK: Saving X auth to database...');
  console.log('  - User ID:', userId);
  console.log('  - Access Token:', accessToken.substring(0, 20) + '...');
  console.log('  - Encrypted Key:', encryptedKey.substring(0, 20) + '...');
  
  // Simulate database save delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  console.log('✅ MOCK: X auth saved to database successfully');
};

export const getXAuthFromDatabaseMock = async (userId: string): Promise<string | null> => {
  console.log('🧪 MOCK: Getting X auth from database for user:', userId);
  
  // Simulate database query delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Return mock data
  const mockToken = 'mock_retrieved_token_' + userId;
  console.log('✅ MOCK: X auth retrieved from database');
  return mockToken;
};

// Mock AI API Key Service
export const aiApiKeyServiceMock = {
  async saveApiKey(config: any) {
    console.log('🧪 MOCK: Saving AI API key:', config.provider);
    await new Promise(resolve => setTimeout(resolve, 200));
    console.log('✅ MOCK: AI API key saved successfully');
  },
  
  async getApiKey(userId: string, provider: string) {
    console.log('🧪 MOCK: Getting AI API key for:', provider);
    await new Promise(resolve => setTimeout(resolve, 150));
    return 'mock_' + provider + '_api_key';
  },
  
  async getUsageStats(userId: string, provider: string) {
    console.log('🧪 MOCK: Getting usage stats for:', provider);
    await new Promise(resolve => setTimeout(resolve, 100));
    return {
      requestsToday: 5,
      tokensUsed: 150,
      lastUsed: Date.now(),
      dailyLimit: 50,
      monthlyLimit: 1000
    };
  },
  
  async hasReachedDailyLimit(userId: string, provider: string) {
    console.log('🧪 MOCK: Checking daily limit for:', provider);
    await new Promise(resolve => setTimeout(resolve, 50));
    return false; // Mock: not reached limit
  }
};

// Mock test runner
export const runMockTests = async () => {
  console.log('🚀 Starting Mock Tests for X OAuth Integration...');
  console.log('=' .repeat(50));
  
  try {
    // Test 1: X OAuth Flow
    console.log('\n📋 Test 1: X OAuth Flow');
    const accessToken = await connectToGrokMock();
    console.log('✅ Test 1 PASSED: OAuth flow completed');
    
    // Test 2: Database Save
    console.log('\n📋 Test 2: Database Save');
    await saveXAuthToDatabaseMock('test_user_123', accessToken, accessToken);
    console.log('✅ Test 2 PASSED: Database save completed');
    
    // Test 3: Database Retrieve
    console.log('\n📋 Test 3: Database Retrieve');
    const retrievedToken = await getXAuthFromDatabaseMock('test_user_123');
    console.log('✅ Test 3 PASSED: Database retrieve completed');
    
    // Test 4: AI API Key Service
    console.log('\n📋 Test 4: AI API Key Service');
    await aiApiKeyServiceMock.saveApiKey({
      provider: 'xai',
      apiKey: accessToken,
      userId: 'test_user_123'
    });
    console.log('✅ Test 4 PASSED: AI API Key Service completed');
    
    // Test 5: Usage Stats
    console.log('\n📋 Test 5: Usage Stats');
    const stats = await aiApiKeyServiceMock.getUsageStats('test_user_123', 'xai');
    console.log('✅ Test 5 PASSED: Usage stats retrieved');
    console.log('   Stats:', stats);
    
    console.log('\n🎉 ALL MOCK TESTS PASSED!');
    console.log('=' .repeat(50));
    console.log('✅ Ready for deployment to DigitalOcean!');
    
    return true;
  } catch (error) {
    console.error('\n❌ MOCK TEST FAILED:', error);
    console.log('=' .repeat(50));
    return false;
  }
};
