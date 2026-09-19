import '../../models/patient.dart';

/// Abstract contract for patient profile data access.
abstract class PatientRepository {
  Future<Patient> getPatient();
  Future<void> updatePatient(Patient patient);
}

/// In-memory pre-seeded repository for offline-first clinical prototype.
class InMemoryPatientRepository implements PatientRepository {
  Patient _patient = Patient(
    id: 1,
    name: 'दादा जी (Dadu)',
    age: 74,
    language: 'hi',
    emergencyContact: '+91 98765 43210',
    caregiverName: 'Bhavya (Daughter)',
    remindersEnabled: true,
    createdAt: DateTime.now().subtract(const Duration(days: 30)),
  );

  @override
  Future<Patient> getPatient() async {
    return _patient;
  }

  @override
  Future<void> updatePatient(Patient patient) async {
    _patient = patient;
  }
}
