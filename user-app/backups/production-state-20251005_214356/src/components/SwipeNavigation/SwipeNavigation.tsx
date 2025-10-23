import React, { useRef } from 'react';

interface SwipeNavigationProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  children: React.ReactNode;
}

const SwipeNavigation: React.FC<SwipeNavigationProps> = ({
  onSwipeLeft,
  onSwipeRight,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeThreshold = 50;
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left
        onSwipeLeft();
      } else {
        // Swipe right
        onSwipeRight();
      }
    }
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        width: '100%',
        height: '100%',
        touchAction: 'pan-y',
      }}
    >
      {children}
    </div>
  );
};

export default SwipeNavigation;
