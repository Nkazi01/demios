import React from 'react';
import { Plus, Heart } from 'lucide-react';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'gradient';
  showText?: boolean;
}

export default function AppLogo({ size = 'md', variant = 'gradient', showText = true }: AppLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  const getLogoBackground = () => {
    switch (variant) {
      case 'light':
        return 'bg-white/20 backdrop-blur-md border border-white/30';
      case 'dark':
        return 'bg-black/20 backdrop-blur-md border border-white/20';
      case 'gradient':
      default:
        return 'bg-gradient-to-br from-teal-400 via-blue-500 to-green-500';
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'light':
        return 'text-white';
      case 'dark':
        return 'text-white';
      case 'gradient':
      default:
        return 'text-white';
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} ${getLogoBackground()} rounded-2xl flex items-center justify-center relative overflow-hidden shadow-xl`}>
        {/* Glass effect overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
        
        {/* Medical cross with heart */}
        <div className="relative z-10 flex items-center justify-center">
          <div className="relative">
            <Plus className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-16 h-16'} text-white`} strokeWidth={3} />
            <Heart className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-8 h-8'} text-red-300 fill-current`} />
          </div>
        </div>
        
        {/* Shine effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-50" />
      </div>

      {/* App Name */}
      {showText && (
        <div className={getTextColor()}>
          <h1 className={`${textSizes[size]} font-bold tracking-tight`}>
            Rural<span className="text-blue-300">Health</span>
          </h1>
          {size !== 'sm' && (
            <p className={`${size === 'md' ? 'text-xs' : size === 'lg' ? 'text-sm' : 'text-base'} opacity-80 font-medium tracking-wide`}>
              Quality Care Everywhere
            </p>
          )}
        </div>
      )}
    </div>
  );
}