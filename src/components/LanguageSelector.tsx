import React, { useState } from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Globe, Volume2, VolumeX } from 'lucide-react';
import { useTranslation, SUPPORTED_LANGUAGES, Language } from '../contexts/TranslationContext';

interface LanguageSelectorProps {
  compact?: boolean;
  showFlag?: boolean;
  showNativeName?: boolean;
  className?: string;
}

export default function LanguageSelector({ 
  compact = false, 
  showFlag = true, 
  showNativeName = true,
  className = ""
}: LanguageSelectorProps) {
  const { currentLanguage, setLanguage, translateText, isTranslating } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (languageCode: string) => {
    const language = SUPPORTED_LANGUAGES.find(lang => lang.code === languageCode);
    if (language) {
      setLanguage(language);
    }
    setIsOpen(false);
  };

  if (compact) {
    return (
      <div className={`relative ${className}`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="h-8 px-2 text-sm"
          disabled={isTranslating}
        >
          {showFlag && <span className="mr-1">{currentLanguage.flag}</span>}
          <Globe className="h-4 w-4" />
          {isTranslating && <div className="ml-1 animate-spin h-3 w-3 border border-gray-300 border-t-blue-600 rounded-full" />}
        </Button>
        
        {isOpen && (
          <div className="absolute top-full right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 min-w-[200px]">
            <div className="p-2">
              <div className="text-xs text-gray-500 mb-2 font-medium">
                {translateText('Select Language')}
              </div>
              {SUPPORTED_LANGUAGES.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-between ${
                    currentLanguage.code === language.code ? 'bg-blue-50 text-blue-700' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <span className="mr-2">{language.flag}</span>
                    <div>
                      <div className="text-sm font-medium">{language.name}</div>
                      {showNativeName && (
                        <div className="text-xs text-gray-500">{language.nativeName}</div>
                      )}
                    </div>
                  </div>
                  {currentLanguage.code === language.code && (
                    <div className="h-2 w-2 bg-blue-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Overlay to close dropdown */}
        {isOpen && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          {translateText('Language')} / {translateText('Ulimi')}
        </label>
        {isTranslating && (
          <Badge variant="secondary" className="text-xs">
            {translateText('translating')}...
          </Badge>
        )}
      </div>
      
      <Select value={currentLanguage.code} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-full">
          <SelectValue>
            <div className="flex items-center">
              {showFlag && <span className="mr-2">{currentLanguage.flag}</span>}
              <span className="font-medium">{currentLanguage.name}</span>
              {showNativeName && currentLanguage.nativeName !== currentLanguage.name && (
                <span className="ml-2 text-sm text-gray-500">({currentLanguage.nativeName})</span>
              )}
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {SUPPORTED_LANGUAGES.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              <div className="flex items-center w-full">
                <span className="mr-2">{language.flag}</span>
                <div className="flex-1">
                  <div className="font-medium">{language.name}</div>
                  {showNativeName && language.nativeName !== language.name && (
                    <div className="text-sm text-gray-500">{language.nativeName}</div>
                  )}
                </div>
                {currentLanguage.code === language.code && (
                  <div className="ml-2 h-2 w-2 bg-blue-600 rounded-full" />
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Language Features Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
        <div className="flex items-start space-x-2">
          <Globe className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <div className="font-medium text-blue-900 mb-1">
              {translateText('Translation Features')}
            </div>
            <ul className="text-blue-700 text-xs space-y-1">
              <li className="flex items-center">
                <Volume2 className="h-3 w-3 mr-1" />
                {translateText('Real-time voice translation')}
              </li>
              <li className="flex items-center">
                <Globe className="h-3 w-3 mr-1" />
                {translateText('Text translation in consultations')}
              </li>
              <li className="flex items-center">
                <VolumeX className="h-3 w-3 mr-1" />
                {translateText('Offline basic translation')}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
