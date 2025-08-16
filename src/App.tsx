import React, { useState, useEffect } from 'react';
import { supabase } from './utils/supabase/client';
import { projectId, publicAnonKey } from './utils/supabase/info';
import RuralHealthLogo from './components/RuralHealthLogo';
import NotificationSystem from './components/NotificationSystem';
import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import RegistrationScreen from './components/RegistrationScreen';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import AdminDashboard from './components/AdminDashboard';
import ClinicLocator from './components/ClinicLocator';
import ClinicDetails from './components/ClinicDetails';
import AppointmentBooking from './components/AppointmentBooking';
import TelemedicineConsultation from './components/TelemedicineConsultation';
import HealthRecords from './components/HealthRecords';
import HealthEducation from './components/HealthEducation';
import ArticleView from './components/ArticleView';
import AdminPanel from './components/AdminPanel';
import AIHealthAssistant from './components/AIHealthAssistant';
import LanguageSelector from './components/LanguageSelector';
import TranslationDemo from './components/TranslationDemo';
import { TranslationProvider } from './contexts/TranslationContext';

export type UserRole = 'patient' | 'doctor' | 'nurse' | 'admin';
export type Screen = 'splash' | 'login' | 'register' | 'dashboard' | 'clinic-locator' | 'clinic-details' | 'appointment-booking' | 'telemedicine' | 'health-records' | 'health-education' | 'article-view' | 'admin-panel' | 'ai-assistant' | 'translation-demo';

export interface AppState {
  currentScreen: Screen;
  userRole: UserRole | null;
  isLoggedIn: boolean;
  user: any;
  userProfile: any;
  selectedClinic: any;
  selectedArticle: any;
  isLoading: boolean;
  accessToken: string | null;
  navHistory: Screen[];
}

