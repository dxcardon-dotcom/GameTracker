import React, { useState } from 'react';
import { components, transitions, animations, spacing, borderRadius, shadows } from '../styles/designSystem';

const AnimatedCard = ({ 
  children, 
  hover = true, 
  clickable = false, 
  className = '', 
  style = {}, 
  onClick, 
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const baseStyles = {
    backgroundColor: 'white',
    borderRadius: borderRadius.xl,
    padding: spacing[6],
    boxShadow: shadows.sm,
    transition: transitions.card,
    position: 'relative',
    overflow: 'hidden',
    transform: isPressed ? 'scale(0.98)' : isHovered && hover ? 'scale(1.02)' : 'scale(1)',
  };

  const hoverStyles = hover ? {
    '&:hover': {
      boxShadow: shadows.lg,
      transform: 'translateY(-4px)',
    }
  } : {};

  const clickableStyles = clickable ? {
    cursor: 'pointer',
    '&:active': {
      transform: 'scale(0.98)',
    }
  } : {};

  const combinedStyles = {
    ...baseStyles,
    ...style,
  };

  return (
    <div
      style={combinedStyles}
      className={className}
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => {
        setIsPressed(false);
        setIsHovered(false);
      }}
      onMouseEnter={() => setIsHovered(true)}
      {...props}
    >
      {/* Gradient overlay for hover effect */}
      {hover && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 197, 253, 0.05) 100%)`,
            opacity: isHovered ? 1 : 0,
            transition: transitions.opacity,
            pointerEvents: 'none',
            borderRadius: borderRadius.xl,
          }}
        />
      )}

      {/* Shimmer effect on hover */}
      {hover && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: -100,
            width: 100,
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateX(400px)' : 'translateX(0)',
            transition: 'transform 0.6s ease-out',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>

      {/* Animated border */}
      {clickable && (
        <style jsx>{`
          div::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: inherit;
            padding: 1px;
            background: linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899);
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: xor;
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          
          div:hover::before {
            opacity: 1;
          }
        `}</style>
      )}
    </div>
  );
};

export default AnimatedCard;
