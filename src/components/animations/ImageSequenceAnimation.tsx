import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../../styles/components/image-sequence.css';

gsap.registerPlugin(ScrollTrigger);

interface ImageSequenceProps {
  className?: string;
  folderPath?: string;
  totalFrames?: number;
  width?: number;
  height?: number;
  initialFrame?: number;
  loadingText?: string;
}

const ImageSequenceAnimation: React.FC<ImageSequenceProps> = ({
  className = '',
  folderPath = 'https://www.apple.com/105/media/us/airpods-pro/2019/1299e2f5_9206_4470_b28e_08307a42f19b/anim/sequence/large/01-hero-lightpass',
  totalFrames = 147,
  width = 1158,
  height = 770,
  initialFrame = 0,
  loadingText = 'Loading...'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const playheadRef = useRef({ frame: initialFrame }); // Store playhead in a ref

  useEffect(() => {
    return () => {
      if (imagesRef.current) {
        imagesRef.current.forEach(img => {
          img.onload = null;
          img.onerror = null;
          img.src = '';
        });
        imagesRef.current = [];
      }
      if (animationRef.current) {
        animationRef.current.kill();
        animationRef.current = null;
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const preloadImages = useCallback(async () => {
    if (!canvasRef.current) return [];
    const urls = new Array(totalFrames).fill(null).map((_, i) => 
      `${folderPath}/${(i+1).toString().padStart(4, '0')}.jpg`
    );
    const loadedImages: HTMLImageElement[] = new Array(totalFrames);
    let loadedCount = 0;

    const drawInitialFrame = (img: HTMLImageElement) => {
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        canvasRef.current.width = width; // Ensure canvas dimensions are set
        canvasRef.current.height = height;
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
      }
    };

    const loadPromises = urls.map((url, i) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          loadedImages[i] = img;
          loadedCount++;
          setLoadingProgress(Math.floor((loadedCount / totalFrames) * 100));
          if (i === initialFrame && isLoading) { // Draw initial frame once loaded if still in loading state
            drawInitialFrame(img);
          }
          resolve();
        };
        img.onerror = () => {
          console.error(`Failed to load image: ${url}`);
          // Resolve even on error to not block everything, image will be undefined in array
          resolve(); 
        };
        img.crossOrigin = 'anonymous';
        img.src = url;
      });
    });

    await Promise.all(loadPromises);
    imagesRef.current = loadedImages.filter(img => img); // Filter out any undefined due to loading errors
    setIsLoading(false);
    return imagesRef.current;

  }, [folderPath, totalFrames, initialFrame, width, height, isLoading]); // Added isLoading to dependencies

  const setupScrollAnimation = useCallback((images: HTMLImageElement[]) => {
    if (!canvasRef.current || !sectionRef.current || images.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    playheadRef.current.frame = initialFrame; // Reset playhead to initialFrame
    let currentDrawnFrame = -1;

    const updateImage = () => {
      const frame = Math.round(playheadRef.current.frame);
      if (frame !== currentDrawnFrame && images[frame]) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(images[frame], 0, 0, canvas.width, canvas.height);
        currentDrawnFrame = frame;
      }
    };
    
    // Draw the initial frame immediately
    if (images[initialFrame]) {
        canvas.width = width;
        canvas.height = height;
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(images[initialFrame], 0, 0, width, height);
        currentDrawnFrame = initialFrame;
    }

    animationRef.current = gsap.to(playheadRef.current, {
      frame: images.length - 1,
      ease: "none",
      onUpdate: updateImage,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom", 
        scrub: 0.3,
        pin: true,
        pinSpacing: true, 
        anticipatePin: 1,
        invalidateOnRefresh: true,
        fastScrollEnd: true,
        markers: false,
        onEnter: () => {
          playheadRef.current.frame = initialFrame;
          updateImage();
        },
        onEnterBack: () => {
          playheadRef.current.frame = images.length - 1;
          updateImage();
        },
        onLeave: () => {
            // Optionally set to last frame when scrolling past down
            playheadRef.current.frame = images.length - 1;
            updateImage();
        },
        onLeaveBack: () => {
            // Optionally set to first frame when scrolling past up
            playheadRef.current.frame = initialFrame;
            updateImage();
        }
      }
    });
  }, [initialFrame, width, height]); // Removed images from dependency array as it's passed directly

  useEffect(() => {
    if (!isLoading && imagesRef.current.length > 0) {
      setupScrollAnimation(imagesRef.current);
    }
  }, [isLoading, setupScrollAnimation]);
  
  // Initial call to preload images
  useEffect(() => {
    preloadImages();
  }, [preloadImages]);

  return (
    <div ref={sectionRef} className={`image-sequence-container ${className}`}>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-text">{loadingText}</div>
            <div className="loading-bar">
              <div 
                className="loading-progress" 
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <div className="loading-percentage">{loadingProgress}%</div>
          </div>
        </div>
      )}
      <canvas 
        ref={canvasRef} 
        // width and height are set in drawInitialFrame and setupScrollAnimation
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
          display: isLoading ? 'none' : 'block' // Hide canvas while loading
        }}
      />
    </div>
  );
};

export default ImageSequenceAnimation; 