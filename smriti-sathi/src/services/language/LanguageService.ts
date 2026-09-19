/**
 * Language Service
 * Manages language selection, translations, and localization
 * Designed for future Bhashini integration
 */

export type SupportedLanguage = 'en' | 'as' | 'brx' | 'mni';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  available: boolean;
}

export interface TranslationKey {
  [key: string]: string;
}

export interface Translations {
  [language: string]: TranslationKey;
}

// Supported languages for NE India
export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    available: true,
  },
  {
    code: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    flag: '🇮🇳',
    available: true,
  },
  {
    code: 'brx',
    name: 'Bodo',
    nativeName: 'बड़ो',
    flag: '🇮🇳',
    available: true,
  },
  {
    code: 'mni',
    name: 'Manipuri',
    nativeName: 'মৈতৈলোন্',
    flag: '🇮🇳',
    available: true,
  },
];

// Translation dictionary
// For prototype, we have English translations
// Other languages will use English as fallback until Bhashini integration
const TRANSLATIONS: Translations = {
  en: {
    // Common
    'app.name': 'Smriti Sathi',
    'app.tagline': 'Memory care that speaks your language',
    
    // Navigation
    'nav.home': 'Home',
    'nav.games': 'Games',
    'nav.reminders': 'Reminders',
    'nav.progress': 'Progress',
    'nav.caregiver': 'Care',
    
    // Home Screen
    'home.greeting.morning': 'Good Morning',
    'home.greeting.afternoon': 'Good Afternoon',
    'home.greeting.evening': 'Good Evening',
    'home.activities.title': "Today's Activities",
    'home.activities.memory': 'Start Memory Activity',
    'home.activities.memory.subtitle': 'Look at objects, then remember them',
    'home.activities.recognition': 'Start Recognition Activity',
    'home.activities.recognition.subtitle': 'Find patterns and what is different',
    'home.activities.memoryBook': 'View Memory Book',
    'home.activities.memoryBook.subtitle': 'Look at your personal memories',
    'home.reminders.title': "Today's Reminders",
    'home.reminders.viewAll': 'View All',
    'home.progress.title': 'Your Progress',
    'home.progress.viewDetails': 'View Details',
    'home.message': 'Take your time. There is no rush.',
    
    // Games
    'games.title': 'Cognitive Games',
    'games.subtitle': 'Keep your mind active',
    'games.remember.title': 'Remember',
    'games.remember.description': 'Look at familiar objects, then recall which ones you saw.',
    'games.recognise.title': 'Recognise',
    'games.recognise.description': 'Find patterns, sequences, and what is different.',
    'games.startActivity': 'Start Activity',
    'games.playAgain': 'Play Again',
    'games.backToGames': 'Back to Games',
    
    // Remember Game
    'remember.intro.title': 'Remember',
    'remember.intro.description': 'Look carefully at the objects. You will be asked about them.',
    'remember.intro.howItWorks': 'How It Works',
    'remember.intro.step1': 'You will see some objects on the screen',
    'remember.intro.step2': 'Look at them carefully for a few seconds',
    'remember.intro.step3': 'Then, select the objects you remember',
    'remember.memorize.title': 'Look Carefully',
    'remember.memorize.instruction': 'Remember these objects',
    'remember.memorize.lookCarefully': 'Look at each object carefully',
    'remember.recall.title': 'Which objects did you see?',
    'remember.recall.instruction': 'Select the objects you remember',
    'remember.recall.selected': 'Selected:',
    'remember.recall.tapToSelect': 'Tap an object to select or deselect it',
    'remember.recall.done': 'Done',
    'remember.result.title': 'Activity Complete',
    'remember.result.yourResults': 'Your results',
    'remember.result.score': 'Score',
    'remember.result.accuracy': 'Accuracy',
    'remember.result.time': 'Time',
    'remember.result.difficultyLevel': 'Difficulty Level',
    'remember.result.details': 'Details',
    'remember.result.correctlyRemembered': '✓ Correctly remembered',
    'remember.result.notInOriginal': '✗ Not in the original set',
    'remember.result.missed': '○ Missed',
    
    // Recognise Game
    'recognise.intro.title': 'Recognise',
    'recognise.intro.description': 'Look at patterns and sequences. Find what comes next or what is different.',
    'recognise.intro.whatYouWillDo': 'What You Will Do',
    'recognise.intro.step1': 'Look at objects or patterns shown to you',
    'recognise.intro.step2': 'Think about what comes next or what is different',
    'recognise.intro.step3': 'Choose your answer from the options given',
    'recognise.intro.example': 'Example:',
    'recognise.intro.whatComesNext': 'What comes next?',
    'recognise.play.chooseAnswer': 'Choose the correct answer',
    'recognise.play.selectYourAnswer': 'Select your answer:',
    'recognise.play.tapToSelect': 'Tap an option to select it',
    'recognise.play.confirmAnswer': 'Confirm Answer',
    'recognise.result.lastQuestion': 'Last Question',
    'recognise.result.yourAnswer': 'Your answer:',
    'recognise.result.correctAnswer': 'Correct answer:',
    
    // Reminders
    'reminders.title': 'Reminders',
    'reminders.subtitle': 'Never miss what matters',
    'reminders.addNew': 'Add New Reminder',
    'reminders.today': 'Today',
    'reminders.upcoming': 'Upcoming',
    'reminders.complete': 'Complete',
    'reminders.snooze': 'Snooze',
    'reminders.edit': 'Edit',
    'reminders.delete': 'Delete',
    'reminders.completed': 'Completed',
    'reminders.noReminders': 'No reminders yet',
    'reminders.tapToAdd': 'Tap "Add New Reminder" to get started',
    'reminders.workOffline': 'Reminders work offline. They\'ll sync when you\'re back online.',
    
    // Reminder Types
    'reminder.type.medicine': 'Medicine',
    'reminder.type.hydration': 'Hydration',
    'reminder.type.activity': 'Activity',
    'reminder.type.appointment': 'Appointment',
    
    // Reminder Form
    'reminder.form.title': 'Title',
    'reminder.form.type': 'Type',
    'reminder.form.time': 'Time',
    'reminder.form.repeat': 'Repeat',
    'reminder.form.repeat.none': 'One time',
    'reminder.form.repeat.daily': 'Daily',
    'reminder.form.repeat.weekly': 'Weekly',
    'reminder.form.description': 'Description (optional)',
    'reminder.form.addNotes': 'Add notes...',
    'reminder.form.cancel': 'Cancel',
    'reminder.form.create': 'Create',
    'reminder.form.update': 'Update',
    'reminder.form.editReminder': 'Edit Reminder',
    'reminder.form.createReminder': 'Create Reminder',
    
    // Progress
    'progress.title': 'My Progress',
    'progress.subtitle': 'Your cognitive journey',
    'progress.today.title': "Today's Activity",
    'progress.today.games': 'Games',
    'progress.today.minutes': 'Minutes',
    'progress.today.accuracy': 'Accuracy',
    'progress.weekly.title': 'This Week',
    'progress.weekly.gamesPlayed': 'Games Played',
    'progress.weekly.totalTime': 'Total Time',
    'progress.memoryPerformance': 'Memory Performance',
    'progress.recognitionPerformance': 'Recognition Performance',
    'progress.totalGames': 'Total Games',
    'progress.reminderAdherence': 'Reminder Adherence',
    'progress.dailyActivity': 'Daily Activity',
    
    // Caregiver Dashboard
    'caregiver.title': 'Caregiver Dashboard',
    'caregiver.subtitle': 'Patient overview',
    'caregiver.lastActive': 'Last active:',
    'caregiver.sessionsCompleted': 'sessions completed',
    'caregiver.followUpSuggested': 'Follow-up Suggested',
    'caregiver.followUpMessage': 'Performance trend has changed. Consider caregiver follow-up.',
    'caregiver.followUpDisclaimer': 'This is not a medical diagnosis. Please consult healthcare professionals for clinical advice.',
    'caregiver.weeklyEngagement': 'Weekly Engagement',
    'caregiver.averageAccuracy': 'Average accuracy this week',
    'caregiver.memory': 'Memory',
    'caregiver.recognition': 'Recognition',
    'caregiver.trend.improving': '↑ Improving',
    'caregiver.trend.stable': '→ Stable',
    'caregiver.trend.declining': '↓ Declining',
    'caregiver.reminderAdherence': 'Reminder Adherence',
    'caregiver.remindersCompleted': 'Reminders completed on time',
    'caregiver.recentActivity': 'Recent Activity',
    'caregiver.noRecentActivities': 'No recent activities',
    'caregiver.refreshDashboard': 'Refresh Dashboard',
    'caregiver.resetDemoData': 'Reset Demo Data',
    'caregiver.backToHome': 'Back to Home',
    'caregiver.disclaimer': 'This dashboard provides engagement insights for caregiver support. It is not a diagnostic or clinical assessment tool.',
    
    // Memory Book
    'memoryBook.title': 'Memory Book',
    'memoryBook.subtitle': 'Your personal memories',
    'memoryBook.manageTitle': 'Memory Book',
    'memoryBook.manageSubtitle': 'Manage memory anchors',
    'memoryBook.addMemory': 'Add Memory',
    'memoryBook.addSampleMemories': 'Add Sample Memories',
    'memoryBook.all': 'All',
    'memoryBook.category.family': 'My Family',
    'memoryBook.category.places': 'My Places',
    'memoryBook.category.objects': 'Important Objects',
    'memoryBook.category.memories': 'My Memories',
    'memoryBook.noMemories': 'No memories yet',
    'memoryBook.askCaregiver': 'Ask a caregiver to add memories for you',
    'memoryBook.noMemoriesCaregiver': 'No memory items yet',
    'memoryBook.addMemoriesToCreate': 'Add memories to create a personal memory book',
    'memoryBook.hearDescription': 'Hear Description',
    'memoryBook.speaking': 'Speaking...',
    'memoryBook.previous': 'Previous',
    'memoryBook.next': 'Next',
    'memoryBook.noPhoto': 'No photo',
    
    // Settings
    'settings.title': 'Settings',
    'settings.subtitle': 'Customize your experience',
    'settings.patientProfile': 'Patient Profile',
    'settings.age': 'Age:',
    'settings.setup': 'Setup',
    'settings.restartSetup': 'Restart Setup',
    'settings.restartSetup.description': 'Change patient, language, or preferences',
    'settings.language': 'Language',
    'settings.appLanguage': 'App Language',
    'settings.moreLanguagesComing': 'More languages from the North Eastern region will be added soon.',
    'settings.voiceAccessibility': 'Voice & Accessibility',
    'settings.voiceInstructions': 'Voice Instructions',
    'settings.voiceInstructions.description': 'Read instructions aloud',
    'settings.largeText': 'Large Text',
    'settings.largeText.description': 'Use bigger fonts throughout',
    'settings.highContrast': 'High Contrast',
    'settings.highContrast.description': 'Increase color contrast',
    'settings.soundEffects': 'Sound Effects',
    'settings.soundEffects.description': 'Play sounds during games',
    'settings.display': 'Display',
    'settings.textSize': 'Text Size',
    'settings.notifications': 'Notifications',
    'settings.medicineReminders': 'Medicine Reminders',
    'settings.medicineReminders.description': 'Alert for medication times',
    'settings.gameReminders': 'Game Reminders',
    'settings.gameReminders.description': 'Daily game suggestions',
    'settings.appointmentAlerts': 'Appointment Alerts',
    'settings.appointmentAlerts.description': 'Notify before appointments',
    'settings.dataPrivacy': 'Data & Privacy',
    'settings.offlineMode': 'Offline Mode',
    'settings.offlineMode.description': 'Store data locally',
    'settings.autoSync': 'Auto-Sync',
    'settings.autoSync.description': 'Sync when online',
    'settings.localStorage': 'Local Storage',
    'settings.localStorage.description': 'Data stored on this device',
    'settings.developerTools': 'Developer Tools',
    'settings.runAdaptiveTests': 'Run Adaptive Engine Tests',
    'settings.runAdaptiveTests.description': 'Verify difficulty adjustment logic',
    'settings.runDatabaseTests': 'Run Database Tests',
    'settings.runDatabaseTests.description': 'Verify offline-first persistence',
    'settings.runReminderTests': 'Run Reminder Tests',
    'settings.runReminderTests.description': 'Test reminder system functionality',
    'settings.about': 'About',
    
    // Common Actions
    'action.save': 'Save',
    'action.cancel': 'Cancel',
    'action.delete': 'Delete',
    'action.edit': 'Edit',
    'action.confirm': 'Confirm',
    'action.back': 'Back',
    'action.next': 'Next',
    'action.previous': 'Previous',
    'action.close': 'Close',
    'action.retry': 'Retry',
    
    // Status Messages
    'status.online': 'Online',
    'status.offline': 'Offline',
    'status.loading': 'Loading...',
    'status.saving': 'Saving...',
    'status.success': 'Success',
    'status.error': 'Error',
    
    // Voice
    'voice.hearInstructions': 'Hear Instructions',
    'voice.listening': 'Listening...',
    'voice.speaking': 'Speaking...',
    'voice.voiceNotAvailable': 'Voice not available',
  },
  
  // Assamese - Using English as fallback for prototype
  as: {
    // Will be populated with Bhashini translations in future
    // For now, all keys fall back to English
  },
  
  // Bodo - Using English as fallback for prototype
  brx: {
    // Will be populated with Bhashini translations in future
    // For now, all keys fall back to English
  },
  
  // Manipuri - Using English as fallback for prototype
  mni: {
    // Will be populated with Bhashini translations in future
    // For now, all keys fall back to English
  },
};

