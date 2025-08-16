import { useState, useEffect, createContext, useContext } from 'react';
import { useLocation } from 'react-router-dom';

interface NavigationState {
  currentSection: string;
  focusedIndex: number;
  weatherCondition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy';
}

interface NavigationContextType extends NavigationState {
  setWeatherCondition: (condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy') => void;
  setFocusedIndex: (index: number) => void;
  setCurrentSection: (section: string) => void;
}

export const NavigationContext = createContext<NavigationContextType | null>(null);

export const useUniversalNavigation = () => {
  const [currentSection, setCurrentSection] = useState('nav');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [weatherCondition, setWeatherCondition] = useState<'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy'>('sunny');
  const location = useLocation();

  // Reset navigation state on route change
  useEffect(() => {
    setCurrentSection('nav');
    setFocusedIndex(0);
  }, [location.pathname]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (currentSection === 'nav') {
        switch (event.key) {
          case 'ArrowLeft':
            event.preventDefault();
            setFocusedIndex((prev) => Math.max(0, prev - 1));
            break;
          case 'ArrowRight':
            event.preventDefault();
            setFocusedIndex((prev) => Math.min(5, prev + 1)); // 6 total items (3 nav + time + weather + ai)
            break;
          case 'ArrowDown':
            event.preventDefault();
            // Transition to main content section
            setCurrentSection('main');
            setFocusedIndex(0);
            break;
          case 'Enter':
            event.preventDefault();
            // Handle Enter key for header items
            if (focusedIndex < 3) {
              // Navigation items
              const navPaths = ['/', '/apps', '/restaurant'];
              const targetPath = navPaths[focusedIndex];
              if (targetPath) {
                window.location.href = targetPath;
              }
            } else if (focusedIndex === 5) {
              // AI Orb
              const aiButton = document.getElementById('ai-orb-button');
              if (aiButton) aiButton.click();
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSection, focusedIndex]);

  return {
    currentSection,
    focusedIndex,
    weatherCondition,
    setWeatherCondition,
    setFocusedIndex,
    setCurrentSection
  };
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};