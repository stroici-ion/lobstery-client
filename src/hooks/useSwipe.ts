import { useRef, useEffect } from 'react';

type SwipeDirection = 'left' | 'right';

type UseSwipeProps = {
  onSwipe: () => void;
  direction: SwipeDirection;
  threshold?: number;
};

const useSwipe = ({ onSwipe, direction, threshold = 50 }: UseSwipeProps) => {
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance = touchEndX.current - touchStartX.current;

    if (direction === 'right' && distance > threshold) {
      onSwipe(); // Swipe right
    } else if (direction === 'left' && -distance > threshold) {
      onSwipe(); // Swipe left
    }
  };

  useEffect(() => {
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [direction, onSwipe, threshold]);

  return null;
};

export default useSwipe;
