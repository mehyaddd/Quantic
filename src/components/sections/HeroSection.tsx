import React from 'react';
import ImageSequence from '../animations/ImageSequence';

const HeroSection: React.FC = () => {
  // Generate image URLs array similar to the original code
  const frameCount = 147;
  const urls = new Array(frameCount).fill('').map((_, i) => 
    `https://www.apple.com/105/media/us/airpods-pro/2019/1299e2f5_9206_4470_b28e_08307a42f19b/anim/sequence/large/01-hero-lightpass/${(i + 1).toString().padStart(4, '0')}.jpg`
  );

  return (
    <section className="h-[300vh] bg-black">
      <ImageSequence
        urls={urls}
        width={1158}
        height={770}
      />
    </section>
  );
};

export default HeroSection;