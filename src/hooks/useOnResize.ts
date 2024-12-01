import { useEffect } from 'react';

export const useOnResize = (onResize: () => void) => {
  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('resize', onResize);
    };
  }, []);
};
