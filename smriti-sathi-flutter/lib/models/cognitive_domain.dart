/// Clinical cognitive domains tracked by Smriti Sathi for MCI/Dementia evaluation.
enum CognitiveDomain {
  workingMemory('Working Memory', 'याददाश्त'),
  processingSpeed('Processing Speed', 'सोचने की गति'),
  temporalOrientation('Temporal Orientation', 'समय और दिन'),
  attentionFocus('Attention & Focus', 'ध्यान और एकाग्रता'),
  careAdherence('Care Adherence', 'दवा और नियम');

  final String englishName;
  final String hindiName;

  const CognitiveDomain(this.englishName, this.hindiName);

  String get localizedName => '$hindiName ($englishName)';
}
