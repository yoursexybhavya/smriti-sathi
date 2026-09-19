/**
 * Voice Reminder Service
 * Provides text-to-speech functionality for reminders
 * Designed for future Bhashini integration
 */

export interface VoiceReminderOptions {
  text: string;
  patientName?: string;
  reminderType?: 'medicine' | 'hydration' | 'activity' | 'appointment';
  language?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export class VoiceReminderService {
  private synth: SpeechSynthesis | null = null;
  private isSupported: boolean = false;

  constructor() {
    // Check if speech synthesis is supported
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.isSupported = true;
    }
  }

  /**
   * Speak a reminder message
   */
  async speak(options: VoiceReminderOptions): Promise<void> {
    if (!this.isSupported || !this.synth) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    this.synth.cancel();

    // Build the message
    const message = this.buildMessage(options);

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(message);
    
    // Configure voice settings
    utterance.rate = options.rate || 0.9; // Slightly slower for elderly users
    utterance.pitch = options.pitch || 1.0;
    utterance.volume = options.volume || 1.0;
    utterance.lang = options.language || 'en-US';

    // Try to find a suitable voice
    const voices = this.synth.getVoices();
    if (voices.length > 0) {
      // Prefer English voices, then any available
      const englishVoice = voices.find(v => v.lang.startsWith('en'));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
    }

    // Speak the message
    return new Promise((resolve, reject) => {
      utterance.onend = () => resolve();
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
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
   * Check if voice reminders are available
   */
  isAvailable(): boolean {
    return this.isSupported;
  }

  /**
   * Build a reminder message based on type and context
   */
  private buildMessage(options: VoiceReminderOptions): string {
    const { text, patientName, reminderType } = options;
    
    let message = '';

    // Add patient name if provided
    if (patientName) {
      message += `${patientName}, `;
    }

    // Add context based on reminder type
    switch (reminderType) {
      case 'medicine':
        message += `it is time to take your medicine. ${text}`;
        break;
      case 'hydration':
        message += `remember to drink some water. ${text}`;
        break;
      case 'activity':
        message += `time for your activity. ${text}`;
        break;
      case 'appointment':
        message += `you have an appointment. ${text}`;
        break;
      default:
        message += text;
    }

    return message;
  }

  /**
   * Get available voices (for debugging/testing)
   */
  getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.isSupported || !this.synth) {
      return [];
    }
    return this.synth.getVoices();
  }

  /**
   * Preview voice settings
   */
  async preview(language: string = 'en-US'): Promise<void> {
    await this.speak({
      text: 'This is a preview of the voice reminder.',
      language,
    });
  }

  /**
   * Future: Integrate with Bhashini API
   * This method is a placeholder for future Bhashini integration
   */
  async speakWithBhashini(options: VoiceReminderOptions): Promise<void> {
    // TODO: Implement Bhashini TTS API integration
    // For now, fall back to browser TTS
    console.log('Bhashini integration not yet implemented, using browser TTS');
    await this.speak(options);
  }
}

// Export singleton instance
export const voiceReminderService = new VoiceReminderService();
