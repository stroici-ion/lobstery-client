import { useEffect, RefObject } from 'react';

export default function useClickOutside<T extends HTMLElement>(ref: RefObject<T>, callback: () => void): void {
  useEffect(() => {
    const onClick = (e: MouseEvent) => checkClickOutside(e.target as Node);
    const onTouchStart = (e: TouchEvent) => checkClickOutside(e.touches[0].target as Node);
    const checkClickOutside = (target: Node) => {
      if (ref.current && !ref.current.contains(target)) {
        callback();
      }
    };

    document.addEventListener('mousedown', onClick);
    document.addEventListener('touchstart', onTouchStart);

    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('touchstart', onTouchStart);
    };
  }, [ref, callback]);
}
