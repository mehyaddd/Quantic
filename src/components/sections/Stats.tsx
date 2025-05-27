import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import '../Stats.css';

const Stats: React.FC = () => {
  const textRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    if (!textRef.current) return;
    
    // Create a horizontal scrolling text animation that loops seamlessly
    const textContent = textRef.current;
    
    // Clone the text to create a seamless loop
    const originalText = textContent.innerHTML;
    textContent.innerHTML = originalText + originalText;
    
    const textWidth = textContent.offsetWidth / 2; // Width of one copy of the text
    
    // Set up the infinite scrolling animation
    gsap.to(textContent, {
      x: -textWidth,
      duration: 100,
      ease: "linear",
      repeat: -1,
      onRepeat: () => {
        gsap.set(textContent, { x: 0 });
      }
    });
    
    return () => {
      // Clean up GSAP animations
      gsap.killTweensOf(textContent);
    };
  }, []);

  return (
    <section ref={sectionRef} className="stats-section py-16 md:py-24 text-white overflow-hidden">
      <div className="scrolling-container w-full overflow-hidden">
        <div 
          ref={textRef} 
          className="scrolling-text whitespace-nowrap text-6xl md:text-8xl lg:text-9xl font-bold"
          style={{ willChange: 'transform', display: 'inline-block' }}
        >
          CREATIVE DEVELOPER • <span className="highlight">UI/UX DESIGNER</span> • PROBLEM SOLVER • <span className="highlight">WEB ENTHUSIAST</span> • DIGITAL CRAFTSMAN • <span className="highlight">PIXEL PERFECTIONIST</span> • CODE ARTISAN •
        </div>
      </div>
    </section>
  );
};

export default Stats;