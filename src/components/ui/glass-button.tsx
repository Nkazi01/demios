import React from 'react';
import { cn } from './../../lib/utils';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  glassEffect?: 'subtle' | 'medium' | 'strong';
  children: React.ReactNode;
}

export default function GlassButton({ 
  variant = 'primary', 
  size = 'md', 
  glassEffect = 'medium',
  className,
  children,
  ...props 
}: GlassButtonProps) {
  const baseClasses = "relative overflow-hidden transition-all duration-300 ease-out active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const sizeClasses = {
    sm: "px-3 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-xl",
    lg: "px-8 py-4 text-lg rounded-2xl"
  };

  const variantClasses = {
    primary: "bg-gradient-to-r from-blue-500/80 to-blue-600/80 text-white border border-blue-400/30 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40",
    secondary: "bg-white/10 text-white border border-white/20 shadow-lg shadow-black/10 hover:bg-white/15",
    accent: "bg-gradient-to-r from-teal-500/80 to-green-500/80 text-white border border-teal-400/30 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40",
    danger: "bg-gradient-to-r from-red-500/80 to-red-600/80 text-white border border-red-400/30 shadow-lg shadow-red-500/25 hover:shadow-red-500/40",
    success: "bg-gradient-to-r from-green-500/80 to-green-600/80 text-white border border-green-400/30 shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
  };

  const glassClasses = {
    subtle: "backdrop-blur-sm",
    medium: "backdrop-blur-md",
    strong: "backdrop-blur-lg"
  };

  return (
    <button
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        glassClasses[glassEffect],
        "hover:scale-105 hover:shadow-xl",
        className
      )}
      {...props}
    >
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
      
      {/* Shine effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <span className="relative z-10 font-medium">{children}</span>
    </button>
  );
}