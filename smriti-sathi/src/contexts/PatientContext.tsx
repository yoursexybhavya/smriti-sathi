import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { db, type Patient } from '../db/database';

interface PatientContextType {
  patient: Patient | null;
  setPatient: (patient: Patient) => void;
  createPatient: (name: string, age: number, language: string) => Promise<Patient>;
  isLoading: boolean;
}

const PatientContext = createContext<PatientContextType | null>(null);

export function PatientProvider({ children }: { children: ReactNode }) {
  const [patient, setPatientState] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load the first (and usually only) patient or initialize default elder profile
    db.patients.toCollection().first().then(async (p) => {
      if (p) {
        setPatientState(p);
      } else {
        const defaultElder: Patient = {
          name: 'Baa (আইতা)',
          age: 72,
          language: 'as',
          createdAt: new Date(),
        };
        const id = await db.patients.add(defaultElder);
        setPatientState({ ...defaultElder, id });
      }
      setIsLoading(false);
    });
  }, []);

  const setPatient = (p: Patient) => {
    setPatientState(p);
  };

  const createPatient = async (name: string, age: number, language: string): Promise<Patient> => {
    const newPatient: Patient = { name, age, language, createdAt: new Date() };
    const id = await db.patients.add(newPatient);
    const created = { ...newPatient, id };
    setPatientState(created);
    return created;
  };

  return (
    <PatientContext.Provider value={{ patient, setPatient, createPatient, isLoading }}>
      {children}
    </PatientContext.Provider>
  );
}

export function usePatient() {
  const context = useContext(PatientContext);
  if (!context) throw new Error('usePatient must be used within PatientProvider');
  return context;
}
