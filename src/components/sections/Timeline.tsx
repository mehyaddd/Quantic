import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const Timeline: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadedImages, setLoadedImages] = useState<HTMLImageElement[]>([]);
  const animationFrameRef = useRef<number>();
  
  useEffect(() => {
    if (!canvasRef.current || !sectionRef.current) return;
    
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    
    // Keep track of all instances for cleanup
    const triggers: ScrollTrigger[] = [];
    
    // Set canvas size with fixed dimensions and proper scaling
    const setCanvasSize = () => {
      const canvasWidth = 1920;
      const canvasHeight = 3200;
      
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      
      const scale = Math.min(
        window.innerWidth * 0.9 / canvasWidth,
        window.innerHeight * 0.85 / canvasHeight
      );
      
      canvas.style.width = `${canvasWidth * scale}px`;
      canvas.style.height = `${canvasHeight * scale}px`;
    };
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // Prepare image sequence - adjusted to handle missing frames
    const frameCount = 254; // Total frames excluding problematic ones
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.error("Could not get canvas context");
      setIsLoading(false);
      return;
    }
    
    // Load all images
    const loadImages = async () => {
      let loadedCount = 0;
      const images: HTMLImageElement[] = [];
      
      const updateLoadingProgress = () => {
        loadedCount++;
        const progress = Math.round((loadedCount / frameCount) * 100);
        setLoadingProgress(progress);
        
        // Show loading text on canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "bold 24px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`Loading: ${progress}%`, canvas.width / 2, canvas.height / 2);
        
        if (loadedCount === frameCount) {
          setLoadedImages(images);
          setTimeout(() => {
            setIsLoading(false);
            drawImage(0); // Draw first frame when loaded
          }, 300);
        }
      };
      
      // Load images sequentially to prevent overwhelming the browser
      for (let i = 0; i < frameCount; i++) {
        const frameNumber = i >= 4 ? i + 1 : i + 1; // Skip frame 5 by adjusting the index
        const img = new Image();
        img.crossOrigin = "anonymous";
        
        // Create a promise for each image load
        await new Promise<void>((resolve) => {
          const tryLoad = (extension: string) => {
            img.src = `/images/paper/${frameNumber}.${extension}`;
            
            img.onload = () => {
              images[i] = img;
              updateLoadingProgress();
              resolve();
            };
            
            img.onerror = () => {
              if (extension === 'webp') {
                // Try PNG if WebP fails
                tryLoad('png');
              } else {
                console.error(`Failed to load image: ${frameNumber}.${extension}`);
                // Create a placeholder for failed images
                const canvas = document.createElement('canvas');
                canvas.width = 1920;
                canvas.height = 3200;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  ctx.fillStyle = '#000000';
                  ctx.fillRect(0, 0, canvas.width, canvas.height);
                  ctx.fillStyle = '#ffffff';
                  ctx.font = '24px Arial';
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  ctx.fillText(`Frame ${frameNumber}`, canvas.width / 2, canvas.height / 2);
                }
                img.src = canvas.toDataURL();
                images[i] = img;
                updateLoadingProgress();
                resolve();
              }
            };
          };
          
          // Start with WebP
          tryLoad('webp');
        });
      }
    };
    
    // Function to draw a specific frame
    const drawImage = (index: number) => {
      if (!loadedImages[index]) return;
      
      const img = loadedImages[index];
      if (!ctx || !img.complete || img.naturalWidth === 0) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      try {
        // Calculate image dimensions for proper scaling
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const canvasRatio = canvas.width / canvas.height;
        
        let drawWidth, drawHeight, offsetX, offsetY;
        
        if (imgRatio > canvasRatio) {
          drawHeight = canvas.height;
          drawWidth = drawHeight * imgRatio;
          offsetX = (canvas.width - drawWidth) / 2;
          offsetY = 0;
        } else {
          drawWidth = canvas.width;
          drawHeight = drawWidth / imgRatio;
          offsetX = 0;
          offsetY = (canvas.height - drawHeight) / 2;
        }
        
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      } catch (error) {
        console.error("Error drawing image:", error);
      }
    };
    
    // Start loading images
    loadImages();
    
    // Create scroll animations once all images are loaded
    const setupScrollAnimation = () => {
      // Create a timeline for the image sequence
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top", 
          end: "+=300%",
          pin: true,
          anticipatePin: 1,
          scrub: 1,
          onUpdate: (self) => {
            // Calculate current frame based on scroll progress
            const frameIndex = Math.min(
              Math.max(
                Math.floor(self.progress * (frameCount - 1)),
                0
              ),
              frameCount - 1
            );
            
            if (animationFrameRef.current) {
              cancelAnimationFrame(animationFrameRef.current);
            }
            animationFrameRef.current = requestAnimationFrame(() => drawImage(frameIndex));
          },
          onLeave: () => drawImage(frameCount - 1),
          onLeaveBack: () => drawImage(0)
        }
      });
      
      triggers.push(tl.scrollTrigger!);
    };
    
    // Set up scroll animation after images are loaded
    const initTimeout = setTimeout(() => {
      if (!isLoading && loadedImages.length === frameCount) {
        setupScrollAnimation();
      } else {
        const checkInterval = setInterval(() => {
          if (!isLoading && loadedImages.length === frameCount) {
            clearInterval(checkInterval);
            setupScrollAnimation();
          }
        }, 500);
        
        setTimeout(() => clearInterval(checkInterval), 30000);
      }
    }, 500);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      clearTimeout(initTimeout);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      triggers.forEach(trigger => trigger.kill());
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [loadedImages]);
  
  return (
    <section className="w-full bg-secondary/5">
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center flex-col">
          <div className="text-primary text-2xl font-bold mb-4">Loading Timeline</div>
          <div className="w-64 h-2 bg-secondary/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300" 
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <div className="text-sm text-muted-foreground mt-2">{loadingProgress}%</div>
        </div>
      )}
      
      {/* Main content section that gets pinned during scroll */}
      <div 
        ref={sectionRef}
        className="w-full py-16 md:py-24 flex flex-col items-center justify-center"
      >
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
            My <span className="text-primary">Journey</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The path that has shaped my skills and expertise in the digital realm
          </p>
        </div>
        
        {/* Canvas container */}
        <div className="w-full h-[80vh] flex items-center justify-center mt-2">
          <canvas 
            ref={canvasRef} 
            id="image-sequence"
            className="shadow-xl rounded-lg transition-opacity duration-300"
            style={{ opacity: isLoading ? 0.3 : 1 }}
            aria-label="Journey timeline animation"
          />
        </div>
      </div>
    </section>
  );
};

export default Timeline;