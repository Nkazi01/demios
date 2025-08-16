import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Users, 
  Building, 
  Calendar, 
  Activity,
  TrendingUp,
  Settings,
  Shield,
  Bot,
  BarChart3,
  UserCheck,
  Clock,
  AlertTriangle,
  Brain
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface AdminDashboardProps {
  onNavigate: (screen: string) => void;
  userProfile: any;
}

interface Analytics {
  totalUsers: number;
  totalClinics: number;
  totalAppointments: number;
  totalConsultations: number;
  activeUsers: number;
  appointmentsThisMonth: number;
}

export default function AdminDashboard({ onNavigate, userProfile }: AdminDashboardProps) {
  const [analytics, setAnalytics] = useState<Analytics>({
    totalUsers: 0,
    totalClinics: 0,
    totalAppointments: 0,
    totalConsultations: 0,
    activeUsers: 0,
    appointmentsThisMonth: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      // Mock analytics data for demo
      setAnalytics({
        totalUsers: 1247,
        totalClinics: 23,
        totalAppointments: 342,
        totalConsultations: 128,
        activeUsers: 89,
        appointmentsThisMonth: 156
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'AI Health Assistant',
      description: 'Access advanced AI tools for system insights and support',
      icon: Bot,
      color: 'bg-gradient-to-br from-purple-500 to-pink-600',
      action: () => onNavigate('ai-assistant'),
      badge: 'ADMIN',
      badgeColor: 'bg-gradient-to-r from-purple-400 to-pink-500'
    },
    {
      title: 'Admin Panel',
      description: 'Manage users, clinics, and system settings',
      icon: Settings,
      color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      action: () => onNavigate('admin-panel')
    },
    {
      title: 'Clinic Management',
      description: 'Add, edit, and monitor healthcare facilities',
      icon: Building,
      color: 'bg-gradient-to-br from-green-500 to-teal-600',
      action: () => onNavigate('clinic-locator')
    },
    {
      title: 'User Analytics',
      description: 'View system usage and user statistics',
      icon: BarChart3,
      color: 'bg-gradient-to-br from-orange-500 to-red-600',
      action: () => onNavigate('admin-panel')
    }
  ];

  const recentActivities = [
    {
      type: 'user',
      message: 'New patient registered: Sarah Johnson',
      time: '2 minutes ago',
      icon: UserCheck
    },
    {
      type: 'appointment',
      message: '15 appointments scheduled today',
      time: '1 hour ago',
      icon: Calendar
    },
    {
      type: 'clinic',
      message: 'Village Health Center updated services',
      time: '3 hours ago',
      icon: Building
    },
    {
      type: 'system',
      message: 'System maintenance completed',
      time: '6 hours ago',
      icon: Settings
    }
  ];

  return (
    <div className="min-h-screen animated-bg p-4 pb-24">
      {/* Welcome Section */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          Admin Dashboard 👨‍💼
        </h1>
        <p className="text-white/80">
          Welcome, {userProfile?.name || 'Administrator'}
        </p>
      </div>

      {/* AI Assistant Highlight for Admins */}
      <Card className="card-enhanced mb-6 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-600 p-1">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg gradient-text">AI Admin Assistant</h3>
                <p className="text-gray-600 text-sm">Access AI-powered system insights, analytics interpretation, and administrative guidance for healthcare management.</p>
              </div>
              <Button
                onClick={() => onNavigate('ai-assistant')}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700"
              >
                <Shield className="w-4 h-4 mr-2" />
                Admin AI
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Analytics Overview */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card className="card-enhanced">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {isLoading ? '...' : analytics.totalUsers}
            </div>
            <div className="text-sm text-gray-600">Total Users</div>
            <Users className="w-5 h-5 text-blue-500 mx-auto mt-2" />
          </CardContent>
        </Card>

        <Card className="card-enhanced">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {isLoading ? '...' : analytics.totalClinics}
            </div>
            <div className="text-sm text-gray-600">Active Clinics</div>
            <Building className="w-5 h-5 text-green-500 mx-auto mt-2" />
          </CardContent>
        </Card>

        <Card className="card-enhanced">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {isLoading ? '...' : analytics.totalAppointments}
            </div>
            <div className="text-sm text-gray-600">Total Appointments</div>
            <Calendar className="w-5 h-5 text-purple-500 mx-auto mt-2" />
          </CardContent>
        </Card>

        <Card className="card-enhanced">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {isLoading ? '...' : analytics.activeUsers}
            </div>
            <div className="text-sm text-gray-600">Active This Week</div>
            <Activity className="w-5 h-5 text-orange-500 mx-auto mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Monthly Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New Users</span>
                <Badge className="bg-green-100 text-green-800">+23%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Appointments</span>
                <Badge className="bg-blue-100 text-blue-800">+18%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Consultations</span>
                <Badge className="bg-purple-100 text-purple-800">+31%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Server Status</span>
                <Badge className="bg-green-100 text-green-800">Online</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Database</span>
                <Badge className="bg-green-100 text-green-800">Healthy</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">AI Services</span>
                <Badge className="bg-green-100 text-green-800">Running</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Administrative Tools</h2>
        
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
                      <div className={`absolute -top-1 -right-1 px-1.5 py-0.5 ${action.badgeColor || 'bg-blue-500'} text-white text-xs rounded-full`}>
                        {action.badge}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      {action.title}
                      {action.badge && (
                        <Badge className={`text-xs ${action.badgeColor || 'bg-blue-500'} text-white border-0`}>
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

      {/* Recent Activities */}
      <Card className="card-enhanced mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-500" />
            Recent Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 glass-card rounded-lg"
              >
                <div className={`p-2 rounded-full ${
                  activity.type === 'user' ? 'bg-blue-100' :
                  activity.type === 'appointment' ? 'bg-green-100' :
                  activity.type === 'clinic' ? 'bg-purple-100' :
                  'bg-gray-100'
                }`}>
                  <activity.icon className={`w-4 h-4 ${
                    activity.type === 'user' ? 'text-blue-600' :
                    activity.type === 'appointment' ? 'text-green-600' :
                    activity.type === 'clinic' ? 'text-purple-600' :
                    'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{activity.message}</div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
          <Button 
            variant="outline" 
            className="w-full mt-4 btn-glass-secondary"
            onClick={() => onNavigate('admin-panel')}
          >
            View All Activities
          </Button>
        </CardContent>
      </Card>

      {/* System Alerts */}
      <Card className="card-enhanced border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            System Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="text-sm font-medium text-yellow-800">Scheduled Maintenance</div>
              <div className="text-xs text-yellow-600">System maintenance scheduled for Sunday 2:00 AM - 4:00 AM</div>
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-sm font-medium text-green-800">AI Assistant Active</div>
              <div className="text-xs text-green-600">AI health assistant is running optimally with 99.9% uptime</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}