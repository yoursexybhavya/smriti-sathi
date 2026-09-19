import '../../models/app_settings.dart';

/// Abstract contract for user preferences and accessibility settings.
abstract class SettingsRepository {
  Future<AppSettings> getSettings();
  Future<void> updateSettings(AppSettings settings);
}

/// In-memory implementation of SettingsRepository.
class InMemorySettingsRepository implements SettingsRepository {
  static final InMemorySettingsRepository _instance =
      InMemorySettingsRepository._internal();
  factory InMemorySettingsRepository() => _instance;

  AppSettings _settings = const AppSettings();

  InMemorySettingsRepository._internal();

  @override
  Future<AppSettings> getSettings() async {
    return _settings;
  }

  @override
  Future<void> updateSettings(AppSettings settings) async {
    _settings = settings;
  }
}
