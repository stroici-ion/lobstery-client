import { useEffect, RefObject } from 'react';

// Hook to handle clicks outside of a referenced element
function useClickOutside<T extends HTMLElement>(ref: RefObject<T>, callback: () => void): void {
  useEffect(() => {
    const onClick = (e: MouseEvent) => checkClickOutside(e.target as Node);
    const onTouchStart = (e: TouchEvent) => checkClickOutside(e.touches[0].target as Node);
    const checkClickOutside = (target: Node) => {
      if (ref.current && !ref.current.contains(target)) {
        callback();
      }
    };

    // Add event listener for clicks
    document.addEventListener('mousedown', onClick);
    document.addEventListener('touchstart', onTouchStart);

    return () => {
      // Cleanup the event listeners
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('touchstart', onTouchStart);
    };
  }, [ref, callback]);
}

export default useClickOutside;
