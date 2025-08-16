import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { 
  ArrowLeft,
  Globe, 
  Mic, 
  MicOff, 
  Volume2, 
  Languages,
  ArrowRightLeft,
  Play,
  Square,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { useTranslation, SUPPORTED_LANGUAGES } from '../contexts/TranslationContext';
import LanguageSelector from './LanguageSelector';

interface TranslationDemoProps {
  onBack: () => void;
}

export default function TranslationDemo({ onBack }: TranslationDemoProps) {
  const { 
    translateText, 
    translate, 
    currentLanguage, 
    speechToText, 
    textToSpeech,
    isTranslating 
  } = useTranslation();
  
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('zu');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [demoMode, setDemoMode] = useState<'text' | 'voice'>('text');
  const [voiceDemo, setVoiceDemo] = useState({
    isListening: false,
    isProcessing: false,
    transcript: '',
    translation: ''
  });

  const audioRef = useRef<HTMLAudioElement>(null);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    
    try {
      const result = await translate(sourceText, targetLanguage);
      setTranslatedText(result);
    } catch (error) {
      console.error('Translation error:', error);
      setTranslatedText('Translation failed. Please try again.');
    }
  };

  const handleSwapLanguages = () => {
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);
    
    // Swap texts too
    const tempText = sourceText;
    setSourceText(translatedText);
    setTranslatedText(tempText);
  };

  const handleVoiceRecord = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Voice recording is not supported in your browser');
      return;
    }

    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      setVoiceDemo(prev => ({ ...prev, isListening: false, isProcessing: true }));
      
      // Simulate processing
      setTimeout(async () => {
        const mockTranscript = 'Hello, I have a headache and need medicine.';
        const translation = await translate(mockTranscript, targetLanguage);
        
        setVoiceDemo({
          isListening: false,
          isProcessing: false,
          transcript: mockTranscript,
          translation: translation
        });
      }, 2000);
    } else {
      // Start recording
      setIsRecording(true);
      setVoiceDemo({
        isListening: true,
        isProcessing: false,
        transcript: '',
        translation: ''
      });
    }
  };

  const handlePlayTranslation = async () => {
    if (!translatedText) return;
    
    setIsPlaying(true);
    
    try {
      // Simulate text-to-speech
      setTimeout(() => {
        setIsPlaying(false);
      }, 2000);
    } catch (error) {
      console.error('Text-to-speech error:', error);
      setIsPlaying(false);
    }
  };

  const quickPhrases = [
    { en: 'Hello, how are you?', zu: 'Sawubona, unjani?', xh: 'Molo, unjani?' },
    { en: 'I need help', zu: 'Ngidinga usizo', xh: 'Ndidinga uncedo' },
    { en: 'Where is the clinic?', zu: 'Ikuphi ikliniki?', xh: 'Ikuphi ikliniki?' },
    { en: 'I have pain here', zu: 'Nginobuhlungu lapha', xh: 'Ndinobuhlungu apha' },
    { en: 'Thank you doctor', zu: 'Ngiyabonga dokotela', xh: 'Enkosi gqirha' }
  ];

  return (
    <div className="min-h-screen animated-bg p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="glass-button"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-white flex items-center gap-2">
            <Languages className="h-6 w-6" />
            {translateText('Translation Demo')}
          </h1>
          <p className="text-white/70 text-sm">
            {translateText('Real-time voice and text translation for healthcare')}
          </p>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="mb-6">
        <div className="glass-card p-4 rounded-xl">
          <div className="flex gap-2">
            <Button
              variant={demoMode === 'text' ? 'default' : 'outline'}
              onClick={() => setDemoMode('text')}
              className="flex-1"
            >
              <Globe className="h-4 w-4 mr-2" />
              {translateText('Text Translation')}
            </Button>
            <Button
              variant={demoMode === 'voice' ? 'default' : 'outline'}
              onClick={() => setDemoMode('voice')}
              className="flex-1"
            >
              <Mic className="h-4 w-4 mr-2" />
              {translateText('Voice Translation')}
            </Button>
          </div>
        </div>
      </div>

      {demoMode === 'text' ? (
        <>
          {/* Language Selection */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600">
                  {translateText('From')}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <div className="flex items-center">
                          <span className="mr-2">{lang.flag}</span>
                          {lang.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600 flex items-center justify-between">
                  {translateText('To')}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSwapLanguages}
                    className="h-6 w-6 p-0"
                  >
                    <ArrowRightLeft className="h-3 w-3" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <div className="flex items-center">
                          <span className="mr-2">{lang.flag}</span>
                          {lang.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          {/* Translation Interface */}
          <div className="space-y-4 mb-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-sm text-gray-600">
                  {translateText('Enter text to translate')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  placeholder={translateText('Type your message here...')}
                  className="min-h-[100px]"
                />
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-gray-500">
                    {sourceText.length}/500
                  </span>
                  <Button
                    onClick={handleTranslate}
                    disabled={!sourceText.trim() || isTranslating}
                    className="flex items-center gap-2"
                  >
                    {isTranslating ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Languages className="h-4 w-4" />
                    )}
                    {translateText('Translate')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {translatedText && (
              <Card className="glass-card border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-sm text-green-700 flex items-center justify-between">
                    <span>{translateText('Translation')}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handlePlayTranslation}
                      disabled={isPlaying}
                      className="text-green-700"
                    >
                      {isPlaying ? (
                        <Square className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-800 font-medium">{translatedText}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Quick Phrases */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">
                {translateText('Quick Medical Phrases')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {quickPhrases.map((phrase, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto p-3"
                    onClick={() => {
                      setSourceText(phrase.en);
                      setTranslatedText(phrase[targetLanguage as keyof typeof phrase] || '');
                    }}
                  >
                    <div>
                      <div className="font-medium">{phrase.en}</div>
                      <div className="text-sm text-gray-500">
                        {phrase[targetLanguage as keyof typeof phrase]}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        /* Voice Translation Mode */
        <div className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              {translateText('Voice translation demo - speak in')} {SUPPORTED_LANGUAGES.find(l => l.code === sourceLanguage)?.name} 
              {translateText(' and get translation in')} {SUPPORTED_LANGUAGES.find(l => l.code === targetLanguage)?.name}
            </AlertDescription>
          </Alert>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
                  voiceDemo.isListening ? 'bg-red-100 animate-pulse' : 
                  voiceDemo.isProcessing ? 'bg-yellow-100' : 'bg-blue-100'
                }`}>
                  {voiceDemo.isProcessing ? (
                    <RefreshCw className="h-8 w-8 text-yellow-600 animate-spin" />
                  ) : isRecording ? (
                    <MicOff className="h-8 w-8 text-red-600" />
                  ) : (
                    <Mic className="h-8 w-8 text-blue-600" />
                  )}
                </div>

                <div>
                  {voiceDemo.isListening && (
                    <Badge variant="destructive">
                      {translateText('listening')}...
                    </Badge>
                  )}
                  {voiceDemo.isProcessing && (
                    <Badge variant="secondary">
                      {translateText('processing')}...
                    </Badge>
                  )}
                  {!voiceDemo.isListening && !voiceDemo.isProcessing && (
                    <Badge variant="outline">
                      {translateText('Ready to record')}
                    </Badge>
                  )}
                </div>

                <Button
                  onClick={handleVoiceRecord}
                  disabled={voiceDemo.isProcessing}
                  className={`${isRecording ? 'bg-red-600 hover:bg-red-700' : ''}`}
                >
                  {isRecording ? (
                    <>
                      <Square className="h-4 w-4 mr-2" />
                      {translateText('Stop Recording')}
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4 mr-2" />
                      {translateText('Start Recording')}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {voiceDemo.transcript && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-sm text-blue-700">
                  {translateText('What you said')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-800">{voiceDemo.transcript}</p>
              </CardContent>
            </Card>
          )}

          {voiceDemo.translation && (
            <Card className="glass-card border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-sm text-green-700 flex items-center justify-between">
                  <span>{translateText('Translation')}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePlayTranslation}
                    disabled={isPlaying}
                    className="text-green-700"
                  >
                    {isPlaying ? (
                      <Square className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-800 font-medium">{voiceDemo.translation}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Translation Features Info */}
      <Card className="glass-card mt-6">
        <CardHeader>
          <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            {translateText('Translation Features')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Globe className="h-3 w-3 text-blue-600" />
              <span>{translateText('8 African languages supported')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mic className="h-3 w-3 text-green-600" />
              <span>{translateText('Real-time voice translation')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Volume2 className="h-3 w-3 text-purple-600" />
              <span>{translateText('Text-to-speech playback')}</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-3 w-3 text-orange-600" />
              <span>{translateText('Offline translation available')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
