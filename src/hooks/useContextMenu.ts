import { useEffect, useRef, useState } from 'react';

export const useContextMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ left: '0', top: '0', right: 'auto', bottom: 'auto' });
  const isOpenRef = useRef(false);

  const contextTriggerRef = useRef<HTMLButtonElement>(null);

  const onHide = () => {
    setIsOpen(false);
    isOpenRef.current = false;
  };

  const calc = () => {
    if (contextTriggerRef.current) {
      const rect = (contextTriggerRef.current as HTMLElement).getBoundingClientRect();
      const width = window.innerWidth;
      const height = window.innerHeight;
      const position = {
        left: rect.left - 10 + 'px',
        top: rect.top + rect.height + 10 + 'px',
        right: 'auto',
        bottom: 'auto',
      };
      if (rect.left + rect.width / 2 > width / 2) {
        position.left = 'auto';
        position.right = width - (rect.x + rect.width + 10) + 'px';
      }

      if (rect.top + rect.height / 2 > height / 2) {
        position.top = 'auto';
        position.bottom = height - rect.y + 10 + 'px';
      }

      setPosition(position);
    }
  };

  const onResize = () => {
    if (isOpenRef.current) calc();
  };

  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => document.removeEventListener('resize', onResize);
  }, []);

  const onShow = () => {
    calc();
    setIsOpen(true);
    isOpenRef.current = true;
  };

  return {
    triggerRef: contextTriggerRef,
    onShow,
    isOpen,
    onHide,
    position,
  };
};
