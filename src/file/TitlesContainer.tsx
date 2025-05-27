import React, { useEffect, useRef } from 'react';
import './titles.css';

interface TitleData {
  title: string;
  offset: {
    x: number;
    y: number;
  };
}

interface ElementTitlesProps {
  imageTitles: TitleData[];
  slideCount: number;
  imagesCount: number;
}

const ElementTitles: React.FC<ElementTitlesProps> = ({ imageTitles, slideCount, imagesCount }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const titlesContainer = containerRef.current;
    titlesContainer.innerHTML = '';
    
    const titleElements = [];
    
    for (let i = 0; i < slideCount; i++) {
      const imageIndex = i % imagesCount;
      const titleInfo = imageTitles[imageIndex];
      
      const titleEl = document.createElement("div");
      titleEl.className = "slide-title";
      
      const titleText = document.createElement("h2");
      titleText.className = "title-text";
      titleText.textContent = titleInfo.title;
      
      const titleNumber = document.createElement("p");
      titleNumber.className = "title-number";
      titleNumber.textContent = `0${i + 1}`;
      
      titleEl.appendChild(titleText);
      titleEl.appendChild(titleNumber);
      titleEl.style.opacity = "0";
      titleEl.style.filter = "blur(0px)";
      
      titlesContainer.appendChild(titleEl);
      
      titleElements.push({
        element: titleEl,
        offset: titleInfo.offset,
        index: i
      });
    }
    
    // Expose the titleElements to the global scope for the canvas component to access
    (window as any).titleElements = titleElements;
    
    // Clean up function
    return () => {
      (window as any).titleElements = null;
      titlesContainer.innerHTML = '';
    };
  }, [imageTitles, slideCount, imagesCount]);

  return <div className="titles-container" id="titles-container" ref={containerRef}></div>;
};

export default ElementTitles;