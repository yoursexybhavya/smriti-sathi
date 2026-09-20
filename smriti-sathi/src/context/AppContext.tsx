import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { userRepository, settingsRepository } from '../database';
import type { User, Settings } from '../database';

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  preferredLanguage: string;
  profileImage?: string;
  dailyRoutine: string[];
  reminderPreferences: {
    medicine: boolean;
    hydration: boolean;
    activity: boolean;
    appointment: boolean;
  };
}

export interface AccessibilitySettings {
  textSize: 'normal' | 'large' | 'extra-large';
  highContrast: boolean;
  voiceGuidance: boolean;
  theme?: 'light' | 'dark';
}

export interface AppState {
  onboardingComplete: boolean;
  currentPatient: PatientProfile | null;
  interfaceLanguage: string;
  accessibility: AccessibilitySettings;
  isLoading: boolean;
}

interface AppContextType {
  state: AppState;
  completeOnboarding: (patient: PatientProfile, language: string, accessibility: AccessibilitySettings) => Promise<void>;
  resetOnboarding: () => Promise<void>;
  updatePatient: (patient: PatientProfile) => Promise<void>;
  updateAccessibility: (settings: AccessibilitySettings) => Promise<void>;
  updateLanguage: (language: string) => Promise<void>;
  toggleTheme: () => void;
  skipToElderDemo: () => Promise<void>;
}

const defaultState: AppState = {
  onboardingComplete: false,
  currentPatient: null,
  interfaceLanguage: 'en',
  accessibility: {
    textSize: 'large',
    highContrast: false,
    voiceGuidance: true,
    theme: (typeof window !== 'undefined' && localStorage.getItem('smriti_sathi_theme') === 'dark') ? 'dark' : 'light',
  },
  isLoading: true,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);

  // Load data from database on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Check if there's a user in the database
        const users = await userRepository.getAll();
        
        if (users.length > 0) {
          const user = users[0]; // Get the first (and only) user
          const settings = await settingsRepository.getByUserId(user.id!);
          
          const patient: PatientProfile = {
            id: user.id!.toString(),
            name: user.name,
            age: user.age,
            preferredLanguage: user.preferredLanguage,
            profileImage: user.profileImage,
            dailyRoutine: [], // These will be stored separately if needed
            reminderPreferences: {
              medicine: true,
              hydration: true,
              activity: true,
              appointment: true,
            },
          };

          const savedTheme = (typeof window !== 'undefined' && localStorage.getItem('smriti_sathi_theme') === 'dark') ? 'dark' : 'light';
          const accessibility: AccessibilitySettings = settings ? {
            textSize: settings.textSize,
            highContrast: settings.highContrast,
            voiceGuidance: settings.voiceGuidance,
            theme: (settings as any).theme || savedTheme,
          } : { ...defaultState.accessibility, theme: savedTheme };

          setState({
            onboardingComplete: true,
            currentPatient: patient,
            interfaceLanguage: user.preferredLanguage,
            accessibility,
            isLoading: false,
          });
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Failed to load initial data:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadInitialData();
  }, []);

  const completeOnboarding = async (
    patient: PatientProfile,
    language: string,
    accessibility: AccessibilitySettings
  ) => {
    try {
      // Create user in database
      const userId = await userRepository.create({
        name: patient.name,
        age: patient.age,
        preferredLanguage: language,
        profileImage: patient.profileImage,
      });

      // Create settings in database
      await settingsRepository.save({
        userId,
        textSize: accessibility.textSize,
        highContrast: accessibility.highContrast,
        voiceGuidance: accessibility.voiceGuidance,
      });

      // Update state
      setState({
        onboardingComplete: true,
        currentPatient: { ...patient, id: userId.toString() },
        interfaceLanguage: language,
        accessibility,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    }
  };

  const resetOnboarding = async () => {
    try {
      // Clear database
      const users = await userRepository.getAll();
      for (const user of users) {
        if (user.id) {
          await userRepository.delete(user.id);
          await settingsRepository.delete(user.id);
        }
      }

      setState(defaultState);
    } catch (error) {
      console.error('Failed to reset onboarding:', error);
    }
  };

  const updatePatient = async (patient: PatientProfile) => {
    try {
      if (patient.id) {
        await userRepository.update(parseInt(patient.id), {
          name: patient.name,
          age: patient.age,
          preferredLanguage: patient.preferredLanguage,
          profileImage: patient.profileImage,
        });
      }
      setState(prev => ({ ...prev, currentPatient: patient }));
    } catch (error) {
      console.error('Failed to update patient:', error);
    }
  };

  const updateAccessibility = async (settings: AccessibilitySettings) => {
    try {
      if (state.currentPatient?.id) {
        await settingsRepository.save({
          userId: parseInt(state.currentPatient.id),
          textSize: settings.textSize,
          highContrast: settings.highContrast,
          voiceGuidance: settings.voiceGuidance,
        });
      }
      if (settings.theme) {
        localStorage.setItem('smriti_sathi_theme', settings.theme);
      }
      setState(prev => ({ ...prev, accessibility: settings }));
    } catch (error) {
      console.error('Failed to update accessibility:', error);
    }
  };

  const updateLanguage = async (language: string) => {
    try {
      if (state.currentPatient?.id) {
        await userRepository.update(parseInt(state.currentPatient.id), {
          preferredLanguage: language,
        });
      }
      setState(prev => ({ ...prev, interfaceLanguage: language }));
    } catch (error) {
      console.error('Failed to update language:', error);
    }
  };

  const toggleTheme = () => {
    setState(prev => {
      const nextTheme = prev.accessibility?.theme === 'dark' ? 'light' : 'dark';
      const isDark = nextTheme === 'dark';
      try {
        localStorage.setItem('smriti_sathi_theme', nextTheme);
        const rootEl = document.documentElement;
        const bodyEl = document.body;
        rootEl.classList.toggle('dark', isDark);
        rootEl.classList.toggle('theme-dark', isDark);
        rootEl.classList.toggle('theme-light', !isDark);
        bodyEl.classList.toggle('dark', isDark);
        bodyEl.classList.toggle('theme-dark', isDark);
        bodyEl.classList.toggle('theme-light', !isDark);
        rootEl.style.colorScheme = isDark ? 'dark' : 'light';
      } catch {}
      return {
        ...prev,
        accessibility: {
          ...prev.accessibility,
          theme: nextTheme,
        },
      };
    });
  };

  const skipToElderDemo = async () => {
    const demoPatient: PatientProfile = {
      id: Date.now().toString(),
      name: 'Kamala Baa (কমলা বা)',
      age: 72,
      preferredLanguage: 'as',
      profileImage: undefined,
      dailyRoutine: ['morning', 'afternoon'],
      reminderPreferences: {
        medicine: true,
        hydration: true,
        activity: true,
        appointment: true,
      },
    };
    await completeOnboarding(demoPatient, 'as', {
      textSize: 'large',
      highContrast: false,
      voiceGuidance: true,
      theme: 'light',
    });
  };

  return (
    <AppContext.Provider value={{
      state,
      completeOnboarding,
      resetOnboarding,
      updatePatient,
      updateAccessibility,
      updateLanguage,
      toggleTheme,
      skipToElderDemo,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
