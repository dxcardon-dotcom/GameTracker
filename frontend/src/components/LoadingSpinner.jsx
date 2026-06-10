import React from 'react';
import { animations } from '../styles/designSystem';

const LoadingSpinner = ({ 
  size = 'md', 
  color = '#3b82f6', 
  variant = 'default', 
  className = '' 
}) => {
  const sizes = {
    xs: { width: '16px', height: '16px', borderWidth: '2px' },
    sm: { width: '24px', height: '24px', borderWidth: '2px' },
    md: { width: '32px', height: '32px', borderWidth: '3px' },
    lg: { width: '48px', height: '48px', borderWidth: '4px' },
    xl: { width: '64px', height: '64px', borderWidth: '4px' },
  };

  const currentSize = sizes[size] || sizes.md;

  const variants = {
    default: (
      <div
        style={{
          ...currentSize,
          border: `${currentSize.borderWidth} solid rgba(0, 0, 0, 0.1)`,
          borderTop: `${currentSize.borderWidth} solid ${color}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
    ),
    dots: (
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            style={{
              width: currentSize.width / 3,
              height: currentSize.height / 3,
              backgroundColor: color,
              borderRadius: '50%',
              animation: `bounce 1.4s ease-in-out infinite both`,
              animationDelay: `${index * 0.16}s`,
            }}
          />
        ))}
      </div>
    ),
    pulse: (
      <div
        style={{
          ...currentSize,
          backgroundColor: color,
          borderRadius: '50%',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }}
      />
    ),
    bars: (
      <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            style={{
              width: currentSize.width / 8,
              height: currentSize.height,
              backgroundColor: color,
              borderRadius: '2px',
              animation: `stretch 1.2s ease-in-out infinite`,
              animationDelay: `${index * 0.1}s`,
            }}
          />
        ))}
      </div>
    ),
  };

  const currentVariant = variants[variant] || variants.default;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        @keyframes stretch {
          0%, 40%, 100% {
            transform: scaleY(0.4);
          }
          20% {
            transform: scaleY(1);
          }
        }
      `}</style>
      {currentVariant}
    </div>
  );
};

export default LoadingSpinner;
