import React, { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface CTAProps {
  style?: CSSProperties;
}

const CTA: React.FC<CTAProps> = ({ style }) => {
  return (
    <div
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(5px)',
        padding: '2rem',
        borderRadius: '1rem',
        visibility: 'visible',
        display: 'block',
        position: 'relative',
        zIndex: 99,
        ...style
      }}
    >
      <h2 
        style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold',
          marginBottom: '2rem',
          visibility: 'visible',
          display: 'block',
          color: 'white'
        }}
      >
        Ready to start your project?
      </h2>
      
      <p 
        style={{ 
          fontSize: '1.25rem',
          maxWidth: '42rem',
          margin: '0 auto 3rem auto',
          visibility: 'visible',
          display: 'block',
          color: 'white',
          opacity: 1,
          position: 'relative',
          zIndex: 100,
          textShadow: '0 0 1px rgba(255,255,255,0.5)'
        }}
      >
        Let's work together to create something amazing. Reach out and let's discuss your ideas.
      </p>
      
      <Link 
        to="/contact" 
        style={{ 
          backgroundColor: '#1a1a1a',
          color: 'white',
          padding: '1rem 2.5rem',
          borderRadius: '9999px',
          fontWeight: '500',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s',
          transform: 'scale(1)',
          visibility: 'visible',
          border: '1px solid rgba(255,255,255,0.2)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.backgroundColor = '#2a2a2a';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.backgroundColor = '#1a1a1a';
        }}
      >
        Get in Touch
        <ArrowRight 
          size={20} 
          style={{ 
            marginLeft: '0.5rem',
            transition: 'transform 0.3s'
          }}
        />
      </Link>
    </div>
  );
};

export default CTA; 