import React from 'react';
import GallerySlider from '../components/gallery/GallerySlider';
import ThreeLoader from '../components/ui/ThreeLoader';

const Gallery: React.FC = () => {
  return (
    <div className="gallery-page">
      <ThreeLoader>
        <GallerySlider />
      </ThreeLoader>
    </div>
  );
};

export default Gallery; 