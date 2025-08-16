import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Calendar, 
  Users, 
  FileText, 
  Video, 
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Bot,
  Stethoscope,
  Brain,
  Sparkles
} from 'lucide-react';

interface DoctorDashboardProps {
  onNavigate: (screen: string) => void;
  userProfile: any;
}

export default function DoctorDashboard({ onNavigate, userProfile }: DoctorDashboardProps) {
  const [todayStats] = useState({
    totalAppointments: 12,
    completedAppointments: 8,
    pendingAppointments: 4,
    onlineConsultations: 6,
    urgentCases: 2
  });

  const quickActions = [
    {
      title: 'AI Medical Assistant',
      description: 'Get AI-powered clinical decision support and medical insights',
      icon: Bot,
      color: 'bg-gradient-to-br from-purple-500 to-pink-600',
      action: () => onNavigate('ai-assistant'),
      badge: 'BETA',
      badgeColor: 'bg-gradient-to-r from-purple-400 to-pink-500'
    },
    {
      title: 'Patient Appointments',
      description: 'View and manage patient appointments',
      icon: Calendar,
      color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      action: () => onNavigate('appointment-booking')
    },
    {
      title: 'Video Consultations',
      description: 'Conduct online patient consultations',
      icon: Video,
      color: 'bg-gradient-to-br from-green-500 to-teal-600',
      action: () => onNavigate('telemedicine')
    },
    {
      title: 'Patient Records',
      description: 'Access and update patient health records',
      icon: FileText,
      color: 'bg-gradient-to-br from-orange-500 to-red-600',
      action: () => onNavigate('health-records')
    }
  ];

  const upcomingAppointments = [
    {
      id: 1,
      patient: 'Sarah Johnson',
      time: '10:30 AM',
      type: 'Follow-up',
      status: 'confirmed',
      urgent: false
    },
    {
      id: 2,
      patient: 'Michael Chen',
      time: '11:15 AM',
      type: 'Consultation',
      status: 'pending',
      urgent: true
    },
    {
      id: 3,
      patient: 'Emily Rodriguez',
      time: '2:00 PM',
      type: 'Check-up',
      status: 'confirmed',
      urgent: false
    }
  ];

  return (
    <div className="min-h-screen animated-bg p-4 pb-24">
      {/* Welcome Section */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome, Dr. {userProfile?.name?.split(' ')[1] || userProfile?.name || 'Doctor'} 👨‍⚕️
        </h1>
        <p className="text-white/80">
          Your medical practice dashboard
        </p>
      </div>

      {/* AI Assistant Highlight for Medical Professionals */}
      <Card className="card-enhanced mb-6 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-teal-600 p-1">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg gradient-text">AI Medical Assistant</h3>
                <p className="text-gray-600 text-sm">Get clinical decision support, drug interaction checks, symptom analysis, and medical research assistance powered by advanced AI.</p>
              </div>
              <Button
                onClick={() => onNavigate('ai-assistant')}
                className="bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:from-purple-600 hover:to-blue-700"
              >
                <Stethoscope className="w-4 h-4 mr-2" />
                Access AI
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Today's Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card className="card-enhanced">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {todayStats.totalAppointments}
            </div>
            <div className="text-sm text-gray-600">Total Appointments</div>
            <Calendar className="w-5 h-5 text-blue-500 mx-auto mt-2" />
          </CardContent>
        </Card>

        <Card className="card-enhanced">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {todayStats.completedAppointments}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
            <CheckCircle className="w-5 h-5 text-green-500 mx-auto mt-2" />
          </CardContent>
        </Card>

        <Card className="card-enhanced">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {todayStats.pendingAppointments}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
            <Clock className="w-5 h-5 text-orange-500 mx-auto mt-2" />
          </CardContent>
        </Card>

        <Card className="card-enhanced">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">
              {todayStats.urgentCases}
            </div>
            <div className="text-sm text-gray-600">Urgent Cases</div>
            <AlertTriangle className="w-5 h-5 text-red-500 mx-auto mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        
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

      {/* Upcoming Appointments */}
      <Card className="card-enhanced mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            Upcoming Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-3 glass-card rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    appointment.urgent ? 'bg-red-500' : 
                    appointment.status === 'confirmed' ? 'bg-green-500' : 'bg-orange-500'
                  }`}></div>
                  <div>
                    <div className="font-medium text-sm">{appointment.patient}</div>
                    <div className="text-xs text-gray-500">{appointment.type}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{appointment.time}</div>
                  <Badge 
                    variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {appointment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <Button 
            variant="outline" 
            className="w-full mt-4 btn-glass-secondary"
            onClick={() => onNavigate('appointment-booking')}
          >
            View All Appointments
          </Button>
        </CardContent>
      </Card>

      {/* Medical AI Tools */}
      <Card className="card-enhanced border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            AI Medical Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 glass-card rounded-lg">
              <div className="flex items-center gap-3">
                <Bot className="w-5 h-5 text-purple-500" />
                <div>
                  <div className="font-medium text-sm">Symptom Analyzer</div>
                  <div className="text-xs text-gray-500">AI-powered symptom assessment</div>
                </div>
              </div>
              <Button 
                size="sm"
                onClick={() => onNavigate('ai-assistant')}
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                Use Tool
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 glass-card rounded-lg">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="font-medium text-sm">Drug Interaction Checker</div>
                  <div className="text-xs text-gray-500">Check medication interactions</div>
                </div>
              </div>
              <Button 
                size="sm"
                onClick={() => onNavigate('ai-assistant')}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Check
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 glass-card rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-green-500" />
                <div>
                  <div className="font-medium text-sm">Medical Assistant Chat</div>
                  <div className="text-xs text-gray-500">Get medical guidance and support</div>
                </div>
              </div>
              <Button 
                size="sm"
                onClick={() => onNavigate('ai-assistant')}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Chat
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}