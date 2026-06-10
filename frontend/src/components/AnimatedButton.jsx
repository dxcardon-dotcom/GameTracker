import React, { useState } from 'react';
import { components, transitions, animations } from '../styles/designSystem';

const AnimatedButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false, 
  onClick, 
  className = '', 
  ...props 
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const baseStyles = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontWeight: '500',
    transition: transitions.button,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    outline: 'none',
    userSelect: 'none',
    transform: isPressed ? 'scale(0.98)' : isHovered ? 'scale(1.02)' : 'scale(1)',
  };

  const variantStyles = {
    primary: {
      backgroundColor: '#3b82f6',
      color: 'white',
      boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.15)',
      '&:hover:not(:disabled)': {
        backgroundColor: '#2563eb',
        boxShadow: '0 6px 20px 0 rgba(59, 130, 246, 0.25)',
      }
    },
    secondary: {
      backgroundColor: '#f1f5f9',
      color: '#1e293b',
      border: '1px solid #e2e8f0',
      '&:hover:not(:disabled)': {
        backgroundColor: '#e2e8f0',
        borderColor: '#cbd5e1',
      }
    },
    success: {
      backgroundColor: '#22c55e',
      color: 'white',
      boxShadow: '0 4px 14px 0 rgba(34, 197, 94, 0.15)',
      '&:hover:not(:disabled)': {
        backgroundColor: '#16a34a',
        boxShadow: '0 6px 20px 0 rgba(34, 197, 94, 0.25)',
      }
    },
    danger: {
      backgroundColor: '#ef4444',
      color: 'white',
      boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.15)',
      '&:hover:not(:disabled)': {
        backgroundColor: '#dc2626',
        boxShadow: '0 6px 20px 0 rgba(239, 68, 68, 0.25)',
      }
    },
    ghost: {
      backgroundColor: 'transparent',
      color: '#64748b',
      '&:hover:not(:disabled)': {
        backgroundColor: '#f1f5f9',
        color: '#1e293b',
      }
    }
  };

  const sizeStyles = {
    sm: {
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
      borderRadius: '0.375rem',
    },
    md: {
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      borderRadius: '0.5rem',
    },
    lg: {
      padding: '1rem 2rem',
      fontSize: '1.125rem',
      borderRadius: '0.75rem',
    },
    xl: {
      padding: '1.25rem 2.5rem',
      fontSize: '1.25rem',
      borderRadius: '1rem',
    }
  };

  const disabledStyles = {
    opacity: 0.5,
    cursor: 'not-allowed',
  };

  const loadingStyles = {
    opacity: 0.8,
    cursor: 'wait',
  };

  const combinedStyles = {
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...(disabled && disabledStyles),
    ...(loading && loadingStyles),
  };

  return (
    <button
      style={combinedStyles}
      className={className}
      disabled={disabled || loading}
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
      {loading && (
        <div 
          style={{
            width: '1rem',
            height: '1rem',
            border: '2px solid transparent',
            borderTop: '2px solid currentColor',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
      )}
      
      <span style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem',
        opacity: loading ? 0.7 : 1,
      }}>
        {children}
      </span>

      {/* Ripple effect */}
      {!disabled && !loading && (
        <style jsx>{`
          button::after {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: inherit;
            background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
            opacity: 0;
            transform: scale(0);
            transition: all 0.5s ease-out;
          }
          
          button:active::after {
            opacity: 1;
            transform: scale(1);
            transition: 0s;
          }
        `}</style>
      )}
    </button>
  );
};

export default AnimatedButton;
