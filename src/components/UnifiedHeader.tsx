import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import WeatherWidget from './WeatherWidget';
import AIOrb from './AIOrb';
import { useGeminiLiveAudio } from '@/hooks/useGeminiLiveAudio';
import { Clock } from 'lucide-react';
interface UnifiedHeaderProps {
  focused: boolean;
  focusedIndex: number;
  onWeatherChange: (condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy') => void;
}
type NavItem = {
  name: string;
  path: string;
  type: 'nav';
};
type TimeItem = {
  name: string;
  type: 'time';
};
type WeatherItem = {
  name: string;
  type: 'weather';
};
type AIItem = {
  name: string;
  type: 'ai';
};
type HeaderItem = NavItem | TimeItem | WeatherItem | AIItem;
const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({
  focused,
  focusedIndex,
  onWeatherChange
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    isConnected,
    isMuted
  } = useGeminiLiveAudio();
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };
  const navItems: NavItem[] = [{
    name: 'Home',
    path: '/',
    type: 'nav'
  }, {
    name: 'Apps',
    path: '/apps',
    type: 'nav'
  }, {
    name: 'Restaurant',
    path: '/restaurant',
    type: 'nav'
  }];
  const allItems: HeaderItem[] = [...navItems, {
    name: getCurrentTime(),
    type: 'time'
  }, {
    name: 'Weather',
    type: 'weather'
  }, {
    name: 'Atlas AI',
    type: 'ai'
  }];
  const handleNavClick = (path: string, index: number) => {
    // Persist focus index when navigating with mouse click
    localStorage.setItem('header-focus-index', index.toString());
    navigate(path);
  };
  return <div className="flex justify-center w-full p-6 md:p-8 fixed top-0 left-0 right-0 z-[60] py-[25px]">
      {/* Blue glow background when AI is active */}
      {isConnected && !isMuted && (
        <div className="absolute inset-0 flex justify-center items-start pt-6 md:pt-8">
          <div className="w-[800px] h-20 bg-ai-blue/30 blur-3xl rounded-full animate-ai-glow-pulse"></div>
        </div>
      )}
      
      <div className={`
        bg-black/30 backdrop-blur-md rounded-full shadow-2xl py-[4px] px-[4px] relative transition-all duration-500 overflow-hidden
        ${isConnected && !isMuted 
          ? 'border-2 border-ai-blue shadow-[0_0_30px_hsl(var(--ai-blue)/0.6)] animate-ai-pulse-complex' 
          : 'border border-white/10'
        }
      `}>
        {/* Inner blue glow overlay when AI is active */}
        {isConnected && !isMuted && (
          <div className="absolute inset-0 rounded-full bg-ai-blue/10 animate-ai-glow-pulse"></div>
        )}
        <div className={`
          flex items-center transition-all duration-700 ease-out
          ${isConnected && !isMuted ? 'w-full' : 'space-x-2'}
        `}>
          {isConnected && !isMuted ? (
            // Only show AI button when expanded
            <div className="w-full">
              <AIOrb focused={focused && focusedIndex === allItems.findIndex(item => item.type === 'ai')} />
            </div>
          ) : (
            // Show all buttons when AI is not active
            allItems.map((item, index) => {
              const isActive = item.type === 'nav' && 'path' in item && location.pathname === item.path;
              const isFocused = focused && focusedIndex === index;
              
              if (item.type === 'weather') {
                return <div key="weather" className={`
                        h-10 flex items-center transition-all duration-500 ease-out rounded-full px-3 transform
                        ${isFocused ? 'bg-white/20 shadow-lg scale-105 translate-x-1' : 'hover:bg-white/10 scale-100 translate-x-0'}
                      `}>
                      <WeatherWidget onWeatherChange={onWeatherChange} />
                    </div>;
              }
              
              if (item.type === 'ai') {
                return <AIOrb key="ai" focused={isFocused} />;
              }
              
              if (item.type === 'time') {
                return <div key="time" className={`
                        h-10 flex items-center text-gray-300 transition-all duration-500 ease-out rounded-full px-3 transform
                        ${isFocused ? 'bg-white/20 shadow-lg text-white scale-105 translate-x-1' : 'hover:bg-white/10 hover:text-white scale-100 translate-x-0'}
                      `}>
                      <Clock size={16} className="mr-2" />
                      <span className="font-semibold whitespace-nowrap text-sm">
                        {getCurrentTime()}
                      </span>
                    </div>;
              }

              // Navigation items
              if (item.type === 'nav') {
                return <button 
                        key={item.path} 
                        onClick={() => handleNavClick(item.path, index)} 
                        className={`
                        h-10 text-sm font-medium transition-all duration-500 ease-out rounded-full px-4 flex items-center whitespace-nowrap transform
                        ${isActive ? 'bg-white text-black shadow-lg scale-105 translate-x-1' : 
                          isFocused ? 'bg-gray-600 text-white shadow-lg scale-105 translate-x-1' : 
                          'text-gray-300 hover:text-white hover:bg-white/10 scale-100 translate-x-0'}
                      `}>
                      {item.name}
                    </button>;
              }
              return null;
            })
          )}
        </div>
      </div>
    </div>;
};
export default UnifiedHeader;