import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ServicesSection from '../components/sections/ServicesSection';
import PortfolioSection from '../components/sections/PortfolioSection';
import styles from '../styles/components/home.module.css';

// کامپوننت‌های بهینه‌شده با React.memo
const HeroContent = memo(() => (
  <div className={styles.heroContent}>
    <div className={styles.contentBackdrop}>
      <h1 className={styles.heroTitle}>
        Quantic Studio
      </h1>
      
      <div className={styles.buttonContainer}>
        <Link to="/projects" className={styles.primaryButton}>
          View Projects
          <ArrowRight size={20} className={styles.primaryButtonIcon} />
        </Link>
      </div>
    </div>
  </div>
));

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
        {/* Grid Background with center-expanding lines */}
        <div className={styles.gridContainer}>
          <div className={styles.verticalLines}></div>
          <div className={styles.horizontalLines}></div>
        </div>
        
        <HeroContent />
        <ScrollIndicator />
      </section>
      
      {/* Services Section */}
      <ServicesSection id="services" />
      
      {/* Portfolio Section */}
      <PortfolioSection />
    </motion.main>
  );
};

export default memo(Home);