import React, { createContext, useState, useEffect, useContext } from 'react';

interface ThemeContextType {
  theme: 'dark';
  toggleTheme: () => void; // Kept for compatibility but will do nothing
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always set to dark theme
  const [theme] = useState<'dark'>('dark');

  useEffect(() => {
    // Always ensure dark mode is applied
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  // This function is kept for compatibility but does nothing
  const toggleTheme = () => {
    // No-op function
    console.log('Light mode has been disabled');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};