import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

const Cursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorText, setCursorText] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power1.out',
      });
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    // Handle hover states for interactive elements
    const handleLinkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (target.tagName === 'A' || 
          target.tagName === 'BUTTON' || 
          target.closest('a') || 
          target.closest('button')) {
        
        gsap.to(cursor, {
          scale: 1.5,
          backgroundColor: 'white',
          mixBlendMode: 'difference',
          duration: 0.3,
        });
        
        setCursorText('Click');
        cursor?.classList.add('custom-cursor-text');
      }
    };

    const handleLinkLeave = () => {
      gsap.to(cursor, {
        scale: 1,
        backgroundColor: '',
        duration: 0.3,
      });
      
      setCursorText('');
      cursor?.classList.remove('custom-cursor-text');
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);
    
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', handleLinkHover);
      el.addEventListener('mouseleave', handleLinkLeave);
    });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
      
      document.querySelectorAll('a, button').forEach(el => {
        el.removeEventListener('mouseenter', handleLinkHover);
        el.removeEventListener('mouseleave', handleLinkLeave);
      });
    };
  }, []);

  return (
    <div 
      ref={cursorRef} 
      className={`custom-cursor ${!isVisible ? 'custom-cursor-hidden' : ''}`}
    >
      {cursorText && <span className="text-xs font-medium">{cursorText}</span>}
    </div>
  );
};

export default Cursor;