/**
 * Text-to-Speech Service
 * Provides multilingual TTS with graceful fallback
 * Designed for future Bhashini integration
 */

import { languageService, SupportedLanguage } from '../language/LanguageService';

export interface TTSOptions {
  text: string;
  language?: SupportedLanguage;
  rate?: number;
  pitch?: number;
  volume?: number;
  onEnd?: () => void;
  onError?: (error: any) => void;
}

export class TextToSpeechService {
  private synth: SpeechSynthesis | null = null;
  private isSupported: boolean = false;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    // Check if speech synthesis is supported
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.isSupported = true;
      
      // Load voices
      this.loadVoices();
      
      // Some browsers load voices asynchronously
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  /**
   * Load available voices
   */
  private loadVoices(): void {
    if (!this.synth) return;
    
    this.voices = this.synth.getVoices();
    console.log(`Loaded ${this.voices.length} voices`);
  }

  /**
   * Find the best voice for a language
   */
  private findVoice(language: SupportedLanguage): SpeechSynthesisVoice | null {
    const languageTag = languageService.getLanguageTag(language);
    
    // Try to find exact match
    let voice = this.voices.find(v => v.lang === languageTag);
    
    // Try to find language prefix match (e.g., 'en' for 'en-US')
    if (!voice) {
      const langPrefix = languageTag.split('-')[0];
      voice = this.voices.find(v => v.lang.startsWith(langPrefix));
    }
    
    // Fallback to English
    if (!voice && language !== 'en') {
      console.warn(`Voice not available for ${language}, falling back to English`);
      voice = this.voices.find(v => v.lang.startsWith('en'));
    }
    
    // Last resort: use any available voice
    if (!voice && this.voices.length > 0) {
      voice = this.voices[0];
    }
    
    return voice || null;
  }

  /**
   * Speak text with optional language
   */
  async speak(options: TTSOptions): Promise<void> {
    if (!this.isSupported || !this.synth) {
      console.warn('Speech synthesis not supported');
      options.onError?.(new Error('Speech synthesis not supported'));
      return;
    }

    // Cancel any ongoing speech
    this.synth.cancel();

    // Determine language (use provided or current)
    const language = options.language || languageService.getLanguage();

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(options.text);
    
    // Configure voice settings
    utterance.rate = options.rate || 0.9; // Slightly slower for elderly users
    utterance.pitch = options.pitch || 1.0;
    utterance.volume = options.volume || 1.0;
    utterance.lang = languageService.getLanguageTag(language);

    // Find and set the best voice
    const voice = this.findVoice(language);
    if (voice) {
      utterance.voice = voice;
      console.log(`Using voice: ${voice.name} (${voice.lang})`);
    }

    // Speak the message
    return new Promise((resolve, reject) => {
      utterance.onend = () => {
        options.onEnd?.();
        resolve();
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        options.onError?.(event);
        reject(event);
      };
      
      this.synth!.speak(utterance);
    });
  }

  /**
   * Stop any ongoing speech
   */
  stop(): void {
    if (this.isSupported && this.synth) {
      this.synth.cancel();
    }
  }

  /**
   * Check if TTS is available
   */
  isAvailable(): boolean {
    return this.isSupported;
  }

  /**
   * Check if a specific language is available for TTS
   */
  isLanguageAvailable(language: SupportedLanguage): boolean {
    if (!this.isSupported) return false;
    
    const voice = this.findVoice(language);
    return voice !== null;
  }

  /**
   * Get available voices for a language
   */
  getAvailableVoices(language?: SupportedLanguage): SpeechSynthesisVoice[] {
    if (!language) return this.voices;
    
    const languageTag = languageService.getLanguageTag(language);
    const langPrefix = languageTag.split('-')[0];
    
    return this.voices.filter(v => 
      v.lang === languageTag || v.lang.startsWith(langPrefix)
    );
  }

  /**
   * Preview voice for a language
   */
  async previewVoice(language: SupportedLanguage): Promise<void> {
    const langInfo = languageService.getLanguageInfo(language);
    const text = `This is a preview of ${langInfo?.name || language} voice.`;
    
    await this.speak({
      text,
      language,
      rate: 0.9,
    });
  }

  /**
   * Get all available languages for TTS
   */
  getAvailableLanguages(): SupportedLanguage[] {
    const languages: SupportedLanguage[] = [];
    const supportedLanguages = languageService.getSupportedLanguages();
    
    for (const lang of supportedLanguages) {
      if (this.isLanguageAvailable(lang.code)) {
        languages.push(lang.code);
      }
    }
    
    return languages;
  }
}

// Export singleton instance
export const ttsService = new TextToSpeechService();
