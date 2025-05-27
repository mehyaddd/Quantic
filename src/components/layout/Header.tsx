import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import gsap from 'gsap';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 glass ${
        scrolled 
          ? 'py-4 shadow-md'
          : 'py-6'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <NavLink 
          to="/" 
          className="text-2xl font-bold relative z-50"
        >
          <span className="text-primary">P</span>ortfolio
        </NavLink>
      </div>
    </header>
  );
};

export default Header;