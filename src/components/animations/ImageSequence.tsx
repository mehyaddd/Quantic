import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ImageSequenceProps {
  urls: string[];
  width: number;
  height: number;
  fps?: number;
  className?: string;
}

const ImageSequence: React.FC<ImageSequenceProps> = ({ 
  urls, 
  width, 
  height, 
  fps = 30,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const curFrameRef = useRef<number>(-1);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const playhead = { frame: 0 };
    
    // Update function to draw the current frame
    const updateImage = () => {
      const frame = Math.round(playhead.frame);
      if (frame !== curFrameRef.current && imagesRef.current[frame]) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(imagesRef.current[frame], 0, 0);
        curFrameRef.current = frame;
      }
    };
    
    // Load all images
    imagesRef.current = urls.map((url, i) => {
      const img = new Image();
      img.src = url;
      if (i === 0) {
        img.onload = updateImage;
      }
      return img;
    });
    
    // Create the animation
    const tween = gsap.to(playhead, {
      frame: urls.length - 1,
      ease: "none",
      onUpdate: updateImage,
      duration: urls.length / fps,
      scrollTrigger: {
        trigger: canvas,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        pin: true,
        anticipatePin: 1
      }
    });
    
    // Cleanup
    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [urls, fps]);
  
  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[100vw] max-h-[100vh] ${className}`}
    />
  );
};

export default ImageSequence;