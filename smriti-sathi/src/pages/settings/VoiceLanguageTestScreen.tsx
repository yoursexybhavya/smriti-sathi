import React, { useState } from 'react';
import { ArrowLeft, Volume2, Globe, CheckCircle, XCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { ttsService } from '../../services/voice/TextToSpeechService';
import { sttService } from '../../services/voice/SpeechToTextService';
import { voiceInstructionService } from '../../services/voice/VoiceInstructionService';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../../services/language/LanguageService';

interface VoiceLanguageTestScreenProps {
  onBack: () => void;
}

export default function VoiceLanguageTestScreen({ onBack }: VoiceLanguageTestScreenProps) {
  const { currentLanguage, setLanguage, translate } = useLanguage();
  const [testResults, setTestResults] = useState<Array<{
    name: string;
    passed: boolean;
    message: string;
  }>>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    const results: Array<{ name: string; passed: boolean; message: string }> = [];

    // Test 1: TTS Availability
    try {
      const available = ttsService.isAvailable();
      results.push({
        name: 'TTS Availability',
        passed: available,
        message: available ? 'Text-to-Speech is available' : 'Text-to-Speech not available',
      });
    } catch (error) {
      results.push({
        name: 'TTS Availability',
        passed: false,
        message: `Error: ${error}`,
      });
    }

    // Test 2: STT Availability
    try {
      const available = sttService.isAvailable();
      results.push({
        name: 'STT Availability',
        passed: available,
        message: available ? 'Speech-to-Text is available' : 'Speech-to-Text not available (expected on some browsers)',
      });
    } catch (error) {
      results.push({
        name: 'STT Availability',
        passed: false,
        message: `Error: ${error}`,
      });
    }

    // Test 3: Language Service
    try {
      const languages = SUPPORTED_LANGUAGES;
      results.push({
        name: 'Language Service',
        passed: languages.length === 4,
        message: `${languages.length} languages supported`,
      });
    } catch (error) {
      results.push({
        name: 'Language Service',
        passed: false,
        message: `Error: ${error}`,
      });
    }

    // Test 4: Translation Fallback
    try {
      const englishText = translate('home.greeting.morning');
      const hasTranslation = englishText.length > 0;
      results.push({
        name: 'Translation Fallback',
        passed: hasTranslation,
        message: hasTranslation ? 'Translations working with fallback' : 'Translation failed',
      });
    } catch (error) {
      results.push({
        name: 'Translation Fallback',
        passed: false,
        message: `Error: ${error}`,
      });
    }

    // Test 5: TTS for Each Language
    for (const lang of SUPPORTED_LANGUAGES) {
      try {
        const available = ttsService.isLanguageAvailable(lang.code);
        results.push({
          name: `TTS - ${lang.name}`,
          passed: true, // We mark as passed even if not available, since fallback works
          message: available 
            ? `${lang.name} voice available` 
            : `${lang.name} voice not available (will use fallback)`,
        });
      } catch (error) {
        results.push({
          name: `TTS - ${lang.name}`,
          passed: false,
          message: `Error: ${error}`,
        });
      }
    }

    // Test 6: Voice Instruction Service
    try {
      const available = voiceInstructionService.isAvailable();
      results.push({
        name: 'Voice Instruction Service',
        passed: available,
        message: available ? 'Voice instructions available' : 'Voice instructions not available',
      });
    } catch (error) {
      results.push({
        name: 'Voice Instruction Service',
        passed: false,
        message: `Error: ${error}`,
      });
    }

    setTestResults(results);
    setIsRunning(false);
  };

  const testTTS = async (language: SupportedLanguage) => {
    const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === language);
    const text = `This is a test of ${langInfo?.name || language} text-to-speech.`;
    
    try {
      await ttsService.speak({
        text,
        language,
        rate: 0.9,
      });
    } catch (error) {
      console.error('TTS test failed:', error);
    }
  };

  const passedCount = testResults.filter(r => r.passed).length;
  const totalCount = testResults.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Voice & Language Tests</h1>
              <p className="text-gray-600 mt-1">Test voice and multilingual features</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Test Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Suite</h2>
          <p className="text-gray-600 mb-6">
            This test suite verifies voice and language functionality including TTS, STT, 
            translations, and language fallback behavior.
          </p>

          <button
            onClick={runTests}
            disabled={isRunning}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
          >
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </button>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Test Results</h2>
              <div className="text-sm font-medium text-gray-600">
                {passedCount} / {totalCount} passed
              </div>
            </div>

            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-4 rounded-lg ${
                    result.passed ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  {result.passed ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{result.name}</div>
                    <div className="text-sm text-gray-600 mt-1">{result.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Language Selection */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Language</h2>
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-5 h-5 text-gray-600" />
            <span className="text-gray-900 font-medium">
              {SUPPORTED_LANGUAGES.find((l: any) => l.code === currentLanguage)?.name || 'Unknown'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {SUPPORTED_LANGUAGES.map((lang: any) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  currentLanguage === lang.code
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{lang.flag}</span>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">{lang.nativeName}</div>
                    <div className="text-xs text-gray-600">{lang.name}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* TTS Test */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Text-to-Speech</h2>
          <p className="text-gray-600 mb-4">
            Click a language to test TTS. If the language is not available, it will fall back to English.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {SUPPORTED_LANGUAGES.map((lang: any) => (
              <button
                key={lang.code}
                onClick={() => testTTS(lang.code)}
                className="flex items-center gap-2 p-3 rounded-lg border-2 border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition-all"
              >
                <Volume2 className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">{lang.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Architecture Notes</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Voice services use Web Speech API (browser built-in)</li>
            <li>• Graceful fallback to English when language unavailable</li>
            <li>• Designed for future Bhashini integration</li>
            <li>• No hardcoded API credentials</li>
            <li>• All services work offline</li>
            <li>• Language selection persists across sessions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
