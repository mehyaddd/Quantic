import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import '../Projects.css';

interface Project {
  id: number;
  title: string;
  year: string;
  image: string;
}

const Projects: React.FC = () => {
  const projectsContainerRef = useRef<HTMLDivElement>(null);
  const backgroundImageRef = useRef<HTMLImageElement>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  
  const projects: Project[] = [
    {
      id: 1,
      title: "Web Design",
      year: "2024",
      image: "https://cdn.cosmos.so/7d47d4e2-0eff-4e2f-9734-9d24a8ba067e?format=jpeg"
    },
    {
      id: 2,
      title: "App Design",
      year: "2024",
      image: "https://cdn.cosmos.so/5eee2d2d-3d4d-4ae5-96d4-cdbae70a2387?format=jpeg"
    },
    {
      id: 3,
      title: "Branding",
      year: "2024",
      image: "https://cdn.cosmos.so/def30e8a-34b2-48b1-86e1-07ec5c28f225?format=jpeg"
    },
    {
      id: 4,
      title: "Social Media",
      year: "2024",
      image: "https://cdn.cosmos.so/44d7cb23-6759-49e4-9dc1-acf771b3a0d1?format=jpeg"
    }
  ];

  useEffect(() => {
    projects.forEach(project => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = project.image;
    });
  }, []);

  const handleProjectHover = (project: Project) => {
    if (backgroundImageRef.current) {
      backgroundImageRef.current.style.transition = "none";
      backgroundImageRef.current.style.transform = "scale(1.2)";

      backgroundImageRef.current.src = project.image;
      backgroundImageRef.current.style.opacity = "1";

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (backgroundImageRef.current) {
            backgroundImageRef.current.style.transition = "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
            backgroundImageRef.current.style.transform = "scale(1.0)";
          }
        });
      });

      setCurrentImage(project.image);
    }
  };

  const handleMouseLeave = () => {
    if (backgroundImageRef.current) {
      backgroundImageRef.current.style.opacity = "0";
    }
    setCurrentImage(null);
  };

  return (
    <section className="projects-section py-16 md:py-24">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          All <span className="text-primary">Projects</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A collection of my creative endeavors and technical achievements
        </p>
      </div>
      
      <div id="background-image-container">
        <img 
          ref={backgroundImageRef}
          id="background-image" 
          crossOrigin="anonymous" 
          alt="" 
        />
      </div>

      <div className="container">
        <div 
          className="projects-container"
          ref={projectsContainerRef}
          onMouseLeave={handleMouseLeave}
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="project-item"
              data-id={project.id}
              data-image={project.image}
              onMouseEnter={() => handleProjectHover(project)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.06,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              <div className="project-title">{project.title}</div>
              <div className="project-year">{project.year}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects; 