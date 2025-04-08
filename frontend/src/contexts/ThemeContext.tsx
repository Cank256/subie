
import React, { createContext, useContext, useEffect, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { applyTheme } from '@/utils/utils';

type ThemeContextType = {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    return savedTheme || 'system';
  });
  
  const { user, isLoading: authLoading } = useAuth();

  // When theme changes, apply it
  useEffect(() => {
    applyTheme(theme);
    // Always save to localStorage for guest users and as fallback
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // When user logs in, fetch their theme preference
  useEffect(() => {
    const loadUserTheme = async () => {
      if (user) {
        if (user.preferences && user.preferences.theme) {
          setThemeState(user.preferences.theme || 'dark');
        } else {
          setThemeState('system');
        }
      }
    };
    
    if (!authLoading && user) {
      loadUserTheme();
    }
  }, [user, authLoading]);

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};
