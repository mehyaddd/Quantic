import React, { useRef, useEffect, useState } from 'react';
import { Code, Palette, Layers } from 'lucide-react';
import { gsap, gsapManager } from '../../utils/gsapManager';
import styles from '../../styles/components/services.module.css';

// Helper function to check if device is mobile
const isMobile = () => {
  return window.innerWidth <= 768;
};

interface ServiceProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
  isMobileDevice: boolean;
}

const ServiceItem: React.FC<ServiceProps> = ({ icon, title, description, index, isMobileDevice }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  
  // Only add mouse move listener on desktop
  useEffect(() => {
    if (!itemRef.current || isMobileDevice) return;
    
    const item = itemRef.current;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = item.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      item.style.setProperty('--mouse-x', `${x}%`);
      item.style.setProperty('--mouse-y', `${y}%`);
    };
    
    item.addEventListener('mousemove', handleMouseMove);
    return () => item.removeEventListener('mousemove', handleMouseMove);
  }, [isMobileDevice]);
  
  return (
    <div
      ref={itemRef}
      className={`${styles.serviceItem} ${isMobileDevice ? styles.mobile : ''}`}
      style={{ opacity: 1, transform: 'none' }} // Ensure items are visible even without animation
    >
      <div className={styles.serviceContent}>
        <div className={styles.serviceIcon}>
          {icon}
        </div>
        <div className={styles.serviceText}>
          <h3 className={styles.serviceTitle} style={{ color: '#ffffff' }}>
            {title}
          </h3>
          <p className={styles.serviceDescription}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

interface ServicesSectionProps {
  id?: string;
  style?: React.CSSProperties;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ id, style }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // Start as visible
  
  // Apply title styles immediately after render
  useEffect(() => {
    if (titleRef.current) {
      // Apply styles directly to the DOM element to ensure visibility
      titleRef.current.style.opacity = '1';
      titleRef.current.style.color = '#ffffff';
      titleRef.current.style.visibility = 'visible';
    }
  }, []); // Empty dependency array to run only once
  
  // Check if device is mobile
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

  // Setup animations
  useEffect(() => {
    if (!sectionRef.current || !titleRef.current || !gridRef.current) return;
    
    // Clean up previous animations
    gsapManager.killByNamespace('services');
    
    // Make sure section is visible
    setIsVisible(true);
    
    // Ensure title is visible regardless of animations
    if (titleRef.current) {
      titleRef.current.style.opacity = '1';
      titleRef.current.style.color = '#ffffff';
      titleRef.current.style.visibility = 'visible';
    }
    
    // Skip animation setup on mobile
    if (isMobileDevice) return;
    
    try {
      // Simple animation for the title - disabled for now to ensure visibility
      /*
      gsap.fromTo(titleRef.current, 
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          ease: 'power2.out',
      scrollTrigger: {
            trigger: titleRef.current,
        start: 'top 85%',
        end: 'bottom 30%',
        toggleActions: 'play none none reverse'
      }
        }
      );
      */

      // Animate service items
    const cards = gsap.utils.toArray<HTMLElement>(gridRef.current.querySelectorAll(`.${styles.serviceItem}`));
    
    gsap.set(cards, { 
        opacity: 1, // Start visible
        y: 0       // Start at final position
    });
    
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: "power2.out",
      scrollTrigger: {
        trigger: gridRef.current,
        start: "top 80%",
        end: "top 30%",
        toggleActions: "play none none reverse"
      }
    });
    } catch (error) {
      console.error("Error setting up animations:", error);
    }

    return () => {
      gsapManager.killByNamespace('services');
    };
  }, [isMobileDevice]);

  const services = [
    {
      icon: <Code size={40} />,
      title: 'Web Development',
      description: 'Crafting visually stunning and high-performance websites to elevate your digital presence',
    },
    {
      icon: <Palette size={40} />,
      title: 'Branding',
      description: 'Creating distinctive and strategic brand identities for lasting impact on your audience',
    },
    {
      icon: <Layers size={40} />,
      title: 'Social media',
      description: 'Targeted social media strategies to boost engagement and amplify your brand\'s influence',
    },
  ];

  return (
    <section 
      id={id || "services"} 
      className={`${styles.servicesSection} ${isVisible ? styles.visible : ''}`}
      ref={sectionRef}
      style={style}
    >
      {/* Grid Background */}
      <div className={styles.gridContainer}>
        <div className={styles.verticalLines}></div>
        <div className={styles.horizontalLines}></div>
      </div>

      <div className={styles.servicesContainer}>
        <div className={styles.servicesHeader}>
          <h2 
            className={styles.servicesTitle} 
            ref={titleRef}
            style={{ 
              color: '#ffffff',
              opacity: 1,
              visibility: 'visible',
              display: 'block',
              textShadow: '0 0 1px rgba(255,255,255,0.5)'
            }} // Ensure title is visible with multiple properties
          >
            My Services
          </h2>
        </div>
        <div className={styles.servicesList} ref={gridRef}>
          {services.map((service, index) => (
            <ServiceItem
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              index={index}
              isMobileDevice={isMobileDevice}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;