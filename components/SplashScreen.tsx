import React, { useEffect } from 'react';
import RuralHealthLogo from './RuralHealthLogo';

interface SplashScreenProps {
  onContinue: () => void;
}

export default function SplashScreen({ onContinue }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl float-animation"></div>
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-white/5 rounded-full blur-xl float-animation" style={{ animationDelay: '-1s' }}></div>
      <div className="absolute top-1/3 right-20 w-16 h-16 bg-white/10 rounded-full blur-xl float-animation" style={{ animationDelay: '-2s' }}></div>
      
      <div className="text-center text-white relative z-10">
        {/* Logo with enhanced effects */}
        <div className="mb-12 transform scale-110">
          <RuralHealthLogo size="xl" className="drop-shadow-2xl" />
        </div>
        
        {/* Tagline with glassmorphism */}
        <div className="glass-card p-6 rounded-2xl mb-8 max-w-sm mx-auto">
          <p className="text-xl opacity-95 leading-relaxed">
            Bringing Quality Healthcare to Rural Areas
          </p>
        </div>

        {/* Features preview */}
        <div className="grid grid-cols-2 gap-4 mb-12 max-w-xs mx-auto">
          <div className="glass-card p-4 rounded-xl text-center">
            <div className="text-2xl mb-2">🏥</div>
            <p className="text-sm">Find Clinics</p>
          </div>
          <div className="glass-card p-4 rounded-xl text-center">
            <div className="text-2xl mb-2">📱</div>
            <p className="text-sm">Telemedicine</p>
          </div>
          <div className="glass-card p-4 rounded-xl text-center">
            <div className="text-2xl mb-2">📋</div>
            <p className="text-sm">Health Records</p>
          </div>
          <div className="glass-card p-4 rounded-xl text-center">
            <div className="text-2xl mb-2">📚</div>
            <p className="text-sm">Education</p>
          </div>
        </div>
        
        {/* Loading indicator with enhanced styling */}
        <div className="flex items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/30 border-t-white"></div>
          <span className="text-white/80 text-sm">Loading your healthcare experience...</span>
        </div>

        {/* Version info */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 text-xs">
          Rural Health v1.0 • Powered by Supabase
        </div>
      </div>
    </div>
  );
}