export class LanguageService {
  private currentLanguage: SupportedLanguage = 'en';
  private fallbackLanguage: SupportedLanguage = 'en';

  /**
   * Set the current language
   */
  setLanguage(language: SupportedLanguage): void {
    this.currentLanguage = language;
    console.log(`Language changed to: ${language}`);
  }

  /**
   * Get the current language
   */
  getLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  /**
   * Get language info by code
   */
  getLanguageInfo(code: SupportedLanguage): LanguageInfo | undefined {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
  }

  /**
   * Get all supported languages
   */
  getSupportedLanguages(): LanguageInfo[] {
    return SUPPORTED_LANGUAGES;
  }

  /**
   * Translate a key to the current language
   * Falls back to English if translation not available
   */
  translate(key: string, params?: Record<string, string>): string {
    let translation = TRANSLATIONS[this.currentLanguage]?.[key];
    
    // Fallback to English if translation not available
    if (!translation) {
      translation = TRANSLATIONS[this.fallbackLanguage]?.[key];
    }
    
    // If still no translation, return the key itself
    if (!translation) {
      console.warn(`Translation not found for key: ${key}`);
      return key;
    }

    // Replace parameters if provided
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation!.replace(`{${paramKey}}`, paramValue);
      });
    }

    return translation;
  }

  /**
   * Check if a language is available
   */
  isLanguageAvailable(code: SupportedLanguage): boolean {
    const lang = this.getLanguageInfo(code);
    return lang?.available || false;
  }

  /**
   * Get the BCP 47 language tag for TTS
   */
  getLanguageTag(code: SupportedLanguage): string {
    const tags: Record<SupportedLanguage, string> = {
      en: 'en-US',
      as: 'as-IN', // Assamese
      brx: 'brx-IN', // Bodo
      mni: 'mni-IN', // Manipuri
    };
    return tags[code];
  }

  /**
   * Get all translations for a language (for debugging)
   */
  getAllTranslations(language?: SupportedLanguage): TranslationKey {
    const lang = language || this.currentLanguage;
    return TRANSLATIONS[lang] || {};
  }

  /**
   * Check if translations exist for a language
   */
  hasTranslations(language: SupportedLanguage): boolean {
    return Object.keys(TRANSLATIONS[language] || {}).length > 0;
  }
}

// Export singleton instance
export const languageService = new LanguageService();
