import React, { useState, useEffect, useMemo } from 'react';
import AnimatedCard from './AnimatedCard';
import AnimatedStatsCard from './AnimatedStatsCard';
import AnimatedButton from './AnimatedButton';
import LoadingSpinner from './LoadingSpinner';
import { colors, spacing, borderRadius, typography, transitions } from '../styles/designSystem';

const AdminDashboard = ({ 
  user, 
  adminData, 
  isLoading = false 
}) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [users, setUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [systemHealth, setSystemHealth] = useState({});

  // Mock data for demonstration
  useEffect(() => {
    if (!isLoading) {
      // Simulate API calls
      setUsers([
        { id: 1, name: 'John Doe', email: 'john@example.com', plan: 'pro', joined: '2024-01-15', lastActive: '2024-06-09', games: 45, status: 'active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', plan: 'free', joined: '2024-02-20', lastActive: '2024-06-08', games: 12, status: 'active' },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', plan: 'pro', joined: '2024-03-10', lastActive: '2024-06-07', games: 67, status: 'active' },
        { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', plan: 'enterprise', joined: '2024-01-05', lastActive: '2024-06-09', games: 89, status: 'active' },
        { id: 5, name: 'Tom Brown', email: 'tom@example.com', plan: 'free', joined: '2024-04-15', lastActive: '2024-05-20', games: 8, status: 'inactive' },
      ]);

      setOrganizations([
        { id: 1, name: 'Springfield High School', teams: 3, users: 12, plan: 'enterprise', created: '2024-01-10', status: 'active' },
        { id: 2, name: 'Riverside Baseball Club', teams: 2, users: 8, plan: 'pro', created: '2024-02-15', status: 'active' },
        { id: 3, name: 'Thunder Softball Academy', teams: 1, users: 4, plan: 'pro', created: '2024-03-20', status: 'active' },
      ]);

      setRevenue([
        { month: '2024-01', revenue: 4500, subscriptions: 15, newUsers: 12 },
        { month: '2024-02', revenue: 6200, subscriptions: 20, newUsers: 18 },
        { month: '2024-03', revenue: 8900, subscriptions: 28, newUsers: 25 },
        { month: '2024-04', revenue: 10200, subscriptions: 35, newUsers: 22 },
        { month: '2024-05', revenue: 12800, subscriptions: 42, newUsers: 31 },
        { month: '2024-06', revenue: 11500, subscriptions: 40, newUsers: 28 },
      ]);

      setSystemHealth({
        uptime: '99.9%',
        responseTime: '145ms',
        errorRate: '0.12%',
        activeConnections: 1247,
        databaseSize: '2.4GB',
        lastBackup: '2024-06-09 02:00:00'
      });
    }
  }, [isLoading]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const proUsers = users.filter(u => u.plan === 'pro').length;
    const enterpriseUsers = users.filter(u => u.plan === 'enterprise').length;
    const totalRevenue = revenue.reduce((sum, r) => sum + r.revenue, 0);
    const monthlyRevenue = revenue[revenue.length - 1]?.revenue || 0;
    const totalOrganizations = organizations.length;
    const totalTeams = organizations.reduce((sum, org) => sum + org.teams, 0);

    return {
      totalUsers,
      activeUsers,
      proUsers,
      enterpriseUsers,
      totalRevenue,
      monthlyRevenue,
      totalOrganizations,
      totalTeams,
      userGrowth: users.filter(u => new Date(u.joined) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
      revenueGrowth: revenue.length > 1 ? 
        ((revenue[revenue.length - 1].revenue - revenue[revenue.length - 2].revenue) / revenue[revenue.length - 2].revenue * 100) : 0
    };
  }, [users, revenue, organizations]);

  const sections = [
    { id: 'overview', label: '📊 Overview', icon: '📊' },
    { id: 'users', label: '👥 Users', icon: '👥' },
    { id: 'organizations', label: '🏢 Organizations', icon: '🏢' },
    { id: 'revenue', label: '💰 Revenue', icon: '💰' },
    { id: 'system', label: '⚙️ System Health', icon: '⚙️' },
    { id: 'security', label: '🔒 Security', icon: '🔒' },
    { id: 'support', label: '🎫 Support', icon: '🎫' },
  ];

  const periods = [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' },
    { id: '1y', label: '1 Year' },
  ];

  const renderOverview = () => (
    <div style={{ display: 'grid', gap: spacing[6] }}>
      {/* Key Metrics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: spacing[6]
      }}>
        <AnimatedStatsCard
          title="Total Users"
          value={metrics.totalUsers}
          subtitle={`${metrics.userGrowth} new this month`}
          trend={12.5}
          icon="👥"
          color={colors.primary[600]}
          size="md"
        />
        
        <AnimatedStatsCard
          title="Active Users"
          value={metrics.activeUsers}
          subtitle={`${Math.round(metrics.activeUsers / metrics.totalUsers * 100)}% of total`}
          trend={8.3}
          icon="✅"
          color={colors.success}
          size="md"
        />
        
        <AnimatedStatsCard
          title="Monthly Revenue"
          value={`$${metrics.monthlyRevenue.toLocaleString()}`}
          subtitle={`${metrics.proUsers + metrics.enterpriseUsers} paying users`}
          trend={metrics.revenueGrowth}
          icon="💰"
          color={colors.warning}
          size="md"
        />
        
        <AnimatedStatsCard
          title="Organizations"
          value={metrics.totalOrganizations}
          subtitle={`${metrics.totalTeams} total teams`}
          trend={15.2}
          icon="🏢"
          color={colors.error}
          size="md"
        />
      </div>

      {/* Charts Section */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: spacing[6]
      }}>
        <AnimatedCard>
          <h3 style={{ 
            fontSize: typography.fontSize.xl, 
            fontWeight: typography.fontWeight.bold,
            color: colors.neutral[900],
            marginBottom: spacing[4]
          }}>
            📈 Revenue Trend
          </h3>
          <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: spacing[2] }}>
            {revenue.map((month, index) => (
              <div key={index} style={{ 
                flex: 1, 
                backgroundColor: colors.primary[500],
                borderRadius: borderRadius.lg,
                height: `${(month.revenue / Math.max(...revenue.map(r => r.revenue))) * 100}%`,
                position: 'relative',
                cursor: 'pointer'
              }}
              title={`${month.month}: $${month.revenue.toLocaleString()}`}>
                <div style={{
                  position: 'absolute',
                  bottom: '-25px',
                  left: 0,
                  right: 0,
                  textAlign: 'center',
                  fontSize: typography.fontSize.xs,
                  color: colors.neutral[600]
                }}>
                  {month.month.slice(-2)}
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
            🎯 User Distribution
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%', 
                backgroundColor: colors.neutral[400] 
              }} />
              <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[700] }}>Free</span>
              <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold, color: colors.neutral[900] }}>
                {users.filter(u => u.plan === 'free').length}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%', 
                backgroundColor: colors.primary[500] 
              }} />
              <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[700] }}>Pro</span>
              <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold, color: colors.neutral[900] }}>
                {metrics.proUsers}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%', 
                backgroundColor: colors.warning[500] 
              }} />
              <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[700] }}>Enterprise</span>
              <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold, color: colors.neutral[900] }}>
                {metrics.enterpriseUsers}
              </span>
            </div>
          </div>
        </AnimatedCard>
      </div>
    </div>
  );

  const renderUsers = () => (
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
          👥 User Management
        </h3>
        <AnimatedButton variant="primary" size="sm">
          + Add User
        </AnimatedButton>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${colors.neutral[200]}` }}>
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
              }}>Plan</th>
              <th style={{ 
                textAlign: 'left', 
                padding: spacing[3], 
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.semibold,
                color: colors.neutral[700]
              }}>Games</th>
              <th style={{ 
                textAlign: 'left', 
                padding: spacing[3], 
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.semibold,
                color: colors.neutral[700]
              }}>Joined</th>
              <th style={{ 
                textAlign: 'left', 
                padding: spacing[3], 
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.semibold,
                color: colors.neutral[700]
              }}>Last Active</th>
              <th style={{ 
                textAlign: 'left', 
                padding: spacing[3], 
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.semibold,
                color: colors.neutral[700]
              }}>Status</th>
              <th style={{ 
                textAlign: 'left', 
                padding: spacing[3], 
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.semibold,
                color: colors.neutral[700]
              }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ 
                borderBottom: `1px solid ${colors.neutral[100]}`,
                transition: transitions.colors
              }}>
                <td style={{ padding: spacing[3] }}>
                  <div>
                    <div style={{ 
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.medium,
                      color: colors.neutral[900]
                    }}>
                      {user.name}
                    </div>
                    <div style={{ 
                      fontSize: typography.fontSize.xs,
                      color: colors.neutral[500]
                    }}>
                      {user.email}
                    </div>
                  </div>
                </td>
                <td style={{ padding: spacing[3] }}>
                  <span style={{
                    fontSize: typography.fontSize.xs,
                    padding: spacing[1] + 'px ' + spacing[2] + 'px',
                    borderRadius: borderRadius.full,
                    backgroundColor: 
                      user.plan === 'enterprise' ? colors.warning[100] :
                      user.plan === 'pro' ? colors.primary[100] :
                      colors.neutral[100],
                    color: 
                      user.plan === 'enterprise' ? colors.warning[700] :
                      user.plan === 'pro' ? colors.primary[700] :
                      colors.neutral[700],
                    fontWeight: typography.fontWeight.medium
                  }}>
                    {user.plan.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: spacing[3] }}>
                  <span style={{ 
                    fontSize: typography.fontSize.sm,
                    color: colors.neutral[900]
                  }}>
                    {user.games}
                  </span>
                </td>
                <td style={{ padding: spacing[3] }}>
                  <span style={{ 
                    fontSize: typography.fontSize.sm,
                    color: colors.neutral[600]
                  }}>
                    {user.joined}
                  </span>
                </td>
                <td style={{ padding: spacing[3] }}>
                  <span style={{ 
                    fontSize: typography.fontSize.sm,
                    color: colors.neutral[600]
                  }}>
                    {user.lastActive}
                  </span>
                </td>
                <td style={{ padding: spacing[3] }}>
                  <span style={{
                    fontSize: typography.fontSize.xs,
                    padding: spacing[1] + 'px ' + spacing[2] + 'px',
                    borderRadius: borderRadius.full,
                    backgroundColor: user.status === 'active' ? colors.success[100] : colors.neutral[100],
                    color: user.status === 'active' ? colors.success[700] : colors.neutral[700],
                    fontWeight: typography.fontWeight.medium
                  }}>
                    {user.status}
                  </span>
                </td>
                <td style={{ padding: spacing[3] }}>
                  <div style={{ display: 'flex', gap: spacing[2] }}>
                    <AnimatedButton variant="ghost" size="sm">
                      Edit
                    </AnimatedButton>
                    <AnimatedButton variant="ghost" size="sm">
                      View
                    </AnimatedButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AnimatedCard>
  );

  const renderOrganizations = () => (
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
          🏢 Organization Management
        </h3>
        <AnimatedButton variant="primary" size="sm">
          + Add Organization
        </AnimatedButton>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: spacing[4]
      }}>
        {organizations.map((org) => (
          <div key={org.id} style={{
            padding: spacing[4],
            border: `1px solid ${colors.neutral[200]}`,
            borderRadius: borderRadius.lg,
            backgroundColor: colors.neutral[50]
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              marginBottom: spacing[3]
            }}>
              <h4 style={{ 
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.semibold,
                color: colors.neutral[900],
                margin: 0
              }}>
                {org.name}
              </h4>
              <span style={{
                fontSize: typography.fontSize.xs,
                padding: spacing[1] + 'px ' + spacing[2] + 'px',
                borderRadius: borderRadius.full,
                backgroundColor: org.status === 'active' ? colors.success[100] : colors.neutral[100],
                color: org.status === 'active' ? colors.success[700] : colors.neutral[700],
                fontWeight: typography.fontWeight.medium
              }}>
                {org.status}
              </span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>Teams:</span>
                <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: colors.neutral[900] }}>
                  {org.teams}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>Users:</span>
                <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: colors.neutral[900] }}>
                  {org.users}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>Plan:</span>
                <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: colors.neutral[900] }}>
                  {org.plan}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>Created:</span>
                <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                  {org.created}
                </span>
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              gap: spacing[2], 
              marginTop: spacing[3]
            }}>
              <AnimatedButton variant="ghost" size="sm">
                Manage
              </AnimatedButton>
              <AnimatedButton variant="ghost" size="sm">
                View
              </AnimatedButton>
            </div>
          </div>
        ))}
      </div>
    </AnimatedCard>
  );

  const renderRevenue = () => (
    <div style={{ display: 'grid', gap: spacing[6] }}>
      <AnimatedCard>
        <h3 style={{ 
          fontSize: typography.fontSize.xl, 
          fontWeight: typography.fontWeight.bold,
          color: colors.neutral[900],
          marginBottom: spacing[4]
        }}>
          💰 Revenue Analytics
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: spacing[4],
          marginBottom: spacing[6]
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: typography.fontSize['2xl'],
              fontWeight: typography.fontWeight.bold,
              color: colors.neutral[900]
            }}>
              ${metrics.totalRevenue.toLocaleString()}
            </div>
            <div style={{ 
              fontSize: typography.fontSize.sm,
              color: colors.neutral[600]
            }}>
              Total Revenue
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: typography.fontSize['2xl'],
              fontWeight: typography.fontWeight.bold,
              color: colors.success
            }}>
              ${metrics.monthlyRevenue.toLocaleString()}
            </div>
            <div style={{ 
              fontSize: typography.fontSize.sm,
              color: colors.neutral[600]
            }}>
              Monthly Revenue
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: typography.fontSize['2xl'],
              fontWeight: typography.fontWeight.bold,
              color: colors.primary[600]
            }}>
              {metrics.proUsers + metrics.enterpriseUsers}
            </div>
            <div style={{ 
              fontSize: typography.fontSize.sm,
              color: colors.neutral[600]
            }}>
              Paying Users
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: typography.fontSize['2xl'],
              fontWeight: typography.fontWeight.bold,
              color: colors.warning
            }}>
              ${Math.round(metrics.monthlyRevenue / (metrics.proUsers + metrics.enterpriseUsers))}
            </div>
            <div style={{ 
              fontSize: typography.fontSize.sm,
              color: colors.neutral[600]
            }}>
              ARPU
            </div>
          </div>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${colors.neutral[200]}` }}>
                <th style={{ 
                  textAlign: 'left', 
                  padding: spacing[3], 
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.neutral[700]
                }}>Month</th>
                <th style={{ 
                  textAlign: 'left', 
                  padding: spacing[3], 
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.neutral[700]
                }}>Revenue</th>
                <th style={{ 
                  textAlign: 'left', 
                  padding: spacing[3], 
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.neutral[700]
                }}>Subscriptions</th>
                <th style={{ 
                  textAlign: 'left', 
                  padding: spacing[3], 
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.neutral[700]
                }}>New Users</th>
                <th style={{ 
                  textAlign: 'left', 
                  padding: spacing[3], 
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.neutral[700]
                }}>Growth</th>
              </tr>
            </thead>
            <tbody>
              {revenue.map((month, index) => {
                const prevRevenue = index > 0 ? revenue[index - 1].revenue : month.revenue;
                const growth = ((month.revenue - prevRevenue) / prevRevenue * 100).toFixed(1);
                
                return (
                  <tr key={month.month} style={{ 
                    borderBottom: `1px solid ${colors.neutral[100]}`
                  }}>
                    <td style={{ padding: spacing[3] }}>
                      <span style={{ 
                        fontSize: typography.fontSize.sm,
                        color: colors.neutral[900]
                      }}>
                        {month.month}
                      </span>
                    </td>
                    <td style={{ padding: spacing[3] }}>
                      <span style={{ 
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.medium,
                        color: colors.neutral[900]
                      }}>
                        ${month.revenue.toLocaleString()}
                      </span>
                    </td>
                    <td style={{ padding: spacing[3] }}>
                      <span style={{ 
                        fontSize: typography.fontSize.sm,
                        color: colors.neutral[600]
                      }}>
                        {month.subscriptions}
                      </span>
                    </td>
                    <td style={{ padding: spacing[3] }}>
                      <span style={{ 
                        fontSize: typography.fontSize.sm,
                        color: colors.neutral[600]
                      }}>
                        {month.newUsers}
                      </span>
                    </td>
                    <td style={{ padding: spacing[3] }}>
                      <span style={{
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.medium,
                        color: growth > 0 ? colors.success : colors.error
                      }}>
                        {growth > 0 ? '+' : ''}{growth}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </AnimatedCard>
    </div>
  );

  const renderSystemHealth = () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
      gap: spacing[6]
    }}>
      <AnimatedCard>
        <h3 style={{ 
          fontSize: typography.fontSize.xl, 
          fontWeight: typography.fontWeight.bold,
          color: colors.neutral[900],
          marginBottom: spacing[4]
        }}>
          ⚙️ System Performance
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>Uptime</span>
            <span style={{ 
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.bold,
              color: colors.success
            }}>
              {systemHealth.uptime}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>Response Time</span>
            <span style={{ 
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.bold,
              color: systemHealth.responseTime < '200ms' ? colors.success : colors.warning
            }}>
              {systemHealth.responseTime}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>Error Rate</span>
            <span style={{ 
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.bold,
              color: systemHealth.errorRate < '1%' ? colors.success : colors.error
            }}>
              {systemHealth.errorRate}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>Active Connections</span>
            <span style={{ 
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.bold,
              color: colors.neutral[900]
            }}>
              {systemHealth.activeConnections}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>Database Size</span>
            <span style={{ 
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.bold,
              color: colors.neutral[900]
            }}>
              {systemHealth.databaseSize}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>Last Backup</span>
            <span style={{ 
              fontSize: typography.fontSize.sm,
              color: colors.neutral[600]
            }}>
              {systemHealth.lastBackup}
            </span>
          </div>
        </div>
      </AnimatedCard>

      <AnimatedCard>
        <h3 style={{ 
          fontSize: typography.fontSize.xl, 
          fontWeight: typography.fontWeight.bold,
          color: colors.neutral[900],
          marginBottom: spacing[4]
        }}>
          🔒 Security Status
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>SSL Certificate</span>
            <span style={{ 
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.bold,
              color: colors.success
            }}>
              Valid
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>Firewall</span>
            <span style={{ 
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.bold,
              color: colors.success
            }}>
              Active
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>Failed Logins (24h)</span>
            <span style={{ 
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.bold,
              color: colors.warning
            }}>
              3
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>Security Updates</span>
            <span style={{ 
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.bold,
              color: colors.success
            }}>
              Current
            </span>
          </div>
        </div>
      </AnimatedCard>
    </div>
  );

  const renderSecurity = () => (
    <AnimatedCard>
      <h3 style={{ 
        fontSize: typography.fontSize.xl, 
        fontWeight: typography.fontWeight.bold,
        color: colors.neutral[900],
        marginBottom: spacing[4]
      }}>
        🔒 Security & Compliance
      </h3>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: spacing[4]
      }}>
        <div style={{
          padding: spacing[4],
          border: `1px solid ${colors.neutral[200]}`,
          borderRadius: borderRadius.lg,
          backgroundColor: colors.neutral[50]
        }}>
          <h4 style={{ 
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.semibold,
            color: colors.neutral[900],
            marginBottom: spacing[3]
          }}>
            Access Control
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>2FA Enabled</span>
              <span style={{ fontSize: typography.fontSize.sm, color: colors.success }}>✓</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>Role-Based Access</span>
              <span style={{ fontSize: typography.fontSize.sm, color: colors.success }}>✓</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>Session Timeout</span>
              <span style={{ fontSize: typography.fontSize.sm, color: colors.success }}>✓</span>
            </div>
          </div>
        </div>

        <div style={{
          padding: spacing[4],
          border: `1px solid ${colors.neutral[200]}`,
          borderRadius: borderRadius.lg,
          backgroundColor: colors.neutral[50]
        }}>
          <h4 style={{ 
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.semibold,
            color: colors.neutral[900],
            marginBottom: spacing[3]
          }}>
            Data Protection
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>Encryption</span>
              <span style={{ fontSize: typography.fontSize.sm, color: colors.success }}>✓</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>Backups</span>
              <span style={{ fontSize: typography.fontSize.sm, color: colors.success }}>✓</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>GDPR Compliance</span>
              <span style={{ fontSize: typography.fontSize.sm, color: colors.success }}>✓</span>
            </div>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );

  const renderSupport = () => (
    <AnimatedCard>
      <h3 style={{ 
        fontSize: typography.fontSize.xl, 
        fontWeight: typography.fontWeight.bold,
        color: colors.neutral[900],
        marginBottom: spacing[4]
      }}>
        🎫 Support Tickets
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: spacing[4]
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: typography.fontSize['2xl'],
              fontWeight: typography.fontWeight.bold,
              color: colors.neutral[900]
            }}>
              12
            </div>
            <div style={{ 
              fontSize: typography.fontSize.sm,
              color: colors.neutral[600]
            }}>
              Open Tickets
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: typography.fontSize['2xl'],
              fontWeight: typography.fontWeight.bold,
              color: colors.warning
            }}>
              3
            </div>
            <div style={{ 
              fontSize: typography.fontSize.sm,
              color: colors.neutral[600]
            }}>
              Urgent
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: typography.fontSize['2xl'],
              fontWeight: typography.fontWeight.bold,
              color: colors.success
            }}>
              2.5h
            </div>
            <div style={{ 
              fontSize: typography.fontSize.sm,
              color: colors.neutral[600]
            }}>
              Avg Response
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: typography.fontSize['2xl'],
              fontWeight: typography.fontWeight.bold,
              color: colors.primary[600]
            }}>
              95%
            </div>
            <div style={{ 
              fontSize: typography.fontSize.sm,
              color: colors.neutral[600]
            }}>
              Satisfaction
            </div>
          </div>
        </div>
        
        <div style={{ 
          border: '1px solid ' + colors.neutral[200],
          borderRadius: borderRadius.lg,
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: colors.neutral[50] }}>
                <th style={{ 
                  textAlign: 'left', 
                  padding: spacing[3], 
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.neutral[700]
                }}>Ticket ID</th>
                <th style={{ 
                  textAlign: 'left', 
                  padding: spacing[3], 
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.neutral[700]
                }}>Subject</th>
                <th style={{ 
                  textAlign: 'left', 
                  padding: spacing[3], 
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.neutral[700]
                }}>Priority</th>
                <th style={{ 
                  textAlign: 'left', 
                  padding: spacing[3], 
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.neutral[700]
                }}>Status</th>
                <th style={{ 
                  textAlign: 'left', 
                  padding: spacing[3], 
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.neutral[700]
                }}>Created</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid ' + colors.neutral[100] }}>
                <td style={{ padding: spacing[3] }}>
                  <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[900] }}>
                    #1234
                  </span>
                </td>
                <td style={{ padding: spacing[3] }}>
                  <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[900] }}>
                    Login issue with mobile app
                  </span>
                </td>
                <td style={{ padding: spacing[3] }}>
                  <span style={{
                    fontSize: typography.fontSize.xs,
                    padding: spacing[1] + 'px ' + spacing[2] + 'px',
                    borderRadius: borderRadius.full,
                    backgroundColor: colors.error[100],
                    color: colors.error[700],
                    fontWeight: typography.fontWeight.medium
                  }}>
                    High
                  </span>
                </td>
                <td style={{ padding: spacing[3] }}>
                  <span style={{
                    fontSize: typography.fontSize.xs,
                    padding: spacing[1] + 'px ' + spacing[2] + 'px',
                    borderRadius: borderRadius.full,
                    backgroundColor: colors.warning[100],
                    color: colors.warning[700],
                    fontWeight: typography.fontWeight.medium
                  }}>
                    In Progress
                  </span>
                </td>
                <td style={{ padding: spacing[3] }}>
                  <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                    2 hours ago
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AnimatedCard>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'users':
        return renderUsers();
      case 'organizations':
        return renderOrganizations();
      case 'revenue':
        return renderRevenue();
      case 'system':
        return renderSystemHealth();
      case 'security':
        return renderSecurity();
      case 'support':
        return renderSupport();
      default:
        return renderOverview();
    }
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
          Loading admin dashboard...
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
          🛠️ Admin Dashboard
        </h1>
        <p style={{ 
          fontSize: typography.fontSize.lg, 
          color: colors.neutral[600],
          marginBottom: spacing[6]
        }}>
          Platform management and analytics
        </p>
        
        {/* Period Selector */}
        <div style={{ 
          display: 'flex', 
          gap: spacing[2], 
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: spacing[6]
        }}>
          {periods.map(period => (
            <AnimatedButton
              key={period.id}
              variant={selectedPeriod === period.id ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setSelectedPeriod(period.id)}
              style={{
                textTransform: 'capitalize',
                borderRadius: borderRadius.full,
                padding: spacing[2] + 'px ' + spacing[4] + 'px'
              }}
            >
              {period.label}
            </AnimatedButton>
          ))}
        </div>

        {/* Section Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: spacing[2], 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {sections.map(section => (
            <AnimatedButton
              key={section.id}
              variant={activeSection === section.id ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveSection(section.id)}
              style={{
                borderRadius: borderRadius.lg,
                padding: spacing[3] + 'px ' + spacing[4] + 'px'
              }}
            >
              {section.icon} {section.label}
            </AnimatedButton>
          ))}
        </div>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default AdminDashboard;
