import { useEffect, useRef } from 'react';

export type TPosition = {
  x: number;
  y: number;
};

interface IProps {
  onMove: (cursorDiff: TPosition, startCursor: TPosition) => void;
  onDown?: (startCursor?: TPosition) => void;
  onLeave?: () => void;
}

export const useCursorMouseMove = (callBacks: IProps) => {
  const isMouseDown = useRef(false);
  const initialPosition = useRef<TPosition>({ x: 0, y: 0 });

  const onMouseDown = (event: MouseEvent) => {
    isMouseDown.current = true;
    initialPosition.current.x = event.clientX;
    initialPosition.current.y = event.clientY;
    callBacks.onDown?.(initialPosition.current);
  };

  const onTouchDown = (event: TouchEvent) => {
    isMouseDown.current = true;
    initialPosition.current.x = event.touches[0].clientX;
    initialPosition.current.y = event.touches[0].clientY;
    callBacks.onDown?.(initialPosition.current);
  };

  const onMouseMove = (event: MouseEvent) => {
    if (isMouseDown.current) {
      const cursorDiff: TPosition = {
        x: initialPosition.current.x - event.clientX,
        y: initialPosition.current.y - event.clientY,
      };
      callBacks.onMove?.(cursorDiff, initialPosition.current);
    }
  };

  const onTouchMove = (event: TouchEvent) => {
    if (isMouseDown.current) {
      const cursorDiff: TPosition = {
        x: initialPosition.current.x - event.touches[0].clientX,
        y: initialPosition.current.y - event.touches[0].clientY,
      };
      callBacks.onMove?.(cursorDiff, initialPosition.current);
    }
  };

  const onMouseLeave = () => {
    isMouseDown.current = false;
    callBacks.onLeave?.();
  };

  useEffect(() => {
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseLeave);
    window.addEventListener('mouseleave', onMouseLeave);

    window.addEventListener('touchstart', onTouchDown);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onMouseLeave);
    window.addEventListener('touchcancel', onMouseLeave);

    // document.addEventListener('selectionchange', onMouseLeave);
    // document.addEventListener('dragstart', onMouseLeave);

    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseLeave);
      window.removeEventListener('mouseleave', onMouseLeave);

      window.removeEventListener('touchstart', onTouchDown);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseLeave);
      window.removeEventListener('touchcancel', onMouseLeave);

      document.removeEventListener('selectionchange', onMouseLeave);
      document.removeEventListener('dragstart', onMouseLeave);
    };
  }, []);
};
