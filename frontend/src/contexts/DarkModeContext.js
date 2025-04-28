import React, { createContext, useState, useContext, useEffect } from 'react';

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  // Initialize from localStorage to match your existing implementation
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  
  // Update localStorage when state changes
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    
    // Apply darkMode class to document for global CSS
    if (darkMode) {
      document.documentElement.classList.add('darkMode');
    } else {
      document.documentElement.classList.remove('darkMode');
    }
    
    // Dispatch the event that your existing code listens for
    const event = new CustomEvent('darkModeToggled');
    window.dispatchEvent(event);
  }, [darkMode]);
  
  // Listen for dark mode events from anywhere in the app
  useEffect(() => {
    const handleDarkModeToggle = () => {
      const storedDarkMode = localStorage.getItem('darkMode') === 'true';
      if (storedDarkMode !== darkMode) {
        setDarkMode(storedDarkMode);
      }
    };
    
    window.addEventListener('darkModeToggled', handleDarkModeToggle);
    return () => window.removeEventListener('darkModeToggled', handleDarkModeToggle);
  }, [darkMode]);
  
  // Toggle function
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };
  
  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => useContext(DarkModeContext);