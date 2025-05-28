import { useEffect, RefObject, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import SplitType from 'split-type';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

interface TextAnimationRefs {
  titleRef: RefObject<HTMLHeadingElement>;
  subtitleRef: RefObject<HTMLParagraphElement>;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

interface ParticleAnimationProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export const useHeroTextAnimation = ({ titleRef, subtitleRef }: TextAnimationRefs) => {
  useEffect(() => {
    if (!titleRef.current || !subtitleRef.current) return;
    
    const tl = gsap.timeline();
    const splitTitle = new SplitType(titleRef.current, { types: "chars" });
    
    // Simple title animation
    gsap.set(titleRef.current, { autoAlpha: 1 });
    gsap.set(splitTitle.chars, { autoAlpha: 0, y: 20 });
    
    tl.to(splitTitle.chars, {
      duration: 0.8,
      autoAlpha: 1,
      y: 0,
      stagger: 0.03,
      ease: "power3.out",
    });
    
    // Simple subtitle animation
    tl.fromTo(subtitleRef.current,
      { autoAlpha: 0, y: 20 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      },
      "-=0.4"
    ).to(subtitleRef.current, {
      duration: 1.5,
      text: "Crafting digital experiences with modern technologies and minimalist design aesthetics",
      ease: "none",
    });
    
    return () => {
      // Revert split text
      splitTitle.revert();
      tl.kill();
    };
  }, [titleRef, subtitleRef]);
};

export const useParticleAnimation = ({ canvasRef }: ParticleAnimationProps) => {
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  
  const PARTICLE_COUNT = 40;
  const PARTICLE_SPEED = 0.3;
  const CONNECTION_DISTANCE = 150;
  
  const initParticles = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * PARTICLE_SPEED,
      vy: (Math.random() - 0.5) * PARTICLE_SPEED,
      radius: Math.random() * 2 + 1,
      color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1})`
    }));
    
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [canvasRef]);
  
  const animateParticles = useCallback((timestamp: number) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particlesRef.current.forEach(particle => {
      particle.x += particle.vx * (deltaTime / 16);
      particle.y += particle.vy * (deltaTime / 16);
      
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
      
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
    });
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 0.5;
    
    for (let i = 0; i < particlesRef.current.length; i++) {
      for (let j = i + 1; j < particlesRef.current.length; j++) {
        const dx = particlesRef.current[i].x - particlesRef.current[j].x;
        const dy = particlesRef.current[i].y - particlesRef.current[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < CONNECTION_DISTANCE) {
          ctx.beginPath();
          ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
          ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
          ctx.stroke();
        }
      }
    }
    
    animationFrameRef.current = requestAnimationFrame(animateParticles);
  }, [canvasRef]);
  
  useEffect(() => {
    const cleanup = initParticles();
    animationFrameRef.current = requestAnimationFrame(animateParticles);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      cleanup?.();
    };
  }, [initParticles, animateParticles]);
};

export const usePortfolioAnimation = (sectionRef: RefObject<HTMLElement>) => {
  // ... existing code ...
};

export default {
  useHeroTextAnimation,
  useParticleAnimation,
  usePortfolioAnimation
}; 