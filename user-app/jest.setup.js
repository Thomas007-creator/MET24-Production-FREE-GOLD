require('@testing-library/jest-dom');

// Mock WatermelonDB
jest.mock('@nozbe/watermelondb', () => ({
  Database: jest.fn(),
  Q: {
    where: jest.fn(),
    and: jest.fn(),
    gte: jest.fn(),
    lte: jest.fn()
  }
}));

// Mock environment variables
process.env.REACT_APP_OPENAI_API_KEY = 'test-openai-key';
process.env.REACT_APP_CLAUDE_API_KEY = 'test-claude-key';
process.env.REACT_APP_GEMINI_API_KEY = 'test-gemini-key';
process.env.REACT_APP_GROK_API_KEY = 'test-grok-key';

// Mock fetch
global.fetch = jest.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Mock WatermelonDB
jest.mock('@nozbe/watermelondb', () => ({
  Database: jest.fn(),
  Q: {
    where: jest.fn(),
    and: jest.fn(),
    gte: jest.fn(),
    lte: jest.fn()
  }
}));

// Mock environment variables
process.env.REACT_APP_OPENAI_API_KEY = 'test-openai-key';
process.env.REACT_APP_CLAUDE_API_KEY = 'test-claude-key';
process.env.REACT_APP_GEMINI_API_KEY = 'test-gemini-key';
process.env.REACT_APP_GROK_API_KEY = 'test-grok-key';

// Mock fetch
global.fetch = jest.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Mock WatermelonDB
jest.mock('@nozbe/watermelondb', () => ({
  Database: jest.fn(),
  Q: {
    where: jest.fn(),
    and: jest.fn(),
    gte: jest.fn(),
    lte: jest.fn()
  }
}));

// Mock environment variables
process.env.REACT_APP_OPENAI_API_KEY = 'test-openai-key';
process.env.REACT_APP_CLAUDE_API_KEY = 'test-claude-key';
process.env.REACT_APP_GEMINI_API_KEY = 'test-gemini-key';
process.env.REACT_APP_GROK_API_KEY = 'test-grok-key';

// Mock fetch
global.fetch = jest.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};




