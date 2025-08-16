import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Calendar, 
  MapPin, 
  Video, 
  FileText, 
  BookOpen, 
  Bell, 
  Heart,
  Bot,
  Sparkles,
  MessageSquare,
  Globe
} from 'lucide-react';
import { dataHelpers } from '../utils/supabase/client';
import { projectId } from '../utils/supabase/info';
import { useTranslation } from '../contexts/TranslationContext';

interface PatientDashboardProps {
  onNavigate: (screen: string) => void;
  user: any;
  accessToken: string | null;
}

interface DashboardStats {
  upcomingAppointments: number;
  unreadNotifications: number;
  healthRecords: number;
  nearestClinic: string;
}

export default function PatientDashboard({ onNavigate, user, accessToken }: PatientDashboardProps) {
  const { translateText } = useTranslation();
  const [stats, setStats] = useState<DashboardStats>({
    upcomingAppointments: 0,
    unreadNotifications: 0,
    healthRecords: 0,
    nearestClinic: 'Loading...'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [quickActions, setQuickActions] = useState([
    {
      title: 'AI Health Assistant',
      description: 'Get instant health guidance from our AI assistant',
      icon: Bot,
      color: 'bg-gradient-to-br from-purple-500 to-pink-600',
      action: () => onNavigate('ai-assistant'),
      badge: 'NEW',
      badgeColor: 'bg-gradient-to-r from-purple-400 to-pink-500'
    },
    {
      title: 'Find Clinics',
      description: 'Locate nearby healthcare facilities',
      icon: MapPin,
      color: 'bg-gradient-to-br from-teal-500 to-green-600',
      action: () => onNavigate('clinic-locator')
    },
    {
      title: 'Book Appointment',
      description: 'Schedule your next medical visit',
      icon: Calendar,
      color: 'bg-gradient-to-br from-blue-500 to-purple-600',
      action: () => onNavigate('appointment-booking')
    },
    {
      title: 'Video Consultation',
      description: 'Connect with doctors online',
      icon: Video,
      color: 'bg-gradient-to-br from-green-500 to-teal-600',
      action: () => onNavigate('telemedicine')
    },
    {
      title: 'Health Records',
      description: 'Access your medical history',
      icon: FileText,
      color: 'bg-gradient-to-br from-orange-500 to-red-600',
      action: () => onNavigate('health-records')
    },
    {
      title: 'Health Education',
      description: 'Learn about health and wellness',
      icon: BookOpen,
      color: 'bg-gradient-to-br from-indigo-500 to-purple-600',
      action: () => onNavigate('health-education')
    },
    {
      title: 'Translation Demo',
      description: 'Voice & text translation for healthcare',
      icon: Globe,
      color: 'bg-gradient-to-br from-pink-500 to-rose-600',
      action: () => onNavigate('translation-demo')
    }
  ]);

  useEffect(() => {
    loadDashboardData();
  }, [user, accessToken]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Load appointments
      let appointmentCount = 0;
      if (accessToken) {
        try {
          const appointmentData = await dataHelpers.getAppointments(accessToken);
          appointmentCount = appointmentData.appointments?.length || 0;
        } catch (error) {
          console.warn('Could not load appointments:', error);
        }
      }

      // Load clinics for nearest clinic info
      const clinicData = await dataHelpers.getClinics();
      const nearestClinicName = clinicData.clinics?.[0]?.name || 'Village Health Center';

      // Load notifications count
      let notificationCount = 0;
      if (accessToken) {
        try {
          const supabaseUrl = `https://${projectId}.supabase.co`;
          const response = await fetch(`${supabaseUrl}/functions/v1/make-server-3f2c9fd9/notifications`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            notificationCount = data.notifications?.filter((n: any) => !n.read).length || 0;
          }
        } catch (error) {
          console.warn('Could not load notifications:', error);
        }
      }

      setStats({
        upcomingAppointments: appointmentCount,
        unreadNotifications: notificationCount,
        healthRecords: Math.floor(Math.random() * 10) + 1, // Demo data
        nearestClinic: nearestClinicName
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen animated-bg p-4 pb-24">
      {/* Welcome Section */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          {translateText('welcome')}, {user?.user_metadata?.name || translateText('patient')}! 👋
        </h1>
        <p className="text-white/80">
          {translateText('health')} journey starts here
        </p>
      </div>

      {/* AI Assistant Highlight */}
      <Card className="card-enhanced mb-6 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 p-1">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg gradient-text">{translateText('ai_assistant')}</h3>
                <p className="text-gray-600 text-sm">Get instant health guidance, symptom analysis, and medical advice powered by advanced AI technology.</p>
              </div>
              <Button
                onClick={() => onNavigate('ai-assistant')}
                className="bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700"
              >
                <Bot className="w-4 h-4 mr-2" />
                {translateText('ai_assistant')}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card className="card-enhanced">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-teal-600 mb-1">
              {isLoading ? '...' : stats.upcomingAppointments}
            </div>
            <div className="text-sm text-gray-600">{translateText('appointment')}</div>
            <Calendar className="w-5 h-5 text-teal-500 mx-auto mt-2" />
          </CardContent>
        </Card>

        <Card className="card-enhanced">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {isLoading ? '...' : stats.unreadNotifications}
            </div>
            <div className="text-sm text-gray-600">{translateText('notifications')}</div>
            <Bell className="w-5 h-5 text-blue-500 mx-auto mt-2" />
          </CardContent>
        </Card>

        <Card className="card-enhanced">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {isLoading ? '...' : stats.healthRecords}
            </div>
            <div className="text-sm text-gray-600">{translateText('records')}</div>
            <FileText className="w-5 h-5 text-purple-500 mx-auto mt-2" />
          </CardContent>
        </Card>

        <Card className="card-enhanced">
          <CardContent className="p-4 text-center">
            <div className="text-xs font-semibold text-green-600 mb-1 leading-tight">
              {isLoading ? '...' : stats.nearestClinic}
            </div>
            <div className="text-sm text-gray-600">{translateText('clinic')}</div>
            <MapPin className="w-5 h-5 text-green-500 mx-auto mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white mb-4">{translateText('dashboard')}</h2>
        
        <div className="grid gap-4">
          {quickActions.map((action, index) => (
            <Card 
              key={index} 
              className="card-enhanced cursor-pointer transition-all hover:scale-[1.02]"
              onClick={action.action}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${action.color} relative`}>
                    <action.icon className="w-6 h-6 text-white" />
                    {action.badge && (
                      <div className={`absolute -top-1 -right-1 px-1.5 py-0.5 ${action.badgeColor || 'bg-red-500'} text-white text-xs rounded-full`}>
                        {action.badge}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      {translateText(action.title)}
                      {action.badge && (
                        <Badge className={`text-xs ${action.badgeColor || 'bg-red-500'} text-white border-0`}>
                          {action.badge}
                        </Badge>
                      )}
                    </h3>
                    <p className="text-gray-600 text-sm">{action.description}</p>
                  </div>
                  <div className="text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Health Tips */}
      <Card className="card-enhanced mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            {`Today's ${translateText('health')} Tip`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-sm mb-3">
            💧 Stay hydrated! Aim for 8 glasses of water daily to maintain optimal health and support your body's natural processes.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('health-education')}
            className="btn-glass-secondary"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            {translateText('education')}
          </Button>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card className="card-enhanced mt-4 border-red-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <MessageSquare className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-red-800">{translateText('emergency')}?</h4>
              <p className="text-red-600 text-sm">Call 911 or use our AI Assistant for guidance</p>
            </div>
            <Button
              size="sm"
              onClick={() => onNavigate('ai-assistant')}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {translateText('ai_assistant')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}