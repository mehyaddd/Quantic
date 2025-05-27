import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import ElementTitles from './TitlesContainer';
import './canvas.css';

// Image titles data
const imageTitles = [
  {
    title: "COSMIC VOYAGE",
    offset: {
      x: 0,
      y: -25
    }
  },
  {
    title: "ASTRAL NEBULA",
    offset: {
      x: 0,
      y: 30
    }
  },
  {
    title: "STELLAR DRIFT",
    offset: {
      x: 0,
      y: 20
    }
  },
  {
    title: "ORBITAL PATH",
    offset: {
      x: 0,
      y: -20
    }
  },
  {
    title: "CELESTIAL FLOW",
    offset: {
      x: 0,
      y: -15
    }
  }
];

// Image URLs for slides
const imageUrls = [
  "https://cdn.cosmos.so/2f49a117-05e7-4ae9-9e95-b9917f970adb?format=jpeg",
  "https://cdn.cosmos.so/7b5340f5-b4dc-4c08-8495-c507fa81480b?format=jpeg",
  "https://cdn.cosmos.so/f733585a-081e-48e7-a30e-e636446f2168?format=jpeg",
  "https://cdn.cosmos.so/47caf8a0-f456-41c5-98ea-6d0476315731?format=jpeg",
  "https://cdn.cosmos.so/f99f8445-6a19-4a9a-9de3-ac382acc1a3f?format=jpeg"
];

// Slider constants
const slideWidth = 4.2;
const slideHeight = 2.4;
const gap = 0.3;
const slideCount = 10;
const imagesCount = 5;
const totalWidth = slideCount * (slideWidth + gap);
const slideUnit = slideWidth + gap;

