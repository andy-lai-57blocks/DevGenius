import React, { createContext, useContext, useState, useEffect } from 'react';

// Create Theme Context
const ThemeContext = createContext({
  isDarkTheme: false,
  toggleTheme: () => {},
  setTheme: () => {}
});

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    // Try to load theme preference from localStorage
    const savedTheme = localStorage.getItem('one-toys-theme');
    if (savedTheme !== null) {
      return savedTheme === 'dark';
    }
    
    // Fallback to system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    // Default to light theme
    return false;
  });

  // Save theme preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('one-toys-theme', isDarkTheme ? 'dark' : 'light');
    
    // Apply theme class to document body for global CSS styling
    document.body.classList.toggle('dark-theme', isDarkTheme);
    document.body.classList.toggle('light-theme', !isDarkTheme);
  }, [isDarkTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e) => {
      // Only update if user hasn't manually set a preference
      const savedTheme = localStorage.getItem('one-toys-theme');
      if (savedTheme === null) {
        setIsDarkTheme(e.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  // Toggle between light and dark theme
  const toggleTheme = () => {
    setIsDarkTheme(prev => !prev);
  };

  // Set specific theme
  const setTheme = (theme) => {
    const isDark = theme === 'dark';
    setIsDarkTheme(isDark);
  };

  const value = {
    isDarkTheme,
    toggleTheme,
    setTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Export context for advanced usage
export { ThemeContext };
export default ThemeProvider;
