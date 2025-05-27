import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { Pane } from 'tweakpane';

interface ThreeLoaderProps {
  children?: React.ReactNode;
}

const ThreeLoader: React.FC<ThreeLoaderProps> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Check if THREE is available
      if (!THREE) {
        throw new Error('THREE.js is not available');
      }

      // Check if Tweakpane is available
      if (!Pane) {
        throw new Error('Tweakpane is not available');
      }

      // Set loaded state
      setIsLoaded(true);
    } catch (err) {
      setError(`Failed to load dependencies: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, []);

  if (error) {
    return (
      <div className="error-container" style={{ padding: '20px', background: '#ffebee', color: '#c62828', borderRadius: '4px' }}>
        <h3>Error Loading Dependencies</h3>
        <p>{error}</p>
        <p>Make sure Three.js and Tweakpane are properly installed.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="loading-container" style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading Three.js and Tweakpane dependencies...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ThreeLoader; 