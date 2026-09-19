import 'package:flutter/foundation.dart';

/// Multilingual localization service supporting key Indian regional languages
/// with special focus on North East India (Smart India Hackathon SIH26003, MDoNER).
class LanguageService {
  static final LanguageService _instance = LanguageService._internal();
  factory LanguageService() => _instance;

  LanguageService._internal();

  final ValueNotifier<String> currentLocaleNotifier =
      ValueNotifier<String>('hi');

  String get currentLocale => currentLocaleNotifier.value;

  final List<Map<String, String>> supportedLanguages = const [
    {'code': 'hi', 'name': 'हिन्दी (Hindi)', 'native': 'हिन्दी'},
    {'code': 'en', 'name': 'English', 'native': 'English'},
    {'code': 'as', 'name': 'অসমীয়া (Assamese)', 'native': 'অসমীয়া'},
    {'code': 'brx', 'name': 'बड़ो (Bodo)', 'native': 'बड़ो'},
    {'code': 'mni', 'name': 'মৈতৈলোন্ (Manipuri)', 'native': 'মৈতৈলোন্'},
  ];

  void setLanguage(String code) {
    if (supportedLanguages.any((lang) => lang['code'] == code)) {
      currentLocaleNotifier.value = code;
    }
  }

  String getLanguageName(String code) {
    final match = supportedLanguages.firstWhere(
      (lang) => lang['code'] == code,
      orElse: () => {'code': 'hi', 'name': 'हिन्दी (Hindi)', 'native': 'हिन्दी'},
    );
    return match['name'] ?? 'हिन्दी (Hindi)';
  }
}
