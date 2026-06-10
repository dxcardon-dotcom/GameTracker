import React, { useState, useEffect, useRef, useCallback } from 'react';
import { colors, spacing, borderRadius, transitions, typography } from '../styles/designSystem';

const RealTimeCollaboration = ({ 
  gameId, 
  userId, 
  userName, 
  onCollaboratorJoin, 
  onCollaboratorLeave,
  onSharedAction 
}) => {
  const [collaborators, setCollaborators] = useState(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const heartbeatIntervalRef = useRef(null);

  // WebSocket connection management
  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    setConnectionStatus('connecting');
    
    // In production, use your WebSocket server URL
    const wsUrl = `ws://localhost:8080/collaborate/${gameId}?userId=${userId}&userName=${encodeURIComponent(userName)}`;
    
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setConnectionStatus('connected');
        console.log('Connected to collaboration server');
        
        // Start heartbeat
        startHeartbeat();
        
        // Send initial presence
        sendPresenceUpdate();
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          handleWebSocketMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        setConnectionStatus('disconnected');
        console.log('Disconnected from collaboration server');
        
        // Clear heartbeat
        stopHeartbeat();
        
        // Attempt reconnection
        scheduleReconnect();
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('error');
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionStatus('error');
      scheduleReconnect();
    }
  }, [gameId, userId, userName]);

  // Heartbeat to keep connection alive
  const startHeartbeat = () => {
    heartbeatIntervalRef.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'heartbeat' }));
      }
    }, 30000); // 30 seconds
  };

  const stopHeartbeat = () => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  };

  // Reconnection logic
  const scheduleReconnect = () => {
    if (reconnectTimeoutRef.current) return;
    
    reconnectTimeoutRef.current = setTimeout(() => {
      reconnectTimeoutRef.current = null;
      connectWebSocket();
    }, 5000); // Reconnect after 5 seconds
  };

  // Send presence update
  const sendPresenceUpdate = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'presence',
        data: {
          userId,
          userName,
          timestamp: Date.now(),
          cursor: null // Will be updated by mouse movement
        }
      }));
    }
  }, [userId, userName]);

  // Handle incoming WebSocket messages
  const handleWebSocketMessage = (message) => {
    const { type, data } = message;

    switch (type) {
      case 'presence':
        handlePresenceUpdate(data);
        break;
      case 'cursor':
        handleCursorUpdate(data);
        break;
      case 'action':
        handleSharedAction(data);
        break;
      case 'user_joined':
        handleUserJoined(data);
        break;
      case 'user_left':
        handleUserLeft(data);
        break;
      case 'heartbeat_response':
        // Heartbeat received, connection is stable
        break;
      default:
        console.log('Unknown message type:', type);
    }
  };

  // Handle presence updates
  const handlePresenceUpdate = (data) => {
    setCollaborators(prev => {
      const newCollaborators = new Map(prev);
      if (data.timestamp > (newCollaborators.get(data.userId)?.timestamp || 0)) {
        newCollaborators.set(data.userId, data);
      }
      return newCollaborators;
    });
  };

  // Handle cursor updates
  const handleCursorUpdate = (data) => {
    setCollaborators(prev => {
      const newCollaborators = new Map(prev);
      const existing = newCollaborators.get(data.userId);
      if (existing) {
        newCollaborators.set(data.userId, {
          ...existing,
          cursor: data.cursor,
          timestamp: data.timestamp
        });
      }
      return newCollaborators;
    });
  };

  // Handle shared actions
  const handleSharedAction = (data) => {
    if (onSharedAction) {
      onSharedAction(data);
    }
  };

  // Handle user joining
  const handleUserJoined = (data) => {
    setCollaborators(prev => {
      const newCollaborators = new Map(prev);
      newCollaborators.set(data.userId, data);
      return newCollaborators;
    });
    
    if (onCollaboratorJoin) {
      onCollaboratorJoin(data);
    }
  };

  // Handle user leaving
  const handleUserLeft = (data) => {
    setCollaborators(prev => {
      const newCollaborators = new Map(prev);
      newCollaborators.delete(data.userId);
      return newCollaborators;
    });
    
    if (onCollaboratorLeave) {
      onCollaboratorLeave(data);
    }
  };

  // Send cursor position
  const sendCursorPosition = useCallback((x, y, element) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'cursor',
        data: {
          userId,
          x,
          y,
          element,
          timestamp: Date.now()
        }
      }));
    }
  }, [userId]);

  // Send shared action
  const sendSharedAction = useCallback((actionType, actionData) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'action',
        data: {
          userId,
          userName,
          actionType,
          actionData,
          timestamp: Date.now()
        }
      }));
    }
  }, [userId, userName]);

  // Initialize connection
  useEffect(() => {
    connectWebSocket();

    return () => {
      // Cleanup
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      stopHeartbeat();
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connectWebSocket]);

  // Render collaborator cursors
  const renderCollaboratorCursors = () => {
    return Array.from(collaborators.values()).map(collaborator => {
      if (collaborator.userId === userId || !collaborator.cursor) return null;

      return (
        <div
          key={collaborator.userId}
          style={{
            position: 'fixed',
            left: collaborator.cursor.x,
            top: collaborator.cursor.y,
            pointerEvents: 'none',
            zIndex: 9999,
            transition: 'all 0.1s ease-out'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[1],
            backgroundColor: collaborator.color || colors.primary[600],
            color: 'white',
            padding: `${spacing[1]} ${spacing[2]}`,
            borderRadius: borderRadius.lg,
            fontSize: typography.fontSize.xs,
            fontWeight: typography.fontWeight.medium,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              backgroundColor: 'white',
              borderRadius: '50%',
              opacity: 0.8
            }} />
            {collaborator.userName}
          </div>
        </div>
      );
    });
  };

  // Connection status indicator
  const renderConnectionStatus = () => {
    const statusColors = {
      connected: colors.success,
      connecting: colors.warning,
      disconnected: colors.neutral[500],
      error: colors.error
    };

    const statusText = {
      connected: 'Connected',
      connecting: 'Connecting...',
      disconnected: 'Disconnected',
      error: 'Connection Error'
    };

    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing[2],
        padding: spacing[2],
        backgroundColor: colors.neutral[100],
        borderRadius: borderRadius.lg,
        fontSize: typography.fontSize.sm
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: statusColors[connectionStatus],
          animation: connectionStatus === 'connecting' ? 'pulse 1.5s infinite' : 'none'
        }} />
        <span style={{ color: colors.neutral[700] }}>
          {statusText[connectionStatus]}
        </span>
        {collaborators.size > 0 && (
          <span style={{ color: colors.neutral[500] }}>
            • {collaborators.size} collaborator{collaborators.size !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    );
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Connection Status */}
      {renderConnectionStatus()}
      
      {/* Collaborator List */}
      {collaborators.size > 0 && (
        <div style={{
          position: 'fixed',
          top: spacing[4],
          right: spacing[4],
          backgroundColor: 'white',
          borderRadius: borderRadius.xl,
          padding: spacing[4],
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          zIndex: 1000,
          minWidth: '200px'
        }}>
          <h4 style={{
            margin: `0 0 ${spacing[3]} 0`,
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.semibold,
            color: colors.neutral[900]
          }}>
            Active Collaborators
          </h4>
          {Array.from(collaborators.values()).map(collaborator => (
            <div key={collaborator.userId} style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
              padding: `${spacing[2]} 0`,
              borderBottom: collaborator.userId !== Array.from(collaborators.keys()).pop() ? `1px solid ${colors.neutral[200]}` : 'none'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: collaborator.color || colors.primary[600]
              }} />
              <span style={{
                fontSize: typography.fontSize.sm,
                color: colors.neutral[700],
                fontWeight: collaborator.userId === userId ? typography.fontWeight.semibold : typography.fontWeight.normal
              }}>
                {collaborator.userName}
                {collaborator.userId === userId && ' (You)'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Collaborator Cursors */}
      {renderCollaboratorCursors()}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

// Hook for easy usage
export const useRealTimeCollaboration = (gameId, userId, userName) => {
  const [collaborators, setCollaborators] = useState(new Map());
  const [lastAction, setLastAction] = useState(null);

  const handleCollaboratorJoin = (data) => {
    console.log('Collaborator joined:', data);
  };

  const handleCollaboratorLeave = (data) => {
    console.log('Collaborator left:', data);
  };

  const handleSharedAction = (data) => {
    console.log('Shared action received:', data);
    setLastAction(data);
  };

  return {
    collaborators,
    lastAction,
    onCollaboratorJoin: handleCollaboratorJoin,
    onCollaboratorLeave: handleCollaboratorLeave,
    onSharedAction: handleSharedAction
  };
};

export default RealTimeCollaboration;
