/**
 * Voice Instruction Service
 * High-level service for providing voice instructions in the UI
 * Combines TTS with language service for seamless multilingual support
 */

import { ttsService } from './TextToSpeechService';
import { languageService, SupportedLanguage } from '../language/LanguageService';

export interface VoiceInstructionOptions {
  translationKey: string;
  params?: Record<string, string>;
  language?: SupportedLanguage;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export class VoiceInstructionService {
  /**
   * Speak a translated instruction
   */
  async speakInstruction(options: VoiceInstructionOptions): Promise<void> {
    // Get the translation
    const text = languageService.translate(options.translationKey, options.params);
    
    // Speak it
    await ttsService.speak({
      text,
      language: options.language,
      rate: options.rate,
      pitch: options.pitch,
      volume: options.volume,
    });
  }

  /**
   * Speak a game instruction
   */
  async speakGameInstruction(
    gameType: 'remember' | 'recognise',
    phase: 'intro' | 'memorize' | 'recall' | 'result',
    language?: SupportedLanguage
  ): Promise<void> {
    const key = `${gameType}.${phase}.title`;
    await this.speakInstruction({
      translationKey: key,
      language,
      rate: 0.85, // Slower for game instructions
    });
  }

  /**
   * Speak a reminder notification
   */
  async speakReminder(
    reminderTitle: string,
    reminderType: string,
    patientName?: string,
    language?: SupportedLanguage
  ): Promise<void> {
    // Build a natural reminder message
    const typeTranslation = languageService.translate(`reminder.type.${reminderType}`);
    
    let message = '';
    if (patientName) {
      message = `${patientName}, `;
    }
    message += `${typeTranslation}: ${reminderTitle}`;
    
    await ttsService.speak({
      text: message,
      language,
      rate: 0.9,
    });
  }

  /**
   * Speak a memory book item description
   */
  async speakMemoryDescription(
    title: string,
    subject: string,
    description: string,
    language?: SupportedLanguage
  ): Promise<void> {
    const message = `${title}. ${subject}. ${description}`;
    
    await ttsService.speak({
      text: message,
      language,
      rate: 0.8, // Slower for memory descriptions
    });
  }

  /**
   * Speak a navigation instruction
   */
  async speakNavigation(screen: string, language?: SupportedLanguage): Promise<void> {
    const key = `nav.${screen}`;
    await this.speakInstruction({
      translationKey: key,
      language,
      rate: 0.9,
    });
  }

  /**
   * Speak a greeting based on time of day
   */
  async speakGreeting(patientName?: string, language?: SupportedLanguage): Promise<void> {
    const hour = new Date().getHours();
    let greetingKey = 'home.greeting.morning';
    
    if (hour >= 12 && hour < 17) {
      greetingKey = 'home.greeting.afternoon';
    } else if (hour >= 17) {
      greetingKey = 'home.greeting.evening';
    }
    
    let message = languageService.translate(greetingKey);
    if (patientName) {
      message = `${message}, ${patientName}`;
    }
    
    await ttsService.speak({
      text: message,
      language,
      rate: 0.9,
    });
  }

  /**
   * Speak a success message
   */
  async speakSuccess(message: string, language?: SupportedLanguage): Promise<void> {
    await ttsService.speak({
      text: message,
      language,
      rate: 0.9,
      pitch: 1.1, // Slightly higher pitch for positive feedback
    });
  }

  /**
   * Speak an error message
   */
  async speakError(message: string, language?: SupportedLanguage): Promise<void> {
    await ttsService.speak({
      text: message,
      language,
      rate: 0.85,
      pitch: 0.9, // Slightly lower pitch for error
    });
  }

  /**
   * Stop any ongoing speech
   */
  stop(): void {
    ttsService.stop();
  }

  /**
   * Check if voice instructions are available
   */
  isAvailable(): boolean {
    return ttsService.isAvailable();
  }

  /**
   * Check if a specific language is available for voice instructions
   */
  isLanguageAvailable(language: SupportedLanguage): boolean {
    return ttsService.isLanguageAvailable(language);
  }
}

// Export singleton instance
export const voiceInstructionService = new VoiceInstructionService();
