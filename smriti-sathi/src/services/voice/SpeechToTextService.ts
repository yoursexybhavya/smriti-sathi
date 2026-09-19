/**
 * Speech-to-Text Service
 * Provides multilingual STT with graceful fallback
 * Designed for future Bhashini integration
 * 
 * Note: This is a placeholder for future implementation.
 * Web Speech API recognition is not widely supported on mobile browsers.
 * For production, consider using native mobile APIs or Bhashini.
 */

import { languageService, SupportedLanguage } from '../language/LanguageService';

export interface STTOptions {
  language?: SupportedLanguage;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (text: string, isFinal: boolean) => void;
  onError?: (error: any) => void;
  onEnd?: () => void;
}

export class SpeechToTextService {
  private recognition: any = null;
  private isSupported: boolean = false;

  constructor() {
    // Check if speech recognition is supported
    // Note: Web Speech API recognition has limited browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.isSupported = true;
      this.recognition = new SpeechRecognition();
      this.setupRecognition();
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
  }

  /**
   * Setup recognition event handlers
   */
  private setupRecognition(): void {
    if (!this.recognition) return;

    this.recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const text = result[0].transcript;
      const isFinal = result.isFinal;
      
      // This will be overridden by options.onResult
      console.log(`STT Result: ${text} (final: ${isFinal})`);
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
    };

    this.recognition.onend = () => {
      console.log('Speech recognition ended');
    };
  }

  /**
   * Start listening for speech
   */
  async startListening(options: STTOptions = {}): Promise<void> {
    if (!this.isSupported || !this.recognition) {
      console.warn('Speech recognition not supported');
      options.onError?.(new Error('Speech recognition not supported'));
      return;
    }

    // Determine language
    const language = options.language || languageService.getLanguage();
    const languageTag = languageService.getLanguageTag(language);

    // Configure recognition
    this.recognition.lang = languageTag;
    this.recognition.continuous = options.continuous || false;
    this.recognition.interimResults = options.interimResults || true;

    // Setup callbacks
    if (options.onResult) {
      this.recognition.onresult = (event: any) => {
        const result = event.results[event.results.length - 1];
        const text = result[0].transcript;
        const isFinal = result.isFinal;
        options.onResult!(text, isFinal);
      };
    }

    if (options.onError) {
      this.recognition.onerror = options.onError;
    }

    if (options.onEnd) {
      this.recognition.onend = options.onEnd;
    }

    // Start recognition
    try {
      this.recognition.start();
      console.log(`Started listening in ${languageTag}`);
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      options.onError?.(error);
    }
  }

  /**
   * Stop listening
   */
  stopListening(): void {
    if (this.isSupported && this.recognition) {
      this.recognition.stop();
      console.log('Stopped listening');
    }
  }

  /**
   * Abort listening immediately
   */
  abortListening(): void {
    if (this.isSupported && this.recognition) {
      this.recognition.abort();
      console.log('Aborted listening');
    }
  }

  /**
   * Check if STT is available
   */
  isAvailable(): boolean {
    return this.isSupported;
  }

  /**
   * Check if a specific language is available for STT
   */
  isLanguageAvailable(language: SupportedLanguage): boolean {
    // For now, assume all languages are available if STT is supported
    // In production, this would check against supported languages
    return this.isSupported;
  }

  /**
   * Get available languages for STT
   */
  getAvailableLanguages(): SupportedLanguage[] {
    if (!this.isSupported) return [];
    
    // Return all supported languages
    // In production, this would filter by actually supported languages
    return languageService.getSupportedLanguages().map(lang => lang.code);
  }
}

// Export singleton instance
export const sttService = new SpeechToTextService();
