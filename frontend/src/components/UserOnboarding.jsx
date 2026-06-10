import React, { useState, useEffect } from 'react';

const UserOnboarding = ({ onComplete, isVisible }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSkipped, setIsSkipped] = useState(false);

  const onboardingSteps = [
    {
      id: 'welcome',
      title: 'Welcome to GameTracker Pro! 🎯',
      content: 'Your professional baseball scoring and analytics platform. Let\'s take a quick tour.',
      highlight: '.main-dashboard',
      position: 'center'
    },
    {
      id: 'scoring',
      title: 'Live Game Scoring ⚾',
      content: 'Track every pitch, hit, and play in real-time. Use the scoring panel to record game events.',
      highlight: '.scoring-panel',
      position: 'right'
    },
    {
      id: 'analytics',
      title: 'Advanced Analytics 📊',
      content: 'View detailed performance metrics, player stats, and predictive analytics.',
      highlight: '.analytics-button',
      position: 'left'
    },
    {
      id: 'development',
      title: 'Player Development 🎯',
      content: 'Track player progress, set goals, and monitor skill improvement over time.',
      highlight: '.development-button',
      position: 'left'
    },
    {
      id: 'sync',
      title: 'Real-time Sync 🔄',
      content: 'Your data syncs across all devices automatically. Work from anywhere!',
      highlight: '.sync-status',
      position: 'bottom'
    },
    {
      id: 'complete',
      title: 'You\'re All Set! 🚀',
      content: 'Start tracking your games like a pro. Access tutorials anytime from the help menu.',
      highlight: null,
      position: 'center'
    }
  ];

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('onboarding-completed', 'true');
    onComplete();
  };

  const handleSkip = () => {
    setIsSkipped(true);
    localStorage.setItem('onboarding-completed', 'true');
    onComplete();
  };

  const currentStepData = onboardingSteps[currentStep];

  if (!isVisible || isSkipped) return null;

  return (
    <div className="onboarding-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div className="onboarding-tooltip" style={{
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
        animation: 'slideIn 0.3s ease-out'
      }}>
        {/* Progress Bar */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              Step {currentStep + 1} of {onboardingSteps.length}
            </span>
            <button
              onClick={handleSkip}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                fontSize: '12px',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Skip Tour
            </button>
          </div>
          <div style={{
            background: '#334155',
            borderRadius: '4px',
            height: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              background: '#38bdf8',
              height: '100%',
              borderRadius: '4px',
              width: `${((currentStep + 1) / onboardingSteps.length) * 100}%`,
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Content */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#f1f5f9',
            marginBottom: '12px',
            margin: '0 0 12px 0'
          }}>
            {currentStepData.title}
          </h3>
          <p style={{
            fontSize: '14px',
            color: '#cbd5e1',
            lineHeight: '1.5',
            margin: 0
          }}>
            {currentStepData.content}
          </p>
        </div>

        {/* Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            style={{
              background: currentStep === 0 ? 'transparent' : '#334155',
              color: currentStep === 0 ? '#64748b' : '#f1f5f9',
              border: '1px solid #334155',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '14px',
              cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Previous
          </button>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            {/* Step Indicators */}
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: index === currentStep ? '#38bdf8' : '#334155',
                  transition: 'background 0.2s ease'
                }}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            style={{
              background: '#38bdf8',
              color: '#0f172a',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            className="btn-hover"
          >
            {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Tutorial Component for Feature-Specific Help
export const TutorialTooltip = ({ feature, isVisible, onClose, position }) => {
  const tutorials = {
    scoring: {
      title: 'Game Scoring',
      content: 'Click on players to select them, then record game events using the action buttons.',
      tips: ['Use keyboard shortcuts for faster scoring', 'Auto-save prevents data loss', 'Review plays before finalizing']
    },
    analytics: {
      title: 'Analytics Dashboard',
      content: 'View comprehensive stats, trends, and predictive analytics.',
      tips: ['Filter by date range', 'Export data for analysis', 'Compare player performance']
    },
    development: {
      title: 'Player Development',
      content: 'Track progress, set goals, and monitor skill improvement.',
      tips: ['Set realistic goals', 'Review progress weekly', 'Celebrate achievements']
    }
  };

  const tutorial = tutorials[feature];

  if (!isVisible || !tutorial) return null;

  return (
    <div className="tutorial-tooltip" style={{
      position: 'absolute',
      background: '#1e293b',
      border: '1px solid #38bdf8',
      borderRadius: '8px',
      padding: '16px',
      minWidth: '250px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
      zIndex: 1000,
      animation: 'fadeIn 0.2s ease-out',
      ...position
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#f1f5f9' }}>
          {tutorial.title}
        </h4>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#64748b',
            fontSize: '16px',
            cursor: 'pointer',
            padding: '0',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ×
        </button>
      </div>
      
      <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#cbd5e1', lineHeight: '1.4' }}>
        {tutorial.content}
      </p>
      
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', marginBottom: '4px' }}>
          Quick Tips:
        </div>
        <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', color: '#94a3b8' }}>
          {tutorial.tips.map((tip, index) => (
            <li key={index} style={{ marginBottom: '2px' }}>{tip}</li>
          ))}
        </ul>
      </div>
      
      <button
        onClick={onClose}
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
        Got it!
      </button>
    </div>
  );
};

export default UserOnboarding;
