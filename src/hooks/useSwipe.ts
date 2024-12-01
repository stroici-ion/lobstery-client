import { useRef, useEffect } from 'react';

type TSwipeDirection = 'left' | 'right' | 'up' | 'down';

type UseSwipeProps = {
  onSwipe: () => void;
  direction: TSwipeDirection;
  threshold?: number;
};

const useSwipe = ({ onSwipe, direction, threshold = 50 }: UseSwipeProps) => {
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const touchEndY = useRef<number>(0);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;

    const deltaX = touchEndX.current - touchStartX.current;
    const deltaY = touchEndY.current - touchStartY.current;

    if (direction === 'right' && deltaX > threshold && Math.abs(deltaY) < threshold) {
      onSwipe(); // Swipe right
    } else if (direction === 'left' && -deltaX > threshold && Math.abs(deltaY) < threshold) {
      onSwipe(); // Swipe left
    } else if (direction === 'down' && deltaY > threshold && Math.abs(deltaX) < threshold) {
      onSwipe(); // Swipe down
    } else if (direction === 'up' && -deltaY > threshold && Math.abs(deltaX) < threshold) {
      onSwipe(); // Swipe up
    }
  };

  useEffect(() => {
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [direction, onSwipe, threshold]);

  return null;
};

export default useSwipe;
