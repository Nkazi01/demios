import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Volume2, 
  VolumeX,
  Play,
  Square,
  Download,
  Clock,
  User,
  Bot,
  Loader,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Shield,
  Settings,
  RefreshCw,
  MessageSquare,
  Keyboard,
  Info,
  XCircle,
  Check,
  Globe,
  Languages,
  Send
} from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { useTranslation } from '../contexts/TranslationContext';

interface VoiceConsultationProps {
  onBack: () => void;
  userProfile: any;
  consultationType: 'patient' | 'doctor';
}

interface TranscriptionSegment {
  id: string;
  speaker: 'user' | 'ai' | 'doctor' | 'patient';
  text: string;
  timestamp: Date;
  confidence?: number;
}

interface ConsultationSession {
  id: string;
  start_time: Date;
  duration: number;
  transcription: TranscriptionSegment[];
  summary?: string;
  recommendations?: string[];
}

type PermissionState = 'unknown' | 'checking' | 'requesting' | 'granted' | 'denied' | 'unavailable';

export default function VoiceConsultation({ onBack, userProfile, consultationType }: VoiceConsultationProps) {
  const { translateText, translate, currentLanguage, speechToText, textToSpeech } = useTranslation();
  const [isInCall, setIsInCall] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [transcription, setTranscription] = useState<TranscriptionSegment[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [currentSession, setCurrentSession] = useState<ConsultationSession | null>(null);
  const [permissionState, setPermissionState] = useState<PermissionState>('unknown');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // Translation States
  const [enableRealTimeTranslation, setEnableRealTimeTranslation] = useState(true);
  const [translatedSegments, setTranslatedSegments] = useState<Record<string, string>>({});
  const [showTextFallback, setShowTextFallback] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [permissionChecked, setPermissionChecked] = useState(false);

  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [currentStream, setCurrentStream] = useState<MediaStream | null>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptionEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializePermissions();
    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [transcription]);

  const cleanup = () => {
    // Cleanup timers and streams
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    if (recordingTimerRef.current) clearTimeout(recordingTimerRef.current);
    if (currentStream) {
      currentStream.getTracks().forEach(track => track.stop());
    }
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
  };

  const scrollToBottom = () => {
    transcriptionEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializePermissions = async () => {
    setPermissionState('checking');
    setErrorMessage('');

    // Check basic browser support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setPermissionState('unavailable');
      setErrorMessage('Your browser does not support audio recording. Please use a modern browser like Chrome, Firefox, or Safari.');
      setShowTextFallback(true);
      return;
    }

    if (!window.MediaRecorder) {
      setPermissionState('unavailable');
      setErrorMessage('Audio recording is not supported in your browser. Please update your browser or try a different one.');
      setShowTextFallback(true);
      return;
    }

    // Check HTTPS requirement (except for localhost)
    if (location.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(location.hostname)) {
      setPermissionState('unavailable');
      setErrorMessage('Voice recording requires a secure connection (HTTPS). Please access this site via HTTPS or use the text chat option.');
      setShowTextFallback(true);
      return;
    }

    // Check existing permissions using Permissions API if available
    if ('permissions' in navigator) {
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        
        if (permissionStatus.state === 'granted') {
          setPermissionState('granted');
          setPermissionChecked(true);
        } else if (permissionStatus.state === 'denied') {
          setPermissionState('denied');
          setErrorMessage('Microphone access was previously denied. Please click the microphone icon in your browser\'s address bar to enable it.');
          setShowTextFallback(true);
        } else {
          setPermissionState('unknown');
        }
        
        // Listen for permission changes
        permissionStatus.addEventListener('change', () => {
          if (permissionStatus.state === 'granted') {
            setPermissionState('granted');
            setErrorMessage('');
            setShowTextFallback(false);
          } else if (permissionStatus.state === 'denied') {
            setPermissionState('denied');
            setErrorMessage('Microphone access was denied.');
            setShowTextFallback(true);
          }
        });
        
      } catch (error) {
        console.warn('Permissions API not supported:', error);
        setPermissionState('unknown');
      }
    } else {
      setPermissionState('unknown');
    }
    
    setPermissionChecked(true);
  };

  const requestMicrophonePermission = async (): Promise<boolean> => {
    setPermissionState('requesting');
    setErrorMessage('');

    try {
      // Test microphone access with minimal constraints
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000, // Lower sample rate for better compatibility
          channelCount: 1      // Mono audio
        }
      });
      
      console.log('Microphone access granted successfully');
      
      // Test MediaRecorder with the stream
      try {
        const testRecorder = new MediaRecorder(stream, {
          mimeType: getPreferredMimeType()
        });
        testRecorder.start();
        testRecorder.stop();
        console.log('MediaRecorder test successful');
      } catch (recorderError) {
        console.error('MediaRecorder test failed:', recorderError);
        stream.getTracks().forEach(track => track.stop());
        throw new Error('Audio recording not supported with current settings');
      }
      
      setPermissionState('granted');
      setCurrentStream(stream);
      
      // Stop the test stream
      stream.getTracks().forEach(track => track.stop());
      setCurrentStream(null);
      
      return true;
      
    } catch (error: any) {
      console.error('Microphone permission error:', error);
      
      setPermissionState('denied');
      
      let userMessage = '';
      
      switch (error.name) {
        case 'NotAllowedError':
          userMessage = 'Microphone access was denied. To enable it:\n1. Click the camera/microphone icon in your browser\'s address bar\n2. Select "Allow" for microphone access\n3. Refresh the page and try again';
          break;
        case 'NotFoundError':
          userMessage = 'No microphone was found. Please connect a microphone and try again.';
          break;
        case 'NotSupportedError':
          userMessage = 'Your browser doesn\'t support audio recording. Please try Chrome, Firefox, or Safari.';
          break;
        case 'NotReadableError':
          userMessage = 'Your microphone is being used by another application. Please close other apps using the microphone and try again.';
          break;
        case 'OverconstrainedError':
          userMessage = 'Microphone settings are not compatible. Please try again with default settings.';
          break;
        case 'SecurityError':
          userMessage = 'Security settings prevent microphone access. Please check your browser settings.';
          break;
        default:
          userMessage = `Unable to access microphone: ${error.message || 'Unknown error'}. Please check your browser settings and try the text chat option.`;
      }
      
      setErrorMessage(userMessage);
      setShowTextFallback(true);
      return false;
    }
  };

  const getPreferredMimeType = (): string => {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/ogg;codecs=opus',
      'audio/ogg',
      'audio/wav'
    ];
    
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        console.log('Using MIME type:', type);
        return type;
      }
    }
    
    console.log('Using default MIME type');
    return '';
  };

  const startCall = async () => {
    // Always show text fallback option
    setShowTextFallback(true);
    
    if (permissionState !== 'granted') {
      const granted = await requestMicrophonePermission();
      if (!granted) {
        // Start consultation with text-only mode
        startTextOnlyConsultation();
        return;
      }
    }

    try {
      // Get fresh stream for the call
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
          channelCount: 1
        }
      });
      
      setCurrentStream(stream);
      setIsInCall(true);
      setCallDuration(0);
      setErrorMessage('');
      
      // Start call timer
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);

      // Initialize session
      const session: ConsultationSession = {
        id: crypto.randomUUID(),
        start_time: new Date(),
        duration: 0,
        transcription: []
      };
      setCurrentSession(session);

      // Add welcome message
      const welcomeMessage: TranscriptionSegment = {
        id: crypto.randomUUID(),
        speaker: 'ai',
        text: `Voice consultation started with AI transcription. You can speak or type your messages. ${consultationType === 'patient' ? 'Please describe your health concerns.' : 'Begin your patient consultation.'}`,
        timestamp: new Date()
      };
      setTranscription([welcomeMessage]);

      // Start recording for transcription
      await startRecording(stream);
      
    } catch (error: any) {
      console.error('Error starting call:', error);
      setErrorMessage('Unable to start voice recording. Using text-only mode.');
      startTextOnlyConsultation();
    }
  };

  const startTextOnlyConsultation = () => {
    setIsInCall(true);
    setCallDuration(0);
    setShowTextFallback(true);
    
    // Start call timer
    callTimerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    // Initialize session
    const session: ConsultationSession = {
      id: crypto.randomUUID(),
      start_time: new Date(),
      duration: 0,
      transcription: []
    };
    setCurrentSession(session);

    // Add welcome message
    const welcomeMessage: TranscriptionSegment = {
      id: crypto.randomUUID(),
      speaker: 'ai',
      text: `Text consultation started with AI assistant. ${consultationType === 'patient' ? 'Please describe your health concerns using the text input below.' : 'Begin your patient consultation using text input.'}`,
      timestamp: new Date()
    };
    setTranscription([welcomeMessage]);
  };

  const endCall = async () => {
    setIsInCall(false);
    setIsRecording(false);
    
    cleanup();

    // Update session
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        duration: callDuration,
        transcription: transcription
      };
      setCurrentSession(updatedSession);
      
      // Generate AI summary
      await generateConsultationSummary(updatedSession);
    }

    // Add end message
    const endMessage: TranscriptionSegment = {
      id: crypto.randomUUID(),
      speaker: 'ai',
      text: 'Consultation ended. Generating summary...',
      timestamp: new Date()
    };
    setTranscription(prev => [...prev, endMessage]);
  };

  const startRecording = async (stream: MediaStream) => {
    try {
      const mimeType = getPreferredMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      
      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = async () => {
        if (chunks.length > 0) {
          const audioBlob = new Blob(chunks, { type: mimeType || 'audio/webm' });
          await transcribeAudioSegment(audioBlob);
        }
      };

      recorder.onerror = (event: any) => {
        console.error('MediaRecorder error:', event.error);
        setErrorMessage('Recording error occurred. Continuing with text input only.');
        setIsRecording(false);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setAudioChunks(chunks);
      setIsRecording(true);

      console.log('Recording started successfully');

      // Schedule next recording segment (3 seconds for better responsiveness)
      recordingTimerRef.current = setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
          // Restart recording if still in call
          if (isInCall) {
            setTimeout(() => startRecording(stream), 100);
          }
        }
      }, 3000);

    } catch (error: any) {
      console.error('Error starting recording:', error);
      setErrorMessage('Recording failed. Continuing with text input only.');
      setIsRecording(false);
    }
  };

  const transcribeAudioSegment = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'segment.wav');

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3f2c9fd9/ai/transcribe`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token') || publicAnonKey}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.transcription && data.transcription.trim() && !data.error) {
          const segment: TranscriptionSegment = {
            id: crypto.randomUUID(),
            speaker: consultationType === 'patient' ? 'patient' : 'doctor',
            text: data.transcription.trim(),
            timestamp: new Date(),
            confidence: data.confidence || 0.8
          };
          
          setTranscription(prev => [...prev, segment]);
          
          // Get AI response for patient consultations
          if (consultationType === 'patient') {
            await getAIResponse(data.transcription);
          }
        }
      } else {
        console.error('Transcription API error:', await response.text());
      }
    } catch (error) {
      console.error('Transcription error:', error);
    } finally {
      setIsTranscribing(false);
    }
  };

  const sendTextMessage = async () => {
    if (!textInput.trim()) return;

    const segment: TranscriptionSegment = {
      id: crypto.randomUUID(),
      speaker: consultationType === 'patient' ? 'patient' : 'doctor',
      text: textInput.trim(),
      timestamp: new Date()
    };
    
    setTranscription(prev => [...prev, segment]);
    
    if (consultationType === 'patient') {
      await getAIResponse(textInput);
    }
    
    setTextInput('');
  };

  const getAIResponse = async (patientMessage: string) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3f2c9fd9/ai/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Voice consultation context: ${patientMessage}`,
          user_context: {
            role: userProfile?.role,
            name: userProfile?.name,
            consultation_type: 'voice'
          },
          conversation_history: transcription.slice(-4).map(msg => ({
            role: msg.speaker === 'ai' ? 'assistant' : 'user',
            content: msg.text
          }))
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        const aiSegment: TranscriptionSegment = {
          id: crypto.randomUUID(),
          speaker: 'ai',
          text: data.response,
          timestamp: new Date()
        };
        
        setTranscription(prev => [...prev, aiSegment]);
        
        // Use speech synthesis to speak AI response if voice is working
        if (isSpeakerOn && 'speechSynthesis' in window && permissionState === 'granted' && isRecording) {
          const utterance = new SpeechSynthesisUtterance(data.response);
          utterance.rate = 0.9;
          utterance.pitch = 1;
          speechSynthesis.speak(utterance);
        }
      }
    } catch (error) {
      console.error('AI response error:', error);
    }
  };

  const generateConsultationSummary = async (session: ConsultationSession) => {
    try {
      const transcriptText = session.transcription
        .map(seg => `${seg.speaker}: ${seg.text}`)
        .join('\n');

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3f2c9fd9/ai/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Please provide a consultation summary for this session transcript:\n\n${transcriptText}\n\nInclude: 1) Key symptoms/concerns discussed, 2) Recommendations provided, 3) Follow-up actions needed`,
          user_context: {
            role: 'system',
            name: 'Summary Generator'
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        const summarySegment: TranscriptionSegment = {
          id: crypto.randomUUID(),
          speaker: 'ai',
          text: `📋 CONSULTATION SUMMARY:\n\n${data.response}`,
          timestamp: new Date()
        };
        
        setTranscription(prev => [...prev, summarySegment]);
      }
    } catch (error) {
      console.error('Summary generation error:', error);
    }
  };

  const downloadTranscript = () => {
    const transcript = transcription
      .map(seg => `[${seg.timestamp.toLocaleTimeString()}] ${seg.speaker.toUpperCase()}: ${seg.text}`)
      .join('\n\n');
    
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consultation-transcript-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const retryPermission = async () => {
    setPermissionState('unknown');
    setErrorMessage('');
    setShowTextFallback(false);
    await initializePermissions();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSpeakerIcon = (speaker: string) => {
    switch (speaker) {
      case 'ai': return Bot;
      case 'doctor': return User;
      case 'patient': return User;
      default: return User;
    }
  };

  const getSpeakerColor = (speaker: string) => {
    switch (speaker) {
      case 'ai': return 'bg-purple-500';
      case 'doctor': return 'bg-blue-500';
      case 'patient': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPermissionStatusIcon = () => {
    switch (permissionState) {
      case 'granted': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'denied': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'unavailable': return <XCircle className="w-5 h-5 text-gray-500" />;
      case 'checking':
      case 'requesting': return <Loader className="w-5 h-5 text-blue-500 animate-spin" />;
      default: return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getPermissionStatusText = () => {
    switch (permissionState) {
      case 'granted': return 'Microphone access granted';
      case 'denied': return 'Microphone access denied';
      case 'unavailable': return 'Microphone unavailable';
      case 'checking': return 'Checking permissions...';
      case 'requesting': return 'Requesting permission...';
      default: return 'Permission not checked';
    }
  };

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
          <h1 className="text-2xl font-semibold text-white">Voice Consultation</h1>
          <p className="text-white/80 text-sm">AI-powered voice transcription & analysis</p>
        </div>
        <div className="text-white text-right">
          <div className="text-lg font-mono">{formatDuration(callDuration)}</div>
          <div className="text-sm opacity-80">
            {isInCall ? (isRecording ? 'Recording' : 'Connected') : 'Ready'}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Permission Status Card */}
        {permissionChecked && (
          <Card className="card-enhanced">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                {getPermissionStatusIcon()}
                <div className="flex-1">
                  <h3 className="font-medium">{getPermissionStatusText()}</h3>
                  {permissionState === 'granted' && (
                    <p className="text-sm text-green-600">Voice recording is ready</p>
                  )}
                  {permissionState === 'denied' && (
                    <p className="text-sm text-red-600">Text chat is available as alternative</p>
                  )}
                  {permissionState === 'unavailable' && (
                    <p className="text-sm text-gray-600">Only text chat is available</p>
                  )}
                </div>
                {(permissionState === 'denied' || permissionState === 'unknown') && (
                  <Button
                    onClick={retryPermission}
                    size="sm"
                    variant="outline"
                    className="btn-glass-secondary"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Retry
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Handling */}
        {errorMessage && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <div className="space-y-2">
                <p><strong>Microphone Issue:</strong></p>
                <p className="text-sm whitespace-pre-line">{errorMessage}</p>
                <p className="text-sm font-medium">You can continue using text chat below.</p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Call Controls */}
        <Card className="card-enhanced">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-4">
              {!isInCall ? (
                <div className="space-y-4">
                  <Button
                    onClick={startCall}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 text-lg"
                  >
                    {permissionState === 'granted' ? (
                      <>
                        <Phone className="w-6 h-6 mr-2" />
                        Start Voice Consultation
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-6 h-6 mr-2" />
                        Start Consultation
                      </>
                    )}
                  </Button>
                  <p className="text-center text-sm text-gray-600">
                    {permissionState === 'granted' 
                      ? 'Voice recording and text input available'
                      : 'Text chat available • Voice will be attempted'
                    }
                  </p>
                </div>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsMuted(!isMuted)}
                    className={`w-12 h-12 ${isMuted ? 'bg-red-100 text-red-600' : 'bg-white'}`}
                    disabled={!isRecording}
                  >
                    {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                    className={`w-12 h-12 ${!isSpeakerOn ? 'bg-gray-100 text-gray-600' : 'bg-white'}`}
                  >
                    {isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                  </Button>

                  <Button
                    onClick={endCall}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 text-lg"
                  >
                    <PhoneOff className="w-6 h-6 mr-2" />
                    End Call
                  </Button>
                </>
              )}
            </div>

            {isInCall && (
              <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`}></div>
                  <span>{isRecording ? 'Voice Recording' : 'Text Only'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isTranscribing ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`}></div>
                  <span>{isTranscribing ? 'Transcribing' : 'Ready'}</span>
                </div>
                {consultationType === 'patient' && (
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-purple-500" />
                    <span>AI Assistant Active</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Text Input (Always available when in call) */}
        {isInCall && (
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Text Input
                <Badge variant="secondary">Always Available</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 border rounded-lg px-3 py-2 input-glass"
                  onKeyPress={(e) => e.key === 'Enter' && sendTextMessage()}
                />
                <Button
                  onClick={sendTextMessage}
                  disabled={!textInput.trim()}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Live Transcription */}
        <Card className="card-enhanced">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Mic className="w-5 h-5" />
                Consultation Transcript
                {isTranscribing && <Loader className="w-4 h-4 animate-spin text-blue-500" />}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {transcription.length} messages
                </Badge>
                {transcription.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadTranscript}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="glass-card p-1 rounded-lg">
              <ScrollArea className="h-96 p-4">
                <div className="space-y-4">
                  {transcription.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Start a consultation to see the conversation</p>
                      <p className="text-sm mt-2">Voice and text messages will appear here</p>
                    </div>
                  ) : (
                    transcription.map((segment) => {
                      const SpeakerIcon = getSpeakerIcon(segment.speaker);
                      return (
                        <div key={segment.id} className="flex gap-3">
                          <div className="flex-shrink-0">
                            <div className={`w-8 h-8 ${getSpeakerColor(segment.speaker)} rounded-full flex items-center justify-center`}>
                              <SpeakerIcon className="w-4 h-4 text-white" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium capitalize">
                                {segment.speaker === 'ai' ? 'AI Assistant' : segment.speaker}
                              </span>
                              <span className="text-xs text-gray-500">
                                {segment.timestamp.toLocaleTimeString()}
                              </span>
                              {segment.confidence && (
                                <Badge variant="outline" className="text-xs">
                                  Voice: {Math.round(segment.confidence * 100)}%
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm whitespace-pre-wrap glass-card p-3 rounded">
                              {segment.text}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={transcriptionEndRef} />
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>

        {/* Consultation Guidelines */}
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              Consultation Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-green-700">✅ For Best Results:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Speak clearly and at normal pace</li>
                  <li>• Use a quiet environment for voice</li>
                  <li>• Describe symptoms specifically</li>
                  <li>• Use text input as backup</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-blue-700">🔧 If Voice Doesn't Work:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Check browser microphone settings</li>
                  <li>• Allow microphone access when prompted</li>
                  <li>• Use text chat (always available)</li>
                  <li>• Try refreshing the page</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> This AI consultation provides general health guidance. 
                For urgent medical concerns or emergencies, contact healthcare professionals or emergency services immediately.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}