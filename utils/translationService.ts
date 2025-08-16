// Translation API utilities for the Rural Healthcare App
// This module provides translation services for text, voice, and real-time communication

interface TranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
}

interface TranslationResponse {
  translatedText: string;
  confidence: number;
  sourceLanguage: string;
  targetLanguage: string;
}

interface VoiceTranslationRequest {
  audioBlob: Blob;
  sourceLanguage: string;
  targetLanguage: string;
}

// Mock translation service for development/demo purposes
const MOCK_TRANSLATIONS: Record<string, Record<string, Record<string, string>>> = {
  'en': {
    'zu': {
      'Hello': 'Sawubona',
      'How are you?': 'Unjani?',
      'I need help': 'Ngidinga usizo',
      'Thank you': 'Ngiyabonga',
      'Doctor': 'Udokotela',
      'Patient': 'Isiguli',
      'Medicine': 'Umuthi',
      'Pain': 'Ubuhlungu',
      'Headache': 'Ikhanda elibuhlungu',
      'Fever': 'Umkhuhlane',
      'Cough': 'Ukukhwehlela',
      'Chest pain': 'Ubuhlungu esifubeni',
      'Difficulty breathing': 'Ukuphefumula kanzima',
      'When did this start?': 'Kuqale nini lokhu?',
      'How long have you had this?': 'Uselokhu unalokhu isikhathi esingakanani?',
      'Take this medicine': 'Thatha lo muthi',
      'Come back in 3 days': 'Buya emva kwezinsuku ezi-3',
      'Emergency': 'Isimo esiphuthumayo',
      'Call ambulance': 'Shayela i-ambulensi'
    },
    'xh': {
      'Hello': 'Molo',
      'How are you?': 'Unjani?',
      'I need help': 'Ndidinga uncedo',
      'Thank you': 'Enkosi',
      'Doctor': 'Ugqirha',
      'Patient': 'Isigulana',
      'Medicine': 'Iyeza',
      'Pain': 'Intlungu',
      'Headache': 'Iintloko',
      'Fever': 'Umkhuhlane',
      'Cough': 'Ukukhohlela',
      'Chest pain': 'Iintlungu zesifuba',
      'Difficulty breathing': 'Ukuphefumla nzima',
      'When did this start?': 'Kuqale nini?',
      'How long have you had this?': 'Uselixesha elingakanani unalo?',
      'Take this medicine': 'Thatha eli yeza',
      'Come back in 3 days': 'Buyela emva kweentsuku ezi-3',
      'Emergency': 'Ingxaki ebukhali',
      'Call ambulance': 'Biza i-ambulensi'
    }
  }
};

export class TranslationService {
  private static instance: TranslationService;
  private apiKey: string | null = null;
  private isOnline: boolean = navigator.onLine;

  constructor() {
    // Monitor online status
    window.addEventListener('online', () => {
      this.isOnline = true;
    });
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  static getInstance(): TranslationService {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService();
    }
    return TranslationService.instance;
  }

  // Set API key for external translation services
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Translate text using mock service or external API
  async translateText(request: TranslationRequest): Promise<TranslationResponse> {
    const { text, sourceLanguage, targetLanguage } = request;

    // If same language, return as is
    if (sourceLanguage === targetLanguage) {
      return {
        translatedText: text,
        confidence: 1.0,
        sourceLanguage,
        targetLanguage
      };
    }

    // Try offline/mock translation first
    const mockTranslation = this.getMockTranslation(text, sourceLanguage, targetLanguage);
    if (mockTranslation) {
      return {
        translatedText: mockTranslation,
        confidence: 0.9,
        sourceLanguage,
        targetLanguage
      };
    }

    // If online, try external API
    if (this.isOnline && this.apiKey) {
      try {
        const translatedText = await this.callExternalAPI(request);
        return {
          translatedText,
          confidence: 0.95,
          sourceLanguage,
          targetLanguage
        };
      } catch (error) {
        console.warn('External translation failed, falling back to mock:', error);
      }
    }

    // Fallback: return original text with low confidence
    return {
      translatedText: text,
      confidence: 0.1,
      sourceLanguage,
      targetLanguage
    };
  }

