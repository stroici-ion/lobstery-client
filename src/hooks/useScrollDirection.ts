import { useState, useEffect } from 'react';

const useScrollDirection = () => {
  //   const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  //   useEffect(() => {
  //     let lastScrollY = window.pageYOffset;
  //     const updateScrollDirection = () => {
  //       const scrollY = window.pageYOffset;
  //       if (scrollY > lastScrollY) {
  //         setScrollDirection('down');
  //       } else if (scrollY < lastScrollY) {
  //         setScrollDirection('up');
  //       }
  //       lastScrollY = scrollY > 0 ? scrollY : 0;
  //     };
  //     window.addEventListener('scroll', updateScrollDirection);
  //     return () => {
  //       window.removeEventListener('scroll', updateScrollDirection);
  //     };
  //   }, []);
  //   return scrollDirection;
};

export default useScrollDirection;
