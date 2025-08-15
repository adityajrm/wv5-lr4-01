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
        h-10 text-sm font-medium transition-all duration-300 rounded-full px-4 flex items-center whitespace-nowrap
        ${isOrbFocused ? 'bg-white text-black shadow-lg' : 'text-gray-300 hover:text-white hover:bg-white/10'}
        ${isConnected && !isMuted ? 'text-white bg-black/20' : ''}
      `}
    >
      Atlas AI {isConnected && `(${getConnectionStatus()})`}
    </button>
  );
};
export default AIOrb;