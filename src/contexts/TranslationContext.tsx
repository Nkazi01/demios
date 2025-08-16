import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
};

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', flag: '🇿🇦' },
  { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa', flag: '🇿🇦' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', flag: '🇿🇦' },
  { code: 'st', name: 'Sotho', nativeName: 'Sesotho', flag: '🇿🇦' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
];

interface TranslationContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  translate: (text: string, targetLanguage?: string) => Promise<string>;
  translateText: (text: string) => string;
  isTranslating: boolean;
  translateVoice: (audioBlob: Blob, targetLanguage?: string) => Promise<string>;
  speechToText: (audioBlob: Blob, sourceLanguage?: string) => Promise<string>;
  textToSpeech: (text: string, language?: string) => Promise<Blob>;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
}

// Basic translation dictionary for common medical terms
const TRANSLATION_DICTIONARY: Record<string, Record<string, string>> = {
  'en': {
    'hello': 'Hello',
    'welcome': 'Welcome',
    'health': 'Health',
    'doctor': 'Doctor',
    'patient': 'Patient',
    'appointment': 'Appointment',
    'symptoms': 'Symptoms',
    'medicine': 'Medicine',
    'emergency': 'Emergency',
    'clinic': 'Clinic',
    'consultation': 'Consultation',
    'records': 'Records',
    'education': 'Education',
    'book_appointment': 'Book Appointment',
    'ai_assistant': 'AI Health Assistant',
    'voice_consultation': 'Voice Consultation',
    'video_call': 'Video Call',
    'chat': 'Chat',
    'notifications': 'Notifications',
    'dashboard': 'Dashboard',
    'profile': 'Profile',
    'settings': 'Settings',
    'logout': 'Logout',
    'login': 'Login',
    'register': 'Register',
    'email': 'Email',
    'password': 'Password',
    'name': 'Name',
    'phone': 'Phone',
    'address': 'Address',
    'age': 'Age',
    'gender': 'Gender',
    'medical_history': 'Medical History',
    'current_medications': 'Current Medications',
    'allergies': 'Allergies',
    'blood_type': 'Blood Type',
    'emergency_contact': 'Emergency Contact',
    'describe_symptoms': 'Please describe your symptoms',
    'ai_analyzing': 'AI is analyzing your symptoms...',
    'speak_now': 'Speak now',
    'listening': 'Listening...',
    'processing': 'Processing...',
    'translating': 'Translating...',
    'translation_error': 'Translation error occurred',
    'microphone_access': 'Microphone access required',
    'browser_not_supported': 'Browser not supported for voice features',
  },
  'zu': {
    'hello': 'Sawubona',
    'welcome': 'Siyakwamukela',
    'health': 'Impilo',
    'doctor': 'Udokotela',
    'patient': 'Isiguli',
    'appointment': 'Isikhathi sokubonana',
    'symptoms': 'Izimpawu',
    'medicine': 'Umuthi',
    'emergency': 'Isimo esiphuthumayo',
    'clinic': 'Umtholampilo',
    'consultation': 'Ukuhlolwa',
    'records': 'Amarekhodi',
    'education': 'Imfundo',
    'book_appointment': 'Bhukha Isikhathi',
    'ai_assistant': 'Umsizi we-AI Wezempilo',
    'voice_consultation': 'Ukuhlolwa Ngezwi',
    'video_call': 'Ucingo Lwevidiyo',
    'chat': 'Ingxoxo',
    'notifications': 'Izaziso',
    'dashboard': 'Ibhodi Elikhulu',
    'profile': 'Iphrofayili',
    'settings': 'Izilungiselelo',
    'logout': 'Phuma',
    'login': 'Ngena',
    'register': 'Bhalisa',
    'email': 'I-imeyili',
    'password': 'Iphasiwedi',
    'name': 'Igama',
    'phone': 'Ifoni',
    'address': 'Ikheli',
    'age': 'Iminyaka',
    'gender': 'Ubulili',
    'medical_history': 'Umlando Wezokwelapha',
    'current_medications': 'Imithi Yamanje',
    'allergies': 'Izimo Zokungalaleli',
    'blood_type': 'Uhlobo Lwegazi',
    'emergency_contact': 'Othintana Naye Esimeni Esiphuthumayo',
    'describe_symptoms': 'Sicela uchaze izimpawu zakho',
    'ai_analyzing': 'I-AI ihlaziya izimpawu zakho...',
    'speak_now': 'Khuluma manje',
    'listening': 'Ngilalele...',
    'processing': 'Ngicubungula...',
    'translating': 'Ngihumusha...',
    'translation_error': 'Kube nephutha lokuhumusha',
    'microphone_access': 'Kudingeka ukufinyelela kwemakrofoni',
    'browser_not_supported': 'Isiphequluli asisekelwa ngezici zezwi',
  },
  'xh': {
    'hello': 'Molo',
    'welcome': 'Wamkelekile',
    'health': 'Impilo',
    'doctor': 'Ugqirha',
    'patient': 'Isigulana',
    'appointment': 'Idinga',
    'symptoms': 'Iimpawu',
    'medicine': 'Iyeza',
    'emergency': 'Ingxaki ebukhali',
    'clinic': 'Iklinikhi',
    'consultation': 'Ukubonana',
    'records': 'Iirekhodi',
    'education': 'Imfundo',
    'book_appointment': 'Bhukisha Idinga',
    'ai_assistant': 'Umncedisi we-AI Wezempilo',
    'voice_consultation': 'Ukubonana Ngelizwi',
    'video_call': 'Umnxeba Wevidiyo',
    'chat': 'Incoko',
    'notifications': 'Izaziso',
    'dashboard': 'Ibhodi Yolawulo',
    'profile': 'Iprofayile',
    'settings': 'Iisetingi',
    'logout': 'Phuma',
    'login': 'Ngena',
    'register': 'Bhalisa',
    'email': 'I-imeyile',
    'password': 'Igama lokugqitha',
    'name': 'Igama',
    'phone': 'Ifowuni',
    'address': 'Idilesi',
    'age': 'Ubudala',
    'gender': 'Isini',
    'medical_history': 'Imbali Yonyango',
    'current_medications': 'Amayeza Angoku',
    'allergies': 'Izinto Ezingakuvumeliyo',
    'blood_type': 'Uhlobo Lwegazi',
    'emergency_contact': 'Umntu Wokuqhagamshelana Naye Kwingxaki',
    'describe_symptoms': 'Nceda chaza iimpawu zakho',
    'ai_analyzing': 'I-AI icacisa iimpawu zakho...',
    'speak_now': 'Thetha ngoku',
    'listening': 'Ndimamele...',
    'processing': 'Ndicwangcisa...',
    'translating': 'Ndiguqula...',
    'translation_error': 'Kuye kwakho imposiso yokuguqula',
    'microphone_access': 'Kufuneka ufikelelo kwimakrofoni',
    'browser_not_supported': 'Isiphequluli asixhaswanga ngeenkonzo zelizwi',
  }
};

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(SUPPORTED_LANGUAGES[0]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationCache, setTranslationCache] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('preferred_language');
    if (savedLanguage) {
      const language = SUPPORTED_LANGUAGES.find(lang => lang.code === savedLanguage);
      if (language) {
        setCurrentLanguage(language);
      }
    }
  }, []);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('preferred_language', language.code);
  };

  const translateText = (text: string): string => {
    const key = text.toLowerCase().replace(/\s+/g, '_');
    const translations = TRANSLATION_DICTIONARY[currentLanguage.code];
    
    if (translations && translations[key]) {
      return translations[key];
    }
    
    // Check translation cache
    const cacheKey = `${text}:${currentLanguage.code}`;
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }
    
    // Return original text if no translation found
    return text;
  };

  const translate = async (text: string, targetLanguage?: string): Promise<string> => {
    const target = targetLanguage || currentLanguage.code;
    
    if (target === 'en') {
      return text;
    }

    const cacheKey = `${text}:${target}`;
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }

    setIsTranslating(true);
    
    try {
      // Try local dictionary first
      const localTranslation = translateText(text);
      if (localTranslation !== text) {
        return localTranslation;
      }

      // Call external translation API
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          targetLanguage: target,
          sourceLanguage: 'en'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const translatedText = data.translatedText || text;
        
        // Cache the translation
        setTranslationCache(prev => ({
          ...prev,
          [cacheKey]: translatedText
        }));
        
        return translatedText;
      }
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }

    return text;
  };

  const translateVoice = async (audioBlob: Blob, targetLanguage?: string): Promise<string> => {
    const target = targetLanguage || currentLanguage.code;
    
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('targetLanguage', target);
      
      const response = await fetch('/api/translate-voice', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.translatedText || '';
      }
    } catch (error) {
      console.error('Voice translation error:', error);
    }

    return '';
  };

  const speechToText = async (audioBlob: Blob, sourceLanguage?: string): Promise<string> => {
    const source = sourceLanguage || currentLanguage.code;
    
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('language', source);
      
      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.text || '';
      }
    } catch (error) {
      console.error('Speech to text error:', error);
    }

    return '';
  };

  const textToSpeech = async (text: string, language?: string): Promise<Blob> => {
    const lang = language || currentLanguage.code;
    
    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          language: lang
        }),
      });

      if (response.ok) {
        return await response.blob();
      }
    } catch (error) {
      console.error('Text to speech error:', error);
    }

    return new Blob();
  };

  const value: TranslationContextType = {
    currentLanguage,
    setLanguage,
    translate,
    translateText,
    isTranslating,
    translateVoice,
    speechToText,
    textToSpeech,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}
