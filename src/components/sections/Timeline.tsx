import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Define types for better type safety
interface ImageSequenceConfig {
  urls: string[];
  canvas: HTMLCanvasElement;
  clear?: boolean;
  scrollTrigger?: any;
  paused?: boolean;
  fps?: number;
  onUpdate?: (index: number, image: HTMLImageElement) => void;
}

const Timeline: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
    
  // Handle canvas resizing
  const setCanvasSize = useCallback(() => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      
    // Fixed dimensions for vertical display
      const canvasWidth = 1920;
      const canvasHeight = 3200;
      
      // Set canvas dimensions
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      
      // Scale canvas to fit viewport while maintaining aspect ratio
      const scale = Math.min(
        window.innerWidth * 0.9 / canvasWidth,
        window.innerHeight * 0.85 / canvasHeight
      );
      
      const scaledWidth = canvasWidth * scale;
      const scaledHeight = canvasHeight * scale;
      
      canvas.style.width = `${scaledWidth}px`;
      canvas.style.height = `${scaledHeight}px`;
  }, []);
    
  // Display loading progress
  const showLoadingProgress = useCallback((ctx: CanvasRenderingContext2D, progress: number) => {
    const canvas = ctx.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`Loading: ${progress}%`, canvas.width / 2, canvas.height / 2);
    setLoadingProgress(progress);
  }, []);
  
  // Image sequence animation function
  const createImageSequence = useCallback((config: ImageSequenceConfig) => {
      const playhead = { frame: 0 };
      const canvas = config.canvas;
      const ctx = canvas.getContext('2d');
      let curFrame = -1;
      const onUpdate = config.onUpdate;
    let loadedImages: HTMLImageElement[] = [];
      const totalImages = config.urls.length;
      
      if (!ctx) {
        console.error("Failed to get canvas context");
        return null;
      }
      
    // Initial loading indicator
    showLoadingProgress(ctx, 0);
      
    // Draw image function
      const updateImage = () => {
        const frame = Math.round(playhead.frame);
      if (frame !== curFrame && frame >= 0 && frame < loadedImages.length) {
          if (config.clear) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }
          
        const img = loadedImages[frame];
          if (img && img.complete && img.naturalWidth > 0) {
            try {
              // Calculate dimensions to fit image properly in vertical orientation
              const imgWidth = img.naturalWidth;
              const imgHeight = img.naturalHeight;
              const imgRatio = imgWidth / imgHeight;
              const canvasRatio = canvas.width / canvas.height;
              
              let drawWidth, drawHeight, offsetX, offsetY;
              
              // If image is wider than canvas (relative to height)
              if (imgRatio > canvasRatio) {
                drawHeight = canvas.height;
                drawWidth = drawHeight * imgRatio;
                offsetX = (canvas.width - drawWidth) / 2;
                offsetY = 0;
              } else {
                // If image is taller than canvas (relative to width)
                drawWidth = canvas.width;
                drawHeight = drawWidth / imgRatio;
                offsetX = 0;
                offsetY = (canvas.height - drawHeight) / 2;
              }
              
              // Draw the image centered in the canvas
              ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
              curFrame = frame;
              if (onUpdate) onUpdate(frame, img);
            } catch (error) {
              console.error("Error drawing image:", error);
            }
          }
        }
      };
      
      // Preload all images before starting animation
    const preloadImages = async (): Promise<HTMLImageElement[]> => {
      return new Promise((resolve) => {
          const imgArray: HTMLImageElement[] = [];
          let loaded = 0;
          
          config.urls.forEach((url, i) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            
            img.onload = () => {
              loaded++;
            const progress = Math.round((loaded / totalImages) * 100);
            showLoadingProgress(ctx, progress);
              
              if (loaded === totalImages) {
              setIsLoading(false);
                resolve(imgArray);
              }
            };
            
            img.onerror = () => {
              console.error(`Failed to load image: ${url}`);
              loaded++;
              if (loaded === totalImages) {
              setIsLoading(false);
                resolve(imgArray);
              }
            };
            
            img.src = url;
            imgArray[i] = img;
          });
        });
      };
      
      // First preload all images, then create the animation
      preloadImages().then((loadedImgs) => {
      loadedImages = loadedImgs;
        
        // Draw first frame once loaded
      if (loadedImages[0] && loadedImages[0].complete) {
          updateImage(); // Use the same rendering logic for consistency
        }
        
        // Create the scroll animation
        const tween = gsap.to(playhead, {
          frame: totalImages - 1,
          ease: "none",
          onUpdate: updateImage,
          duration: totalImages / (config.fps || 30),
          paused: !!config.paused,
          scrollTrigger: config.scrollTrigger
        });
        
        return tween;
      });
      
      // Return placeholder - the actual tween is created after images load
      return null;
  }, [showLoadingProgress]);
    
  // Setup ScrollTrigger and image sequence
  const setupScrollTrigger = useCallback(() => {
      if (!sectionRef.current || !canvasRef.current) return;
      
    // Clear any existing ScrollTriggers
    ScrollTrigger.getAll().forEach(st => st.kill());
    
    // Total number of frames (255 images in the public/images/paper directory)
    const frameCount = 255;
    
    // URLs for the paper sequence images (numbered from 1 to 255)
    const urls = Array.from({ length: frameCount }, (_, i) => 
      `/images/paper/${i + 1}.png`
    );
    
    // Create a ScrollTrigger for the canvas animation
    createImageSequence({
        urls,
        canvas: canvasRef.current,
        clear: true,
        scrollTrigger: {
          trigger: sectionRef.current.parentElement,
        pin: true,         // Pin the section
        start: "top top",  // Start at the top of the viewport
        end: "+=120%",     // End after scrolling 120% of the viewport height
        scrub: 1,          // Smooth scrubbing
          markers: false,
        anticipatePin: 1,  // To prevent pinning jump
          invalidateOnRefresh: true,
        pinSpacing: "margin",  // Use margin for smoother transition
        pinType: 'fixed',  // Use fixed position for smoother pinning
        }
      });
  }, [createImageSequence]);
  
  // Initialize everything
  useEffect(() => {
    if (!canvasRef.current || !sectionRef.current) return;
    
    // Initial size setup
    setCanvasSize();
    
    // Listen for window resize
    window.addEventListener('resize', setCanvasSize);
    
    // We'll use a timeout to ensure DOM is ready
    const initTimeout = setTimeout(setupScrollTrigger, 500);
    
    // Cleanup function
    return () => {
      clearTimeout(initTimeout);
      window.removeEventListener('resize', setCanvasSize);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [setCanvasSize, setupScrollTrigger]);
  
  return (
    <section className="w-full overflow-x-hidden">
      {/* This is the scrollable container that creates space for the animation */}
      <div className="w-full h-[100vh] md:h-[120vh] relative">
        {/* This is the container that will be pinned during scrolling */}
        <div 
          ref={sectionRef} 
          className="w-full py-4 md:py-8 flex flex-col items-center justify-center sticky top-0 h-screen"
        >
          {/* Title */}
          <div className="text-center mb-2 md:mb-4 pt-8 md:pt-12 mt-8 md:mt-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
              My <span className="text-primary">Journey</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The path that has shaped my skills and expertise in the digital realm
            </p>
          </div>
          
          {/* Canvas container */}
          <div className="w-full h-[70vh] md:h-[80vh] flex items-center justify-center mt-2 relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-foreground">{loadingProgress}%</p>
                </div>
              </div>
            )}
            <canvas 
              ref={canvasRef} 
              id="image-sequence"
              className="shadow-xl rounded-lg max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline; 