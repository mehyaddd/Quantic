import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const AnimatedBackground: React.FC = () => {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bg = bgRef.current;
    if (!bg) return;

    // Create floating elements
    const elements = Array.from({ length: 6 }).map((_, i) => {
      const el = document.createElement('div');
      el.className = `absolute rounded-full blur-3xl bg-primary/10 transition-colors duration-300`;
      el.style.width = `${Math.random() * 300 + 200}px`;
      el.style.height = el.style.width;
      el.style.left = `${Math.random() * 100}%`;
      el.style.top = `${Math.random() * 100}%`;
      return el;
    });

    elements.forEach(el => {
      bg.appendChild(el);
      
      // Random floating animation
      gsap.to(el, {
        y: "random(-100, 100)",
        x: "random(-100, 100)",
        scale: "random(0.8, 1.2)",
        duration: "random(10, 20)",
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    });

    return () => {
      elements.forEach(el => el.remove());
    };
  }, []);

  return (
    <div ref={bgRef} className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-transparent opacity-90" />
    </div>
  );
};

export default AnimatedBackground;