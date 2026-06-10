import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import AnimatedButton from './AnimatedButton';
import { colors, spacing, borderRadius, typography, transitions } from '../styles/designSystem';

const LanguageSwitcher = ({ 
  variant = 'dropdown', 
  showFlag = true, 
  showName = true,
  size = 'md',
  style = {}
}) => {
  const { 
    locale, 
    currentLocale, 
    supportedLocales, 
    changeLanguage, 
    getTextDirection 
  } = useLanguage();
  
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (newLocale) => {
    changeLanguage(newLocale);
    setIsOpen(false);
  };

  const renderDropdown = () => (
    <div style={{ position: 'relative', ...style }}>
      <AnimatedButton
        variant="ghost"
        size={size}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing[2],
          padding: `${spacing[2]} ${spacing[3]}`,
          borderRadius: borderRadius.lg,
          border: `1px solid ${colors.neutral[200]}`,
          backgroundColor: colors.neutral[50],
          minWidth: '120px',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
          {showFlag && (
            <span style={{ fontSize: typography.fontSize.base }}>
              {currentLocale.flag}
            </span>
          )}
          {showName && (
            <span style={{ 
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
              color: colors.neutral[900]
            }}>
              {currentLocale.name}
            </span>
          )}
        </div>
        <span style={{ 
          fontSize: typography.fontSize.xs,
          color: colors.neutral[500],
          transition: transitions.transform,
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
        }}>
          ▼
        </span>
      </AnimatedButton>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: spacing[1],
          backgroundColor: 'white',
          border: `1px solid ${colors.neutral[200]}`,
          borderRadius: borderRadius.lg,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          zIndex: 1000,
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          {supportedLocales.map((supportedLocale) => (
            <button
              key={supportedLocale.code}
              onClick={() => handleLanguageChange(supportedLocale.code)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
                padding: `${spacing[2]} ${spacing[3]}`,
                border: 'none',
                backgroundColor: supportedLocale.code === locale ? colors.primary[50] : 'transparent',
                color: colors.neutral[900],
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                textAlign: 'left',
                cursor: 'pointer',
                transition: transitions.colors,
                borderBottom: supportedLocale.code === locale ? `2px solid ${colors.primary[500]}` : 'none'
              }}
              onMouseEnter={(e) => {
                if (supportedLocale.code !== locale) {
                  e.target.style.backgroundColor = colors.neutral[50];
                }
              }}
              onMouseLeave={(e) => {
                if (supportedLocale.code !== locale) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              {showFlag && (
                <span style={{ fontSize: typography.fontSize.base }}>
                  {supportedLocale.flag}
                </span>
              )}
              {showName && (
                <span>{supportedLocale.name}</span>
              )}
              {supportedLocale.code === locale && (
                <span style={{ 
                  marginLeft: 'auto',
                  color: colors.primary[600],
                  fontSize: typography.fontSize.sm
                }}>
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const renderButtons = () => (
    <div style={{ 
      display: 'flex', 
      gap: spacing[2], 
      flexWrap: 'wrap',
      ...style 
    }}>
      {supportedLocales.map((supportedLocale) => (
        <AnimatedButton
          key={supportedLocale.code}
          variant={supportedLocale.code === locale ? 'primary' : 'ghost'}
          size={size}
          onClick={() => handleLanguageChange(supportedLocale.code)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[1],
            padding: `${spacing[2]} ${spacing[3]}`,
            borderRadius: borderRadius.lg,
            border: `1px solid ${colors.neutral[200]}`,
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium
          }}
        >
          {showFlag && (
            <span style={{ fontSize: typography.fontSize.base }}>
              {supportedLocale.flag}
            </span>
          )}
          {showName && (
            <span>{supportedLocale.name}</span>
          )}
        </AnimatedButton>
      ))}
    </div>
  );

  const renderTabs = () => (
    <div style={{ 
      display: 'flex', 
      gap: spacing[1], 
      backgroundColor: colors.neutral[100],
      padding: spacing[1],
      borderRadius: borderRadius.lg,
      ...style 
    }}>
      {supportedLocales.map((supportedLocale) => (
        <AnimatedButton
          key={supportedLocale.code}
          variant={supportedLocale.code === locale ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => handleLanguageChange(supportedLocale.code)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[1],
            padding: `${spacing[2]} ${spacing[3]}`,
            borderRadius: borderRadius.md,
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            backgroundColor: supportedLocale.code === locale ? colors.primary[500] : 'transparent',
            color: supportedLocale.code === locale ? 'white' : colors.neutral[700],
            border: 'none'
          }}
        >
          {showFlag && (
            <span style={{ fontSize: typography.fontSize.sm }}>
              {supportedLocale.flag}
            </span>
          )}
          {showName && (
            <span>{supportedLocale.code.toUpperCase()}</span>
          )}
        </AnimatedButton>
      ))}
    </div>
  );

  const renderCompact = () => (
    <div style={{ position: 'relative', ...style }}>
      <AnimatedButton
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing[1],
          padding: spacing[2],
          borderRadius: borderRadius.full,
          backgroundColor: colors.neutral[100],
          border: `1px solid ${colors.neutral[200]}`,
          minWidth: '40px',
          justifyContent: 'center'
        }}
      >
        <span style={{ fontSize: typography.fontSize.base }}>
          {currentLocale.flag}
        </span>
      </AnimatedButton>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: spacing[1],
          backgroundColor: 'white',
          border: `1px solid ${colors.neutral[200]}`,
          borderRadius: borderRadius.lg,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          zIndex: 1000,
          minWidth: '150px'
        }}>
          {supportedLocales.map((supportedLocale) => (
            <button
              key={supportedLocale.code}
              onClick={() => handleLanguageChange(supportedLocale.code)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
                padding: `${spacing[2]} ${spacing[3]}`,
                border: 'none',
                backgroundColor: supportedLocale.code === locale ? colors.primary[50] : 'transparent',
                color: colors.neutral[900],
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                textAlign: 'left',
                cursor: 'pointer',
                transition: transitions.colors
              }}
              onMouseEnter={(e) => {
                if (supportedLocale.code !== locale) {
                  e.target.style.backgroundColor = colors.neutral[50];
                }
              }}
              onMouseLeave={(e) => {
                if (supportedLocale.code !== locale) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: typography.fontSize.base }}>
                {supportedLocale.flag}
              </span>
              <span>{supportedLocale.name}</span>
              {supportedLocale.code === locale && (
                <span style={{ 
                  marginLeft: 'auto',
                  color: colors.primary[600],
                  fontSize: typography.fontSize.sm
                }}>
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.language-switcher')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown when pressing Escape
  React.useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const renderVariant = () => {
    switch (variant) {
      case 'buttons':
        return renderButtons();
      case 'tabs':
        return renderTabs();
      case 'compact':
        return renderCompact();
      default:
        return renderDropdown();
    }
  };

  return (
    <div className="language-switcher" style={{ direction: getTextDirection() }}>
      {renderVariant()}
    </div>
  );
};

export default LanguageSwitcher;
