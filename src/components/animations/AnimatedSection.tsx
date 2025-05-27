import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, className }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    
    if (!section || !content) return;

    // Split text elements for animation
    const titles = content.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const paragraphs = content.querySelectorAll('p');
    const buttons = content.querySelectorAll('button, a');
    const images = content.querySelectorAll('img');
    const cards = content.querySelectorAll('.card');

    titles.forEach(title => {
      const split = new SplitText(title, { type: "chars, words" });
      
      gsap.from(split.chars, {
        opacity: 0,
        y: 100,
        rotateX: -90,
        stagger: 0.02,
        duration: 1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: title,
          start: "top 80%",
        }
      });
    });

    paragraphs.forEach(para => {
      gsap.from(para, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: para,
          start: "top 85%",
        }
      });
    });

    buttons.forEach(button => {
      gsap.from(button, {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: button,
          start: "top 90%",
        }
      });
    });

    images.forEach(img => {
      gsap.from(img, {
        opacity: 0,
        scale: 0.8,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: img,
          start: "top 85%",
        }
      });
    });

    cards.forEach(card => {
      gsap.from(card, {
        opacity: 0,
        y: 100,
        rotation: 5,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
        }
      });
    });

    // Parallax effect for background elements
    const bgElements = content.querySelectorAll('.bg-element');
    bgElements.forEach(element => {
      gsap.to(element, {
        y: "30%",
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className={className}>
      <div ref={contentRef}>
        {children}
      </div>
    </section>
  );
};

export default AnimatedSection;