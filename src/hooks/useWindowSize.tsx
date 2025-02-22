
import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  isMobile: boolean;
  height?: number; 
}

const MOBILE_BREAKPOINT = 768;

export const useWindowSize = (): WindowSize => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window.innerWidth,
    isMobile: window.innerWidth < MOBILE_BREAKPOINT,
    height: window.innerHeight,
  });

  useEffect(() => {
    
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        isMobile: window.innerWidth < MOBILE_BREAKPOINT,
        height: window.innerHeight,
      });
    };

  
    window.addEventListener('resize', handleResize);
    
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};