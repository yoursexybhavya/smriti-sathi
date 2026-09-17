import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { db, type Patient, type GameSession } from '../db/database';
import { seedDemoProfiles } from '../db/demoData';

export interface PatientStats {
  streak: number;
  cpi: number;
  totalPlayed: number;
}

interface PatientContextType {
  patient: Patient | null;
  patients: Patient[];
  stats: PatientStats;
  isLoading: boolean;
  setupCompleted: boolean;
  userRole: 'elder' | 'caregiver';
  setPatient: (patient: Patient) => void;
  selectPatient: (id: number) => Promise<void>;
  createPatient: (
    name: string,
    age: number,
    language: string,
    remindersEnabled?: { medicine: boolean; hydration: boolean; brainWorkout: boolean }
  ) => Promise<Patient>;
  updatePatient: (id: number, data: Partial<Patient>) => Promise<void>;
  deletePatient: (id: number) => Promise<void>;
  refreshStats: () => Promise<void>;
  clearAllData: () => Promise<void>;
  seedClinicalDemo: () => Promise<void>;
  resetToFreshInstall: () => Promise<void>;
  setUserRole: (role: 'elder' | 'caregiver') => Promise<void>;
  completeOnboarding: (data: {
    name: string;
    age: number;
    language: string;
    role: 'elder' | 'caregiver';
    pin: string;
    remindersEnabled: { medicine: boolean; hydration: boolean; brainWorkout: boolean };
    reminderTimes?: {
      medicine: { hour: number; minute: number };
      hydration: { hour: number; minute: number };
      brainWorkout: { hour: number; minute: number };
    };
  }) => Promise<Patient>;
  verifyCaregiverPin: (enteredPin: string) => Promise<boolean>;
  setCaregiverPin: (pin: string) => Promise<void>;
}

const PatientContext = createContext<PatientContextType | null>(null);

