import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Loader, User, Mail, Phone, Shield } from 'lucide-react';
import RuralHealthLogo from './RuralHealthLogo';

interface RegistrationScreenProps {
  onRegister: (email: string, password: string, name: string, role: 'patient' | 'doctor' | 'nurse' | 'admin', phone?: string) => void;
  onNavigateToLogin: () => void;
  isLoading?: boolean;
}

export default function RegistrationScreen({ onRegister, onNavigateToLogin, isLoading }: RegistrationScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient' as 'patient' | 'doctor' | 'nurse' | 'admin'
  });

  const handleRegister = () => {
    if (!formData.name || !formData.email || !formData.password) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    onRegister(formData.email, formData.password, formData.name, formData.role, formData.phone);
  };

  const roles = [
    { value: 'patient', label: 'Patient', icon: User, description: 'Seek medical care and consultations' },
    { value: 'doctor', label: 'Doctor', icon: Shield, description: 'Provide medical consultations' },
    { value: 'nurse', label: 'Nurse', icon: Shield, description: 'Assist with patient care' },
    { value: 'admin', label: 'Admin', icon: Shield, description: 'Manage system and clinics' }
  ];

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-white/5 rounded-full blur-xl float-animation"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-white/5 rounded-full blur-xl float-animation" style={{ animationDelay: '-1s' }}></div>
      
      <Card className="w-full max-w-md card-enhanced relative z-10">
        <CardHeader className="text-center pb-2">
          <div className="mb-6">
            <RuralHealthLogo size="lg" className="mx-auto" />
          </div>
          <h1 className="text-2xl font-semibold gradient-text">Join Rural Health</h1>
          <p className="text-gray-600 text-sm">Create your account to access healthcare services</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-glass pl-10"
                disabled={isLoading}
              />
            </div>
            
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-glass pl-10"
                disabled={isLoading}
              />
            </div>
            
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                type="tel"
                placeholder="Phone Number (Optional)"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input-glass pl-10"
                disabled={isLoading}
              />
            </div>
            
            <Input
              type="password"
              placeholder="Password (min. 6 characters)"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="input-glass"
              disabled={isLoading}
            />
            
            <Input
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="input-glass"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Account Type</label>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <div
                    key={role.value}
                    className={`glass-card p-3 rounded-lg cursor-pointer transition-all ${
                      formData.role === role.value 
                        ? 'bg-teal-50 border-teal-300 shadow-md' 
                        : 'hover:bg-gray-50/50'
                    }`}
                    onClick={() => setFormData({ ...formData, role: role.value as any })}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`w-4 h-4 ${formData.role === role.value ? 'text-teal-600' : 'text-gray-500'}`} />
                      <span className={`text-sm font-medium ${formData.role === role.value ? 'text-teal-900' : 'text-gray-700'}`}>
                        {role.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-tight">{role.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
          
          <Button 
            onClick={handleRegister} 
            className="w-full bg-gradient-to-r from-teal-500 to-green-600 hover:from-teal-600 hover:to-green-700 text-white shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
          
          <div className="text-center">
            <span className="text-gray-600 text-sm">Already have an account? </span>
            <button 
              onClick={onNavigateToLogin} 
              className="text-teal-600 hover:text-teal-700 transition-colors font-medium"
              disabled={isLoading}
            >
              Sign In
            </button>
          </div>
          
          <div className="glass-card p-3 rounded-lg">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              By creating an account, you agree to our Terms of Service and Privacy Policy. 
              Your medical data is encrypted and secure.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}