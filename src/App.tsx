import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/layout/Header';
import Cursor from './components/ui/Cursor';
import LoadingScreen from './components/animations/LoadingScreen';
import BottomNav from './components/layout/BottomNav';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
// import Gallery from './pages/Gallery';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';
import './components/NoiseEffect.css';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

function App() {
  const [loading, setLoading] = useState(true);
  const mainRef = useRef<HTMLElement>(null);
  const sectionsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Add noise effect class to body
    document.body.classList.add('has-noise-effect');
    
    // Set a shorter loading time to improve user experience
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Reduced from 2000

    return () => {
      clearTimeout(timer);
      // Cleanup ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      // Clean up noise effect
      document.body.classList.remove('has-noise-effect');
    };
  }, []);

  useGSAP(() => {
    if (!loading) {
      try {
    // Set up section transitions
    sectionsRef.current.forEach((section, i) => {
          if (!section) return; // Skip if section ref is not assigned
          
          // Initial state - set items visible by default to avoid flashes
      gsap.set(section.children, {
            y: 0,
            opacity: 1
      });

      // Create scroll trigger for each section
      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          // Animate section content when entering viewport
          gsap.to(section.children, {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out'
          });
          
          // Update active nav item
          document.querySelector(`[data-section="${section.id}"]`)?.classList.add('text-primary');
        },
        onLeaveBack: () => {
              // Reset section content when scrolling back up, but keep visible
          gsap.to(section.children, {
            y: 50,
                opacity: 0.8,
            duration: 0.5
          });
          
          document.querySelector(`[data-section="${section.id}"]`)?.classList.remove('text-primary');
        },
        onEnterBack: () => {
          // Re-animate when scrolling back into view
          gsap.to(section.children, {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out'
          });
          
          document.querySelector(`[data-section="${section.id}"]`)?.classList.add('text-primary');
        },
        onLeave: () => {
          document.querySelector(`[data-section="${section.id}"]`)?.classList.remove('text-primary');
        }
      });
    });
      } catch (error) {
        console.error("Error setting up animations:", error);
      }
    }
  }, [loading]);

  const scrollToSection = (id: string) => {
    gsap.to(window, {
      duration: 1.5,
      scrollTo: `#${id}`,
      ease: 'power4.inOut'
    });
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <ThemeProvider>
        <div className="relative w-full overflow-hidden">
          <Cursor />
          <Header />
          <main ref={mainRef} className="relative w-full">
            <section 
              id="home" 
              ref={el => el && (sectionsRef.current[0] = el as HTMLDivElement)}
              className="min-h-screen relative z-10"
            >
              <Home />
            </section>
            <section 
              id="about"
              ref={el => el && (sectionsRef.current[1] = el as HTMLDivElement)}
              className="min-h-screen relative z-10"
            >
              <About />
            </section>
            <section 
              id="projects"
              ref={el => el && (sectionsRef.current[2] = el as HTMLDivElement)}
              className="min-h-screen relative z-10"
            >
              <Projects />
            </section>
            <section 
              id="contact"
              ref={el => el && (sectionsRef.current[3] = el as HTMLDivElement)}
              className="min-h-screen relative z-20"
            >
              <Contact />
            </section>
          </main>
          <Footer />
          <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent pointer-events-none z-0"></div>
          <BottomNav onSectionClick={scrollToSection} />
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;