export default function App() {
  const [appState, setAppState] = useState<AppState>({
    currentScreen: 'splash',
    userRole: null,
    isLoggedIn: false,
    user: null,
    userProfile: null,
    selectedClinic: null,
    selectedArticle: null,
    isLoading: true,
  accessToken: null,
  navHistory: []
  });

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await loadUserProfile(session.user, session.access_token);
      } else {
        setAppState(prev => ({ 
          ...prev, 
          isLoading: false,
          currentScreen: 'splash'
        }));
      }
    } catch (error) {
      console.error('Session check error:', error);
      setAppState(prev => ({ 
        ...prev, 
        isLoading: false,
        currentScreen: 'splash'
      }));
    }
  };

  const loadUserProfile = async (user: any, accessToken: string) => {
    try {
      const supabaseUrl = `https://${projectId}.supabase.co`;
      const response = await fetch(`${supabaseUrl}/functions/v1/make-server-3f2c9fd9/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAppState(prev => ({
          ...prev,
          isLoggedIn: true,
          user,
          userProfile: data.profile,
          userRole: data.profile.role,
          currentScreen: 'dashboard',
          isLoading: false,
          accessToken
        }));
      } else {
        throw new Error('Failed to load profile');
      }
    } catch (error) {
      console.error('Load profile error:', error);
      setAppState(prev => ({ 
        ...prev, 
        isLoading: false,
        currentScreen: 'login',
        accessToken: null
      }));
    }
  };

  const navigateTo = (screen: Screen, data?: any) => {
    setAppState(prev => ({
      ...prev,
      // push current screen into history when navigating
      navHistory: prev.currentScreen ? [...prev.navHistory, prev.currentScreen] : prev.navHistory,
      currentScreen: screen,
      ...(data && { ...data })
    }));
  };

  const goBack = () => {
    setAppState(prev => {
      const history = [...prev.navHistory];
      const last = history.pop();
      return {
        ...prev,
        navHistory: history,
        currentScreen: last || (prev.isLoggedIn ? 'dashboard' : 'login')
      };
    });
  };

  // Wrapper to satisfy components that type onNavigate as (screen: string)
  const navigateToAny = (screen: string, data?: any) => {
    navigateTo(screen as Screen, data);
  };

  const login = async (email: string, password: string) => {
    try {
      setAppState(prev => ({ ...prev, isLoading: true }));

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        alert(error.message);
        setAppState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      if (data.user && data.session) {
        await loadUserProfile(data.user, data.session.access_token);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
      setAppState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const register = async (email: string, password: string, name: string, role: UserRole, phone?: string) => {
    try {
      setAppState(prev => ({ ...prev, isLoading: true }));

      const supabaseUrl = `https://${projectId}.supabase.co`;
      const response = await fetch(`${supabaseUrl}/functions/v1/make-server-3f2c9fd9/auth/signup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, name, role, phone })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      const data = await response.json();
      
      // Now sign in the user
      await login(email, password);
    } catch (error) {
      console.error('Registration error:', error);
      alert(error instanceof Error ? error.message : 'Registration failed. Please try again.');
      setAppState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setAppState({
        currentScreen: 'login',
        userRole: null,
        isLoggedIn: false,
        user: null,
        userProfile: null,
        selectedClinic: null,
        selectedArticle: null,
        isLoading: false,
  accessToken: null,
  navHistory: []
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (appState.isLoading) {
    return (
      <div className="min-h-screen animated-bg flex items-center justify-center">
        <div className="text-center text-white">
          <RuralHealthLogo size="xl" />
          <div className="mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  const renderScreen = () => {
    switch (appState.currentScreen) {
      case 'splash':
        return <SplashScreen onContinue={() => navigateTo('login')} />;
      case 'login':
        return (
          <LoginScreen 
            onLogin={login} 
            onNavigateToRegister={() => navigateTo('register')}
            isLoading={appState.isLoading}
          />
        );
      case 'register':
        return (
          <RegistrationScreen 
            onRegister={register} 
            onNavigateToLogin={() => navigateTo('login')}
            isLoading={appState.isLoading}
          />
        );
      case 'dashboard':
        if (appState.userRole === 'patient') {
          return (
            <PatientDashboard 
              onNavigate={navigateToAny} 
              user={appState.user}
              accessToken={appState.accessToken}
            />
          );
        } else if (appState.userRole === 'doctor' || appState.userRole === 'nurse') {
          return <DoctorDashboard onNavigate={navigateToAny} userProfile={appState.userProfile} />;
        } else if (appState.userRole === 'admin') {
          return <AdminDashboard onNavigate={navigateToAny} userProfile={appState.userProfile} />;
        }
        break;
      case 'clinic-locator':
        return (
          <ClinicLocator 
            onNavigate={navigateToAny} 
            onBack={() => navigateTo('dashboard')} 
          />
        );
      case 'clinic-details':
        return (
          <ClinicDetails 
            clinic={appState.selectedClinic} 
            onNavigate={navigateToAny} 
            onBack={() => navigateTo('clinic-locator')} 
          />
        );
      case 'appointment-booking':
        return (
          <AppointmentBooking 
            clinic={appState.selectedClinic} 
            onNavigate={navigateToAny} 
            onBack={() => navigateTo('clinic-details')}
          />
        );
      case 'telemedicine':
        return (
          <TelemedicineConsultation 
            onNavigate={navigateToAny} 
            onBack={() => navigateTo('dashboard')}
            userProfile={appState.userProfile}
          />
        );
      case 'health-records':
        return (
          <HealthRecords 
            onNavigate={navigateToAny} 
            onBack={() => navigateTo('dashboard')}
          />
        );
      case 'health-education':
        return (
          <HealthEducation 
            onNavigate={navigateToAny} 
            onBack={() => navigateTo('dashboard')} 
          />
        );
      case 'article-view':
        return (
          <ArticleView 
            article={appState.selectedArticle} 
            onBack={() => navigateTo('health-education')} 
          />
        );
      case 'admin-panel':
        return (
          <AdminPanel 
            onNavigate={navigateToAny} 
            onBack={() => navigateTo('dashboard')}
          />
        );
      case 'ai-assistant':
        return (
          <AIHealthAssistant 
            onBack={() => navigateTo('dashboard')}
            userProfile={appState.userProfile}
          />
        );
      case 'translation-demo':
        return (
          <TranslationDemo 
            onBack={() => navigateTo('dashboard')}
          />
        );
      default:
        return <SplashScreen onContinue={() => navigateTo('login')} />;
    }
  };

  return (
    <TranslationProvider>
      {(() => {
        const showTopNav = appState.isLoggedIn && appState.currentScreen !== 'splash' && appState.currentScreen !== 'login' && appState.currentScreen !== 'register';
        return (
          <div className={"min-h-screen bg-gray-50 " + (showTopNav ? 'pt-20' : '')}>
            {/* Top Navigation Bar */}
            {showTopNav && (
              <div className="fixed top-0 left-0 right-0 glass-nav z-40 p-3 h-16 flex items-center">
                <div className="flex items-center justify-between w-full max-w-4xl mx-auto">
                  <div className="flex items-center gap-2">
                    {/* Back button on non-dashboard pages */}
                    {appState.currentScreen !== 'dashboard' && (
                      <button
                        onClick={goBack}
                        className="glass-button px-3 py-1 rounded-lg text-sm font-medium"
                        aria-label="Go back"
                      >
                        ← Back
                      </button>
                    )}
                    <RuralHealthLogo size="sm" />
                  </div>
                  <div className="flex items-center gap-2">
                    <LanguageSelector compact />
                    {appState.user && appState.accessToken && (
                      <NotificationSystem 
                        userId={appState.user.id} 
                        userRole={appState.userRole || 'patient'} 
                        accessToken={appState.accessToken}
                      />
                    )}
                    <button
                      onClick={logout}
                      className="glass-button px-3 py-1 rounded-lg text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Main content */}
            {renderScreen()}
          </div>
        );
      })()}
    </TranslationProvider>
  );
}