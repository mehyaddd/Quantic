import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// This is a centralized manager for GSAP animations and ScrollTrigger
// It ensures that animations are properly cleaned up and prevents conflicts
class GSAPManager {
  private static instance: GSAPManager;
  private triggers: Map<string, ScrollTrigger> = new Map();
  private animations: Map<string, gsap.core.Animation> = new Map();
  
  private constructor() {
    // Private constructor to enforce singleton pattern
  }
  
  public static getInstance(): GSAPManager {
    if (!GSAPManager.instance) {
      GSAPManager.instance = new GSAPManager();
    }
    return GSAPManager.instance;
  }
  
  // Create a ScrollTrigger with an ID and store it
  public createScrollTrigger(id: string, config: ScrollTriggerConfig): ScrollTrigger {
    // Make sure we clean up any existing trigger with this ID
    this.killScrollTrigger(id);
    
    const trigger = ScrollTrigger.create({
      id,
      ...config
    });
    
    this.triggers.set(id, trigger);
    return trigger;
  }
  
  // Create animation with ID
  public createAnimation(id: string, targets: gsap.TweenTarget, vars: gsap.TweenVars): gsap.core.Animation {
    // Clean up existing animation if any
    this.killAnimation(id);
    
    const animation = gsap.to(targets, vars);
    this.animations.set(id, animation);
    return animation;
  }
  
  // Kill a specific trigger by ID
  public killScrollTrigger(id: string): boolean {
    const trigger = this.triggers.get(id);
    if (trigger) {
      trigger.kill();
      this.triggers.delete(id);
      return true;
    }
    return false;
  }
  
  // Kill a specific animation by ID
  public killAnimation(id: string): boolean {
    const animation = this.animations.get(id);
    if (animation) {
      animation.kill();
      this.animations.delete(id);
      return true;
    }
    return false;
  }
  
  // Kill all triggers and animations with a specific namespace
  public killByNamespace(namespace: string): void {
    // Kill triggers with this namespace
    this.triggers.forEach((trigger, id) => {
      if (id.startsWith(`${namespace}-`)) {
        trigger.kill();
        this.triggers.delete(id);
      }
    });
    
    // Kill animations with this namespace
    this.animations.forEach((animation, id) => {
      if (id.startsWith(`${namespace}-`)) {
        animation.kill();
        this.animations.delete(id);
      }
    });
  }
  
  // Kill all triggers and animations
  public killAll(): void {
    // Kill all triggers
    this.triggers.forEach(trigger => trigger.kill());
    this.triggers.clear();
    
    // Kill all animations
    this.animations.forEach(animation => animation.kill());
    this.animations.clear();
  }
}

// Interface for ScrollTrigger config without id
interface ScrollTriggerConfig extends Omit<ScrollTrigger.StaticVars, 'id'> {}

export const gsapManager = GSAPManager.getInstance();
export { gsap, ScrollTrigger };