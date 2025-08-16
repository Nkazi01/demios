import React from 'react';
import { cn } from './../../lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'frosted' | 'minimal' | 'gradient';
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;
  shadow?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function GlassCard({ 
  children, 
  className,
  variant = 'default',
  blur = 'md',
  border = true,
  shadow = 'lg'
}: GlassCardProps) {
  const baseClasses = "relative overflow-hidden transition-all duration-300";
  
  const variantClasses = {
    default: "bg-white/10 text-white",
    frosted: "bg-white/20 text-gray-800",
    minimal: "bg-white/5 text-white",
    gradient: "bg-gradient-to-br from-white/20 to-white/5 text-white"
  };

  const blurClasses = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
    xl: "backdrop-blur-xl"
  };

  const shadowClasses = {
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg shadow-black/10",
    xl: "shadow-xl shadow-black/20"
  };

  const borderClass = border ? "border border-white/20" : "";

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        blurClasses[blur],
        shadowClasses[shadow],
        borderClass,
        "rounded-2xl p-6",
        "hover:shadow-xl hover:scale-[1.02]",
        className
      )}
    >
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-2xl" />
      
      {/* Shine effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-30 rounded-2xl" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}