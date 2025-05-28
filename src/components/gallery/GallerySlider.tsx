import React from 'react';
import SlideCanvas from '../animations/SlideCanvas';
import Particles from '../animations/Particles';
import TitlesContainer from '../ui/TitlesContainer';
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

// Slider constants from SlideCanvas.tsx
const slideCount = 10;
const imagesCount = 5;

interface GallerySliderProps {
  className?: string;
}

const GallerySlider: React.FC<GallerySliderProps> = ({ className = '' }) => {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Slider container with responsive height */}
      <div className="relative w-full h-[500px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px]">
        <SlideCanvas />
        <TitlesContainer
          imageTitles={imageTitles}
          slideCount={slideCount}
          imagesCount={imagesCount}
        />
        <Particles />
      </div>
    </div>
  );
};

export default GallerySlider; 