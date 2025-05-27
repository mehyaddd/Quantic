import React, { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../../styles/components/optimized-gallery.css';

// تصاویر اسلایدها - همان تصاویر اصلی
const imageUrls = [
  "https://cdn.cosmos.so/2f49a117-05e7-4ae9-9e95-b9917f970adb?format=jpeg",
  "https://cdn.cosmos.so/7b5340f5-b4dc-4c08-8495-c507fa81480b?format=jpeg",
  "https://cdn.cosmos.so/f733585a-081e-48e7-a30e-e636446f2168?format=jpeg",
  "https://cdn.cosmos.so/47caf8a0-f456-41c5-98ea-6d0476315731?format=jpeg",
  "https://cdn.cosmos.so/f99f8445-6a19-4a9a-9de3-ac382acc1a3f?format=jpeg"
];

// عناوین اسلایدها - همان عناوین اصلی
const imageTitles = [
  "COSMIC VOYAGE",
  "ASTRAL NEBULA",
  "STELLAR DRIFT",
  "ORBITAL PATH",
  "CELESTIAL FLOW"
];

// آدرس ویدیوها - همان ویدیوهای اصلی
const videoUrls = [
  "https://player.vimeo.com/external/459189087.hd.mp4?s=3ec1c88a0e98ca32ad5dfa9d38c25ef44fd4ed28&profile_id=174",
  "https://player.vimeo.com/external/517090076.hd.mp4?s=7cc154936f5fe8962bcb37f48ec545447f99d1c5&profile_id=174",
  "https://player.vimeo.com/external/368484050.hd.mp4?s=92fb2af86e39a853c8483ef6a2c26fae85e01b66&profile_id=174",
  "https://player.vimeo.com/external/370525863.hd.mp4?s=80e6f069e947f41e265e65e750014ac3151a5b8c&profile_id=174",
  "https://player.vimeo.com/external/317992108.hd.mp4?s=8ac39f2c30950699e8cc37e0f69d1ee77d188fdb&profile_id=174"
];

interface OptimizedGallerySliderProps {
  className?: string;
  onVideoSelect?: (videoUrl: string) => void;
}

const OptimizedGallerySlider: React.FC<OptimizedGallerySliderProps> = ({ 
  className = '', 
  onVideoSelect 
}) => {
  const swiperRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // کلیک روی اسلاید
  const handleSlideClick = (index: number) => {
    if (onVideoSelect) {
      const videoIndex = index % videoUrls.length;
      onVideoSelect(videoUrls[videoIndex]);
    }
  };

  // بهینه‌سازی رندر با کاهش فریم‌ریت در حالت عدم تعامل
  useEffect(() => {
    let inactivityTimer: number;
    let isInteracting = false;

    const handleInteractionStart = () => {
      isInteracting = true;
      document.body.classList.add('interacting');
      
      clearTimeout(inactivityTimer);
    };

    const handleInteractionEnd = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = window.setTimeout(() => {
        isInteracting = false;
        document.body.classList.remove('interacting');
      }, 500);
    };

    document.addEventListener('touchstart', handleInteractionStart);
    document.addEventListener('mousedown', handleInteractionStart);
    document.addEventListener('touchend', handleInteractionEnd);
    document.addEventListener('mouseup', handleInteractionEnd);

    return () => {
      document.removeEventListener('touchstart', handleInteractionStart);
      document.removeEventListener('mousedown', handleInteractionStart);
      document.removeEventListener('touchend', handleInteractionEnd);
      document.removeEventListener('mouseup', handleInteractionEnd);
      clearTimeout(inactivityTimer);
    };
  }, []);

  return (
    <div className={`optimized-gallery-slider ${className}`}>
      <Swiper
        ref={swiperRef}
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        loop={true}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
          slideShadows: false,
        }}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Pagination, Navigation]}
        className="optimized-swiper"
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {/* تکرار اسلایدها برای ایجاد افکت بی‌نهایت */}
        {[...Array(10)].map((_, slideIndex) => {
          const imageIndex = slideIndex % imageUrls.length;
          return (
            <SwiperSlide key={slideIndex} className="optimized-swiper-slide">
              <div 
                className="slide-content" 
                onClick={() => handleSlideClick(slideIndex)}
              >
                <img src={imageUrls[imageIndex]} alt={imageTitles[imageIndex]} />
                <div className="slide-title">
                  <h3>{imageTitles[imageIndex]}</h3>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default OptimizedGallerySlider; 