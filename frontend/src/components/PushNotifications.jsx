import React, { useState, useEffect, useCallback } from 'react';

const PushNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [permission, setPermission] = useState('default');
  const [settings, setSettings] = useState({
    gameUpdates: true,
    scoreChanges: true,
    playerMilestones: true,
    teamAchievements: true,
    systemUpdates: false
  });

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      localStorage.setItem('notification-permission', result);
      return result;
    }
    return 'denied';
  }, []);

  // Load saved settings and permission
  useEffect(() => {
    const savedPermission = localStorage.getItem('notification-permission') || 'default';
    const savedSettings = localStorage.getItem('notification-settings');
    
    setPermission(savedPermission);
    
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Check if browser supports notifications
    if ('Notification' in window && Notification.permission === 'granted') {
      setPermission('granted');
    }
  }, []);

  // Show browser notification
  const showNotification = useCallback((title, options = {}) => {
    if (permission !== 'granted') return;

    const notification = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: options.tag || 'default',
      requireInteraction: options.requireInteraction || false,
      ...options
    });

    // Auto-close after 5 seconds unless interaction is required
    if (!options.requireInteraction) {
      setTimeout(() => notification.close(), 5000);
    }

    // Handle click
    notification.onclick = () => {
      window.focus();
      notification.close();
      if (options.onClick) {
        options.onClick();
      }
    };

    return notification;
  }, [permission]);

  // Add in-app notification
  const addNotification = useCallback((notification) => {
    const id = Date.now();
    const newNotification = {
      id,
      timestamp: new Date().toISOString(),
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep last 50

    // Show browser notification if enabled
    if (settings[notification.type] !== false) {
      showNotification(notification.title, {
        body: notification.message,
        tag: notification.type,
        icon: notification.icon || '/favicon.ico',
        requireInteraction: notification.important || false
      });
    }

    // Auto-remove in-app notification after duration
    setTimeout(() => {
      removeNotification(id);
    }, notification.duration || 5000);
  }, [settings, showNotification]);

  // Remove notification
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Update settings
  const updateSettings = useCallback((newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('notification-settings', JSON.stringify(updatedSettings));
  }, [settings]);

  // Game-specific notification helpers
  const notifyGameUpdate = useCallback((gameData) => {
    addNotification({
      type: 'gameUpdates',
      title: 'Game Update',
      message: `${gameData.team} vs ${gameData.opponent} - ${gameData.status}`,
      icon: '⚾',
      important: gameData.status === 'Final'
    });
  }, [addNotification]);

  const notifyScoreChange = useCallback((team, score, inning) => {
    addNotification({
      type: 'scoreChanges',
      title: 'Score Update!',
      message: `${team} scores! Current: ${score}`,
      icon: '🎯',
      important: true
    });
  }, [addNotification]);

  const notifyPlayerMilestone = useCallback((player, milestone) => {
    addNotification({
      type: 'playerMilestones',
      title: 'Player Milestone! 🏆',
      message: `${player} achieved ${milestone}`,
      icon: '🏆',
      important: true
    });
  }, [addNotification]);

  const notifyTeamAchievement = useCallback((achievement) => {
    addNotification({
      type: 'teamAchievements',
      title: 'Team Achievement! 🎉',
      message: achievement,
      icon: '🎉',
      important: true
    });
  }, [addNotification]);

  // Notification types and their icons
  const getNotificationIcon = (type) => {
    const icons = {
      gameUpdates: '⚾',
      scoreChanges: '🎯',
      playerMilestones: '🏆',
      teamAchievements: '🎉',
      systemUpdates: '🔧',
      sync: '🔄',
      error: '❌',
      success: '✅',
      warning: '⚠️'
    };
    return icons[type] || '📢';
  };

  const getNotificationColor = (type) => {
    const colors = {
      gameUpdates: '#38bdf8',
      scoreChanges: '#22c55e',
      playerMilestones: '#f59e0b',
      teamAchievements: '#a855f7',
      systemUpdates: '#64748b',
      sync: '#38bdf8',
      error: '#ef4444',
      success: '#22c55e',
      warning: '#f59e0b'
    };
    return colors[type] || '#64748b';
  };

  return (
    <div className="notification-system">
      {/* Notification Container */}
      <div className="notification-container" style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9998,
        maxWidth: '400px',
        width: '100%'
      }}>
        {notifications.map(notification => (
          <div
            key={notification.id}
            className="notification-item"
            style={{
              background: '#1e293b',
              border: `1px solid ${getNotificationColor(notification.type)}`,
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
              animation: 'slideIn 0.3s ease-out',
              cursor: 'pointer'
            }}
            onClick={() => removeNotification(notification.id)}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span style={{ fontSize: '16px', flexShrink: 0 }}>
                {getNotificationIcon(notification.type)}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#f1f5f9',
                  marginBottom: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>{notification.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#64748b',
                      fontSize: '14px',
                      cursor: 'pointer',
                      padding: '0',
                      width: '16px',
                      height: '16px'
                    }}
                  >
                    ×
                  </button>
                </div>
                <p style={{
                  margin: 0,
                  fontSize: '11px',
                  color: '#cbd5e1',
                  lineHeight: '1.4'
                }}>
                  {notification.message}
                </p>
                <div style={{
                  fontSize: '10px',
                  color: '#64748b',
                  marginTop: '4px'
                }}>
                  {new Date(notification.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Notification Settings */}
      <div className="notification-settings" style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9997
      }}>
        <button
          onClick={() => {
            // Toggle settings panel
            const panel = document.getElementById('notification-settings-panel');
            if (panel) {
              panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            }
          }}
          style={{
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.2s ease'
          }}
          className="btn-hover"
          title="Notification Settings"
        >
          🔔
        </button>

        {/* Settings Panel */}
        <div
          id="notification-settings-panel"
          style={{
            display: 'none',
            position: 'absolute',
            bottom: '60px',
            right: '0',
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '8px',
            padding: '16px',
            minWidth: '250px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
          }}
        >
          <h4 style={{
            margin: '0 0 12px 0',
            fontSize: '14px',
            fontWeight: '600',
            color: '#f1f5f9'
          }}>
            Notification Settings
          </h4>

          {permission === 'default' && (
            <div style={{
              background: '#334155',
              borderRadius: '4px',
              padding: '8px',
              marginBottom: '12px'
            }}>
              <p style={{
                margin: '0 0 8px 0',
                fontSize: '11px',
                color: '#cbd5e1'
              }}>
                Enable browser notifications for real-time alerts
              </p>
              <button
                onClick={requestPermission}
                style={{
                  background: '#38bdf8',
                  color: '#0f172a',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '6px 12px',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                Enable Notifications
              </button>
            </div>
          )}

          {Object.entries(settings).map(([key, value]) => (
            <label
              key={key}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
                cursor: 'pointer'
              }}
            >
              <span style={{
                fontSize: '12px',
                color: '#cbd5e1'
              }}>
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => updateSettings({ [key]: e.target.checked })}
                style={{
                  width: '16px',
                  height: '16px',
                  cursor: 'pointer'
                }}
              />
            </label>
          ))}

          <button
            onClick={clearAllNotifications}
            style={{
              background: 'transparent',
              color: '#64748b',
              border: '1px solid #334155',
              borderRadius: '4px',
              padding: '6px 12px',
              fontSize: '11px',
              cursor: 'pointer',
              width: '100%',
              marginTop: '8px'
            }}
          >
            Clear All Notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default PushNotifications;
