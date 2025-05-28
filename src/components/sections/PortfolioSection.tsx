import React, { useRef, useEffect, useState } from 'react';
import SplitType from 'split-type';
import GallerySlider from '../gallery/GallerySlider';
import OptimizedGallerySlider from '../gallery/OptimizedGallerySlider';
import VideoPlayer from '../ui/VideoPlayer';
import { gsap, gsapManager } from '@/lib/utils';
import { isLowEndDeviceQuickCheck } from '@/lib/utils';
import styles from '@/styles/components/portfolio.module.css';

// Helper function to check if device is mobile
const isMobile = () => {
  return window.innerWidth <= 768;
};

// Portfolio Section component
const PortfolioSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isSliderActive, setIsSliderActive] = useState(false);
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  
  // تشخیص عملکرد دستگاه در زمان لود
  useEffect(() => {
    const checkPerformance = () => {
      const isLowEnd = isLowEndDeviceQuickCheck();
      setIsLowEndDevice(isLowEnd);
      
      if (isLowEnd) {
        console.log('Low-end device detected, using optimized gallery slider');
      }
    };
    
    checkPerformance();
  }, []);
  
  // Check if device is mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileDevice(isMobile());
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // ردیابی فعالیت اسلایدر
  useEffect(() => {
    if (!isMobileDevice || !sliderRef.current) return;

    // تایمر برای بررسی عدم فعالیت
    let inactivityTimer: number;
    
    // تابع برای شروع ردیابی فعالیت
    const startTracking = () => {
      setIsSliderActive(true);
      
      // پاک کردن تایمر قبلی
      clearTimeout(inactivityTimer);
      
      // تنظیم تایمر جدید
      inactivityTimer = window.setTimeout(() => {
        setIsSliderActive(false);
      }, 1500); // 1.5 ثانیه بعد از آخرین حرکت
    };
    
    // اضافه کردن گوش دهنده‌ها برای حرکت
    const sliderElement = sliderRef.current;
    
    sliderElement.addEventListener('touchstart', startTracking);
    sliderElement.addEventListener('touchmove', startTracking);
    sliderElement.addEventListener('mousedown', startTracking);
    sliderElement.addEventListener('mousemove', startTracking);
    
    // پاکسازی
    return () => {
      clearTimeout(inactivityTimer);
      sliderElement.removeEventListener('touchstart', startTracking);
      sliderElement.removeEventListener('touchmove', startTracking);
      sliderElement.removeEventListener('mousedown', startTracking);
      sliderElement.removeEventListener('mousemove', startTracking);
    };
  }, [isMobileDevice]);

  // تابع باز کردن ویدیو پلیر
  const handleVideoSelect = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
    setIsVideoOpen(true);
  };

  // تابع بستن ویدیو پلیر
  const handleCloseVideo = () => {
    setIsVideoOpen(false);
    setSelectedVideo(null);
  };

  // Main animation setup effect
  useEffect(() => {
    if (!sectionRef.current || !titleRef.current) return;
    
    // Kill any existing animations with the portfolio namespace to prevent conflicts
    gsapManager.killByNamespace('portfolio');
    
    // Apply direct styles to ensure the title is visible regardless of animation state
    if (titleRef.current) {
      titleRef.current.style.opacity = '1';
      titleRef.current.style.color = '#ffffff';
    }
    
    // Set visibility to ensure content is visible
    setIsVisible(true);
    
    // Split the title text for character-by-character animation, but only on desktop
    let splitTitle: SplitType | null = null;
    
    if (!isMobileDevice && !isLowEndDevice) {
      try {
        splitTitle = new SplitType(titleRef.current, { types: ["chars", "words"] });
    
        // Set initial states for title characters
        if (splitTitle.chars) {
          gsap.set(splitTitle.chars, { 
            opacity: 1,
            y: 0,
            rotateX: 0,
            transformOrigin: "50% 50% -50"
          });
        }
    
        // Create scroll-synchronized animation for title
        if (splitTitle.chars) {
          gsapManager.createAnimation('portfolio-title-chars', splitTitle.chars, {
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%", 
              end: "top 30%",
              scrub: 0.5,
              toggleActions: "play none none reverse",
            },
            opacity: 1,
            y: 0,
            rotateX: 0,
            stagger: 0.02,
            ease: "power2.out",
          });
        }
      } catch (error) {
        console.error("Error setting up animations:", error);
      }
    }
    
    // Set visibility based on scroll position but ensure it's visible on initial load
    gsapManager.createScrollTrigger('portfolio-visibility', {
      trigger: sectionRef.current,
      start: "top 80%",
      end: "bottom 20%",
      onEnter: () => setIsVisible(true),
      onLeave: () => setIsVisible(false),
      onEnterBack: () => setIsVisible(true),
      onLeaveBack: () => setIsVisible(false),
      toggleClass: { targets: sectionRef.current, className: styles.visible },
      markers: false,
      toggleActions: "play none none none",
    });
    
    // Cleanup function
    return () => {
      if (splitTitle) {
        try {
          splitTitle.revert();
        } catch (error) {
          console.error("Error reverting split text:", error);
        }
      }
      gsapManager.killByNamespace('portfolio');
    };
  }, [isMobileDevice, isLowEndDevice]);
  
  return (
    <section 
      ref={sectionRef} 
      className={`${styles.portfolioSection} ${isVisible ? styles.visible : ''}`}
      id="portfolio"
    >
      {/* Grid Background */}
      <div className={styles.gridContainer}>
        <div className={styles.verticalLines}></div>
        <div className={styles.horizontalLines}></div>
      </div>
      
      {/* Title Container */}
      <div className={styles.portfolioContainer}>
        <div className={styles.portfolioHeader}>
          <h2 
            ref={titleRef} 
            className={styles.portfolioTitle}
            style={{ 
              color: '#ffffff',
              opacity: 1,
              visibility: 'visible',
              display: 'block',
              textShadow: '0 0 1px rgba(255,255,255,0.5)'
            }}
          >
            Reel Works
          </h2>
          <p className={styles.portfolioSubtitle}>Click on any reel to play video</p>
        </div>
      </div>
      
      {/* Full-width Gallery Slider - Conditional Rendering */}
      <div 
        ref={sliderRef}
        className={`${styles.sliderFullWidth} ${isSliderActive ? styles.sliderActive : ''}`}
      >
        {isLowEndDevice ? (
          <OptimizedGallerySlider 
            className={styles.gallerySlider} 
            onVideoSelect={handleVideoSelect}
          />
        ) : (
          <GallerySlider 
            className={styles.gallerySlider} 
          />
        )}
      </div>

      {/* Video Player */}
      {selectedVideo && (
        <VideoPlayer
          videoUrl={selectedVideo}
          isOpen={isVideoOpen}
          onClose={handleCloseVideo}
        />
      )}
    </section>
  );
};

export default PortfolioSection;