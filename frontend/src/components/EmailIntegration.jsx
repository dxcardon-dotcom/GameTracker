import React, { useState, useEffect, useCallback } from 'react';

const EmailIntegration = () => {
  const [emailSettings, setEmailSettings] = useState({
    enabled: false,
    recipientEmail: '',
    gameReports: true,
    weeklySummaries: true,
    playerUpdates: true,
    milestoneAlerts: true,
    scheduleReminders: true
  });
  const [isConfigured, setIsConfigured] = useState(false);
  const [testEmailSent, setTestEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load saved email settings
  useEffect(() => {
    const savedSettings = localStorage.getItem('email-settings');
    if (savedSettings) {
      setEmailSettings(JSON.parse(savedSettings));
      setIsConfigured(true);
    }
  }, []);

  // Save email settings
  const saveSettings = useCallback((newSettings) => {
    const updatedSettings = { ...emailSettings, ...newSettings };
    setEmailSettings(updatedSettings);
    localStorage.setItem('email-settings', JSON.stringify(updatedSettings));
    setIsConfigured(true);
  }, [emailSettings]);

  // Send test email
  const sendTestEmail = useCallback(async () => {
    if (!emailSettings.recipientEmail) {
      alert('Please enter a recipient email address');
      return;
    }

    setLoading(true);
    try {
      // Mock email sending - in production, this would call your backend API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setTestEmailSent(true);
      setTimeout(() => setTestEmailSent(false), 5000);
    } catch (error) {
      console.error('Failed to send test email:', error);
      alert('Failed to send test email. Please check your settings.');
    } finally {
      setLoading(false);
    }
  }, [emailSettings.recipientEmail]);

  // Generate game report email
  const generateGameReport = useCallback((gameData) => {
    const report = {
      to: emailSettings.recipientEmail,
      subject: `Game Report: ${gameData.team} vs ${gameData.opponent}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e293b;">Game Report</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>${gameData.team} ${gameData.ourScore} - ${gameData.theirScore} ${gameData.opponent}</h3>
            <p><strong>Date:</strong> ${gameData.date}</p>
            <p><strong>Location:</strong> ${gameData.location}</p>
            <p><strong>Status:</strong> ${gameData.status}</p>
          </div>
          
          <h3>Game Highlights</h3>
          <ul>
            <li>Final Score: ${gameData.ourScore} - ${gameData.theirScore}</li>
            <li>Result: ${gameData.result}</li>
            <li>Total Innings: ${gameData.innings}</li>
          </ul>
          
          <div style="margin-top: 30px; padding: 20px; background: #e0f2fe; border-radius: 8px;">
            <p style="margin: 0; color: #0369a1;">
              This report was generated automatically by GameTracker Pro.
            </p>
          </div>
        </div>
      `
    };
    return report;
  }, [emailSettings.recipientEmail]);

  // Generate weekly summary email
  const generateWeeklySummary = useCallback((weekData) => {
    const summary = {
      to: emailSettings.recipientEmail,
      subject: `Weekly Summary - ${weekData.teamName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e293b;">Weekly Performance Summary</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>${weekData.teamName} - Week of ${weekData.weekStart}</h3>
            <p><strong>Games Played:</strong> ${weekData.gamesPlayed}</p>
            <p><strong>Record:</strong> ${weekData.wins}-${weekData.losses}</p>
            <p><strong>Win Percentage:</strong> ${weekData.winPercentage}%</p>
          </div>
          
          <h3>Team Statistics</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background: #e2e8f0;">
              <th style="padding: 10px; text-align: left;">Metric</th>
              <th style="padding: 10px; text-align: right;">Value</th>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">Batting Average</td>
              <td style="padding: 8px; text-align: right; border-bottom: 1px solid #e2e8f0;">${weekData.stats.battingAverage}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">On-Base Percentage</td>
              <td style="padding: 8px; text-align: right; border-bottom: 1px solid #e2e8f0;">${weekData.stats.onBasePercentage}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">Slugging Percentage</td>
              <td style="padding: 8px; text-align: right; border-bottom: 1px solid #e2e8f0;">${weekData.stats.sluggingPercentage}</td>
            </tr>
            <tr>
              <td style="padding: 8px;">OPS</td>
              <td style="padding: 8px; text-align: right;">${weekData.stats.ops}</td>
            </tr>
          </table>
          
          <h3>Top Performers</h3>
          ${weekData.topPerformers.map(player => `
            <div style="background: #f0f9ff; padding: 12px; margin: 8px 0; border-radius: 6px;">
              <strong>${player.name}</strong> - ${player.metric}: ${player.value}
            </div>
          `).join('')}
          
          <div style="margin-top: 30px; padding: 20px; background: #e0f2fe; border-radius: 8px;">
            <p style="margin: 0; color: #0369a1;">
              This summary was generated automatically by GameTracker Pro.
            </p>
          </div>
        </div>
      `
    };
    return summary;
  }, [emailSettings.recipientEmail]);

  // Send email (mock implementation)
  const sendEmail = useCallback(async (emailData) => {
    if (!emailSettings.enabled || !emailSettings.recipientEmail) {
      return;
    }

    setLoading(true);
    try {
      // Mock email sending - in production, this would call your backend API
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Email sent:', emailData);
    } catch (error) {
      console.error('Failed to send email:', error);
    } finally {
      setLoading(false);
    }
  }, [emailSettings]);

  return (
    <div className="email-integration" style={{
      background: '#1e293b',
      border: '1px solid #334155',
      borderRadius: '8px',
      padding: '16px',
      margin: '16px 0'
    }}>
      <h3 style={{
        margin: '0 0 16px 0',
        fontSize: '16px',
        fontWeight: '600',
        color: '#f1f5f9',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        📧 Email Integration
        {isConfigured && (
          <span style={{
            background: '#22c55e',
            color: '#fff',
            fontSize: '10px',
            padding: '2px 6px',
            borderRadius: '4px',
            fontWeight: '500'
          }}>
            Configured
          </span>
        )}
      </h3>

      {/* Email Configuration */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '12px',
          cursor: 'pointer'
        }}>
          <input
            type="checkbox"
            checked={emailSettings.enabled}
            onChange={(e) => saveSettings({ enabled: e.target.checked })}
            style={{ width: '16px', height: '16px' }}
          />
          <span style={{ fontSize: '14px', color: '#cbd5e1' }}>
            Enable email notifications
          </span>
        </label>

        {emailSettings.enabled && (
          <div style={{
            background: '#0f172a',
            padding: '12px',
            borderRadius: '6px',
            border: '1px solid #334155'
          }}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                color: '#94a3b8',
                marginBottom: '4px'
              }}>
                Recipient Email Address
              </label>
              <input
                type="email"
                value={emailSettings.recipientEmail}
                onChange={(e) => saveSettings({ recipientEmail: e.target.value })}
                placeholder="coach@example.com"
                style={{
                  width: '100%',
                  padding: '8px',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '4px',
                  color: '#f1f5f9',
                  fontSize: '14px'
                }}
              />
            </div>

            <button
              onClick={sendTestEmail}
              disabled={loading || !emailSettings.recipientEmail}
              style={{
                background: loading ? '#64748b' : '#38bdf8',
                color: '#0f172a',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: loading || !emailSettings.recipientEmail ? 'not-allowed' : 'pointer',
                width: '100%'
              }}
            >
              {loading ? 'Sending...' : 'Send Test Email'}
            </button>

            {testEmailSent && (
              <div style={{
                background: '#22c55e',
                color: '#fff',
                padding: '8px',
                borderRadius: '4px',
                marginTop: '8px',
                fontSize: '12px',
                textAlign: 'center'
              }}>
                ✅ Test email sent successfully!
              </div>
            )}
          </div>
        )}
      </div>

      {/* Email Types */}
      {emailSettings.enabled && (
        <div>
          <h4 style={{
            margin: '0 0 12px 0',
            fontSize: '14px',
            fontWeight: '600',
            color: '#f1f5f9'
          }}>
            Email Types
          </h4>

          {Object.entries({
            gameReports: 'Game Reports',
            weeklySummaries: 'Weekly Summaries',
            playerUpdates: 'Player Updates',
            milestoneAlerts: 'Milestone Alerts',
            scheduleReminders: 'Schedule Reminders'
          }).map(([key, label]) => (
            <label
              key={key}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 0',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '13px', color: '#cbd5e1' }}>
                {label}
              </span>
              <input
                type="checkbox"
                checked={emailSettings[key]}
                onChange={(e) => saveSettings({ [key]: e.target.checked })}
                style={{ width: '16px', height: '16px' }}
              />
            </label>
          ))}
        </div>
      )}

      {/* Email Templates Preview */}
      {emailSettings.enabled && emailSettings.recipientEmail && (
        <div style={{ marginTop: '16px' }}>
          <h4 style={{
            margin: '0 0 12px 0',
            fontSize: '14px',
            fontWeight: '600',
            color: '#f1f5f9'
          }}>
            Email Templates
          </h4>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                const mockGameData = {
                  team: 'Irvin Rockets',
                  opponent: 'Franklin Cougars',
                  ourScore: 8,
                  theirScore: 5,
                  date: new Date().toLocaleDateString(),
                  location: 'Home',
                  status: 'Final',
                  result: 'Win',
                  innings: 7
                };
                const report = generateGameReport(mockGameData);
                console.log('Game Report Email:', report);
                alert('Game report template logged to console');
              }}
              style={{
                background: '#334155',
                color: '#cbd5e1',
                border: '1px solid #475569',
                borderRadius: '4px',
                padding: '6px 12px',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              Preview Game Report
            </button>

            <button
              onClick={() => {
                const mockWeekData = {
                  teamName: 'Irvin Rockets',
                  weekStart: new Date().toLocaleDateString(),
                  gamesPlayed: 3,
                  wins: 2,
                  losses: 1,
                  winPercentage: '66.7',
                  stats: {
                    battingAverage: '.325',
                    onBasePercentage: '.412',
                    sluggingPercentage: '.487',
                    ops: '.899'
                  },
                  topPerformers: [
                    { name: 'John Doe', metric: 'Batting Average', value: '.450' },
                    { name: 'Jane Smith', metric: 'Home Runs', value: '3' }
                  ]
                };
                const summary = generateWeeklySummary(mockWeekData);
                console.log('Weekly Summary Email:', summary);
                alert('Weekly summary template logged to console');
              }}
              style={{
                background: '#334155',
                color: '#cbd5e1',
                border: '1px solid #475569',
                borderRadius: '4px',
                padding: '6px 12px',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              Preview Weekly Summary
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Hook for easy email integration
export const useEmailIntegration = () => {
  const sendGameReport = useCallback((gameData) => {
    // This would integrate with the EmailIntegration component
    console.log('Sending game report:', gameData);
  }, []);

  const sendWeeklySummary = useCallback((weekData) => {
    // This would integrate with the EmailIntegration component
    console.log('Sending weekly summary:', weekData);
  }, []);

  const sendMilestoneAlert = useCallback((playerData, milestone) => {
    // This would integrate with the EmailIntegration component
    console.log('Sending milestone alert:', playerData, milestone);
  }, []);

  return {
    sendGameReport,
    sendWeeklySummary,
    sendMilestoneAlert
  };
};

export default EmailIntegration;