export async function calculatePatientStats(patientId: number): Promise<PatientStats> {
  const sessions = await db.gameSessions.where('patientId').equals(patientId).toArray();
  if (!sessions || sessions.length === 0) {
    return { streak: 0, cpi: 0, totalPlayed: 0 };
  }

  // Calculate distinct played dates (YYYY-MM-DD)
  const playedDates = new Set<string>();
  sessions.forEach((s: GameSession) => {
    const d = new Date(s.playedAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    playedDates.add(key);
  });

  // Calculate streak from today or yesterday backwards
  let currentStreak = 0;
  const now = new Date();
  const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  const yesterday = new Date(Date.now() - 86400000);
  const yesterdayKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  const checkDate = playedDates.has(todayKey) ? now : (playedDates.has(yesterdayKey) ? yesterday : null);

  if (checkDate) {
    let d = new Date(checkDate);
    while (true) {
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (playedDates.has(key)) {
        currentStreak++;
        d = new Date(d.getTime() - 86400000);
      } else {
        break;
      }
    }
  }

  const avgAccuracy = sessions.reduce((sum: number, s: GameSession) => sum + s.accuracy, 0) / sessions.length;
  const avgDiff = sessions.reduce((sum: number, s: GameSession) => sum + s.difficulty, 0) / sessions.length;
  const calculatedCpi = Math.min(999, Math.round(350 + (avgAccuracy * 450) + (avgDiff * 40) + Math.min(50, currentStreak * 5)));

  return { streak: currentStreak, cpi: calculatedCpi, totalPlayed: sessions.length };
}

export function PatientProvider({ children }: { children: ReactNode }) {
  const [patient, setPatientState] = useState<Patient | null>(null);
  const [patients, setPatientsState] = useState<Patient[]>([]);
  const [stats, setStats] = useState<PatientStats>({ streak: 0, cpi: 0, totalPlayed: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [setupCompleted, setSetupCompleted] = useState(false);
  const [userRole, setUserRoleState] = useState<'elder' | 'caregiver'>('elder');

  const refreshStats = useCallback(async () => {
    if (patient?.id) {
      const s = await calculatePatientStats(patient.id);
      setStats(s);
    } else {
      setStats({ streak: 0, cpi: 0, totalPlayed: 0 });
    }
  }, [patient?.id]);

  // Load all patients and active selection on mount
  useEffect(() => {
    const initPatients = async () => {
      try {
        const setupSetting = await db.settings.get('setup_completed');
        const roleSetting = await db.settings.get('user_role');
        if (roleSetting?.value === 'caregiver' || roleSetting?.value === 'elder') {
          setUserRoleState(roleSetting.value);
        }

        const all = await db.patients.toArray();
        setPatientsState(all);

        if (all.length > 0 && setupSetting?.value === 'true') {
          setSetupCompleted(true);
          const savedActive = await db.settings.get('activePatientId');
          let active = all[0];
          if (savedActive && savedActive.value) {
            const found = all.find((p) => p.id === parseInt(savedActive.value));
            if (found) active = found;
          }

          setPatientState(active);
          if (active.id) {
            const s = await calculatePatientStats(active.id);
            setStats(s);
          }
        } else {
          // No setup yet completed -> require first-launch onboarding
          setSetupCompleted(false);
          setPatientState(null);
          setStats({ streak: 0, cpi: 0, totalPlayed: 0 });
        }
      } catch (err) {
        console.warn('Error initializing patients from DB:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initPatients();
  }, []);

  // Update stats whenever patient changes
  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  const setPatient = (p: Patient) => {
    setPatientState(p);
    if (p.id) {
      db.settings.put({ key: 'activePatientId', value: p.id.toString() });
    }
  };

  const selectPatient = async (id: number) => {
    const found = patients.find((p) => p.id === id);
    if (found) {
      setPatientState(found);
      await db.settings.put({ key: 'activePatientId', value: id.toString() });
      const s = await calculatePatientStats(id);
      setStats(s);
    }
  };

  const createPatient = async (
    name: string,
    age: number,
    language: string,
    remindersEnabled?: { medicine: boolean; hydration: boolean; brainWorkout: boolean }
  ): Promise<Patient> => {
    const newPatient: Patient = {
      name,
      age,
      language,
      remindersEnabled: remindersEnabled || { medicine: true, hydration: true, brainWorkout: true },
      createdAt: new Date(),
    };
    const id = await db.patients.add(newPatient);
    const created = { ...newPatient, id };
    const updatedList = [...patients, created];
    setPatientsState(updatedList);
    setPatientState(created);
    await db.settings.put({ key: 'activePatientId', value: id.toString() });
    setStats({ streak: 0, cpi: 0, totalPlayed: 0 });
    return created;
  };

  const completeOnboarding = async (data: {
    name: string;
    age: number;
    language: string;
    role: 'elder' | 'caregiver';
    pin: string;
    remindersEnabled: { medicine: boolean; hydration: boolean; brainWorkout: boolean };
    reminderTimes?: {
      medicine: { hour: number; minute: number };
      hydration: { hour: number; minute: number };
      brainWorkout: { hour: number; minute: number };
    };
  }): Promise<Patient> => {
    const newElder: Patient = {
      name: data.name,
      age: data.age,
      language: data.language,
      remindersEnabled: data.remindersEnabled,
      createdAt: new Date(),
    };
    const id = await db.patients.add(newElder);
    const created = { ...newElder, id };
    setPatientsState([created]);
    setPatientState(created);
    setUserRoleState(data.role);
    setSetupCompleted(true);

    // Persist settings
    await db.settings.put({ key: 'activePatientId', value: id.toString() });
    await db.settings.put({ key: 'user_role', value: data.role });
    await db.settings.put({ key: 'setup_completed', value: 'true' });
    await db.settings.put({ key: 'language', value: data.language });
    localStorage.setItem('smriti_language', data.language);

    // Only save PIN for caregiver role (elder should never need PIN)
    if (data.role === 'caregiver' && data.pin.length === 4) {
      await db.settings.put({ key: 'caregiver_pin', value: data.pin });
    }

    // Use custom times if provided, otherwise sensible defaults
    const medTime = data.reminderTimes?.medicine || { hour: 9, minute: 0 };
    const waterTime = data.reminderTimes?.hydration || { hour: 11, minute: 0 };
    const brainTime = data.reminderTimes?.brainWorkout || { hour: 16, minute: 0 };

    // Setup care reminders with plain language labels
    if (data.remindersEnabled.medicine) {
      await db.reminders.add({
        patientId: id,
        type: 'medicine',
        label: 'Morning Medicine',
        timeHour: medTime.hour,
        timeMinute: medTime.minute,
        repeatDays: [0, 1, 2, 3, 4, 5, 6],
        isActive: true,
        lastAcked: null,
      });
    }
    if (data.remindersEnabled.hydration) {
      await db.reminders.add({
        patientId: id,
        type: 'water',
        label: 'Drink Water',
        timeHour: waterTime.hour,
        timeMinute: waterTime.minute,
        repeatDays: [0, 1, 2, 3, 4, 5, 6],
        isActive: true,
        lastAcked: null,
      });
    }
    if (data.remindersEnabled.brainWorkout) {
      await db.reminders.add({
        patientId: id,
        type: 'activity',
        label: 'Memory Game Time',
        timeHour: brainTime.hour,
        timeMinute: brainTime.minute,
        repeatDays: [0, 1, 2, 3, 4, 5, 6],
        isActive: true,
        lastAcked: null,
      });
    }

    setStats({ streak: 0, cpi: 0, totalPlayed: 0 });
    return created;
  };

  const verifyCaregiverPin = async (enteredPin: string): Promise<boolean> => {
    const pinSetting = await db.settings.get('caregiver_pin');
    // If no PIN was ever set (elder-only setup), allow direct access
    if (!pinSetting?.value) return true;
    return enteredPin.trim() === pinSetting.value.trim();
  };

  const setCaregiverPin = async (pin: string) => {
    await db.settings.put({ key: 'caregiver_pin', value: pin.trim() });
  };

  const setUserRole = async (role: 'elder' | 'caregiver') => {
    setUserRoleState(role);
    await db.settings.put({ key: 'user_role', value: role });
  };

  const updatePatient = async (id: number, data: Partial<Patient>) => {
    await db.patients.update(id, data);
    const updatedList = patients.map((p) => (p.id === id ? { ...p, ...data } : p));
    setPatientsState(updatedList);
    if (patient?.id === id) {
      setPatientState({ ...patient, ...data });
    }
  };

  const deletePatient = async (id: number) => {
    if (patients.length <= 1) return; // Keep at least one elder profile
    await db.patients.delete(id);
    const updatedList = patients.filter((p) => p.id !== id);
    setPatientsState(updatedList);
    if (patient?.id === id) {
      const nextActive = updatedList[0];
      setPatientState(nextActive);
      if (nextActive.id) {
        await db.settings.put({ key: 'activePatientId', value: nextActive.id.toString() });
      }
    }
  };

  const clearAllData = async () => {
    try {
      await db.gameSessions.clear();
      await db.reminderLogs.clear();
      setStats({ streak: 0, cpi: 0, totalPlayed: 0 });
    } catch (err) {
      console.error('Error clearing data:', err);
    }
  };

  const seedClinicalDemo = async () => {
    try {
      setIsLoading(true);
      await db.gameSessions.clear();
      await db.reminderLogs.clear();
      await db.patients.clear();
      await seedDemoProfiles();
      const all = await db.patients.toArray();
      setPatientsState(all);
      setSetupCompleted(true);
      if (all.length > 0) {
        setPatientState(all[0]);
        const s = await calculatePatientStats(all[0].id!);
        setStats(s);
      }
    } catch (err) {
      console.error('Error seeding demo profiles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetToFreshInstall = async () => {
    try {
      setIsLoading(true);
      await db.patients.clear();
      await db.gameSessions.clear();
      await db.reminders.clear();
      await db.reminderLogs.clear();
      await db.settings.clear();
      localStorage.removeItem('smriti_language');
      setPatientsState([]);
      setPatientState(null);
      setSetupCompleted(false);
      setUserRoleState('elder');
      setStats({ streak: 0, cpi: 0, totalPlayed: 0 });
    } catch (err) {
      console.error('Error resetting to fresh install:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PatientContext.Provider
      value={{
        patient,
        patients,
        stats,
        isLoading,
        setupCompleted,
        userRole,
        setPatient,
        selectPatient,
        createPatient,
        updatePatient,
        deletePatient,
        refreshStats,
        clearAllData,
        seedClinicalDemo,
        resetToFreshInstall,
        setUserRole,
        completeOnboarding,
        verifyCaregiverPin,
        setCaregiverPin,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
}

export function usePatient() {
  const context = useContext(PatientContext);
  if (!context) throw new Error('usePatient must be used within PatientProvider');
  return context;
}
