import React from 'react';
import { Plus, Heart, MapPin } from 'lucide-react';

interface RuralHealthLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
  className?: string;
}

export default function RuralHealthLogo({ 
  size = 'md', 
  variant = 'full',
  className = ''
}: RuralHealthLogoProps) {
  const sizeClasses = {
    sm: { container: 'w-8 h-8', icon: 'w-4 h-4', text: 'text-sm' },
    md: { container: 'w-12 h-12', icon: 'w-6 h-6', text: 'text-base' },
    lg: { container: 'w-16 h-16', icon: 'w-8 h-8', text: 'text-lg' },
    xl: { container: 'w-24 h-24', icon: 'w-12 h-12', text: 'text-2xl' }
  };

  const sizes = sizeClasses[size];

  const LogoIcon = () => (
    <div className={`${sizes.container} relative flex items-center justify-center ${className}`}>
      {/* Outer ring with gradient */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-400 via-emerald-500 to-green-600 shadow-lg">
        <div className="absolute inset-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30"></div>
      </div>
      
      {/* Inner elements */}
      <div className="relative z-10 flex items-center justify-center">
        {/* Medical cross */}
        <Plus className={`${sizes.icon} text-white drop-shadow-sm`} strokeWidth={2.5} />
        
        {/* Small heart accent */}
        <Heart 
          className="absolute -top-1 -right-1 w-3 h-3 text-red-300 fill-current" 
          strokeWidth={0}
        />
        
        {/* Location pin accent */}
        <MapPin 
          className="absolute -bottom-1 -left-1 w-3 h-3 text-blue-300"
          strokeWidth={2}
        />
      </div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-400 to-green-600 opacity-30 blur-md scale-110"></div>
    </div>
  );

  const LogoText = () => (
    <div className={`${sizes.text} font-bold bg-gradient-to-r from-teal-600 to-green-700 bg-clip-text text-transparent`}>
      Rural Health
    </div>
  );

  if (variant === 'icon') return <LogoIcon />;
  if (variant === 'text') return <LogoText />;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoIcon />
      <div className="flex flex-col">
        <LogoText />
        {size === 'lg' || size === 'xl' ? (
          <div className="text-xs text-gray-600 leading-tight">
            Quality Healthcare for Rural Areas
          </div>
        ) : null}
      </div>
    </div>
  );
}