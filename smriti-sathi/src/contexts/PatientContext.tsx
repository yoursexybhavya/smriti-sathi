import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { db, type Patient, type GameSession } from '../db/database';

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
  setPatient: (patient: Patient) => void;
  selectPatient: (id: number) => Promise<void>;
  createPatient: (name: string, age: number, language: string) => Promise<Patient>;
  updatePatient: (id: number, data: Partial<Patient>) => Promise<void>;
  deletePatient: (id: number) => Promise<void>;
  refreshStats: () => Promise<void>;
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
        let all = await db.patients.toArray();
        if (all.length === 0) {
          const defaultElder: Patient = {
            name: 'Baa (আইতা)',
            age: 72,
            language: 'as',
            createdAt: new Date(),
          };
          const id = await db.patients.add(defaultElder);
          const created = { ...defaultElder, id };
          all = [created];
        }
        setPatientsState(all);

        // Check stored active patient id
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

  const createPatient = async (name: string, age: number, language: string): Promise<Patient> => {
    const newPatient: Patient = { name, age, language, createdAt: new Date() };
    const id = await db.patients.add(newPatient);
    const created = { ...newPatient, id };
    const updatedList = [...patients, created];
    setPatientsState(updatedList);
    setPatientState(created);
    await db.settings.put({ key: 'activePatientId', value: id.toString() });
    setStats({ streak: 0, cpi: 0, totalPlayed: 0 });
    return created;
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

  return (
    <PatientContext.Provider
      value={{
        patient,
        patients,
        stats,
        isLoading,
        setPatient,
        selectPatient,
        createPatient,
        updatePatient,
        deletePatient,
        refreshStats,
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
