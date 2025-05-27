import React, { useState } from 'react';
import SlideCanvas from '../animations/SlideCanvas';
import Particles from '../animations/Particles';
import TitlesContainer from '../ui/TitlesContainer';
import VideoPlayer from '../ui/VideoPlayer';
import '../../styles/components/global.css';
import '../../styles/components/canvas.css';
import '../../styles/components/particles.css';
import '../../styles/components/titles.css';

// Image titles data from SlideCanvas.tsx
const imageTitles = [
  {
    title: "COSMIC VOYAGE",
    offset: {
      x: 0,
      y: -25
    }
  },
  {
    title: "ASTRAL NEBULA",
    offset: {
      x: 0,
      y: 30
    }
  },
  {
    title: "STELLAR DRIFT",
    offset: {
      x: 0,
      y: 20
    }
  },
  {
    title: "ORBITAL PATH",
    offset: {
      x: 0,
      y: -20
    }
  },
  {
    title: "CELESTIAL FLOW",
    offset: {
      x: 0,
      y: -15
    }
  }
];

// Video URLs for slides - همان با SlideCanvas.tsx
const videoUrls = [
  "https://player.vimeo.com/external/459189087.hd.mp4?s=3ec1c88a0e98ca32ad5dfa9d38c25ef44fd4ed28&profile_id=174",
  "https://player.vimeo.com/external/517090076.hd.mp4?s=7cc154936f5fe8962bcb37f48ec545447f99d1c5&profile_id=174",
  "https://player.vimeo.com/external/368484050.hd.mp4?s=92fb2af86e39a853c8483ef6a2c26fae85e01b66&profile_id=174",
  "https://player.vimeo.com/external/370525863.hd.mp4?s=80e6f069e947f41e265e65e750014ac3151a5b8c&profile_id=174",
  "https://player.vimeo.com/external/317992108.hd.mp4?s=8ac39f2c30950699e8cc37e0f69d1ee77d188fdb&profile_id=174"
];

// Slider constants from SlideCanvas.tsx
const slideCount = 10;
const imagesCount = 5;

interface GallerySliderProps {
  className?: string;
  onVideoSelect?: (videoUrl: string) => void;
}

const GallerySlider: React.FC<GallerySliderProps> = ({ 
  className = '',
  onVideoSelect
}) => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // تابع برای باز کردن ویدیو پلیر
  const handleVideoSelect = (videoIndex: number) => {
    const videoUrl = videoUrls[videoIndex % videoUrls.length];
    
    if (onVideoSelect) {
      // اگر onVideoSelect از parent ارسال شده باشد، از آن استفاده می‌کنیم
      onVideoSelect(videoUrl);
    } else {
      // در غیر این صورت از حالت داخلی استفاده می‌کنیم
      setSelectedVideo(videoUrl);
      setIsVideoOpen(true);
    }
  };

  // تابع برای بستن ویدیو پلیر
  const handleCloseVideo = () => {
    setIsVideoOpen(false);
    setSelectedVideo(null);
  };

  return (
    <div className={`relative w-full overflow-hidden flex justify-center ${className}`}>
      {/* Slider container with responsive height */}
      <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px] flex justify-center">
        <SlideCanvas onSlideClick={handleVideoSelect} />
        <TitlesContainer
          imageTitles={imageTitles}
          slideCount={slideCount}
          imagesCount={imagesCount}
        />
        <Particles />
        
        {/* ویدیو پلیر - فقط اگر از parent کنترل نشود */}
        {!onVideoSelect && selectedVideo && (
          <VideoPlayer
            videoUrl={selectedVideo}
            isOpen={isVideoOpen}
            onClose={handleCloseVideo}
          />
        )}
      </div>
    </div>
  );
};

export default GallerySlider; 