  // Voice to text with translation
  async translateVoice(request: VoiceTranslationRequest): Promise<TranslationResponse> {
    const { audioBlob, sourceLanguage, targetLanguage } = request;

    try {
      // First convert speech to text
      const text = await this.speechToText(audioBlob, sourceLanguage);
      
      // Then translate the text
      if (text) {
        return await this.translateText({
          text,
          sourceLanguage,
          targetLanguage
        });
      }
    } catch (error) {
      console.error('Voice translation error:', error);
    }

    return {
      translatedText: '',
      confidence: 0,
      sourceLanguage,
      targetLanguage
    };
  }

  // Convert speech to text
  async speechToText(audioBlob: Blob, language: string): Promise<string> {
    // Mock implementation - in production, use Web Speech API or external service
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate speech recognition
        const mockResponses = [
          'I have a headache',
          'My chest hurts',
          'I need medicine',
          'When should I come back?',
          'Thank you doctor'
        ];
        const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
        resolve(randomResponse);
      }, 1000);
    });
  }

  // Convert text to speech
  async textToSpeech(text: string, language: string): Promise<Blob> {
    // Use Web Speech API if available
    if ('speechSynthesis' in window) {
      return new Promise((resolve, reject) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = this.getLanguageCode(language);
        
        // Create a MediaRecorder to capture the speech
        // This is a simplified approach - in production you'd use more sophisticated methods
        speechSynthesis.speak(utterance);
        
        // Return empty blob for now - actual implementation would capture audio
        resolve(new Blob([], { type: 'audio/wav' }));
      });
    }

    return new Blob([], { type: 'audio/wav' });
  }

  // Get translation from mock dictionary
  private getMockTranslation(text: string, sourceLanguage: string, targetLanguage: string): string | null {
    const sourceLangTranslations = MOCK_TRANSLATIONS[sourceLanguage];
    if (sourceLangTranslations && sourceLangTranslations[targetLanguage]) {
      return sourceLangTranslations[targetLanguage][text] || null;
    }
    return null;
  }

  // Call external translation API (Google Translate, Azure, etc.)
  private async callExternalAPI(request: TranslationRequest): Promise<string> {
    // This would integrate with actual translation services
    // For demo purposes, we'll simulate an API call
    
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    // Mock external API response
    const mockTranslation = this.getMockTranslation(
      request.text, 
      request.sourceLanguage, 
      request.targetLanguage
    );
    
    if (mockTranslation) {
      return mockTranslation;
    }
    
    throw new Error('Translation not available');
  }

  // Convert language codes for speech synthesis
  private getLanguageCode(language: string): string {
    const languageMap: Record<string, string> = {
      'en': 'en-US',
      'zu': 'zu-ZA',
      'xh': 'xh-ZA',
      'af': 'af-ZA',
      'st': 'st-ZA',
      'sw': 'sw-KE',
      'fr': 'fr-FR',
      'pt': 'pt-PT'
    };
    
    return languageMap[language] || 'en-US';
  }

  // Get available voices for a language
  getAvailableVoices(language: string): SpeechSynthesisVoice[] {
    if ('speechSynthesis' in window) {
      const voices = speechSynthesis.getVoices();
      const langCode = this.getLanguageCode(language);
      return voices.filter(voice => voice.lang.startsWith(langCode.split('-')[0]));
    }
    return [];
  }

  // Check if translation is supported for a language pair
  isLanguagePairSupported(sourceLanguage: string, targetLanguage: string): boolean {
    if (sourceLanguage === targetLanguage) return true;
    
    const sourceLangTranslations = MOCK_TRANSLATIONS[sourceLanguage];
    return !!(sourceLangTranslations && sourceLangTranslations[targetLanguage]);
  }

  // Get list of supported languages
  getSupportedLanguages(): string[] {
    return Object.keys(MOCK_TRANSLATIONS);
  }
}

// Export singleton instance
export const translationService = TranslationService.getInstance();
