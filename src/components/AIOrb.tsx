import React, { useState, useEffect } from 'react';
import { useGeminiLiveAudio } from '@/hooks/useGeminiLiveAudio';
import { useAIOrbFocus } from '@/hooks/useAIOrbFocus';

interface AIOrbProps {
  focused?: boolean;
  onClick?: () => void;
}

const AIOrb: React.FC<AIOrbProps> = ({
  focused = false,
  onClick
}) => {
  const {
    isConnected,
    isMuted,
    toggleMute,
    mute,
    connect,
    disconnect
  } = useGeminiLiveAudio();
  const {
    isFocused,
    setFocused
  } = useAIOrbFocus();

  // Listen for mute events from Gemini service
  useEffect(() => {
    const handleMuteEvent = () => {
      mute();
    };
    window.addEventListener('aiOrb:mute', handleMuteEvent);
    return () => {
      window.removeEventListener('aiOrb:mute', handleMuteEvent);
    };
  }, [mute]);

  const handleClick = async () => {
    onClick?.();
    if (!isConnected) {
      // First click - establish connection
      await connect();
    } else {
      // Subsequent clicks - toggle mute
      await toggleMute();
    }
  };

  const getConnectionStatus = () => {
    if (!isConnected) return 'Connect';
    if (isMuted) return 'Muted';
    return 'Active';
  };

  // Use focused prop or global focus state
  const isOrbFocused = focused || isFocused;
  useEffect(() => {
    // Update global focus state when focused prop changes
    if (focused !== isFocused) {
      setFocused(focused);
    }
  }, [focused, isFocused, setFocused]);

  return (
    <button 
      id="ai-orb-button" 
      onClick={handleClick} 
      className={`
        h-10 text-sm font-medium transition-all duration-300 rounded-full px-4 flex items-center whitespace-nowrap relative
        ${isOrbFocused ? 'bg-white text-black shadow-lg' : 'text-gray-300 hover:text-white hover:bg-white/10'}
        ${isConnected && !isMuted ? 'text-white bg-black/20' : ''}
      `}
    >
      <span className="flex items-center gap-2">
        <span>Atlas AI</span>
        
        {/* Waveform Animation when active and not muted */}
        {isConnected && !isMuted && (
          <div className="flex items-center gap-0.5">
            <div className="w-0.5 h-3 bg-ai-blue rounded-full animate-waveform"></div>
            <div className="w-0.5 h-4 bg-ai-blue rounded-full animate-waveform-delayed"></div>
            <div className="w-0.5 h-2 bg-ai-blue rounded-full animate-waveform-delayed-2"></div>
            <div className="w-0.5 h-3 bg-ai-blue rounded-full animate-waveform"></div>
          </div>
        )}
        
        {/* Muted indicator */}
        {isConnected && isMuted && (
          <div className="relative">
            <div className="w-4 h-3 border border-ai-muted rounded opacity-50"></div>
            <div className="absolute top-1/2 left-1/2 w-5 h-0.5 bg-ai-muted transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
          </div>
        )}
        
        {isConnected && <span className="text-xs">({getConnectionStatus()})</span>}
      </span>
    </button>
  );
};
export default AIOrb;