import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  Video, 
  MessageSquare, 
  Phone, 
  Clock, 
  User, 
  Bot,
  Mic,
  Calendar,
  Shield,
  Wifi,
  WifiOff,
  Camera,
  CameraOff,
  VolumeX,
  Volume2,
  Settings
} from 'lucide-react';
import VoiceConsultation from './VoiceConsultation';

interface TelemedicineConsultationProps {
  onNavigate: (screen: string) => void;
  onBack: () => void;
  userProfile: any;
}

export default function TelemedicineConsultation({ onNavigate, onBack, userProfile }: TelemedicineConsultationProps) {
  const [consultationMode, setConsultationMode] = useState<'select' | 'video' | 'voice' | 'chat'>('select');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor'>('good');

  if (consultationMode === 'voice') {
    return (
      <VoiceConsultation 
        onBack={() => setConsultationMode('select')}
        userProfile={userProfile}
        consultationType={userProfile?.role === 'patient' ? 'patient' : 'doctor'}
      />
    );
  }

  const consultationOptions = [
    {
      id: 'voice',
      title: 'AI Voice Consultation',
      description: 'Speak with our AI health assistant with real-time transcription',
      icon: Mic,
      color: 'bg-gradient-to-br from-purple-500 to-pink-600',
      features: ['Real-time AI responses', 'Voice transcription', 'Medical guidance', 'Consultation summary'],
      badge: 'AI POWERED',
      badgeColor: 'bg-purple-500'
    },
    {
      id: 'video',
      title: 'Video Call',
      description: 'Face-to-face consultation with healthcare providers',
      icon: Video,
      color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      features: ['HD video quality', 'Screen sharing', 'Recording available', 'Secure connection'],
      badge: 'POPULAR',
      badgeColor: 'bg-blue-500'
    },
    {
      id: 'chat',
      title: 'Text Chat',
      description: 'Written conversation with medical professionals',
      icon: MessageSquare,
      color: 'bg-gradient-to-br from-green-500 to-teal-600',
      features: ['Instant messaging', 'File sharing', 'Chat history', 'Encrypted'],
      badge: 'SECURE',
      badgeColor: 'bg-green-500'
    }
  ];

  const availableDoctors = [
    {
      id: 1,
      name: 'Dr. Sarah Mitchell',
      specialty: 'Family Medicine',
      rating: 4.9,
      experience: '12 years',
      status: 'online',
      avatar: '/api/placeholder/64/64',
      nextAvailable: 'Available now'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Internal Medicine',
      rating: 4.8,
      experience: '8 years',
      status: 'busy',
      avatar: '/api/placeholder/64/64',
      nextAvailable: 'Available in 15 min'
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialty: 'Pediatrics',
      rating: 4.9,
      experience: '10 years',
      status: 'online',
      avatar: '/api/placeholder/64/64',
      nextAvailable: 'Available now'
    }
  ];

  const startConsultation = (mode: 'video' | 'voice' | 'chat') => {
    setConsultationMode(mode);
  };

  const renderVideoConsultation = () => (
    <div className="space-y-6">
      {/* Video Interface */}
      <Card className="card-enhanced">
        <CardContent className="p-0">
          <div className="relative bg-black rounded-t-lg h-96 flex items-center justify-center">
            <div className="text-center text-white">
              <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Video consultation interface</p>
              <p className="text-sm opacity-75">Connecting to healthcare provider...</p>
            </div>
            
            {/* Connection Status */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${connectionQuality === 'excellent' ? 'bg-green-500' : connectionQuality === 'good' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
              <span className="text-white text-sm capitalize">{connectionQuality}</span>
            </div>

            {/* Timer */}
            <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded text-white text-sm">
              00:45
            </div>
          </div>
          
          {/* Controls */}
          <div className="p-4 bg-gray-900 rounded-b-lg">
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" size="icon" className="bg-gray-800 border-gray-700 text-white">
                <Mic className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" className="bg-gray-800 border-gray-700 text-white">
                <Camera className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" className="bg-gray-800 border-gray-700 text-white">
                <Volume2 className="w-5 h-5" />
              </Button>
              <Button 
                onClick={() => setConsultationMode('select')}
                className="bg-red-600 hover:bg-red-700 text-white px-6"
              >
                End Call
              </Button>
              <Button variant="outline" size="icon" className="bg-gray-800 border-gray-700 text-white">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Sidebar */}
      <Card className="card-enhanced">
        <CardHeader>
          <CardTitle className="text-sm">Chat with Dr. Sarah Mitchell</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                Dr
              </div>
              <div className="flex-1 bg-gray-100 rounded-lg p-2">
                Hello! I can see you clearly. How are you feeling today?
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <div className="flex-1 bg-teal-500 text-white rounded-lg p-2 max-w-xs">
                I've been having headaches for the past few days.
              </div>
              <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white text-xs">
                You
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderChatConsultation = () => (
    <div className="space-y-6">
      <Card className="card-enhanced">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Chat Consultation</CardTitle>
            <Badge className="bg-green-500 text-white">Dr. Sarah Mitchell - Online</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="glass-card p-4 h-96 overflow-y-auto mb-4">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 bg-gray-100 rounded-lg p-3">
                  <p className="text-sm">Hello! I'm Dr. Sarah Mitchell. I'll be assisting you today. Could you please describe your symptoms?</p>
                  <span className="text-xs text-gray-500">2:30 PM</span>
                </div>
              </div>
              
              <div className="flex gap-3 justify-end">
                <div className="flex-1 max-w-xs bg-teal-500 text-white rounded-lg p-3">
                  <p className="text-sm">Hi Dr. Mitchell, I've been experiencing persistent headaches for the past 3 days.</p>
                  <span className="text-xs text-teal-100">2:32 PM</span>
                </div>
                <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 bg-gray-100 rounded-lg p-3">
                  <p className="text-sm">I understand. Can you tell me more about the headaches? Where exactly do you feel the pain, and on a scale of 1-10, how would you rate the intensity?</p>
                  <span className="text-xs text-gray-500">2:33 PM</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Type your message..."
              className="flex-1 border rounded-lg px-3 py-2 input-glass"
            />
            <Button className="bg-teal-500 hover:bg-teal-600 text-white">
              <MessageSquare className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen animated-bg p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="glass-button text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-white">Telemedicine</h1>
          <p className="text-white/80 text-sm">Connect with healthcare providers remotely</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          <span className="text-white text-sm">{isConnected ? 'Connected' : 'Offline'}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {consultationMode === 'select' && (
          <div className="space-y-6">
            {/* Consultation Options */}
            <div className="grid gap-6">
              <h2 className="text-xl font-semibold text-white mb-4">Choose Consultation Type</h2>
              
              {consultationOptions.map((option) => (
                <Card 
                  key={option.id} 
                  className="card-enhanced cursor-pointer transition-all hover:scale-[1.02]"
                  onClick={() => startConsultation(option.id as any)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-4 rounded-2xl ${option.color} relative`}>
                        <option.icon className="w-8 h-8 text-white" />
                        {option.badge && (
                          <Badge className={`absolute -top-2 -right-2 text-xs ${option.badgeColor} text-white border-0`}>
                            {option.badge}
                          </Badge>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{option.title}</h3>
                        <p className="text-gray-600 mb-4">{option.description}</p>
                        <div className="grid grid-cols-2 gap-2">
                          {option.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-gray-500">
                              <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button className={`${option.color} text-white`}>
                        Start
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Available Doctors */}
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Available Healthcare Providers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availableDoctors.map((doctor) => (
                    <div key={doctor.id} className="flex items-center gap-4 p-4 glass-card rounded-lg">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{doctor.name}</h4>
                          <div className={`w-2 h-2 rounded-full ${doctor.status === 'online' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                        </div>
                        <p className="text-sm text-gray-600">{doctor.specialty} • {doctor.experience}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            <span className="text-sm">{doctor.rating}</span>
                          </div>
                          <span className="text-xs text-gray-500">{doctor.nextAvailable}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => startConsultation('voice')}
                          className="btn-glass-secondary"
                        >
                          <Mic className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => startConsultation('video')}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          <Video className="w-4 h-4 mr-1" />
                          Connect
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bot className="w-5 h-5 text-purple-500" />
                    AI Health Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Get instant medical guidance with our advanced AI assistant
                  </p>
                  <Button 
                    onClick={() => onNavigate('ai-assistant')}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white"
                  >
                    <Bot className="w-4 h-4 mr-2" />
                    Chat with AI
                  </Button>
                </CardContent>
              </Card>

              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-green-500" />
                    Schedule Appointment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Book an in-person visit at a nearby clinic
                  </p>
                  <Button 
                    onClick={() => onNavigate('appointment-booking')}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {consultationMode === 'video' && renderVideoConsultation()}
        {consultationMode === 'chat' && renderChatConsultation()}
      </div>
    </div>
  );
}