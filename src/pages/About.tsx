import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import GlitchImage from '../components/animations/GlitchImage';
import Projects from '../components/sections/Projects';
import Stats from '../components/sections/Stats';
import Timeline from '../components/sections/Timeline';
import '../styles/typing-animation.css';

// A component that starts typing when it's visible in the viewport
const VisibilityTypedText: React.FC<{ text: string; delay?: number; speed?: number }> = ({ 
  text, 
  delay = 0,
  speed = 30
}) => {
  const [displayedText, setDisplayedText] = React.useState('');
  const [isVisible, setIsVisible] = React.useState(false);
  const [hasStartedTyping, setHasStartedTyping] = React.useState(false);
  const [isTypingComplete, setIsTypingComplete] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  // Setup intersection observer to detect when element is visible
  React.useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 } // Trigger when at least 10% of the element is visible
    );
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);
  
  // Start typing when element becomes visible
  React.useEffect(() => {
    if (!isVisible || hasStartedTyping) return;
    
    const startTypingTimeout = setTimeout(() => {
      setHasStartedTyping(true);
      
      // Clear the text initially
      setDisplayedText('');
      
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(interval);
          setIsTypingComplete(true); // Mark typing as complete
        }
      }, speed);
      
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(startTypingTimeout);
  }, [isVisible, hasStartedTyping, text, delay, speed]);

  // Final fallback - always show complete text after 10 seconds
  React.useEffect(() => {
    const finalFallback = setTimeout(() => {
      setDisplayedText(text);
      setIsTypingComplete(true);
    }, 10000);
    
    return () => clearTimeout(finalFallback);
  }, [text]);
  
  return (
    <div ref={containerRef} className="typing-container">
      <div style={{
        position: 'absolute',
        visibility: 'hidden',
        whiteSpace: 'pre-wrap',
        width: '100%'
      }}>
        {text}
      </div>
      <div className="typing-text-wrapper">
      <span>{displayedText}</span>
        {displayedText.length < text.length && hasStartedTyping && !isTypingComplete && (
        <span className="typing-cursor">|</span>
      )}
      </div>
    </div>
  );
};

const About: React.FC = () => {
  // Removed the timelineRef and useEffect for timeline animation
  
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-0 md:pt-28"
    >
      {/* About Intro Section */}
      <section className="pt-0 pb-16 md:pb-32 md:py-20">
        <div className="container mx-auto px-4 md:px-8">
          {/* Mobile-only title that appears above the image */}
          <div className="block lg:hidden text-center mb-20 mt-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              About <span className="text-primary">Me</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The path that has shaped my skills and expertise in the digital realm
            </p>
         </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Image Section */}
            <div className="relative order-1 lg:order-2">
              <div className="aspect-square rounded-2xl overflow-hidden">
                <GlitchImage 
                  src="/images/abuot.png" 
                  alt="Professional portrait" 
                  className="w-full h-full object-cover"
                />
               </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 md:w-40 md:h-40 bg-primary rounded-2xl -z-10"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 md:w-40 md:h-40 bg-accent rounded-2xl -z-10"></div>
             </div>
             
            {/* Text Section */}
            <div className="order-2 lg:order-1">
              {/* Desktop-only title that appears to the left of the image */}
              <div className="hidden lg:block mb-6">
                <h2 className="text-3xl md:text-4xl font-bold mb-2">
                  About <span className="text-primary">Me</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl">
                  The path that has shaped my skills and expertise in the digital realm
                </p>
               </div>
               
              <div className="text-lg text-muted-foreground mb-6">
                <VisibilityTypedText 
                  text="I'm a passionate web developer and designer with a focus on creating exceptional digital experiences that combine aesthetic appeal with functional excellence."
                  delay={300}
                  speed={5}
                />
               </div>
               
              <div className="text-muted-foreground mb-8">
                <VisibilityTypedText 
                  text="With over 5 years of experience in the industry, I've worked with various clients from startups to established companies, helping them achieve their goals through thoughtful design and clean, efficient code. I'm particularly interested in interactive web experiences, performance optimization, and creating intuitive user interfaces."
                  delay={1500}
                  speed={3}
                />
               </div>
              
              <Link 
                to="/contact" 
                className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white px-6 py-3 rounded-lg font-medium inline-flex items-center justify-center transition-colors border border-white/20"
              >
                Let's Connect
                <ArrowRight size={18} className="ml-2" />
              </Link>
             </div>
           </div>
         </div>
       </section>
       
      {/* Projects Section */}
      <Projects />
      
      {/* Stats Section */}
      <Stats />
      
      {/* My Journey - Timeline Component */}
      <Timeline />
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-accent text-white">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Let's Create Something Amazing</h2>
          <p className="text-accent-foreground/90 max-w-2xl mx-auto mb-8">
            Interested in working together? Let's discuss your project and see how I can help bring your ideas to life.
          </p>
          <Link 
            to="/contact" 
            className="bg-white text-accent hover:bg-accent-foreground/90 px-8 py-3 rounded-lg font-medium inline-flex items-center justify-center transition-colors"
          >
            Start a Project
            <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>
      </section>
    </motion.main>
  );
};

export default About;