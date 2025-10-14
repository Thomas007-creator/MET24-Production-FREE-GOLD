/**
 * useOfflineQueue Hook Tests
 * Tests for React hook functionality
 */

import { renderHook, act } from '@testing-library/react';
import { useOfflineQueue, useOfflineAPI } from '../useOfflineQueue';

// Mock the offline queue client
jest.mock('../../lib/offlineQueueClient', () => ({
  __esModule: true,
  default: {
    enqueueRequest: jest.fn(),
    getAllRequests: jest.fn(),
    clearQueue: jest.fn(),
    getOfflineQueueSupport: jest.fn(() => ({
      indexedDB: true,
      serviceWorker: true,
      backgroundSync: true,
      platform: 'test'
    }))
  }
}));

describe('useOfflineQueue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with correct default status', () => {
    const { result } = renderHook(() => useOfflineQueue());

    expect(result.current.status.isOnline).toBe(navigator.onLine);
    expect(result.current.status.queuedRequests).toBe(0);
    expect(result.current.status.support.indexedDB).toBe(true);
    expect(result.current.status.support.serviceWorker).toBe(true);
    expect(result.current.status.support.backgroundSync).toBe(true);
  });

  it('should provide enqueueRequest function', () => {
    const { result } = renderHook(() => useOfflineQueue());

    expect(typeof result.current.enqueueRequest).toBe('function');
    expect(typeof result.current.clearQueue).toBe('function');
    expect(typeof result.current.getQueuedRequests).toBe('function');
    expect(typeof result.current.manualSync).toBe('function');
  });
});

describe('useOfflineAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should provide makeRequest function', () => {
    const { result } = renderHook(() => useOfflineAPI());

    expect(typeof result.current.makeRequest).toBe('function');
    expect(typeof result.current.isOnline).toBe('boolean');
    expect(typeof result.current.queuedRequests).toBe('number');
  });

  it('should handle online status correctly', () => {
    const { result } = renderHook(() => useOfflineAPI());

    expect(result.current.isOnline).toBe(navigator.onLine);
  });
});
