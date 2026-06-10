import React, { useState, useEffect, useMemo } from 'react';
import AnimatedCard from './AnimatedCard';
import AnimatedStatsCard from './AnimatedStatsCard';
import AnimatedButton from './AnimatedButton';
import LoadingSpinner from './LoadingSpinner';
import { colors, spacing, borderRadius, typography, transitions } from '../styles/designSystem';

const SecurityCenter = ({ 
  user, 
  securitySettings,
  onSecurityUpdate,
  isLoading = false 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [securityScore, setSecurityScore] = useState(0);
  const [complianceStatus, setComplianceStatus] = useState({});

  // Mock data for demonstration
  useEffect(() => {
    if (!isLoading) {
      setAuditLogs([
        {
          id: 1,
          timestamp: '2024-06-09 14:30:22',
          action: 'Login Successful',
          user: user?.displayName || user?.email,
          ip: '192.168.1.100',
          location: 'Austin, TX',
          device: 'Chrome on macOS',
          severity: 'info'
        },
        {
          id: 2,
          timestamp: '2024-06-09 14:25:15',
          action: 'Password Changed',
          user: user?.displayName || user?.email,
          ip: '192.168.1.100',
          location: 'Austin, TX',
          device: 'Chrome on macOS',
          severity: 'warning'
        },
        {
          id: 3,
          timestamp: '2024-06-09 14:20:08',
          action: '2FA Enabled',
          user: user?.displayName || user?.email,
          ip: '192.168.1.100',
          location: 'Austin, TX',
          device: 'Chrome on macOS',
          severity: 'success'
        },
        {
          id: 4,
          timestamp: '2024-06-09 14:15:33',
          action: 'Failed Login Attempt',
          user: 'unknown@example.com',
          ip: '185.220.101.182',
          location: 'Unknown',
          device: 'Unknown',
          severity: 'error'
        },
        {
          id: 5,
          timestamp: '2024-06-09 14:10:45',
          action: 'API Key Generated',
          user: user?.displayName || user?.email,
          ip: '192.168.1.100',
          location: 'Austin, TX',
          device: 'Chrome on macOS',
          severity: 'info'
        }
      ]);

      setActiveSessions([
        {
          id: 1,
          device: 'Chrome on macOS',
          ip: '192.168.1.100',
          location: 'Austin, TX',
          lastActive: '2 minutes ago',
          current: true
        },
        {
          id: 2,
          device: 'Safari on iPhone',
          ip: '192.168.1.101',
          location: 'Austin, TX',
          lastActive: '1 hour ago',
          current: false
        },
        {
          id: 3,
          device: 'Firefox on Windows',
          ip: '192.168.1.102',
          location: 'Houston, TX',
          lastActive: '3 days ago',
          current: false
        }
      ]);

      setSecurityScore(85);
      setComplianceStatus({
        gdpr: { compliant: true, lastUpdated: '2024-06-01' },
        ccpa: { compliant: true, lastUpdated: '2024-06-01' },
        soc2: { compliant: false, lastUpdated: '2024-05-15' },
        hipaa: { compliant: false, applicable: false }
      });
    }
  }, [isLoading, user]);

  // Calculate security score based on settings
  const calculateSecurityScore = () => {
    let score = 0;
    if (twoFactorEnabled) score += 25;
    if (securitySettings?.strongPassword) score += 20;
    if (securitySettings?.sessionTimeout) score += 15;
    if (securitySettings?.ipWhitelist) score += 15;
    if (securitySettings?.auditLogging) score += 15;
    if (securitySettings?.encryption) score += 10;
    return score;
  };

  // Get severity color
  const getSeverityColor = (severity) => {
    const colors = {
      info: colors.neutral[500],
      success: colors.success[500],
      warning: colors.warning[500],
      error: colors.error[500]
    };
    return colors[severity] || colors.neutral[500];
  };

  // Get severity background
  const getSeverityBackground = (severity) => {
    const backgrounds = {
      info: colors.neutral[100],
      success: colors.success[100],
      warning: colors.warning[100],
      error: colors.error[100]
    };
    return backgrounds[severity] || colors.neutral[100];
  };

  // Render security overview
  const renderOverview = () => (
    <div style={{ display: 'grid', gap: spacing[6] }}>
      {/* Security Score Card */}
      <AnimatedCard>
        <div style={{ textAlign: 'center', marginBottom: spacing[6] }}>
          <div style={{ 
            fontSize: typography.fontSize['4xl'],
            fontWeight: typography.fontWeight.bold,
            color: securityScore >= 80 ? colors.success[600] : securityScore >= 60 ? colors.warning[600] : colors.error[600],
            marginBottom: spacing[2]
          }}>
            {securityScore}%
          </div>
          <div style={{ 
            fontSize: typography.fontSize.lg,
            color: colors.neutral[600],
            marginBottom: spacing[4]
          }}>
            Security Score
          </div>
          
          {/* Security Score Progress */}
          <div style={{ 
            backgroundColor: colors.neutral[200],
            borderRadius: borderRadius.full,
            height: '12px',
            marginBottom: spacing[4]
          }}>
            <div style={{
              backgroundColor: securityScore >= 80 ? colors.success[500] : securityScore >= 60 ? colors.warning[500] : colors.error[500],
              borderRadius: borderRadius.full,
              height: '100%',
              width: securityScore + '%',
              transition: transitions.all
            }} />
          </div>
        </div>

        {/* Security Metrics Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: spacing[4]
        }}>
          <AnimatedStatsCard
            title="2FA Status"
            value={twoFactorEnabled ? 'Enabled' : 'Disabled'}
            icon="🔐"
            color={twoFactorEnabled ? colors.success : colors.error}
            size="sm"
          />
          
          <AnimatedStatsCard
            title="Active Sessions"
            value={activeSessions.length}
            icon="💻"
            color={colors.primary[600]}
            size="sm"
          />
          
          <AnimatedStatsCard
            title="Failed Logins (24h)"
            value="3"
            icon="⚠️"
            color={colors.warning}
            size="sm"
          />
          
          <AnimatedStatsCard
            title="Last Password Change"
            value="15 days ago"
            icon="🔑"
            color={colors.neutral[600]}
            size="sm"
          />
        </div>
      </AnimatedCard>

      {/* Security Recommendations */}
      <AnimatedCard>
        <h3 style={{ 
          fontSize: typography.fontSize.xl, 
          fontWeight: typography.fontWeight.bold,
          color: colors.neutral[900],
          marginBottom: spacing[4]
        }}>
          🔒 Security Recommendations
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
          {!twoFactorEnabled && (
            <div style={{
              padding: spacing[4],
              backgroundColor: colors.warning[50],
              borderRadius: borderRadius.lg,
              borderLeft: '4px solid ' + colors.warning[500]
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: spacing[2]
              }}>
                <h4 style={{ 
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.warning[900],
                  margin: 0
                }}>
                  Enable Two-Factor Authentication
                </h4>
                <AnimatedButton variant="primary" size="sm" onClick={() => setShow2FAModal(true)}>
                  Enable 2FA
                </AnimatedButton>
              </div>
              <p style={{ 
                fontSize: typography.fontSize.sm,
                color: colors.warning[700],
                margin: 0,
                lineHeight: 1.5
              }}>
                Add an extra layer of security to your account with 2FA. This significantly reduces the risk of unauthorized access.
              </p>
            </div>
          )}
          
          <div style={{
            padding: spacing[4],
            backgroundColor: colors.info[50],
            borderRadius: borderRadius.lg,
            borderLeft: '4px solid ' + colors.primary[500]
          }}>
            <h4 style={{ 
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.semibold,
              color: colors.primary[900],
              marginBottom: spacing[2]
            }}>
              Review Active Sessions
            </h4>
            <p style={{ 
              fontSize: typography.fontSize.sm,
              color: colors.primary[700],
              margin: 0,
              lineHeight: 1.5
            }}>
              You have {activeSessions.length} active sessions. Review and remove any unfamiliar devices.
            </p>
          </div>
        </div>
      </AnimatedCard>
    </div>
  );

  // Render 2FA setup
  const renderTwoFactorAuth = () => (
    <AnimatedCard>
      <h3 style={{ 
        fontSize: typography.fontSize.xl, 
        fontWeight: typography.fontWeight.bold,
        color: colors.neutral[900],
        marginBottom: spacing[4]
      }}>
        🔐 Two-Factor Authentication
      </h3>
      
      <div style={{ textAlign: 'center', marginBottom: spacing[6] }}>
        <div style={{ 
          fontSize: typography.fontSize['6xl'],
          marginBottom: spacing[4]
        }}>
          {twoFactorEnabled ? '✅' : '🔒'}
        </div>
        
        <h4 style={{ 
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.semibold,
          color: colors.neutral[900],
          marginBottom: spacing[2]
        }}>
          {twoFactorEnabled ? '2FA is Enabled' : '2FA is Disabled'}
        </h4>
        
        <p style={{ 
          fontSize: typography.fontSize.base,
          color: colors.neutral[600],
          marginBottom: spacing[6],
          lineHeight: 1.5
        }}>
          {twoFactorEnabled 
            ? 'Your account is protected with two-factor authentication. You can disable it at any time, but we recommend keeping it enabled.'
            : 'Enable two-factor authentication to add an extra layer of security to your account.'}
        </p>
        
        <AnimatedButton
          variant={twoFactorEnabled ? 'ghost' : 'primary'}
          onClick={() => twoFactorEnabled ? setTwoFactorEnabled(false) : setShow2FAModal(true)}
        >
          {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
        </AnimatedButton>
      </div>
      
      {twoFactorEnabled && (
        <div style={{
          padding: spacing[4],
          backgroundColor: colors.success[50],
          borderRadius: borderRadius.lg,
          border: '1px solid ' + colors.success[200]
        }}>
          <h5 style={{ 
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.semibold,
            color: colors.success[900],
            marginBottom: spacing[2]
          }}>
            Backup Codes
          </h5>
          <p style={{ 
            fontSize: typography.fontSize.sm,
            color: colors.success[700],
            marginBottom: spacing[3]
          }}>
            Save these backup codes in a secure location. You can use them to access your account if you lose your authentication device.
          </p>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: spacing[2],
            fontFamily: 'monospace',
            fontSize: typography.fontSize.sm
          }}>
            {['ABCD-1234', 'EFGH-5678', 'IJKL-9012', 'MNOP-3456', 'QRST-7890', 'UVWX-2345'].map(code => (
              <div key={code} style={{
                padding: spacing[2],
                backgroundColor: 'white',
                borderRadius: borderRadius.lg,
                border: '1px solid ' + colors.success[200],
                textAlign: 'center'
              }}>
                {code}
              </div>
            ))}
          </div>
        </div>
      )}
    </AnimatedCard>
  );

  // Render audit logs
  const renderAuditLogs = () => (
    <AnimatedCard>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: spacing[4]
      }}>
        <h3 style={{ 
          fontSize: typography.fontSize.xl, 
          fontWeight: typography.fontWeight.bold,
          color: colors.neutral[900],
          margin: 0
        }}>
          📋 Audit Logs
        </h3>
        <AnimatedButton variant="ghost" size="sm">
          Export Logs
        </AnimatedButton>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid ' + colors.neutral[200] }}>
              <th style={{ 
                textAlign: 'left', 
                padding: spacing[3], 
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.semibold,
                color: colors.neutral[700]
              }}>Timestamp</th>
              <th style={{ 
                textAlign: 'left', 
                padding: spacing[3], 
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.semibold,
                color: colors.neutral[700]
              }}>Action</th>
              <th style={{ 
                textAlign: 'left', 
                padding: spacing[3], 
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.semibold,
                color: colors.neutral[700]
              }}>User</th>
              <th style={{ 
                textAlign: 'left', 
                padding: spacing[3], 
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.semibold,
                color: colors.neutral[700]
              }}>IP Address</th>
              <th style={{ 
                textAlign: 'left', 
                padding: spacing[3], 
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.semibold,
                color: colors.neutral[700]
              }}>Location</th>
              <th style={{ 
                textAlign: 'left', 
                padding: spacing[3], 
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.semibold,
                color: colors.neutral[700]
              }}>Device</th>
              <th style={{ 
                textAlign: 'left', 
                padding: spacing[3], 
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.semibold,
                color: colors.neutral[700]
              }}>Severity</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log) => (
              <tr key={log.id} style={{ 
                borderBottom: '1px solid ' + colors.neutral[100],
                transition: transitions.colors
              }}>
                <td style={{ padding: spacing[3] }}>
                  <span style={{ 
                    fontSize: typography.fontSize.sm,
                    color: colors.neutral[900]
                  }}>
                    {log.timestamp}
                  </span>
                </td>
                <td style={{ padding: spacing[3] }}>
                  <span style={{ 
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium,
                    color: colors.neutral[900]
                  }}>
                    {log.action}
                  </span>
                </td>
                <td style={{ padding: spacing[3] }}>
                  <span style={{ 
                    fontSize: typography.fontSize.sm,
                    color: colors.neutral[600]
                  }}>
                    {log.user}
                  </span>
                </td>
                <td style={{ padding: spacing[3] }}>
                  <span style={{ 
                    fontSize: typography.fontSize.sm,
                    color: colors.neutral[600]
                  }}>
                    {log.ip}
                  </span>
                </td>
                <td style={{ padding: spacing[3] }}>
                  <span style={{ 
                    fontSize: typography.fontSize.sm,
                    color: colors.neutral[600]
                  }}>
                    {log.location}
                  </span>
                </td>
                <td style={{ padding: spacing[3] }}>
                  <span style={{ 
                    fontSize: typography.fontSize.sm,
                    color: colors.neutral[600]
                  }}>
                    {log.device}
                  </span>
                </td>
                <td style={{ padding: spacing[3] }}>
                  <span style={{
                    fontSize: typography.fontSize.xs,
                    padding: spacing[1] + 'px ' + spacing[2] + 'px',
                    borderRadius: borderRadius.full,
                    backgroundColor: getSeverityBackground(log.severity),
                    color: getSeverityColor(log.severity),
                    fontWeight: typography.fontWeight.medium,
                    textTransform: 'capitalize'
                  }}>
                    {log.severity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AnimatedCard>
  );

  // Render active sessions
  const renderActiveSessions = () => (
    <AnimatedCard>
      <h3 style={{ 
        fontSize: typography.fontSize.xl, 
        fontWeight: typography.fontWeight.bold,
        color: colors.neutral[900],
        marginBottom: spacing[4]
      }}>
        💻 Active Sessions
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
        {activeSessions.map((session) => (
          <div key={session.id} style={{
            padding: spacing[4],
            border: '1px solid ' + (session.current ? colors.primary[300] : colors.neutral[200]),
            borderRadius: borderRadius.lg,
            backgroundColor: session.current ? colors.primary[50] : colors.neutral[50]
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              marginBottom: spacing[2]
            }}>
              <div>
                <h4 style={{ 
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.neutral[900],
                  marginBottom: spacing[1]
                }}>
                  {session.device}
                  {session.current && (
                    <span style={{
                      fontSize: typography.fontSize.xs,
                      backgroundColor: colors.primary[500],
                      color: 'white',
                      padding: spacing[1] + 'px ' + spacing[2] + 'px',
                      borderRadius: borderRadius.full,
                      marginLeft: spacing[2]
                    }}>
                      Current
                    </span>
                  )}
                </h4>
                <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                  <div>IP: {session.ip}</div>
                  <div>Location: {session.location}</div>
                  <div>Last active: {session.lastActive}</div>
                </div>
              </div>
              
              {!session.current && (
                <AnimatedButton variant="ghost" size="sm" style={{ color: colors.error[600] }}>
                  Terminate
                </AnimatedButton>
              )}
            </div>
          </div>
        ))}
      </div>
    </AnimatedCard>
  );

  // Render compliance status
  const renderCompliance = () => (
    <div style={{ display: 'grid', gap: spacing[6] }}>
      <AnimatedCard>
        <h3 style={{ 
          fontSize: typography.fontSize.xl, 
          fontWeight: typography.fontWeight.bold,
          color: colors.neutral[900],
          marginBottom: spacing[4]
        }}>
          🛡️ Compliance Status
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: spacing[4]
        }}>
          {Object.entries(complianceStatus).map(([framework, status]) => (
            <div key={framework} style={{
              padding: spacing[4],
              border: '1px solid ' + colors.neutral[200],
              borderRadius: borderRadius.lg,
              backgroundColor: colors.neutral[50]
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: spacing[2]
              }}>
                <h4 style={{ 
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.neutral[900],
                  margin: 0
                }}>
                  {framework.toUpperCase()}
                </h4>
                <span style={{
                  fontSize: typography.fontSize.sm,
                  padding: spacing[1] + 'px ' + spacing[2] + 'px',
                  borderRadius: borderRadius.full,
                  backgroundColor: status.compliant ? colors.success[100] : colors.error[100],
                  color: status.compliant ? colors.success[700] : colors.error[700],
                  fontWeight: typography.fontWeight.medium
                }}>
                  {status.compliant ? 'Compliant' : 'Non-Compliant'}
                </span>
              </div>
              
              <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                <div>Last updated: {status.lastUpdated}</div>
                {!status.applicable && <div>Not applicable</div>}
              </div>
            </div>
          ))}
        </div>
      </AnimatedCard>

      <AnimatedCard>
        <h3 style={{ 
          fontSize: typography.fontSize.xl, 
          fontWeight: typography.fontWeight.bold,
          color: colors.neutral[900],
          marginBottom: spacing[4]
        }}>
          📄 Data Processing Records
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
          <div style={{
            padding: spacing[4],
            backgroundColor: colors.neutral[50],
            borderRadius: borderRadius.lg,
            border: '1px solid ' + colors.neutral[200]
          }}>
            <h4 style={{ 
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.semibold,
              color: colors.neutral[900],
              marginBottom: spacing[2]
            }}>
              Data Collection & Processing
            </h4>
            <ul style={{ 
              fontSize: typography.fontSize.sm, 
              color: colors.neutral[600],
              margin: 0,
              paddingLeft: spacing[4]
            }}>
              <li>Personal data is collected only with explicit consent</li>
              <li>Data is encrypted at rest and in transit</li>
              <li>Users can request data deletion at any time</li>
              <li>Regular security audits and penetration testing</li>
            </ul>
          </div>
          
          <div style={{
            padding: spacing[4],
            backgroundColor: colors.neutral[50],
            borderRadius: borderRadius.lg,
            border: '1px solid ' + colors.neutral[200]
          }}>
            <h4 style={{ 
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.semibold,
              color: colors.neutral[900],
              marginBottom: spacing[2]
            }}>
              Third-Party Services
            </h4>
            <ul style={{ 
              fontSize: typography.fontSize.sm, 
              color: colors.neutral[600],
              margin: 0,
              paddingLeft: spacing[4]
            }}>
              <li>Firebase (Authentication & Database)</li>
              <li>Stripe (Payment Processing)</li>
              <li>SendGrid (Email Services)</li>
              <li>Vercel (Hosting & CDN)</li>
            </ul>
          </div>
        </div>
      </AnimatedCard>
    </div>
  );

  // Render 2FA modal
  const render2FAModal = () => {
    if (!show2FAModal) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: spacing[4]
      }}
      onClick={() => setShow2FAModal(false)}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: borderRadius.xl,
          padding: spacing[6],
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center'
        }}
        onClick={(e) => e.stopPropagation()}>
          <div style={{ 
            fontSize: typography.fontSize['4xl'],
            marginBottom: spacing[4]
          }}>
            📱
          </div>
          
          <h3 style={{ 
            fontSize: typography.fontSize.xl,
            fontWeight: typography.fontWeight.bold,
            color: colors.neutral[900],
            marginBottom: spacing[2]
          }}>
            Enable Two-Factor Authentication
          </h3>
          
          <p style={{ 
            fontSize: typography.fontSize.base,
            color: colors.neutral[600],
            marginBottom: spacing[6],
            lineHeight: 1.5
          }}>
            Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.) to enable 2FA.
          </p>
          
          <div style={{
            width: '200px',
            height: '200px',
            backgroundColor: colors.neutral[100],
            border: '2px solid ' + colors.neutral[300],
            borderRadius: borderRadius.lg,
            margin: '0 auto ' + spacing[4] + 'px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: typography.fontSize.sm,
            color: colors.neutral[600]
          }}>
            QR Code Placeholder
          </div>
          
          <div style={{
            padding: spacing[3],
            backgroundColor: colors.neutral[100],
            borderRadius: borderRadius.lg,
            fontFamily: 'monospace',
            fontSize: typography.fontSize.sm,
            marginBottom: spacing[6]
          }}>
            ABCD-EFGH-IJKL-MNOP
          </div>
          
          <div style={{ display: 'flex', gap: spacing[3] }}>
            <AnimatedButton
              variant="ghost"
              onClick={() => setShow2FAModal(false)}
            >
              Cancel
            </AnimatedButton>
            <AnimatedButton
              variant="primary"
              onClick={() => {
                setTwoFactorEnabled(true);
                setShow2FAModal(false);
                window.showNotification?.('success', '2FA enabled successfully!', 'Security');
              }}
            >
              Verify & Enable
            </AnimatedButton>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        flexDirection: 'column',
        gap: spacing[4]
      }}>
        <LoadingSpinner size="lg" />
        <div style={{ color: colors.neutral[500], fontSize: typography.fontSize.lg }}>
          Loading security center...
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: spacing[6], 
      backgroundColor: colors.neutral[50],
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ 
        marginBottom: spacing[8], 
        textAlign: 'center' 
      }}>
        <h1 style={{ 
          fontSize: typography.fontSize['4xl'], 
          fontWeight: typography.fontWeight.bold,
          color: colors.neutral[900],
          marginBottom: spacing[2]
        }}>
          🔒 Security Center
        </h1>
        <p style={{ 
          fontSize: typography.fontSize.lg, 
          color: colors.neutral[600],
          marginBottom: spacing[6]
        }}>
          Manage your account security and compliance settings
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: spacing[2], 
        justifyContent: 'center',
        marginBottom: spacing[8],
        flexWrap: 'wrap'
      }}>
        <AnimatedButton
          variant={activeTab === 'overview' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('overview')}
          style={{
            borderRadius: borderRadius.lg,
            padding: spacing[3] + 'px ' + spacing[4] + 'px'
          }}
        >
          📊 Overview
        </AnimatedButton>
        <AnimatedButton
          variant={activeTab === '2fa' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('2fa')}
          style={{
            borderRadius: borderRadius.lg,
            padding: spacing[3] + 'px ' + spacing[4] + 'px'
          }}
        >
          🔐 2FA
        </AnimatedButton>
        <AnimatedButton
          variant={activeTab === 'audit' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('audit')}
          style={{
            borderRadius: borderRadius.lg,
            padding: spacing[3] + 'px ' + spacing[4] + 'px'
          }}
        >
          📋 Audit Logs
        </AnimatedButton>
        <AnimatedButton
          variant={activeTab === 'sessions' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('sessions')}
          style={{
            borderRadius: borderRadius.lg,
            padding: spacing[3] + 'px ' + spacing[4] + 'px'
          }}
        >
          💻 Sessions
        </AnimatedButton>
        <AnimatedButton
          variant={activeTab === 'compliance' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('compliance')}
          style={{
            borderRadius: borderRadius.lg,
            padding: spacing[3] + 'px ' + spacing[4] + 'px'
          }}
        >
          🛡️ Compliance
        </AnimatedButton>
      </div>

      {/* Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === '2fa' && renderTwoFactorAuth()}
      {activeTab === 'audit' && renderAuditLogs()}
      {activeTab === 'sessions' && renderActiveSessions()}
      {activeTab === 'compliance' && renderCompliance()}

      {/* 2FA Modal */}
      {render2FAModal()}
    </div>
  );
};

export default SecurityCenter;
