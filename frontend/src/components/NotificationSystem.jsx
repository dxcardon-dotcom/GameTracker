import React, { useState, useEffect } from 'react';
import { colors, spacing, borderRadius, shadows, transitions } from '../styles/designSystem';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Global notification function
  useEffect(() => {
    window.showNotification = addNotification;
    return () => {
      delete window.showNotification;
    };
  }, []);

  const getNotificationStyles = (type) => {
    const styles = {
      success: {
        backgroundColor: colors.success,
        color: 'white',
        icon: '✓',
      },
      error: {
        backgroundColor: colors.error,
        color: 'white',
        icon: '✕',
      },
      warning: {
        backgroundColor: colors.warning,
        color: 'white',
        icon: '⚠',
      },
      info: {
        backgroundColor: colors.info,
        color: 'white',
        icon: 'ℹ',
      },
    };
    
    return styles[type] || styles.info;
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: spacing[4],
        right: spacing[4],
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing[2],
        pointerEvents: 'none',
      }}
    >
      {notifications.map((notification, index) => {
        const styles = getNotificationStyles(notification.type);
        
        return (
          <div
            key={notification.id}
            style={{
              backgroundColor: styles.backgroundColor,
              color: styles.color,
              padding: spacing[4],
              borderRadius: borderRadius.lg,
              boxShadow: shadows.lg,
              minWidth: '300px',
              maxWidth: '400px',
              display: 'flex',
              alignItems: 'center',
              gap: spacing[3],
              pointerEvents: 'auto',
              cursor: 'pointer',
              transform: 'translateX(0)',
              opacity: 1,
              animation: `slideInRight 0.3s ease-out`,
              transition: transitions.all,
            }}
            onClick={() => removeNotification(notification.id)}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateX(-4px)';
              e.target.style.boxShadow = shadows.xl;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateX(0)';
              e.target.style.boxShadow = shadows.lg;
            }}
          >
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                flexShrink: 0,
              }}
            >
              {styles.icon}
            </div>
            
            <div style={{ flex: 1 }}>
              {notification.title && (
                <div
                  style={{
                    fontWeight: 'bold',
                    marginBottom: spacing[1],
                    fontSize: '0.875rem',
                  }}
                >
                  {notification.title}
                </div>
              )}
              <div style={{ fontSize: '0.875rem', lineHeight: 1.4 }}>
                {notification.message}
              </div>
            </div>
            
            <button
              style={{
                background: 'none',
                border: 'none',
                color: 'inherit',
                fontSize: '1.25rem',
                cursor: 'pointer',
                padding: spacing[1],
                borderRadius: borderRadius.base,
                opacity: 0.8,
                transition: transitions.opacity,
              }}
              onClick={(e) => {
                e.stopPropagation();
                removeNotification(notification.id);
              }}
              onMouseEnter={(e) => {
                e.target.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = '0.8';
              }}
            >
              ×
            </button>
          </div>
        );
      })}
      
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

// Hook for easy notification usage
export const useNotification = () => {
  return (type, message, title = '') => {
    if (window.showNotification) {
      window.showNotification({ type, message, title });
    }
  };
};

export default NotificationSystem;
