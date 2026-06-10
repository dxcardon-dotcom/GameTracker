import React, { useState, useEffect, useMemo } from 'react';
import AnimatedCard from './AnimatedCard';
import AnimatedStatsCard from './AnimatedStatsCard';
import AnimatedButton from './AnimatedButton';
import LoadingSpinner from './LoadingSpinner';
import { colors, spacing, borderRadius, typography, transitions } from '../styles/designSystem';

const AnalyticsDashboard = ({ 
  user, 
  analyticsData, 
  onDateRangeChange,
  onExport,
  isLoading = false 
}) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [dateRange, setDateRange] = useState('30days');
  const [selectedMetrics, setSelectedMetrics] = useState(['users', 'revenue', 'engagement']);
  const [comparisonMode, setComparisonMode] = useState(false);

  // Mock analytics data
  const [analytics, setAnalytics] = useState({
    overview: {
      totalUsers: 15420,
      activeUsers: 8934,
      newUsers: 1247,
      revenue: 48560,
      growthRate: 23.4,
      engagementRate: 78.2,
      retentionRate: 85.6,
      churnRate: 14.4
    },
    userAnalytics: {
      dailyActive: 2847,
      weeklyActive: 8934,
      monthlyActive: 12450,
      userSegments: [
        { segment: 'Free', users: 8450, percentage: 54.8 },
        { segment: 'Pro', users: 5670, percentage: 36.8 },
        { segment: 'Enterprise', users: 1300, percentage: 8.4 }
      ],
      userLifecycle: [
        { stage: 'New', users: 1247, percentage: 8.1 },
        { stage: 'Active', users: 8934, percentage: 57.9 },
        { stage: 'At Risk', users: 2340, percentage: 15.2 },
        { stage: 'Churned', users: 2899, percentage: 18.8 }
      ],
      geographicDistribution: [
        { country: 'United States', users: 6847, percentage: 44.4 },
        { country: 'Canada', users: 2156, percentage: 14.0 },
        { country: 'United Kingdom', users: 1542, percentage: 10.0 },
        { country: 'Australia', users: 1234, percentage: 8.0 },
        { country: 'Germany', users: 1089, percentage: 7.1 },
        { country: 'Others', users: 2552, percentage: 16.5 }
      ]
    },
    revenueAnalytics: {
      monthlyRevenue: 48560,
      yearlyRevenue: 582720,
      averageRevenuePerUser: 3.15,
      customerLifetimeValue: 127.50,
      revenueByPlan: [
        { plan: 'Free', revenue: 0, users: 8450, percentage: 0 },
        { plan: 'Pro', revenue: 28470, users: 5670, percentage: 58.6 },
        { plan: 'Enterprise', revenue: 20090, users: 1300, percentage: 41.4 }
      ],
      revenueByRegion: [
        { region: 'North America', revenue: 32450, percentage: 66.8 },
        { region: 'Europe', revenue: 10890, percentage: 22.4 },
        { region: 'Asia Pacific', revenue: 3245, percentage: 6.7 },
        { region: 'Others', revenue: 1975, percentage: 4.1 }
      ],
      monthlyTrend: [
        { month: 'Jan', revenue: 38420, growth: 0 },
        { month: 'Feb', revenue: 41230, growth: 7.3 },
        { month: 'Mar', revenue: 44560, growth: 8.1 },
        { month: 'Apr', revenue: 46780, growth: 5.0 },
        { month: 'May', revenue: 47890, growth: 2.4 },
        { month: 'Jun', revenue: 48560, growth: 1.4 }
      ]
    },
    engagementAnalytics: {
      averageSessionDuration: 1247, // seconds
      pagesPerSession: 8.4,
      bounceRate: 23.5,
      featureUsage: [
        { feature: 'Live Scoring', usage: 89.2, users: 13756 },
        { feature: 'Team Management', usage: 76.8, users: 11849 },
        { feature: 'Statistics', usage: 68.4, users: 10548 },
        { feature: 'AI Insights', usage: 54.2, users: 8356 },
        { feature: 'Community', usage: 42.1, users: 6492 },
        { feature: 'Gamification', usage: 38.7, users: 5967 }
      ],
      contentEngagement: [
        { type: 'Posts', interactions: 45678, engagement: 78.4 },
        { type: 'Comments', interactions: 23456, engagement: 65.2 },
        { type: 'Likes', interactions: 67890, engagement: 82.1 },
        { type: 'Shares', interactions: 12345, engagement: 45.6 }
      ]
    },
    performanceAnalytics: {
      averageResponseTime: 234, // milliseconds
      uptime: 99.97,
      errorRate: 0.03,
      pageLoadTime: 1.2, // seconds
      apiPerformance: [
        { endpoint: '/api/auth', avgTime: 145, successRate: 99.8 },
        { endpoint: '/api/games', avgTime: 234, successRate: 99.5 },
        { endpoint: '/api/stats', avgTime: 189, successRate: 99.9 },
        { endpoint: '/api/analytics', avgTime: 456, successRate: 98.7 }
      ],
      systemHealth: {
        cpu: 67.8,
        memory: 72.4,
        disk: 45.6,
        network: 34.2
      }
    }
  });

  // Date range options
  const dateRangeOptions = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' },
    { value: '6months', label: 'Last 6 Months' },
    { value: '1year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  // Metric options
  const metricOptions = [
    { value: 'users', label: 'User Metrics', icon: '👥' },
    { value: 'revenue', label: 'Revenue Metrics', icon: '💰' },
    { value: 'engagement', label: 'Engagement Metrics', icon: '📊' },
    { value: 'performance', label: 'Performance Metrics', icon: '⚡' }
  ];

  // Format numbers
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (num) => {
    return num.toFixed(1) + '%';
  };

  // Get trend color
  const getTrendColor = (trend) => {
    if (trend > 0) return colors.success[600];
    if (trend < 0) return colors.error[600];
    return colors.neutral[600];
  };

  // Get trend icon
  const getTrendIcon = (trend) => {
    if (trend > 0) return '📈';
    if (trend < 0) return '📉';
    return '➡️';
  };

  // Render overview section
  const renderOverview = () => (
    <div style={{ display: 'grid', gap: spacing[6] }}>
      {/* Key Metrics Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: spacing[4]
      }}>
        <AnimatedStatsCard
          title="Total Users"
          value={formatNumber(analytics.overview.totalUsers)}
          icon="👥"
          color={colors.primary[600]}
          size="lg"
          trend={{
            value: analytics.overview.growthRate,
            label: 'vs last period'
          }}
        />
        
        <AnimatedStatsCard
          title="Active Users"
          value={formatNumber(analytics.overview.activeUsers)}
          icon="🟢"
          color={colors.success[600]}
          size="lg"
          trend={{
            value: 12.3,
            label: 'vs last period'
          }}
        />
        
        <AnimatedStatsCard
          title="Revenue"
          value={formatCurrency(analytics.overview.revenue)}
          icon="💰"
          color={colors.warning[600]}
          size="lg"
          trend={{
            value: 8.7,
            label: 'vs last period'
          }}
        />
        
        <AnimatedStatsCard
          title="Engagement Rate"
          value={formatPercentage(analytics.overview.engagementRate)}
          icon="📊"
          color={colors.info[600]}
          size="lg"
          trend={{
            value: 3.2,
            label: 'vs last period'
          }}
        />
      </div>

      {/* Charts Row */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: spacing[6]
      }}>
        {/* User Growth Chart */}
        <AnimatedCard>
          <h3 style={{ 
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.semibold,
            color: colors.neutral[900],
            marginBottom: spacing[4]
          }}>
            📈 User Growth Trend
          </h3>
          <div style={{
            height: '300px',
            backgroundColor: colors.neutral[50],
            borderRadius: borderRadius.lg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.neutral[500]
          }}>
            Chart Placeholder - User Growth Over Time
          </div>
        </AnimatedCard>

        {/* Revenue Chart */}
        <AnimatedCard>
          <h3 style={{ 
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.semibold,
            color: colors.neutral[900],
            marginBottom: spacing[4]
          }}>
            💰 Revenue Breakdown
          </h3>
          <div style={{
            height: '300px',
            backgroundColor: colors.neutral[50],
            borderRadius: borderRadius.lg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.neutral[500]
          }}>
            Chart Placeholder - Revenue by Plan/Region
          </div>
        </AnimatedCard>
      </div>

      {/* Quick Insights */}
      <AnimatedCard>
        <h3 style={{ 
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.semibold,
          color: colors.neutral[900],
          marginBottom: spacing[4]
        }}>
          💡 Key Insights
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: spacing[4]
        }}>
          <div style={{
            padding: spacing[4],
            backgroundColor: colors.success[50],
            borderRadius: borderRadius.lg,
            borderLeft: `4px solid ${colors.success[500]}`
          }}>
            <h4 style={{ 
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.semibold,
              color: colors.success[900],
              marginBottom: spacing[2]
            }}>
              🎯 High Engagement
            </h4>
            <p style={{ 
              fontSize: typography.fontSize.sm,
              color: colors.success[700],
              margin: 0
            }}>
              User engagement is at an all-time high with {formatPercentage(analytics.overview.engagementRate)} engagement rate.
            </p>
          </div>
          
          <div style={{
            padding: spacing[4],
            backgroundColor: colors.warning[50],
            borderRadius: borderRadius.lg,
            borderLeft: `4px solid ${colors.warning[500]}`
          }}>
            <h4 style={{ 
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.semibold,
              color: colors.warning[900],
              marginBottom: spacing[2]
            }}>
              📈 Growth Opportunity
            </h4>
            <p style={{ 
              fontSize: typography.fontSize.sm,
              color: colors.warning[700],
              margin: 0
            }}>
              {analytics.userAnalytics.userSegments.find(s => s.segment === 'Enterprise').percentage}% of users are on Enterprise plans.
            </p>
          </div>
          
          <div style={{
            padding: spacing[4],
            backgroundColor: colors.info[50],
            borderRadius: borderRadius.lg,
            borderLeft: `4px solid ${colors.info[500]}`
          }}>
            <h4 style={{ 
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.semibold,
              color: colors.info[900],
              marginBottom: spacing[2]
            }}>
              🌍 Global Reach
            </h4>
            <p style={{ 
              fontSize: typography.fontSize.sm,
              color: colors.info[700],
              margin: 0
            }}>
              Users from {analytics.userAnalytics.geographicDistribution.length} countries are actively using the platform.
            </p>
          </div>
        </div>
      </AnimatedCard>
    </div>
  );

  // Render user analytics
  const renderUserAnalytics = () => (
    <div style={{ display: 'grid', gap: spacing[6] }}>
      {/* User Metrics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: spacing[4]
      }}>
        <AnimatedStatsCard
          title="Daily Active"
          value={formatNumber(analytics.userAnalytics.dailyActive)}
          icon="📅"
          color={colors.primary[600]}
          size="md"
        />
        
        <AnimatedStatsCard
          title="Weekly Active"
          value={formatNumber(analytics.userAnalytics.weeklyActive)}
          icon="📆"
          color={colors.success[600]}
          size="md"
        />
        
        <AnimatedStatsCard
          title="Monthly Active"
          value={formatNumber(analytics.userAnalytics.monthlyActive)}
          icon="📊"
          color={colors.warning[600]}
          size="md"
        />
        
        <AnimatedStatsCard
          title="Retention Rate"
          value={formatPercentage(analytics.overview.retentionRate)}
          icon="🔄"
          color={colors.info[600]}
          size="md"
        />
      </div>

      {/* User Segments */}
      <AnimatedCard>
        <h3 style={{ 
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.semibold,
          color: colors.neutral[900],
          marginBottom: spacing[4]
        }}>
          👥 User Segments
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: spacing[4]
        }}>
          {analytics.userAnalytics.userSegments.map((segment) => (
            <div key={segment.segment} style={{
              padding: spacing[4],
              backgroundColor: colors.neutral[50],
              borderRadius: borderRadius.lg,
              border: `1px solid ${colors.neutral[200]}`
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
                  {segment.segment}
                </h4>
                <span style={{
                  fontSize: typography.fontSize.sm,
                  padding: `${spacing[1]} ${spacing[2]}`,
                  borderRadius: borderRadius.full,
                  backgroundColor: colors.primary[100],
                  color: colors.primary[700],
                  fontWeight: typography.fontWeight.medium
                }}>
                  {formatPercentage(segment.percentage)}
                </span>
              </div>
              <div style={{ 
                fontSize: typography.fontSize['2xl'],
                fontWeight: typography.fontWeight.bold,
                color: colors.primary[600]
              }}>
                {formatNumber(segment.users)}
              </div>
              <div style={{ 
                fontSize: typography.fontSize.sm,
                color: colors.neutral[600]
              }}>
                Users
              </div>
            </div>
          ))}
        </div>
      </AnimatedCard>

      {/* Geographic Distribution */}
      <AnimatedCard>
        <h3 style={{ 
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.semibold,
          color: colors.neutral[900],
          marginBottom: spacing[4]
        }}>
          🌍 Geographic Distribution
        </h3>
        <div style={{
          height: '400px',
          backgroundColor: colors.neutral[50],
          borderRadius: borderRadius.lg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.neutral[500]
        }}>
          Chart Placeholder - World Map with User Distribution
        </div>
      </AnimatedCard>
    </div>
  );

  // Render revenue analytics
  const renderRevenueAnalytics = () => (
    <div style={{ display: 'grid', gap: spacing[6] }}>
      {/* Revenue Metrics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: spacing[4]
      }}>
        <AnimatedStatsCard
          title="Monthly Revenue"
          value={formatCurrency(analytics.revenueAnalytics.monthlyRevenue)}
          icon="💵"
          color={colors.success[600]}
          size="md"
        />
        
        <AnimatedStatsCard
          title="Yearly Revenue"
          value={formatCurrency(analytics.revenueAnalytics.yearlyRevenue)}
          icon="💰"
          color={colors.primary[600]}
          size="md"
        />
        
        <AnimatedStatsCard
          title="ARPU"
          value={formatCurrency(analytics.revenueAnalytics.averageRevenuePerUser)}
          icon="👤"
          color={colors.warning[600]}
          size="md"
        />
        
        <AnimatedStatsCard
          title="LTV"
          value={formatCurrency(analytics.revenueAnalytics.customerLifetimeValue)}
          icon="📈"
          color={colors.info[600]}
          size="md"
        />
      </div>

      {/* Revenue by Plan */}
      <AnimatedCard>
        <h3 style={{ 
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.semibold,
          color: colors.neutral[900],
          marginBottom: spacing[4]
        }}>
          💰 Revenue by Plan
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: spacing[4]
        }}>
          {analytics.revenueAnalytics.revenueByPlan.map((plan) => (
            <div key={plan.plan} style={{
              padding: spacing[4],
              backgroundColor: colors.neutral[50],
              borderRadius: borderRadius.lg,
              border: `1px solid ${colors.neutral[200]}`
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
                  {plan.plan}
                </h4>
                <span style={{
                  fontSize: typography.fontSize.sm,
                  padding: `${spacing[1]} ${spacing[2]}`,
                  borderRadius: borderRadius.full,
                  backgroundColor: colors.success[100],
                  color: colors.success[700],
                  fontWeight: typography.fontWeight.medium
                }}>
                  {formatPercentage(plan.percentage)}
                </span>
              </div>
              <div style={{ 
                fontSize: typography.fontSize['2xl'],
                fontWeight: typography.fontWeight.bold,
                color: colors.success[600]
              }}>
                {formatCurrency(plan.revenue)}
              </div>
              <div style={{ 
                fontSize: typography.fontSize.sm,
                color: colors.neutral[600]
              }}>
                {formatNumber(plan.users)} users
              </div>
            </div>
          ))}
        </div>
      </AnimatedCard>

      {/* Revenue Trend */}
      <AnimatedCard>
        <h3 style={{ 
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.semibold,
          color: colors.neutral[900],
          marginBottom: spacing[4]
        }}>
          📈 Revenue Trend
        </h3>
        <div style={{
          height: '400px',
          backgroundColor: colors.neutral[50],
          borderRadius: borderRadius.lg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.neutral[500]
        }}>
          Chart Placeholder - Monthly Revenue Trend
        </div>
      </AnimatedCard>
    </div>
  );

  // Render engagement analytics
  const renderEngagementAnalytics = () => (
    <div style={{ display: 'grid', gap: spacing[6] }}>
      {/* Engagement Metrics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: spacing[4]
      }}>
        <AnimatedStatsCard
          title="Avg Session Duration"
          value={Math.round(analytics.engagementAnalytics.averageSessionDuration / 60) + 'm'}
          icon="⏱️"
          color={colors.primary[600]}
          size="md"
        />
        
        <AnimatedStatsCard
          title="Pages per Session"
          value={analytics.engagementAnalytics.pagesPerSession.toFixed(1)}
          icon="📄"
          color={colors.success[600]}
          size="md"
        />
        
        <AnimatedStatsCard
          title="Bounce Rate"
          value={formatPercentage(analytics.engagementAnalytics.bounceRate)}
          icon="🔄"
          color={colors.warning[600]}
          size="md"
        />
        
        <AnimatedStatsCard
          title="Engagement Rate"
          value={formatPercentage(analytics.overview.engagementRate)}
          icon="📊"
          color={colors.info[600]}
          size="md"
        />
      </div>

      {/* Feature Usage */}
      <AnimatedCard>
        <h3 style={{ 
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.semibold,
          color: colors.neutral[900],
          marginBottom: spacing[4]
        }}>
          🎯 Feature Usage
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: spacing[4]
        }}>
          {analytics.engagementAnalytics.featureUsage.map((feature) => (
            <div key={feature.feature} style={{
              padding: spacing[4],
              backgroundColor: colors.neutral[50],
              borderRadius: borderRadius.lg,
              border: `1px solid ${colors.neutral[200]}`
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: spacing[3]
              }}>
                <h4 style={{ 
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.neutral[900],
                  margin: 0
                }}>
                  {feature.feature}
                </h4>
                <span style={{
                  fontSize: typography.fontSize.sm,
                  padding: `${spacing[1]} ${spacing[2]}`,
                  borderRadius: borderRadius.full,
                  backgroundColor: colors.primary[100],
                  color: colors.primary[700],
                  fontWeight: typography.fontWeight.medium
                }}>
                  {formatPercentage(feature.usage)}
                </span>
              </div>
              
              {/* Usage Bar */}
              <div style={{ 
                backgroundColor: colors.neutral[200],
                borderRadius: borderRadius.full,
                height: '8px',
                marginBottom: spacing[2]
              }}>
                <div style={{
                  backgroundColor: colors.primary[500],
                  borderRadius: borderRadius.full,
                  height: '100%',
                  width: feature.usage + '%',
                  transition: transitions.all
                }} />
              </div>
              
              <div style={{ 
                fontSize: typography.fontSize.sm,
                color: colors.neutral[600]
              }}>
                {formatNumber(feature.users)} users
              </div>
            </div>
          ))}
        </div>
      </AnimatedCard>
    </div>
  );

  // Render performance analytics
  const renderPerformanceAnalytics = () => (
    <div style={{ display: 'grid', gap: spacing[6] }}>
      {/* Performance Metrics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: spacing[4]
      }}>
        <AnimatedStatsCard
          title="Avg Response Time"
          value={analytics.performanceAnalytics.averageResponseTime + 'ms'}
          icon="⚡"
          color={colors.success[600]}
          size="md"
        />
        
        <AnimatedStatsCard
          title="Uptime"
          value={formatPercentage(analytics.performanceAnalytics.uptime)}
          icon="🟢"
          color={colors.success[600]}
          size="md"
        />
        
        <AnimatedStatsCard
          title="Error Rate"
          value={formatPercentage(analytics.performanceAnalytics.errorRate)}
          icon="❌"
          color={colors.error[600]}
          size="md"
        />
        
        <AnimatedStatsCard
          title="Page Load Time"
          value={analytics.performanceAnalytics.pageLoadTime + 's'}
          icon="📄"
          color={colors.warning[600]}
          size="md"
        />
      </div>

      {/* System Health */}
      <AnimatedCard>
        <h3 style={{ 
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.semibold,
          color: colors.neutral[900],
          marginBottom: spacing[4]
        }}>
          🖥️ System Health
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: spacing[4]
        }}>
          {Object.entries(analytics.performanceAnalytics.systemHealth).map(([metric, value]) => (
            <div key={metric} style={{
              padding: spacing[4],
              backgroundColor: colors.neutral[50],
              borderRadius: borderRadius.lg,
              border: `1px solid ${colors.neutral[200]}`
            }}>
              <h4 style={{ 
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.semibold,
                color: colors.neutral[900],
                marginBottom: spacing[2],
                textTransform: 'capitalize'
              }}>
                {metric}
              </h4>
              <div style={{ 
                fontSize: typography.fontSize['2xl'],
                fontWeight: typography.fontWeight.bold,
                color: value > 80 ? colors.error[600] : value > 60 ? colors.warning[600] : colors.success[600]
              }}>
                {formatPercentage(value)}
              </div>
              <div style={{ 
                backgroundColor: colors.neutral[200],
                borderRadius: borderRadius.full,
                height: '8px',
                marginTop: spacing[2]
              }}>
                <div style={{
                  backgroundColor: value > 80 ? colors.error[500] : value > 60 ? colors.warning[500] : colors.success[500],
                  borderRadius: borderRadius.full,
                  height: '100%',
                  width: value + '%',
                  transition: transitions.all
                }} />
              </div>
            </div>
          ))}
        </div>
      </AnimatedCard>
    </div>
  );

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
          Loading analytics dashboard...
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
          📊 Analytics Dashboard
        </h1>
        <p style={{ 
          fontSize: typography.fontSize.lg, 
          color: colors.neutral[600],
          marginBottom: spacing[6]
        }}>
          Comprehensive business intelligence and insights
        </p>
      </div>

      {/* Controls */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: spacing[6],
        flexWrap: 'wrap',
        gap: spacing[4]
      }}>
        {/* Date Range Selector */}
        <div style={{ display: 'flex', gap: spacing[2], alignItems: 'center' }}>
          <span style={{ 
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            color: colors.neutral[700]
          }}>
            Date Range:
          </span>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{
              padding: `${spacing[2]} ${spacing[3]}`,
              border: `1px solid ${colors.neutral[300]}`,
              borderRadius: borderRadius.lg,
              fontSize: typography.fontSize.sm,
              backgroundColor: 'white'
            }}
          >
            {dateRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Comparison Mode */}
        <AnimatedButton
          variant={comparisonMode ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setComparisonMode(!comparisonMode)}
        >
          📊 Compare Periods
        </AnimatedButton>

        {/* Export Button */}
        <AnimatedButton variant="ghost" size="sm">
          📥 Export Report
        </AnimatedButton>
      </div>

      {/* Section Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: spacing[2], 
        justifyContent: 'center',
        marginBottom: spacing[8},
        flexWrap: 'wrap'
      }}>
        <AnimatedButton
          variant={activeSection === 'overview' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveSection('overview')}
          style={{
            borderRadius: borderRadius.lg,
            padding: `${spacing[3]} ${spacing[4]}`
          }}
        >
          📊 Overview
        </AnimatedButton>
        <AnimatedButton
          variant={activeSection === 'users' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveSection('users')}
          style={{
            borderRadius: borderRadius.lg,
            padding: `${spacing[3]} ${spacing[4]}`
          }}
        >
          👥 Users
        </AnimatedButton>
        <AnimatedButton
          variant={activeSection === 'revenue' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveSection('revenue')}
          style={{
            borderRadius: borderRadius.lg,
            padding: `${spacing[3]} ${spacing[4]}`
          }}
        >
          💰 Revenue
        </AnimatedButton>
        <AnimatedButton
          variant={activeSection === 'engagement' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveSection('engagement')}
          style={{
            borderRadius: borderRadius.lg,
            padding: `${spacing[3]} ${spacing[4]}`
          }}
        >
          📈 Engagement
        </AnimatedButton>
        <AnimatedButton
          variant={activeSection === 'performance' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveSection('performance')}
          style={{
            borderRadius: borderRadius.lg,
            padding: `${spacing[3]} ${spacing[4]}`
          }}
        >
          ⚡ Performance
        </AnimatedButton>
      </div>

      {/* Content */}
      {activeSection === 'overview' && renderOverview()}
      {activeSection === 'users' && renderUserAnalytics()}
      {activeSection === 'revenue' && renderRevenueAnalytics()}
      {activeSection === 'engagement' && renderEngagementAnalytics()}
      {activeSection === 'performance' && renderPerformanceAnalytics()}
    </div>
  );
};

export default AnalyticsDashboard;
