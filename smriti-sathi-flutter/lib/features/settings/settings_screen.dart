import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_dimensions.dart';
import '../../core/constants/app_typography.dart';
import '../../core/utils/accessibility_utils.dart';
import '../../core/widgets/elderly_card.dart';
import '../../core/widgets/elderly_header.dart';
import '../../database/repositories/settings_repository.dart';
import '../../models/app_settings.dart';
import '../../services/language_service.dart';

/// Settings Screen — Controls high contrast mode, typography scaling,
/// voice readout, and regional Indian language selection.
class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  final SettingsRepository _settingsRepo = InMemorySettingsRepository();
  final LanguageService _langService = LanguageService();

  AppSettings _settings = const AppSettings();
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadSettings();
  }

  Future<void> _loadSettings() async {
    final s = await _settingsRepo.getSettings();
    if (mounted) {
      setState(() {
        _settings = s;
        _isLoading = false;
      });
    }
  }

  Future<void> _updateSettings(AppSettings updated) async {
    await _settingsRepo.updateSettings(updated);
    if (mounted) {
      setState(() {
        _settings = updated;
      });
      AccessibilityUtils.triggerAffirmativeHaptic();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          backgroundColor: AppColors.darkEmerald,
          content: Text(
            'सेटिंग्स अपडेट हो गईं (Settings Saved)',
            style: TextStyle(
              fontSize: AppTypography.button,
              fontWeight: AppTypography.weightBold,
              color: AppColors.darkOnEmerald,
            ),
          ),
          duration: Duration(seconds: 2),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(
        child: CircularProgressIndicator(color: AppColors.darkPrimary),
      );
    }

    return SingleChildScrollView(
      padding: AppDimensions.screenPaddingAll,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Header
          const ElderlyHeader(
            title: 'ऐप सेटिंग्स (App Settings)',
            subtitle: 'Customize contrast, typography size, and language.',
            icon: Icons.settings_rounded,
            iconColor: AppColors.darkTextPrimary,
          ),
          const SizedBox(height: AppDimensions.spacingLarge),

          // -------------------------------------------------------------------
          // 1. High Contrast WCAG AAA Toggle
          // -------------------------------------------------------------------
          ElderlyCard(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: SwitchListTile(
              contentPadding: EdgeInsets.zero,
              activeThumbColor: AppColors.darkPrimary,
              title: const Text(
                'हाई कंट्रास्ट (High Contrast)',
                style: TextStyle(
                  fontSize: AppTypography.titleMedium,
                  fontWeight: AppTypography.weightBold,
                  color: AppColors.darkTextPrimary,
                ),
              ),
              subtitle: const Text(
                'WCAG 2.2 AAA standard (7:1 contrast ratio)',
                style: TextStyle(
                  fontSize: AppTypography.bodySmall,
                  color: AppColors.darkTextSecondary,
                ),
              ),
              value: _settings.highContrast,
              onChanged: (val) {
                _updateSettings(_settings.copyWith(highContrast: val));
              },
            ),
          ),
          const SizedBox(height: AppDimensions.spacingMedium),

          // -------------------------------------------------------------------
          // 2. Voice Readout Assistance Toggle
          // -------------------------------------------------------------------
          ElderlyCard(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: SwitchListTile(
              contentPadding: EdgeInsets.zero,
              activeThumbColor: AppColors.darkAmber,
              title: const Text(
                'आवाज़ में सहायता (Voice Readout)',
                style: TextStyle(
                  fontSize: AppTypography.titleMedium,
                  fontWeight: AppTypography.weightBold,
                  color: AppColors.darkTextPrimary,
                ),
              ),
              subtitle: const Text(
                'Reads titles and instructions aloud on screen change',
                style: TextStyle(
                  fontSize: AppTypography.bodySmall,
                  color: AppColors.darkTextSecondary,
                ),
              ),
              value: _settings.voiceGuidance,
              onChanged: (val) {
                _updateSettings(_settings.copyWith(voiceGuidance: val));
              },
            ),
          ),
          const SizedBox(height: AppDimensions.spacingLarge),

          // -------------------------------------------------------------------
          // 3. Indian Regional Language Selection (SIH26003 MDoNER Focus)
          // -------------------------------------------------------------------
          const ElderlyHeader(
            title: 'भाषा चुनें (Select Language)',
            subtitle: 'Regional North East & national languages',
          ),
          const SizedBox(height: AppDimensions.spacingSmall),

          ElderlyCard(
            padding: AppDimensions.cardPaddingAll,
            child: Column(
              children: _langService.supportedLanguages.map((lang) {
                final isSelected = _langService.currentLocale == lang['code'];

                return Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4.0),
                  child: InkWell(
                    borderRadius: BorderRadius.circular(12),
                    onTap: () {
                      _langService.setLanguage(lang['code']!);
                      _updateSettings(_settings.copyWith(language: lang['code']!));
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? AppColors.darkSurfaceElevated
                            : Colors.transparent,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.fromBorderSide(
                          BorderSide(
                            color: isSelected
                                ? AppColors.darkPrimary
                                : AppColors.darkBorder,
                            width: isSelected ? 2.5 : 1.0,
                          ),
                        ),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  lang['name']!,
                                  style: TextStyle(
                                    fontSize: AppTypography.titleMedium,
                                    fontWeight: isSelected
                                        ? AppTypography.weightBold
                                        : AppTypography.weightMedium,
                                    color: isSelected
                                        ? AppColors.darkPrimary
                                        : AppColors.darkTextPrimary,
                                  ),
                                ),
                                Text(
                                  lang['native']!,
                                  style: const TextStyle(
                                    fontSize: AppTypography.bodySmall,
                                    color: AppColors.darkTextSecondary,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Icon(
                            isSelected
                                ? Icons.radio_button_checked_rounded
                                : Icons.radio_button_unchecked_rounded,
                            size: AppDimensions.iconMedium,
                            color: isSelected
                                ? AppColors.darkPrimary
                                : AppColors.darkTextMuted,
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: AppDimensions.spacingLarge),
        ],
      ),
    );
  }
}
