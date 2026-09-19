/// Patient profile model representing an elderly patient using Smriti Sathi.
class Patient {
  final int? id;
  final String name;
  final int age;
  final String language;
  final String emergencyContact;
  final String caregiverName;
  final String? photoUrl;
  final bool remindersEnabled;
  final DateTime createdAt;

  const Patient({
    this.id,
    required this.name,
    required this.age,
    required this.language,
    required this.emergencyContact,
    this.caregiverName = 'Bhavya (Daughter)',
    this.photoUrl,
    this.remindersEnabled = true,
    required this.createdAt,
  });

  Patient copyWith({
    int? id,
    String? name,
    int? age,
    String? language,
    String? emergencyContact,
    String? caregiverName,
    String? photoUrl,
    bool? remindersEnabled,
    DateTime? createdAt,
  }) {
    return Patient(
      id: id ?? this.id,
      name: name ?? this.name,
      age: age ?? this.age,
      language: language ?? this.language,
      emergencyContact: emergencyContact ?? this.emergencyContact,
      caregiverName: caregiverName ?? this.caregiverName,
      photoUrl: photoUrl ?? this.photoUrl,
      remindersEnabled: remindersEnabled ?? this.remindersEnabled,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}
