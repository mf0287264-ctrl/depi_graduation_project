import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-btn"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '38px',
        height: '38px',
        borderRadius: '50%',
        backgroundColor: 'var(--bg-input)',
        color: isDark ? '#fbbf24' : '#64748b',
        border: '1px solid var(--border-subtle)',
        transition: 'all 0.25s ease',
        cursor: 'pointer'
      }}
    >
      {isDark ? (
        <Sun size={19} className="transition-transform hover:rotate-45" />
      ) : (
        <Moon size={19} className="transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}
