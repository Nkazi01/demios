import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader } from './ui/card';
import { Eye, EyeOff, Loader, MessageSquare } from 'lucide-react';
import RuralHealthLogo from './RuralHealthLogo';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void;
  onNavigateToRegister: () => void;
  isLoading?: boolean;
}

export default function LoginScreen({ onLogin, onNavigateToRegister, isLoading }: LoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    emailOrPhone: '',
    password: ''
  });

  const handleLogin = () => {
    if (!credentials.emailOrPhone || !credentials.password) {
      alert('Please fill in all fields');
      return;
    }
    onLogin(credentials.emailOrPhone, credentials.password);
  };

  const handleSocialLogin = () => {
    alert('Social login is not configured in this demo. Please use the email/password login with the demo accounts provided below.');
  };

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl float-animation"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/5 rounded-full blur-xl float-animation" style={{ animationDelay: '-1s' }}></div>
      
      <Card className="w-full max-w-md card-enhanced relative z-10">
        <CardHeader className="text-center pb-2">
          <div className="mb-6">
            <RuralHealthLogo size="lg" className="mx-auto" />
          </div>
          <h1 className="text-2xl font-semibold gradient-text">Welcome Back</h1>
          <p className="text-gray-600 text-sm">Sign in to continue your healthcare journey</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Email or Phone"
                value={credentials.emailOrPhone}
                onChange={(e) => setCredentials({ ...credentials, emailOrPhone: e.target.value })}
                className="input-glass"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2 relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="input-glass pr-12"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          
          <div className="text-right">
            <button className="text-teal-600 text-sm hover:text-teal-700 transition-colors">
              Forgot password?
            </button>
          </div>
          
          <Button 
            onClick={handleLogin} 
            className="w-full bg-gradient-to-r from-teal-500 to-green-600 hover:from-teal-600 hover:to-green-700 text-white shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or continue with</span>
            </div>
          </div>
          
          <Button 
            onClick={handleSocialLogin}
            variant="outline" 
            className="w-full btn-glass-secondary border-green-300 text-green-700 hover:bg-green-50"
            disabled={isLoading}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Continue with Social Login
          </Button>
          
          <div className="text-center">
            <span className="text-gray-600 text-sm">Don't have an account? </span>
            <button 
              onClick={onNavigateToRegister} 
              className="text-teal-600 hover:text-teal-700 transition-colors font-medium"
              disabled={isLoading}
            >
              Create Account
            </button>
          </div>
          
          <div className="glass-card p-3 rounded-lg">
            <div className="text-xs text-gray-600 text-center mb-2">
              <strong>Demo Accounts:</strong>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <div>👥 Patient: patient@demo.com</div>
              <div>👨‍⚕️ Doctor: doctor@demo.com</div>
              <div>👩‍⚕️ Nurse: nurse@demo.com</div>
              <div>⚙️ Admin: admin@demo.com</div>
              <div className="text-center mt-2 text-gray-400">Password: demo123</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}