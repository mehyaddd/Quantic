import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface GlitchImageProps {
  src: string;
  alt: string;
  className?: string;
}

const GlitchImage: React.FC<GlitchImageProps> = ({ src, alt, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!containerRef.current || !imageRef.current) return;

    const container = containerRef.current;
    const image = imageRef.current;

    // Create noise overlay
    const noise = document.createElement('div');
    noise.className = 'absolute inset-0 pointer-events-none';
    noise.style.background = 'url("data:image/png;base64,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")';
    noise.style.opacity = '0.05';
    noise.style.mixBlendMode = 'overlay';
    container.appendChild(noise);

    // Create scan lines
    const scanLines = document.createElement('div');
    scanLines.className = 'absolute inset-0 pointer-events-none';
    scanLines.style.background = 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)';
    scanLines.style.opacity = '0.3';
    container.appendChild(scanLines);

    // Create digital distortion block
    const distortionBlock = document.createElement('div');
    distortionBlock.className = 'absolute inset-0 pointer-events-none';
    distortionBlock.style.opacity = '0';
    distortionBlock.style.background = 'repeating-linear-gradient(90deg, rgba(255,255,255,0.1) 0px, rgba(0,255,255,0.3) 5px, rgba(255,0,255,0.3) 10px)';
    distortionBlock.style.mixBlendMode = 'overlay';
    container.appendChild(distortionBlock);

    // Create signal strength indicator
    const signalStrength = document.createElement('div');
    signalStrength.className = 'absolute right-3 top-3 pointer-events-none flex flex-row gap-1';
    signalStrength.style.opacity = '0.6';
    container.appendChild(signalStrength);

    // Create 5 signal bars
    for (let i = 0; i < 5; i++) {
      const bar = document.createElement('div');
      bar.className = 'h-3 w-1 bg-white';
      bar.style.opacity = i < 3 ? '1' : '0.2';
      signalStrength.appendChild(bar);
    }

    // Create connection lost overlay
    const connectionLost = document.createElement('div');
    connectionLost.className = 'absolute inset-0 pointer-events-none flex items-center justify-center';
    connectionLost.style.backgroundColor = 'rgba(0,0,0,0.7)';
    connectionLost.style.opacity = '0';
    connectionLost.style.color = 'white';
    connectionLost.style.fontFamily = 'monospace';
    connectionLost.style.fontSize = '14px';
    connectionLost.textContent = 'SIGNAL LOST';
    container.appendChild(connectionLost);
    
    // Create horizontal distortion
    const horizontalDistortion = document.createElement('div');
    horizontalDistortion.className = 'absolute inset-0 pointer-events-none overflow-hidden';
    horizontalDistortion.style.opacity = '0';
    container.appendChild(horizontalDistortion);
    
    // Create multiple horizontal distortion lines
    for (let i = 0; i < 5; i++) {
      const line = document.createElement('div');
      line.className = 'absolute w-full pointer-events-none';
      line.style.height = '3px';
      line.style.top = `${Math.floor(Math.random() * 100)}%`;
      line.style.backgroundColor = 'rgba(255,255,255,0.8)';
      line.style.transform = 'translateX(-100%)';
      horizontalDistortion.appendChild(line);
    }

    // Animation
    const mainTimeline = gsap.timeline({
      repeat: -1,
      repeatDelay: 3,
    });

    // Utility to animate horizontal lines
    const animateHorizontalLines = () => {
      const lines = horizontalDistortion.querySelectorAll('div');
      lines.forEach((line: Element) => {
        gsap.fromTo(
          line,
          { x: '-100%' },
          { 
            x: '100%', 
            duration: 0.2, 
            ease: 'power1.inOut',
            delay: Math.random() * 0.1,
            onComplete: () => {
              line.setAttribute('style', `
                height: 3px;
                top: ${Math.floor(Math.random() * 100)}%;
                background-color: rgba(255,255,255,0.8);
                transform: translateX(-100%);
              `);
            }
          }
        );
      });
    };

    // Signal loss sequence
    const signalLoss = () => {
      // Signal bars animation
      const bars = signalStrength.querySelectorAll('div');
      bars.forEach((bar: Element, index: number) => {
        gsap.to(bar, {
          opacity: 0.2,
          duration: 0.1,
          delay: index * 0.05,
        });
      });

      // Increase noise
      gsap.to(noise, {
        opacity: 0.3,
        duration: 0.2,
      });

      // Show distortion
      gsap.to(distortionBlock, {
        opacity: 0.8,
        duration: 0.1,
      });

      // Horizontal distortion
      gsap.to(horizontalDistortion, {
        opacity: 1,
        duration: 0.1,
        onComplete: animateHorizontalLines,
      });

      // After a moment, show connection lost
      gsap.to(connectionLost, {
        opacity: 1,
        duration: 0.3,
        delay: 0.2,
      });
    };

    // Signal restore sequence
    const signalRestore = () => {
      // Hide connection lost
      gsap.to(connectionLost, {
        opacity: 0,
        duration: 0.3,
      });

      // Restore signal bars
      const bars = signalStrength.querySelectorAll('div');
      for (let i = 0; i < bars.length; i++) {
        const bar = bars[i];
        gsap.to(bar, {
          opacity: i < 3 ? 1 : 0.2,
          duration: 0.1,
          delay: 0.3 + (bars.length - i - 1) * 0.05,
        });
      }

      // Final horizontal distortion
      gsap.to(horizontalDistortion, {
        opacity: 1,
        duration: 0.1,
        delay: 0.2,
        onComplete: animateHorizontalLines,
      });

      // Reset distortion
      gsap.to(distortionBlock, {
        opacity: 0,
        duration: 0.2,
        delay: 0.4,
      });

      // Reset noise
      gsap.to(noise, {
        opacity: 0.05,
        duration: 0.2,
        delay: 0.4,
      });

      // Reset horizontal distortion
      gsap.to(horizontalDistortion, {
        opacity: 0,
        duration: 0.2,
        delay: 0.5,
      });
    };

    // Sequence of signal loss and restoration
    mainTimeline
      .add(signalLoss)
      .add(signalRestore, '+=0.8');

    return () => {
      mainTimeline.kill();
      noise.remove();
      scanLines.remove();
      distortionBlock.remove();
      signalStrength.remove();
      connectionLost.remove();
      horizontalDistortion.remove();
    };
  }, [src]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default GlitchImage; 