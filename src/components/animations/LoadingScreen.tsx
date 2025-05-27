import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Code } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  const loadingRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    
    // Initialize with 0% width
    gsap.set(progressRef.current, {
      width: '0%',
    });

    // Animate the progress bar from 0% to 100%
    tl.to(progressRef.current, {
      width: '100%',
      duration: 2,
      ease: 'power2.inOut',
    });

    // Animate text reveal
    tl.from(textRef.current?.children || [], {
      y: 20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power2.out',
    }, 0.3);

    // Fade out the entire loading screen
    tl.to(loadingRef.current, {
      opacity: 0,
      duration: 0.5,
      delay: 0.2,
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div 
      ref={loadingRef} 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
    >
      <div className="flex flex-col items-center space-y-8">
        <Code size={48} className="text-primary animate-spin-slow" />
        
        <div ref={textRef} className="text-center">
          <h2 className="text-4xl font-bold mb-2">Loading</h2>
          <p className="text-muted-foreground">Creating digital experiences</p>
        </div>
        
        <div className="w-64 h-1 bg-muted overflow-hidden rounded-full">
          <div 
            ref={progressRef} 
            className="h-full bg-primary rounded-full"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;