const ElementSlideGallery: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Global settings
    const settings = {
      wheelSensitivity: 0.01,
      touchSensitivity: 0.01,
      momentumMultiplier: 2.5,
      smoothing: 0.1,
      slideLerp: 0.075,
      distortionDecay: 0.93,
      maxDistortion: 4.0,
      distortionSensitivity: 0.25,
      distortionSmoothing: 0.075,
      rotationFactor: 0.2,
      animationSpeed: 0.5,
      textFadeStart: slideWidth / 2,
      textFadeEnd: slideWidth / 2 + 0.5,
      textMaxBlur: 5,
      distortionIntensity: 0.3,
      horizontalDistortionDamping: 0.3,
      momentumDistortionBoost: 0.3,
      directionInfluence: 0.4,
      waveAmplitudeBoost: 0.2,
      directionChangeThreshold: 0.02,
      directionSmoothing: 0.03
    };

    // Three.js Setup
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      preserveDrawingBuffer: true,
      alpha: true
    });
    
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.08);
    
    const camera = new THREE.PerspectiveCamera(
      50,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    );
    camera.position.z = 5;
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);
    
    // White light instead of colored
    const pointLight = new THREE.PointLight(0xffffff, 2, 10);
    pointLight.position.set(0, 0, 2);
    scene.add(pointLight);
    
    // Track state
    let currentPosition = 0;
    let targetPosition = 0;
    let isScrolling = false;
    let autoScrollSpeed = 0;
    let lastTime = 0;
    let touchStartX = 0;
    let touchLastX = 0;
    let globalTime = 0;
    let currentDistortionFactor = 0;
    let targetDistortionFactor = 0;
    let peakVelocity = 0;
    let velocityHistory = [0, 0, 0, 0, 0];
    let lastDeltaX = 0;
    let movementDirection = new THREE.Vector2(0, 0);
    let lastMovementInput = 0;
    let accumulatedMovement = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragLastX = 0;
    let scrollTimeoutId: number;
    
    // Functions
    const correctImageColor = (texture: THREE.Texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };
    
    const slides: THREE.Mesh[] = [];
    
    const createSlide = (index: number) => {
      const geometry = new THREE.PlaneGeometry(slideWidth, slideHeight, 64, 32);
      const material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        metalness: 0.2,
        roughness: 0.8,
        clearcoat: 0.4,
        clearcoatRoughness: 0.3
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = index * (slideWidth + gap);
      
      // Add userData
      mesh.userData = {
        originalVertices: [...geometry.attributes.position.array],
        index,
        time: Math.random() * 1000,
        waveSpeed: 0.5 + Math.random() * 0.5,
        waveAmplitude: 1.0,
        wavePhase: Math.random() * Math.PI * 2,
        targetX: 0,
        currentX: 0,
        currentRotFactor: 0
      };
      
      const imageIndex = index % imagesCount;
      const imagePath = imageUrls[imageIndex];
      
      new THREE.TextureLoader().load(
        imagePath,
        (texture) => {
          correctImageColor(texture);
          material.map = texture;
          material.needsUpdate = true;
          
          const imgAspect = texture.image.width / texture.image.height;
          const slideAspect = slideWidth / slideHeight;
          
          if (imgAspect > slideAspect) {
            mesh.scale.y = slideAspect / imgAspect;
          } else {
            mesh.scale.x = imgAspect / slideAspect;
          }
        },
        undefined,
        (err) => console.warn(`Couldn't load image ${imagePath}`, err)
      );
      
      scene.add(mesh);
      slides.push(mesh);
    };
    
    // Create all slides
    for (let i = 0; i < slideCount; i++) {
      createSlide(i);
    }
    
    // Position slides
    slides.forEach((slide) => {
      slide.position.x -= totalWidth / 2;
      slide.userData.targetX = slide.position.x;
      slide.userData.currentX = slide.position.x;
      
      // Slight random rotation just for style
      slide.rotation.x = (Math.random() - 0.5) * 0.1;
      slide.rotation.y = (Math.random() - 0.5) * 0.1;
    });
    
    // Update title positions
    const updateTitlePositions = () => {
      const titleElements = (window as any).titleElements;
      if (!titleElements) return;
      
      titleElements.forEach((titleObj: any) => {
        const slide = slides[titleObj.index];
        if (!slide) return;
        
        const { element, offset } = titleObj;
        
        // Project the slide's position into screen coords
        const vector = new THREE.Vector3(
          slide.position.x,
          slide.position.y,
          slide.position.z
        );
        vector.project(camera);
        
        const screenX = (vector.x * 0.5 + 0.5) * canvas.clientWidth;
        const screenY = (-vector.y * 0.5 + 0.5) * canvas.clientHeight;
        
        // Place text exactly horizontally centered, and apply only vertical offset
        element.style.left = `${screenX}px`;
        element.style.top = `${screenY + offset.y}px`;
        
        const textRect = element.getBoundingClientRect();
        element.style.left = `${screenX - textRect.width / 2}px`;
        
        // Fade + blur based on world distance from center
        const distanceFromCenter = Math.abs(slide.position.x);
        let opacity;
        
        if (distanceFromCenter < settings.textFadeStart) {
          opacity = 1;
        } else if (distanceFromCenter > settings.textFadeEnd) {
          opacity = 0;
        } else {
          opacity =
            1 -
            (distanceFromCenter - settings.textFadeStart) /
              (settings.textFadeEnd - settings.textFadeStart);
        }
        
        element.style.opacity = opacity.toFixed(2);
        
        // Compute blur: maximum at opacity=0
        const blurValue = (1 - opacity) * settings.textMaxBlur;
        element.style.filter = `blur(${blurValue}px)`;
      });
    };
    
    // Enhanced distortion with smoother momentum and directional influence
    const updateDistortion = (mesh: THREE.Mesh, distortionFactor: number, deltaTime: number) => {
      if (!mesh.userData.time) return;
      
      mesh.userData.time +=
        deltaTime * settings.animationSpeed * mesh.userData.waveSpeed;
      const time = mesh.userData.time;
      
      const positionAttribute = mesh.geometry.attributes.position;
      const originalVertices = mesh.userData.originalVertices;
      
      if (!positionAttribute || !originalVertices) return;
      
      // Enhanced wave amplitude based on momentum (with more gradual changes)
      const momentumBoost = Math.min(
        1.0,
        peakVelocity * settings.momentumDistortionBoost
      );
      
      // More gradual wave amplitude changes
      const targetWaveAmplitude =
        1.0 + momentumBoost * settings.waveAmplitudeBoost * 3.0;
      
      if (!mesh.userData.waveAmplitude) {
        mesh.userData.waveAmplitude = 1.0;
      }
      
      mesh.userData.waveAmplitude +=
        (targetWaveAmplitude - mesh.userData.waveAmplitude) * 0.05;
      
      const effectiveDistortion = distortionFactor * settings.distortionIntensity;
      const gravityCenterX = Math.sin(time * 0.1) * 0.5;
      const gravityCenterY = Math.cos(time * 0.15) * 0.3;
      const gravityStrength = Math.min(2.0, Math.max(0, effectiveDistortion)) * 2.0;
      
      const dx = mesh.userData.targetX - mesh.userData.currentX;
      const dxAbs = Math.abs(dx);
      
      // Only update direction if movement exceeds threshold
      if (dxAbs > settings.directionChangeThreshold) {
        // Get movement sign
        const newDirection = dx > 0 ? -1 : 1;
        
        // Apply much smoother directional changes
        const directionBlend = Math.min(
          1.0,
          settings.directionSmoothing * (1 + dxAbs * 5)
        );
        
        movementDirection.x +=
          (newDirection - movementDirection.x) * directionBlend;
      }
      
      // Scale direction influence by velocity to reduce effect of small movements
      const velocityScale = Math.min(1.0, peakVelocity * 2);
      const effectiveDirectionInfluence =
        settings.directionInfluence * velocityScale;
      
      for (let i = 0; i < positionAttribute.count; i++) {
        const x = originalVertices[i * 3];
        const y = originalVertices[i * 3 + 1];
        const z = originalVertices[i * 3 + 2];
        
        const distX = x - gravityCenterX;
        const distY = y - gravityCenterY;
        const dist = Math.sqrt(distX * distX + distY * distY + 0.0001);
        const gravityFactor = Math.min(1, 1 / (1 + dist * 8));
        
        // Smoother directional wave with velocity scaling
        const dirWaveX =
          movementDirection.x *
          Math.sin(dist * 5 + time) *
          effectiveDirectionInfluence;
        
        // Keep Y wave minimal to prevent vertical jumpiness
        const dirWaveY =
          movementDirection.y *
          Math.cos(dist * 5 + time) *
          (effectiveDirectionInfluence * 0.3);
        
        // Distortion components
        const pullX = distX * gravityFactor * gravityStrength * 0.5;
        const pullY = distY * gravityFactor * gravityStrength * 0.5;
        
        // Reduce stretch effect for small movements
        const stretchFactor = effectiveDistortion * 0.3 * velocityScale;
        const stretchX =
          movementDirection.x * stretchFactor * (1 - Math.min(1, Math.abs(y)));
        const stretchY =
          movementDirection.y * stretchFactor * (1 - Math.min(1, Math.abs(x)));
        
        // Enhanced wave effect that scales with momentum
        const waveScale = mesh.userData.waveAmplitude;
        const phase = mesh.userData.wavePhase;
        const pulse =
          Math.sin(time + dist * 3 + phase) *
          0.05 *
          effectiveDistortion *
          waveScale;
        
        const twistAmount =
          effectiveDistortion * 0.1 * gravityFactor * velocityScale;
        const twistX = -y * twistAmount;
        const twistY = x * twistAmount;
        
        // Apply extra horizontal damping for small movements
        const horizontalDamping =
          settings.horizontalDistortionDamping * (1 - velocityScale * 0.3);
        
        // Apply displacement with more aggressive damping at low velocities
        const newX =
          x +
          Math.min(
            1,
            Math.max(-1, (pullX + stretchX + twistX + dirWaveX) * horizontalDamping)
          );
          
        const newY =
          y + Math.min(1, Math.max(-1, pullY + stretchY + twistY + dirWaveY));
          
        const newZ = Math.min(
          2,
          Math.max(
            -2,
            (gravityFactor * gravityStrength + pulse) * (1 + Math.min(5, dist))
          )
        );
        
        positionAttribute.setXYZ(i, newX, newY, newZ);
      }
      
      positionAttribute.needsUpdate = true;
      mesh.geometry.computeVertexNormals();
      
      // More gradual rotation changes
      const targetRotFactor =
        Math.min(0.2, effectiveDistortion) *
        settings.rotationFactor *
        (1 + momentumBoost * 0.5);
      
      if (!mesh.userData.currentRotFactor) {
        mesh.userData.currentRotFactor = 0;
      }
      
      mesh.userData.currentRotFactor +=
        (targetRotFactor - mesh.userData.currentRotFactor) * 0.1;
      
      const rotFactor = mesh.userData.currentRotFactor;
      
      mesh.rotation.x = Math.sin(time * 0.2) * 0.1 * rotFactor;
      mesh.rotation.y = Math.sin(time * 0.3 + 0.5) * 0.1 * rotFactor;
      mesh.rotation.z = rotFactor * 0.05 * Math.sin(time * 0.1);
    };
    
    // Camera movement
    const updateCamera = (time: number) => {
      const amplitude = 0; // Camera drift disabled
      const frequency = 0.2;
      
      camera.position.y = Math.sin(time * frequency) * amplitude;
      camera.position.x = Math.cos(time * frequency * 0.7) * amplitude * 0.5;
      camera.lookAt(0, 0, 0);
    };
    
    // Animation loop
    const animate = (time: number) => {
      const animationId = requestAnimationFrame(animate);
      
      const deltaTime = lastTime ? (time - lastTime) / 1000 : 0.016;
      lastTime = time;
      globalTime += deltaTime;
      
      // Set point light to white
      pointLight.color.set(0xffffff);
      
      const prevPos = currentPosition;
      
      if (isScrolling) {
        targetPosition += autoScrollSpeed;
        const speedBasedDecay = 0.97 - Math.abs(autoScrollSpeed) * 0.5;
        autoScrollSpeed *= Math.max(0.92, speedBasedDecay);
        
        if (Math.abs(autoScrollSpeed) < 0.001) {
          autoScrollSpeed = 0;
        }
      }
      
      // Smoother position updates with adaptive smoothing
      const positionDelta = Math.abs(targetPosition - currentPosition);
      const adaptiveSmoothing =
        settings.smoothing * (positionDelta < 0.1 ? 0.5 : 1.0);
      
      currentPosition += (targetPosition - currentPosition) * adaptiveSmoothing;
      
      // Compute current velocity in slides with improved tracking
      const currentVelocity = Math.abs(currentPosition - prevPos) / deltaTime;
      
      // More stable velocity calculation with threshold filtering
      const significantVelocity = currentVelocity > 0.01 ? currentVelocity : 0;
      velocityHistory.push(significantVelocity);
      velocityHistory.shift();
      
      // Use weighted average with more weight on recent values
      const weights = [0.1, 0.15, 0.2, 0.25, 0.3];
      let weightSum = 0;
      let weightedVelocity = 0;
      
      for (let i = 0; i < velocityHistory.length; i++) {
        weightedVelocity += velocityHistory[i] * weights[i];
        weightSum += weights[i];
      }
      
      const avgVelocity = weightSum > 0 ? weightedVelocity / weightSum : 0;
      
      // Smoother peak velocity updates
      if (avgVelocity > peakVelocity) {
        // Gradual increase to peak
        peakVelocity += (avgVelocity - peakVelocity) * 0.3;
        
        // Boost distortion on acceleration more smoothly
        const accelerationBoost = Math.min(0.1, avgVelocity * 0.03);
        targetDistortionFactor = Math.min(
          settings.maxDistortion,
          targetDistortionFactor + accelerationBoost
        );
      }
      
      const velocityRatio = avgVelocity / (peakVelocity + 0.001);
      const isDecelerating = velocityRatio < 0.7 && peakVelocity > 0.3;
      
      // More gradual peak velocity decay for smoother transitions
      peakVelocity *= 0.98;
      
      // Scale movement distortion by square of velocity to reduce impact of small moves
      const movementDistortion = Math.min(
        1.0,
        currentVelocity * currentVelocity * 2
      );
      
      if (currentVelocity > 0.03) {
        // More gradual increase
        const blendFactor = Math.min(0.2, currentVelocity);
        targetDistortionFactor +=
          (movementDistortion - targetDistortionFactor) * blendFactor;
      }
      
      // Different decay rates for acceleration vs deceleration
      if (isDecelerating) {
        // Slower decay when decelerating for more lasting effect
        targetDistortionFactor *= settings.distortionDecay * 1.01;
      } else if (avgVelocity < 0.1) {
        // Faster decay when nearly stopped
        targetDistortionFactor *= settings.distortionDecay * 0.9;
      }
      
      // Adaptive smoothing based on distortion magnitude
      const distortionDelta = Math.abs(
        targetDistortionFactor - currentDistortionFactor
      );
      
      const adaptiveDistortionSmoothing =
        settings.distortionSmoothing * (distortionDelta < 0.05 ? 0.5 : 1.0);
      
      currentDistortionFactor +=
        (targetDistortionFactor - currentDistortionFactor) *
        adaptiveDistortionSmoothing;
      
      updateCamera(globalTime);
      
      slides.forEach((slide, i) => {
        let baseX = i * slideUnit - currentPosition;
        baseX = ((baseX % totalWidth) + totalWidth) % totalWidth;
        
        if (baseX > totalWidth / 2) {
          baseX -= totalWidth;
        }
        
        if (Math.abs(baseX - slide.userData.targetX) > slideWidth * 2) {
          slide.userData.currentX = baseX;
        }
        
        slide.userData.targetX = baseX;
        slide.userData.currentX +=
          (slide.userData.targetX - slide.userData.currentX) * settings.slideLerp;
        
        if (Math.abs(slide.userData.currentX) < totalWidth / 2 + slideWidth * 1.5) {
          slide.position.x = slide.userData.currentX;
          const distanceFromCenter = Math.abs(slide.position.x);
          
          // Subtle Z offset so slides off-center recede slightly
          slide.position.z = distanceFromCenter * -0.05;
          
          updateDistortion(slide, currentDistortionFactor, deltaTime);
        }
      });
      
      updateTitlePositions();
      renderer.render(scene, camera);
    };
    
    // Start animation
    const animationId = requestAnimationFrame(animate);
    
    // Event listeners
    // Mouse move for light position
    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = (e.clientX / canvas.clientWidth) * 2 - 1;
      const mouseY = -(e.clientY / canvas.clientHeight) * 2 + 1;
      
      pointLight.position.x = mouseX * 3;
      pointLight.position.y = mouseY * 2;
      
      if (!isDragging) return;
      
      const mouseX2 = e.clientX;
      const deltaX = mouseX2 - dragLastX;
      lastDeltaX = deltaX;
      
      // Accumulate small movements to avoid jerkiness
      accumulatedMovement += deltaX;
      
      // Only apply movement if it exceeds threshold or time has passed
      const now = performance.now();
      const timeDelta = now - lastMovementInput;
      
      if (Math.abs(accumulatedMovement) > 1 || timeDelta > 50) {
        dragLastX = mouseX2;
        const dragStrength = Math.abs(accumulatedMovement) * 0.02;
        
        targetDistortionFactor = Math.min(
          1.0,
          targetDistortionFactor + dragStrength
        );
        
        targetPosition -= accumulatedMovement * settings.touchSensitivity;
        accumulatedMovement = 0;
        lastMovementInput = now;
      }
    };
    
    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      dragStartX = e.clientX;
      dragLastX = dragStartX;
      if (canvasRef.current) { // Check if canvasRef.current is not null
        canvasRef.current.style.cursor = "grabbing";
      }
    };
    
    const handleMouseUp = () => {
      if (!isDragging) return;
      
      isDragging = false;
      if (canvasRef.current) { // Check if canvasRef.current is not null
        canvasRef.current.style.cursor = "grab";
      }
      
      const velocity = (dragLastX - dragStartX) * 0.005;
      
      if (Math.abs(velocity) > 0.5) {
        autoScrollSpeed = -velocity * settings.momentumMultiplier * 0.05;
        
        targetDistortionFactor = Math.min(
          1.0,
          Math.abs(velocity) * 3 * settings.distortionSensitivity
        );
        
        isScrolling = true;
        
        setTimeout(() => {
          isScrolling = false;
        }, 800);
      }
    };
    
    const handleMouseLeave = () => {
      if (isDragging) {
        isDragging = false;
        if (canvasRef.current) { // Check if canvasRef.current is not null
            canvasRef.current.style.cursor = "grab";
        }
      }
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        targetPosition += slideUnit;
        targetDistortionFactor = Math.min(1.0, targetDistortionFactor + 0.4);
        movementDirection.x = 1; // Set direction for left
      } else if (e.key === "ArrowRight") {
        targetPosition -= slideUnit;
        targetDistortionFactor = Math.min(1.0, targetDistortionFactor + 0.4);
        movementDirection.x = -1; // Set direction for right
      }
    };
    
    const handleWheel = (e: WheelEvent) => {
      // e.preventDefault(); // Potentially remove or make conditional
      
      const wheelStrength = Math.abs(e.deltaY) * 0.001;
      
      targetDistortionFactor = Math.min(
        1.0,
        targetDistortionFactor + wheelStrength
      );
      
      targetPosition -= e.deltaY * settings.wheelSensitivity;
      isScrolling = true; // This might need to be managed differently if page scroll is enabled
      
      autoScrollSpeed =
        Math.min(Math.abs(e.deltaY) * 0.0005, 0.05) * Math.sign(e.deltaY);
      
      movementDirection.x = Math.sign(e.deltaY) * -1; // Set direction for wheel
      
      clearTimeout(scrollTimeoutId);
      scrollTimeoutId = setTimeout(() => {
        isScrolling = false;
      }, 150);
    };
    
    const handleTouchStart = (e: TouchEvent) => {
      // e.preventDefault(); // Potentially remove or make conditional
      touchStartX = e.touches[0].clientX;
      touchLastX = touchStartX;
      isScrolling = false; // This might need to be managed differently
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      // e.preventDefault(); // Potentially remove or make conditional
      
      const touchX = e.touches[0].clientX;
      const deltaX = touchX - touchLastX;
      lastDeltaX = deltaX;
      
      // Accumulate small movements to avoid jerkiness
      accumulatedMovement += deltaX;
      
      // Only apply movement if it exceeds threshold or time has passed
      const now = performance.now();
      const timeDelta = now - lastMovementInput;
      
      if (Math.abs(accumulatedMovement) > 1 || timeDelta > 50) {
        touchLastX = touchX;
        const touchStrength = Math.abs(accumulatedMovement) * 0.02;
        
        targetDistortionFactor = Math.min(
          1.0,
          targetDistortionFactor + touchStrength
        );
        
        targetPosition -= accumulatedMovement * settings.touchSensitivity;
        accumulatedMovement = 0;
        lastMovementInput = now;
        isScrolling = true; // This might need to be managed differently
      }
    };
    
    const handleTouchEnd = () => {
      const velocity = (touchLastX - touchStartX) * 0.005;
      
      if (Math.abs(velocity) > 0.5) {
        autoScrollSpeed = -velocity * settings.momentumMultiplier * 0.05;
        
        targetDistortionFactor = Math.min(
          1.0,
          Math.abs(velocity) * 3 * settings.distortionSensitivity
        );
        
        movementDirection.x = Math.sign(velocity) * -1; // Set direction from velocity
        isScrolling = true; // This might need to be managed differently
        
        setTimeout(() => {
          isScrolling = false;
        }, 800);
      }
    };
    
    const handleResize = () => {
      if (!canvasRef.current) return; // Add null check for canvasRef.current
      const currentCanvas = canvasRef.current; // Use currentCanvas consistently
      // camera.aspect = window.innerWidth / window.innerHeight;
      camera.aspect = currentCanvas.clientWidth / currentCanvas.clientHeight;
      camera.updateProjectionMatrix();
      // renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setSize(currentCanvas.clientWidth, currentCanvas.clientHeight);
      updateTitlePositions(); // This function might also need adjustment if it relies on window dimensions for projections
    };
    
    // Add event listeners
    const currentCanvas = canvasRef.current; // Store ref for cleanup
    
    window.addEventListener("mousemove", handleMouseMove);
    if (currentCanvas) {
        currentCanvas.addEventListener("mousedown", handleMouseDown);
        currentCanvas.addEventListener("wheel", handleWheel, { passive: true }); // Use passive: true if not preventing default
        currentCanvas.addEventListener("touchstart", handleTouchStart, { passive: true }); // Use passive: true if not preventing default
        currentCanvas.addEventListener("touchmove", handleTouchMove, { passive: true }); // Use passive: true if not preventing default
        currentCanvas.addEventListener("touchend", handleTouchEnd);
    }
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseleave", handleMouseLeave); // Keep on window if drag can go outside canvas
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);
    
    // Canvas initial setup
    if (currentCanvas) {
        currentCanvas.style.cursor = "grab";
    }
    
    // Cleanup function
    return () => {
      // Remove event listeners
      window.removeEventListener("mousemove", handleMouseMove);
      if (currentCanvas) {
          currentCanvas.removeEventListener("mousedown", handleMouseDown);
          currentCanvas.removeEventListener("wheel", handleWheel);
          currentCanvas.removeEventListener("touchstart", handleTouchStart);
          currentCanvas.removeEventListener("touchmove", handleTouchMove);
          currentCanvas.removeEventListener("touchend", handleTouchEnd);
      }
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
      
      // Cancel animation frame
      cancelAnimationFrame(animationId);
      
      // Dispose Three.js objects
      slides.forEach((slide) => {
        slide.geometry.dispose();
        if (slide.material instanceof THREE.Material) {
          slide.material.dispose();
        } else if (Array.isArray(slide.material)) {
          slide.material.forEach((material) => material.dispose());
        }
        scene.remove(slide);
      });
      
      // Dispose lights
      scene.remove(ambientLight);
      scene.remove(directionalLight);
      scene.remove(pointLight);
      
      // Dispose renderer
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <canvas id="canvas" ref={canvasRef}></canvas>
      <ElementTitles imageTitles={imageTitles} slideCount={slideCount} imagesCount={imagesCount} />
    </>
  );
};

export default ElementSlideGallery;