import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
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

interface LoadedImage {
  img: HTMLImageElement;
  loaded: boolean;
}

const Timeline: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  
  // Constants for canvas dimensions
  const CANVAS_DIMENSIONS = useMemo(() => ({
    width: 1920,
    height: 3200
  }), []);
  
  // Total number of frames
  const FRAME_COUNT = 255;
  
  // Generate image URLs once
  const imageUrls = useMemo(() => {
    return Array.from({ length: FRAME_COUNT }, (_, i) => 
      `/images/paper/${i + 1}.webp`
    );
  }, [FRAME_COUNT]);
    
  // Handle canvas resizing
  const setCanvasSize = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const { width: canvasWidth, height: canvasHeight } = CANVAS_DIMENSIONS;
    
    // Set canvas dimensions
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // Scale canvas to fit viewport while maintaining aspect ratio
    const isMobile = window.innerWidth < 768;
    const scale = Math.min(
      (isMobile ? window.innerWidth * 0.95 : window.innerWidth * 0.9) / canvasWidth,
      (isMobile ? window.innerHeight * 0.6 : window.innerHeight * 0.85) / canvasHeight
    );
    
    const scaledWidth = canvasWidth * scale;
    const scaledHeight = canvasHeight * scale;
    
    canvas.style.width = `${scaledWidth}px`;
    canvas.style.height = `${scaledHeight}px`;
    
    // Store the context for reuse
    if (!ctxRef.current) {
      ctxRef.current = canvas.getContext('2d');
    }
  }, [CANVAS_DIMENSIONS]);
    
  // Display loading progress
  const showLoadingProgress = useCallback((progress: number) => {
    const ctx = ctxRef.current;
    if (!ctx || !canvasRef.current) return;
    
    const canvas = ctx.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`Loading: ${progress}%`, canvas.width / 2, canvas.height / 2);
    setLoadingProgress(progress);
  }, []);
  
  // Draw image function - optimized to avoid unnecessary calculations
  const drawImage = useCallback((img: HTMLImageElement, ctx: CanvasRenderingContext2D) => {
    if (!img || !img.complete || img.naturalWidth === 0) return;
    
    try {
      const canvas = ctx.canvas;
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
    } catch (error) {
      console.error("Error drawing image:", error);
    }
  }, []);
  
  // Image sequence animation function
  const createImageSequence = useCallback((config: ImageSequenceConfig) => {
    const playhead = { frame: 0 };
    const canvas = config.canvas;
    const ctx = ctxRef.current;
    let curFrame = -1;
    const onUpdate = config.onUpdate;
    let loadedImages: HTMLImageElement[] = [];
    const totalImages = config.urls.length;
    
    if (!ctx) {
      console.error("Failed to get canvas context");
      return null;
    }
    
    // Initial loading indicator
    showLoadingProgress(0);
    
    // Draw image function
    const updateImage = () => {
      const frame = Math.round(playhead.frame);
      if (frame !== curFrame && frame >= 0 && frame < loadedImages.length) {
        if (config.clear) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        
        const img = loadedImages[frame];
        if (img && img.complete && img.naturalWidth > 0) {
          drawImage(img, ctx);
          curFrame = frame;
          if (onUpdate) onUpdate(frame, img);
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
            showLoadingProgress(progress);
            
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
      
      // Store the tween for cleanup
      tweenRef.current = tween;
      
      return tween;
    });
    
    // Return placeholder - the actual tween is created after images load
    return null;
  }, [showLoadingProgress, drawImage]);
    
  // Setup ScrollTrigger and image sequence
  const setupScrollTrigger = useCallback(() => {
    if (!sectionRef.current || !canvasRef.current) return;
    
    // Clear any existing ScrollTriggers
    ScrollTrigger.getAll().forEach(st => st.kill());
    
    // Check if mobile
    const isMobile = window.innerWidth < 768;
    
    // Create a ScrollTrigger for the canvas animation
    createImageSequence({
      urls: imageUrls,
      canvas: canvasRef.current,
      clear: true,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: isMobile ? "+=120%" : "+=80%",
        scrub: isMobile ? 1 : 0.5,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        fastScrollEnd: true,
        preventOverlaps: true
      }
    });
  }, [createImageSequence, imageUrls]);
  
  // Initialize everything
  useEffect(() => {
    if (!canvasRef.current || !sectionRef.current) return;
    
    // Initial size setup
    setCanvasSize();
    
    // Listen for window resize
    const handleResize = () => {
      setCanvasSize();
      // Refresh ScrollTrigger on resize
      ScrollTrigger.refresh();
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    // We'll use a timeout to ensure DOM is ready
    const initTimeout = setTimeout(setupScrollTrigger, 500);
    
    // Cleanup function
    return () => {
      clearTimeout(initTimeout);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      
      // Kill all ScrollTriggers
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      
      // Kill the tween if it exists
      if (tweenRef.current) {
        tweenRef.current.kill();
      }
      
      // Clear canvas to free memory
      if (ctxRef.current && canvasRef.current) {
        ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    };
  }, [setCanvasSize, setupScrollTrigger]);
  
  // Loading overlay component
  const LoadingOverlay = useMemo(() => {
    if (!isLoading) return null;
    
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground">{loadingProgress}%</p>
        </div>
      </div>
    );
  }, [isLoading, loadingProgress]);
  
  return (
    <section className="w-full overflow-hidden">
      <div ref={sectionRef} className="h-[180vh] md:h-[150vh] relative flex flex-col">
        <div className="sticky top-0 h-[100vh] flex flex-col items-center justify-center w-full">
          {/* Title */}
          <div className="text-center mb-2 md:mb-4 pt-4 md:pt-8">
            <h2 className="text-2xl md:text-4xl font-bold mb-2 text-foreground">
              My <span className="text-primary">Journey</span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              The path that has shaped my skills and expertise in the digital realm
            </p>
          </div>
          
          {/* Canvas container */}
          <div className="w-full h-[65vh] md:h-[80vh] flex items-center justify-center relative px-2 md:px-0">
            {LoadingOverlay}
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