/// User accessibility and clinical preference settings.
class AppSettings {
  final bool highContrast;
  final double fontScale;
  final String language;
  final bool voiceGuidance;
  final int errorlessScaffoldingSeconds;

  const AppSettings({
    this.highContrast = true,
    this.fontScale = 1.0,
    this.language = 'hi',
    this.voiceGuidance = true,
    this.errorlessScaffoldingSeconds = 3,
  });

  AppSettings copyWith({
    bool? highContrast,
    double? fontScale,
    String? language,
    bool? voiceGuidance,
    int? errorlessScaffoldingSeconds,
  }) {
    return AppSettings(
      highContrast: highContrast ?? this.highContrast,
      fontScale: fontScale ?? this.fontScale,
      language: language ?? this.language,
      voiceGuidance: voiceGuidance ?? this.voiceGuidance,
      errorlessScaffoldingSeconds:
          errorlessScaffoldingSeconds ?? this.errorlessScaffoldingSeconds,
    );
  }
}
