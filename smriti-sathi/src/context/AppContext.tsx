import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { userRepository, settingsRepository, db } from '../database';
import type { User, Settings } from '../database';
import { accountService } from '../services/account/AccountService';

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

export interface EmergencyContact {
  name: string;
  phone: string;
  relation?: string;
}

export interface AppState {
  onboardingComplete: boolean;
  currentPatient: PatientProfile | null;
  interfaceLanguage: string;
  accessibility: AccessibilitySettings;
  emergencyContact: EmergencyContact | null;
  isLoading: boolean;
}

interface AppContextType {
  state: AppState;
  completeOnboarding: (
    patient: PatientProfile,
    language: string,
    accessibility: AccessibilitySettings,
    contact?: EmergencyContact | null,
  ) => Promise<void>;
  resetOnboarding: () => Promise<void>;
  updatePatient: (patient: PatientProfile) => Promise<void>;
  updateAccessibility: (settings: AccessibilitySettings) => Promise<void>;
  updateLanguage: (language: string) => Promise<void>;
  updateEmergencyContact: (contact: EmergencyContact | null) => Promise<void>;
  toggleTheme: () => void;
  /** Wipes accounts, database and preferences — the device goes back to first run. */
  eraseEverything: () => Promise<void>;
}

const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  try {
    const urlTheme = new URLSearchParams(window.location.search).get('theme');
    if (urlTheme === 'dark' || urlTheme === 'light') return urlTheme;
    return localStorage.getItem('smriti_sathi_theme') === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

const readStoredContact = (): EmergencyContact | null => {
  if (typeof window === 'undefined') return null;
  try {
    const name = localStorage.getItem('smriti_linked_caregiver_name');
    const phone = localStorage.getItem('smriti_linked_caregiver_phone');
    if (name && phone) return { name, phone };
  } catch {
    /* ignore */
  }
  return null;
};

const defaultState: AppState = {
  onboardingComplete: false,
  currentPatient: null,
  interfaceLanguage: 'en',
  accessibility: {
    textSize: 'large',
    highContrast: false,
    voiceGuidance: true,
    theme: getInitialTheme(),
  },
  emergencyContact: null,
  isLoading: true,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);

  /* Load whatever this device already has — never invents a profile. */
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const users = await userRepository.getAll();

        if (users.length > 0) {
          const user = users[0];
          const settings = await settingsRepository.getByUserId(user.id!);

          const patient: PatientProfile = {
            id: user.id!.toString(),
            name: user.name,
            age: user.age,
            preferredLanguage: user.preferredLanguage,
            profileImage: user.profileImage,
            dailyRoutine: [],
            reminderPreferences: {
              medicine: true,
              hydration: true,
              activity: true,
              appointment: true,
            },
          };

          const savedTheme = getInitialTheme();
          const accessibility: AccessibilitySettings = settings
            ? {
                textSize: settings.textSize,
                highContrast: settings.highContrast,
                voiceGuidance: settings.voiceGuidance,
                theme:
                  (typeof window !== 'undefined' &&
                    (new URLSearchParams(window.location.search).get('theme') as 'light' | 'dark' | null)) ||
                  savedTheme,
              }
            : { ...defaultState.accessibility, theme: savedTheme };

          setState({
            onboardingComplete: true,
            currentPatient: patient,
            interfaceLanguage: user.preferredLanguage,
            accessibility,
            emergencyContact: readStoredContact(),
            isLoading: false,
          });
        } else {
          setState((prev) => ({ ...prev, emergencyContact: readStoredContact(), isLoading: false }));
        }
      } catch (error) {
        console.error('Failed to load initial data:', error);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    loadInitialData();
  }, []);

  const persistContact = (contact: EmergencyContact | null) => {
    try {
      if (contact) {
        localStorage.setItem('smriti_linked_caregiver_name', contact.name);
        localStorage.setItem('smriti_linked_caregiver_phone', contact.phone);
      } else {
        localStorage.removeItem('smriti_linked_caregiver_name');
        localStorage.removeItem('smriti_linked_caregiver_phone');
      }
    } catch {
      /* ignore */
    }
  };

  const completeOnboarding = async (
    patient: PatientProfile,
    language: string,
    accessibility: AccessibilitySettings,
    contact?: EmergencyContact | null,
  ) => {
    try {
      const userId = await userRepository.create({
        name: patient.name,
        age: patient.age,
        preferredLanguage: language,
        profileImage: patient.profileImage,
      });

      await settingsRepository.save({
        userId,
        textSize: accessibility.textSize,
        highContrast: accessibility.highContrast,
        voiceGuidance: accessibility.voiceGuidance,
      });

      try {
        localStorage.setItem('smriti_language', language);
        localStorage.setItem('smriti_sathi_language', language);
        window.dispatchEvent(new CustomEvent('smriti_language_changed', { detail: language }));
      } catch {
        /* ignore */
      }

      if (contact?.name && contact?.phone) {
        persistContact(contact);
        const elder = accountService.primaryElder();
        if (elder) {
          accountService.update(elder.id, {
            name: patient.name,
            guardianName: contact.name,
            guardianPhone: contact.phone,
            guardianRelation: contact.relation,
          });
        }
      }

      setState({
        onboardingComplete: true,
        currentPatient: { ...patient, id: userId.toString(), preferredLanguage: language },
        interfaceLanguage: language,
        accessibility,
        emergencyContact: contact?.name && contact?.phone ? contact : readStoredContact(),
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    }
  };

  const updateEmergencyContact = async (contact: EmergencyContact | null) => {
    persistContact(contact);
    if (contact) {
      const elder = accountService.primaryElder();
      if (elder) {
        accountService.update(elder.id, {
          guardianName: contact.name,
          guardianPhone: contact.phone,
          guardianRelation: contact.relation,
        });
      }
    }
    setState((prev) => ({ ...prev, emergencyContact: contact }));
  };

  const resetOnboarding = async () => {
    try {
      const users = await userRepository.getAll();
      for (const user of users) {
        if (user.id) {
          await userRepository.delete(user.id);
          await settingsRepository.delete(user.id);
        }
      }
      setState((prev) => ({ ...defaultState, accessibility: prev.accessibility, isLoading: false }));
    } catch (error) {
      console.error('Failed to reset onboarding:', error);
    }
  };

  const updatePatient = async (patient: PatientProfile) => {
    try {
      if (patient.id) {
        await userRepository.update(parseInt(patient.id, 10), {
          name: patient.name,
          age: patient.age,
          preferredLanguage: patient.preferredLanguage,
          profileImage: patient.profileImage,
        });
      }
      setState((prev) => ({ ...prev, currentPatient: patient }));
    } catch (error) {
      console.error('Failed to update patient:', error);
    }
  };

  const updateAccessibility = async (settings: AccessibilitySettings) => {
    try {
      if (state.currentPatient?.id) {
        await settingsRepository.save({
          userId: parseInt(state.currentPatient.id, 10),
          textSize: settings.textSize,
          highContrast: settings.highContrast,
          voiceGuidance: settings.voiceGuidance,
        });
      }
      if (settings.theme) localStorage.setItem('smriti_sathi_theme', settings.theme);
      setState((prev) => ({ ...prev, accessibility: settings }));
    } catch (error) {
      console.error('Failed to update accessibility:', error);
    }
  };

  const updateLanguage = async (language: string) => {
    try {
      if (state.currentPatient?.id) {
        await userRepository.update(parseInt(state.currentPatient.id, 10), { preferredLanguage: language });
      }
      try {
        localStorage.setItem('smriti_language', language);
        localStorage.setItem('smriti_sathi_language', language);
        window.dispatchEvent(new CustomEvent('smriti_language_changed', { detail: language }));
      } catch {
        /* ignore */
      }
      setState((prev) => ({
        ...prev,
        interfaceLanguage: language,
        currentPatient: prev.currentPatient
          ? { ...prev.currentPatient, preferredLanguage: language }
          : null,
      }));
    } catch (error) {
      console.error('Failed to update language:', error);
    }
  };

  const toggleTheme = () => {
    setState((prev) => {
      const nextTheme = prev.accessibility?.theme === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('smriti_sathi_theme', nextTheme);
        document.documentElement.style.colorScheme = nextTheme === 'dark' ? 'dark' : 'light';
      } catch {
        /* ignore */
      }
      return {
        ...prev,
        accessibility: { ...prev.accessibility, theme: nextTheme },
      };
    });
  };

  const eraseEverything = async () => {
    try {
      await db.delete();
    } catch {
      /* database may not exist yet */
    }
    accountService.eraseAll();
    try {
      const keep: string[] = ['smriti_lang', 'smriti_sathi_theme'];
      const keys = Object.keys(localStorage);
      keys.forEach((k) => {
        if ((k.startsWith('smriti') || k.startsWith('Smriti')) && !keep.includes(k)) localStorage.removeItem(k);
      });
      sessionStorage.clear();
    } catch {
      /* ignore */
    }
    setState({ ...defaultState, accessibility: { ...defaultState.accessibility, theme: getInitialTheme() } });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        completeOnboarding,
        resetOnboarding,
        updatePatient,
        updateAccessibility,
        updateLanguage,
        updateEmergencyContact,
        toggleTheme,
        eraseEverything,
      }}
    >
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
