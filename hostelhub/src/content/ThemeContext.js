import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const updateTheme = () => {
    const newTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
    setTheme(newTheme);
  };

  useEffect(() => {
    updateTheme(); // Set initial theme
    window.addEventListener('theme-changed', updateTheme);

    return () => window.removeEventListener('theme-changed', updateTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for easy usage
export const useTheme = () => useContext(ThemeContext);
