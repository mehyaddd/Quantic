import React, { useEffect } from 'react';
import './particles.css';

const ElementParticles: React.FC = () => {
  useEffect(() => {
    const particlesContainer = document.getElementById("particles");
    if (!particlesContainer) return;
    
    const particleCount = 80;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      
      const size = Math.random() * 5 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      particle.style.left = `${x}%`;
      particle.style.top = `${y}%`;
      
      particle.style.opacity = String(Math.random() * 0.5 + 0.1);
      particlesContainer.appendChild(particle);
    }
    
    // Clean up function
    return () => {
      if (particlesContainer) {
        particlesContainer.innerHTML = '';
      }
    };
  }, []);

  return <div className="particles" id="particles"></div>;
};

export default ElementParticles;