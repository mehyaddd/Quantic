import React, { memo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PortfolioSection from '../components/sections/PortfolioSection';
import Projects from '../components/sections/Projects';
import HeroSection from '../components/sections/HeroSection';
import styles from '../styles/components/home.module.css';

gsap.registerPlugin(ScrollTrigger);

// Memoized components
const HeroContent = memo(() => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: titleRef.current,
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
      },
    });

    tl.to(titleRef.current, {
      opacity: 0,
      y: -50,
      duration: 1,
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className={styles.heroContent}>
      <div className={styles.contentBackdrop}>
        <h1 ref={titleRef} className={styles.heroTitle}>
          Quantic Studio
        </h1>
        
        <div className={styles.buttonContainer}>
          <Link 
            ref={buttonRef}
            to="/projects" 
            className={styles.primaryButton}
          >
            View Projects
            <ArrowRight size={20} className={styles.primaryButtonIcon} />
          </Link>
        </div>
      </div>
    </div>
  );
});

const ScrollIndicator = memo(() => (
  <div className={styles.scrollIndicator}>
    <div className={styles.scrollArrow}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 15L12 20L17 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  </div>
));

const Home: React.FC = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <HeroContent />
        <ScrollIndicator />
      </section>
      
      {/* Portfolio Section */}
      <PortfolioSection />

      {/* Projects Section */}
      <Projects />

      {/* Hero Section with Image Sequence */}
      <HeroSection />
    </motion.main>
  );
};

export default memo(Home);