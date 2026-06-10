import React, { useState, useEffect } from 'react';
import { colors, spacing, borderRadius, typography, transitions } from '../styles/designSystem';

const AnimatedStatsCard = ({ 
  title, 
  value, 
  subtitle, 
  trend, 
  icon, 
  color = colors.primary[600], 
  size = 'md',
  animated = true 
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    if (animated && typeof value === 'number') {
      const duration = 1000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);
      
      return () => clearInterval(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value, animated]);

  const sizes = {
    sm: {
      padding: spacing[4],
      titleSize: typography.fontSize.sm,
      valueSize: typography.fontSize['2xl'],
      subtitleSize: typography.fontSize.xs,
    },
    md: {
      padding: spacing[6],
      titleSize: typography.fontSize.base,
      valueSize: typography.fontSize['3xl'],
      subtitleSize: typography.fontSize.sm,
    },
    lg: {
      padding: spacing[8],
      titleSize: typography.fontSize.lg,
      valueSize: typography.fontSize['4xl'],
      subtitleSize: typography.fontSize.base,
    },
  };

  const currentSize = sizes[size] || sizes.md;

  const getTrendIcon = (trendValue) => {
    if (trendValue > 0) return '↑';
    if (trendValue < 0) return '↓';
    return '→';
  };

  const getTrendColor = (trendValue) => {
    if (trendValue > 0) return colors.success;
    if (trendValue < 0) return colors.error;
    return colors.neutral[500];
  };

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: borderRadius.xl,
        padding: currentSize.padding,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        transition: transitions.all,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        opacity: isVisible ? 1 : 0,
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-4px)';
        e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
      }}
    >
      {/* Background gradient */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100px',
          height: '100px',
          background: `linear-gradient(135deg, ${color}20, ${color}05)`,
          borderRadius: '50%',
          transform: 'translate(30%, -30%)',
        }}
      />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing[4] }}>
        <div>
          <div
            style={{
              color: colors.neutral[600],
              fontSize: currentSize.titleSize,
              fontWeight: typography.fontWeight.medium,
              marginBottom: spacing[1],
            }}
          >
            {title}
          </div>
          
          {subtitle && (
            <div
              style={{
                color: colors.neutral[500],
                fontSize: currentSize.subtitleSize,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        <div
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: `${color}15`,
            borderRadius: borderRadius.lg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            color: color,
          }}
        >
          {icon}
        </div>
      </div>

      {/* Value */}
      <div
        style={{
          fontSize: currentSize.valueSize,
          fontWeight: typography.fontWeight.bold,
          color: colors.neutral[900],
          marginBottom: spacing[2],
          lineHeight: 1,
        }}
      >
        {typeof value === 'number' ? 
          (value >= 1000 ? `${(displayValue / 1000).toFixed(1)}k` : displayValue) : 
          displayValue
        }
      </div>

      {/* Trend */}
      {trend !== undefined && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
            fontSize: typography.fontSize.sm,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[1],
              color: getTrendColor(trend),
              fontWeight: typography.fontWeight.medium,
            }}
          >
            <span>{getTrendIcon(trend)}</span>
            <span>{Math.abs(trend)}%</span>
          </div>
          
          <div style={{ color: colors.neutral[500] }}>
            vs last period
          </div>
        </div>
      )}

      {/* Progress bar for percentage values */}
      {typeof value === 'number' && value <= 100 && (
        <div
          style={{
            marginTop: spacing[4],
            height: '4px',
            backgroundColor: colors.neutral[200],
            borderRadius: borderRadius.full,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              backgroundColor: color,
              borderRadius: borderRadius.full,
              width: animated ? '0%' : `${value}%`,
              transition: `width 1s ease-out`,
              animation: animated ? 'slideIn 1s ease-out' : 'none',
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            width: 0%;
          }
          to {
            width: ${value}%;
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedStatsCard;
