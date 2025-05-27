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

    // Create heavy noise overlay
    const noise = document.createElement('div');
    noise.className = 'absolute inset-0 pointer-events-none';
    noise.style.background = 'url("data:image/png;base64,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")';
    noise.style.opacity = '0';
    noise.style.mixBlendMode = 'multiply';
    container.appendChild(noise);

    // Create color distortion layer
    const colorDistortion = document.createElement('div');
    colorDistortion.className = 'absolute inset-0 pointer-events-none';
    colorDistortion.style.background = 'linear-gradient(45deg, rgba(255,0,0,0) 95%, rgba(255,0,0,0.8) 100%), linear-gradient(135deg, rgba(0,255,0,0) 95%, rgba(0,255,0,0.8) 100%)';
    colorDistortion.style.opacity = '0';
    colorDistortion.style.mixBlendMode = 'screen';
    container.appendChild(colorDistortion);

    // Create scan lines
    const scanLines = document.createElement('div');
    scanLines.className = 'absolute inset-0 pointer-events-none';
    scanLines.style.background = 'repeating-linear-gradient(0deg, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 1px, transparent 1px, transparent 2px)';
    scanLines.style.opacity = '0';
    container.appendChild(scanLines);

    // Create signal strength indicator
    const signalStrength = document.createElement('div');
    signalStrength.className = 'absolute top-4 right-4 flex items-center pointer-events-none opacity-0';
    signalStrength.innerHTML = `
      <div class="flex space-x-1 mr-2">
        <div class="w-1 h-3 bg-green-500"></div>
        <div class="w-1 h-5 bg-green-500"></div>
        <div class="w-1 h-7 bg-green-500"></div>
        <div class="w-1 h-9 bg-white/40"></div>
        <div class="w-1 h-11 bg-white/40"></div>
      </div>
      <div class="text-xs font-mono text-green-500">SIGNAL 60%</div>
    `;
    container.appendChild(signalStrength);

    // Create "SIGNAL LOST" text
    const signalLostText = document.createElement('div');
    signalLostText.className = 'absolute inset-0 flex items-center justify-center pointer-events-none opacity-0';
    signalLostText.innerHTML = `
      <div class="bg-black/70 px-6 py-3 rounded-md">
        <div class="text-2xl font-bold text-red-500 font-mono tracking-widest">SIGNAL LOST</div>
        <div class="text-xs text-gray-400 font-mono text-center mt-1">Reconnecting...</div>
      </div>
    `;
    container.appendChild(signalLostText);
    
    // Create interlacing effect
    const interlacing = document.createElement('div');
    interlacing.className = 'absolute inset-0 pointer-events-none';
    interlacing.style.background = 'repeating-linear-gradient(to bottom, transparent, transparent 1px, rgba(0,0,0,0.05) 1px, rgba(0,0,0,0.05) 2px)';
    interlacing.style.opacity = '0';
    container.appendChild(interlacing);

    // Main glitch animation
    const glitchTimeline = gsap.timeline({
      repeat: -1,
      repeatDelay: gsap.utils.random(7, 12), // Random delay between glitches
      paused: true,
    });

    // Signal indicator appears first
    glitchTimeline.to(signalStrength, {
      opacity: 1,
      duration: 0.5,
    });
    
    // Initial small glitch
    glitchTimeline.to(image, {
      filter: 'brightness(1.1) contrast(1.1)',
          duration: 0.1,
      delay: 0.5,
        });
    
    glitchTimeline.to([noise, scanLines, interlacing], {
      opacity: 0.15,
      duration: 0.1,
    }, '<');
    
    glitchTimeline.to(image, {
      x: () => Math.random() * 5 - 2.5,
      y: () => Math.random() * 5 - 2.5,
      duration: 0.1,
    }, '<');
    
    // Quickly return to normal
    glitchTimeline.to([image, noise, scanLines, interlacing], {
      opacity: (_, target) => target === image ? 1 : 0,
      x: 0,
      y: 0,
      filter: 'brightness(1) contrast(1)',
        duration: 0.1,
      });

    // Major signal loss
    glitchTimeline.to(image, {
      filter: 'brightness(1.3) contrast(1.5) hue-rotate(-10deg)',
      duration: 0.05,
      delay: 0.7,
    });
    
    glitchTimeline.to([noise, scanLines, interlacing, colorDistortion], {
      opacity: (_, target) => target === colorDistortion ? 0.8 : 0.6,
      duration: 0.05,
    }, '<');
    
    glitchTimeline.to(image, {
      x: () => Math.random() * 20 - 10,
      y: () => Math.random() * 10 - 5,
      skewX: () => Math.random() * 3 - 1.5,
      duration: 0.1,
    }, '<');
    
    // Signal strength indicator changes
    glitchTimeline.to(signalStrength, {
      opacity: 0,
      duration: 0.1,
    }, '<');
    
    // Show "SIGNAL LOST" text
    glitchTimeline.to(signalLostText, {
        opacity: 1,
        duration: 0.1,
    }, '<');
    
    // More intense distortion
    glitchTimeline.to(image, {
      filter: 'brightness(0.8) contrast(2) saturate(1.5) hue-rotate(5deg)',
      x: () => Math.random() * 30 - 15,
      duration: 0.2,
      });
    
    // Random horizontal shifting lines
    const horizontalShiftEffect = () => {
      const numLines = 4;
      for (let i = 0; i < numLines; i++) {
        const y = Math.random() * 100;
        const height = Math.random() * 10 + 5;
        const line = document.createElement('div');
        line.className = 'absolute pointer-events-none';
        line.style.top = `${y}%`;
        line.style.left = '0';
        line.style.right = '0';
        line.style.height = `${height}px`;
        line.style.background = 'rgba(255,255,255,0.2)';
        line.style.transform = `translateX(${Math.random() * 20 - 10}px)`;
        container.appendChild(line);
        
        gsap.to(line, {
          x: Math.random() * 50 - 25,
        opacity: 0,
        duration: 0.3,
          onComplete: () => line.remove(),
        });
      }
    };
    
    glitchTimeline.call(horizontalShiftEffect);
    
    // Second wave of distortion
    glitchTimeline.to(image, {
      filter: 'brightness(1.5) contrast(1.2) blur(2px)',
      x: () => Math.random() * 10 - 5,
      y: () => Math.random() * 10 - 5,
      duration: 0.2,
      delay: 0.1,
        });

    // Begin recovering
    glitchTimeline.to([image, noise, scanLines, interlacing, colorDistortion], {
      opacity: (_, target) => target === image ? 1 : 0.3,
      x: 0,
      y: 0,
      skewX: 0,
      filter: 'brightness(1.1) contrast(1.1) blur(1px) hue-rotate(0deg)',
      duration: 0.3,
      delay: 0.2,
      });

    // Signal Lost text fades
    glitchTimeline.to(signalLostText, {
        opacity: 0,
      duration: 0.3,
    }, '<');

    // Signal strength returns
    glitchTimeline.to(signalStrength, {
      opacity: 1,
      duration: 0.3,
    }, '<');

    // Final recovery
    glitchTimeline.to([image, noise, scanLines, interlacing, colorDistortion], {
      opacity: (_, target) => target === image ? 1 : 0,
      filter: 'brightness(1) contrast(1) blur(0px)',
      duration: 0.5,
    });
    
    // Signal indicator fades away
    glitchTimeline.to(signalStrength, {
        opacity: 0,
      duration: 0.5,
      delay: 1,
      });

    // Start the animation
    glitchTimeline.play();

    return () => {
      glitchTimeline.kill();
      noise.remove();
      scanLines.remove();
      colorDistortion.remove();
      signalStrength.remove();
      signalLostText.remove();
      interlacing.remove();
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