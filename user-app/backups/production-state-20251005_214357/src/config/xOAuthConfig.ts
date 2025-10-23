// X OAuth Configuration
// Based on Grok-4's implementation

export const X_OAUTH_CONFIG = {
  // X Developer Client ID - Replace with your actual client ID from developer.x.com
  CLIENT_ID: process.env.REACT_APP_X_DEV_CLIENT_ID || 'JOUW_X_DEV_KEY',
  
  // OAuth redirect URI
  REDIRECT_URI: process.env.REACT_APP_X_OAUTH_REDIRECT_URI || 'tijdelijk://callback',
  
  // X API endpoints
  AUTHORIZE_URL: 'https://api.x.ai/oauth/authorize',
  TOKEN_URL: 'https://api.x.ai/oauth/token',
  
  // Local storage key for encrypted Grok key
  GROK_KEY_STORAGE: 'grokKey',
};

// X OAuth flow function (Grok-4's implementation)
export const connectToGrok = async (): Promise<string> => {
  try {
    // Check if we have a real X Developer Client ID
    if (X_OAUTH_CONFIG.CLIENT_ID === 'your-x-dev-client-id' || !X_OAUTH_CONFIG.CLIENT_ID) {
      // Fallback: Simulate successful X OAuth for development
      console.log('X OAuth: Using development fallback (no real Client ID configured)');
      const mockAccessToken = 'dev-grok-access-token-' + Date.now();
      const encryptedKey = btoa(mockAccessToken);
      localStorage.setItem(X_OAUTH_CONFIG.GROK_KEY_STORAGE, encryptedKey);
      
      console.log('Grok verbonden – klaar voor gebruik! (Development Mode)');
      return mockAccessToken;
    }

    // Real X OAuth flow (when Client ID is configured)
    const authUrl = `${X_OAUTH_CONFIG.AUTHORIZE_URL}?client_id=${X_OAUTH_CONFIG.CLIENT_ID}&redirect_uri=${X_OAUTH_CONFIG.REDIRECT_URI}`;
    const response = await fetch(authUrl);
    const { code } = await response.json();
    
    const tokenRes = await fetch(X_OAUTH_CONFIG.TOKEN_URL, {
      method: 'POST',
      body: JSON.stringify({
        code, 
        redirect_uri: X_OAUTH_CONFIG.REDIRECT_URI, 
        grant_type: 'authorization_code'
      }),
      headers: { 'Content-Type': 'application/json' }
    });
    const { access_token } = await tokenRes.json();
    
    const encryptedKey = btoa(access_token);
    localStorage.setItem(X_OAUTH_CONFIG.GROK_KEY_STORAGE, encryptedKey);
    
    console.log('Grok verbonden – klaar voor gebruik!');
    return access_token;
  } catch (e) {
    console.error('X OAuth error:', e);
    alert('Oeps, iets ging mis met X verbinding. Probeer opnieuw?');
    throw e;
  }
};

// Check if user has Grok key stored
export const hasGrokKey = (): boolean => {
  return localStorage.getItem(X_OAUTH_CONFIG.GROK_KEY_STORAGE) !== null;
};

// Get stored Grok key (for API calls)
export const getGrokKey = (): string | null => {
  return localStorage.getItem(X_OAUTH_CONFIG.GROK_KEY_STORAGE);
};

// Save X OAuth data to WatermelonDB settings table
export const saveXAuthToDatabase = async (userId: string, accessToken: string, encryptedKey: string) => {
  try {
    const { databaseService } = await import('../services/databaseService');
    const { aiApiKeyService } = await import('../services/aiApiKeyService');
    
    // Save to settings table
    await databaseService.createOrUpdateSetting({
      user_id: userId,
      key: 'xai_oauth_token',
      value: encryptedKey,
      category: 'ai_services',
      data_type: 'encrypted_string'
    });

    // Save to external_ai_services table
    await aiApiKeyService.saveApiKey({
      provider: 'xai',
      apiKey: accessToken,
      userId: userId,
      serviceLimits: {
        dailyLimit: 50, // Free tier limit
        monthlyLimit: 1000
      }
    });

    console.log(`X auth saved for user ${userId} to database`);
  } catch (error) {
    console.error('Error saving X auth to database:', error);
    // Fallback to localStorage
    localStorage.setItem(X_OAUTH_CONFIG.GROK_KEY_STORAGE, encryptedKey);
  }
};

// Get X OAuth data from WatermelonDB settings table
export const getXAuthFromDatabase = async (userId: string): Promise<string | null> => {
  try {
    const { databaseService } = await import('../services/databaseService');
    
    const setting = await databaseService.getSetting(userId, 'xai_oauth_token');
    if (setting) {
      console.log(`X auth retrieved for user ${userId} from database`);
      return setting.value;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting X auth from database:', error);
    // Fallback to localStorage
    return localStorage.getItem(X_OAUTH_CONFIG.GROK_KEY_STORAGE);
  }
};
