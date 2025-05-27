import React, { useRef, useEffect } from 'react';
import '../../styles/components/video-player.css';

interface VideoPlayerProps {
  videoUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Focus trap and escape key handler
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    // Play video when modal opens
    if (videoRef.current) {
      videoRef.current.play().catch(err => console.error('Error playing video:', err));
    }
    
    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);
  
  // Handle click outside to close
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && e.target === modalRef.current) {
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="video-player-overlay" 
      ref={modalRef}
      onClick={handleOutsideClick}
    >
      <div className="video-player-container">
        <button className="close-button" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div className="video-wrapper">
          <video 
            ref={videoRef}
            className="video-element"
            src={videoUrl} 
            controls
            controlsList="nodownload"
            playsInline
          />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer; 