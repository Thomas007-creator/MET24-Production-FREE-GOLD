/**
 * iPhone-style Swipe Navigation Hook
 * 
 * Implements < > swipe gestures voor navigatie tussen features
 */

import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface SwipeNavigationConfig {
  // Swipe targets from mainview
  swipeLeft?: string;   // < gesture
  swipeRight?: string;  // > gesture
  enabled?: boolean;
  sensitivity?: number; // px minimum swipe distance
}

export const useSwipeNavigation = (config: SwipeNavigationConfig) => {
  const navigate = useNavigate();
  const {
    swipeLeft,
    swipeRight,
    enabled = true,
    sensitivity = 100
  } = config;

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled) return;
    
    const touch = e.touches[0];
    (e.target as any).startX = touch.clientX;
    (e.target as any).startY = touch.clientY;
  }, [enabled]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!enabled) return;
    
    const touch = e.changedTouches[0];
    const target = e.target as any;
    
    if (!target.startX || !target.startY) return;
    
    const deltaX = touch.clientX - target.startX;
    const deltaY = touch.clientY - target.startY;
    
    // Only trigger if horizontal swipe is dominant
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > sensitivity) {
      if (deltaX > 0 && swipeRight) {
        // Swipe right (> gesture)
        navigate(swipeRight);
      } else if (deltaX < 0 && swipeLeft) {
        // Swipe left (< gesture) 
        navigate(swipeLeft);
      }
    }
    
    // Cleanup
    target.startX = null;
    target.startY = null;
  }, [enabled, navigate, swipeLeft, swipeRight, sensitivity]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd, enabled]);

  return {
    // Manual navigation functions
    goLeft: swipeLeft ? () => navigate(swipeLeft) : undefined,
    goRight: swipeRight ? () => navigate(swipeRight) : undefined
  };
};

/**
 * Keyboard Shortcuts Hook voor desktop ontwikkeling
 */
export const useKeyboardShortcuts = (config: SwipeNavigationConfig) => {
  const navigate = useNavigate();
  const { swipeLeft, swipeRight, enabled = true } = config;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Arrow keys voor navigatie
      if ((e.metaKey || e.ctrlKey)) {
        if (e.key === 'ArrowLeft' && swipeLeft) {
          e.preventDefault();
          navigate(swipeLeft);
        } else if (e.key === 'ArrowRight' && swipeRight) {
          e.preventDefault();
          navigate(swipeRight);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate, swipeLeft, swipeRight, enabled]);
};