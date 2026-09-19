import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_dimensions.dart';
import '../../core/constants/app_routes.dart';
import '../../core/constants/app_typography.dart';
import '../../core/utils/date_formatter.dart';
import '../../core/widgets/elderly_button.dart';
import '../../core/widgets/elderly_card.dart';
import '../../core/widgets/elderly_header.dart';
import '../../database/repositories/patient_repository.dart';
import '../../database/repositories/reminder_repository.dart';
import '../../models/patient.dart';
import '../../models/reminder.dart';
import '../../services/voice_service.dart';

/// Home Screen — Daily focal dashboard presenting orientation greeting,
/// upcoming reminder with direct acknowledgment, single hero workout CTA,
/// and giant 1-tap shortcut cards to all core features.
class HomeScreen extends StatefulWidget {
  final ValueChanged<int> onNavigate;

  const HomeScreen({super.key, required this.onNavigate});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final PatientRepository _patientRepo = InMemoryPatientRepository();
  final ReminderRepository _reminderRepo = InMemoryReminderRepository();
  final VoiceService _voiceService = VoiceService();

  Patient? _patient;
  Reminder? _nextReminder;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final patient = await _patientRepo.getPatient();
    final nextReminder = await _reminderRepo.getNextUpcomingReminder();
    if (mounted) {
      setState(() {
        _patient = patient;
        _nextReminder = nextReminder;
        _isLoading = false;
      });
    }
  }

  Future<void> _acknowledgeReminder(int reminderId) async {
    await _reminderRepo.acknowledgeReminder(reminderId);
    await _loadData();
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          backgroundColor: AppColors.darkEmerald,
          content: Text(
            'बहुत अच्छा! दवाई ले ली गई (Acknowledged ✓)',
            style: TextStyle(
              fontSize: AppTypography.button,
              fontWeight: AppTypography.weightBold,
              color: AppColors.darkOnEmerald,
            ),
          ),
          duration: Duration(seconds: 3),
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

    final now = DateTime.now();
    final greeting = DateFormatter.getGreeting(now);
    final elderlyDate = DateFormatter.formatElderlyDate(now);
    final patientName = _patient?.name ?? 'दादा जी (Dadu)';

    return SingleChildScrollView(
      padding: AppDimensions.screenPaddingAll,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // -------------------------------------------------------------------
          // 1. Orientation & Temporal Greeting Card
          // -------------------------------------------------------------------
          ElderlyCard(
            backgroundColor: AppColors.darkSurfaceElevated,
            padding: AppDimensions.cardPaddingAll,
            semanticLabel: '$greeting, $patientName. Today is $elderlyDate',
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(
                      Icons.calendar_month_rounded,
                      size: AppDimensions.iconMedium,
                      color: AppColors.darkAmber,
                    ),
                    const SizedBox(width: AppDimensions.spacingSmall),
                    Expanded(
                      child: Text(
                        elderlyDate,
                        style: const TextStyle(
                          fontSize: AppTypography.titleLarge,
                          fontWeight: AppTypography.weightBold,
                          color: AppColors.darkAmber,
                          height: AppTypography.lineHeightTight,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppDimensions.spacingMedium),
                Text(
                  '$greeting, $patientName!',
                  style: const TextStyle(
                    fontSize: AppTypography.headlineMedium,
                    fontWeight: AppTypography.weightHeavy,
                    color: AppColors.darkTextPrimary,
                    height: AppTypography.lineHeightComfort,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppDimensions.spacingLarge),

          // -------------------------------------------------------------------
          // 2. Next Upcoming Medication / Routine Reminder
          // -------------------------------------------------------------------
          if (_nextReminder != null) ...[
            const ElderlyHeader(
              title: 'अगली याददिहानी (Upcoming Reminder)',
              subtitle: 'Scheduled routine prompt for your health',
              icon: Icons.notifications_active_rounded,
              iconColor: AppColors.darkPrimary,
            ),
            const SizedBox(height: AppDimensions.spacingSmall),
            ElderlyCard(
              padding: AppDimensions.cardPaddingAll,
              borderColor: _nextReminder!.isAcknowledgedToday
                  ? AppColors.darkEmerald
                  : AppColors.darkBorder,
              semanticLabel:
                  'Reminder for ${_nextReminder!.label} at ${_nextReminder!.formattedTime}',
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Icon(
                        _nextReminder!.type == 'medicine'
                            ? Icons.medication_rounded
                            : (_nextReminder!.type == 'water'
                                ? Icons.water_drop_rounded
                                : Icons.alarm_rounded),
                        size: AppDimensions.iconLarge,
                        color: AppColors.darkPrimary,
                      ),
                      const SizedBox(width: AppDimensions.spacingMedium),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _nextReminder!.formattedTime,
                              style: const TextStyle(
                                fontSize: AppTypography.headlineSmall,
                                fontWeight: AppTypography.weightHeavy,
                                color: AppColors.darkAmber,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              _nextReminder!.label,
                              style: const TextStyle(
                                fontSize: AppTypography.titleMedium,
                                fontWeight: AppTypography.weightBold,
                                color: AppColors.darkTextPrimary,
                              ),
                            ),
                          ],
                        ),
                      ),
                      // Familiar voice playback button
                      IconButton(
                        icon: const Icon(
                          Icons.volume_up_rounded,
                          size: AppDimensions.iconMedium,
                          color: AppColors.darkAmber,
                        ),
                        tooltip: 'Play voice prompt',
                        onPressed: () {
                          _voiceService.playReminderVoice(
                            _nextReminder!.label,
                            audioPath: _nextReminder!.audioPath,
                          );
                        },
                      ),
                    ],
                  ),
                  const SizedBox(height: AppDimensions.spacingMedium),
                  // Large 64px Acknowledgment Button
                  ElderlyButton(
                    label: _nextReminder!.isAcknowledgedToday
                        ? 'पूर्ण हुआ (Taken ✓)'
                        : 'दवाई ले ली (TAKE NOW)',
                    icon: _nextReminder!.isAcknowledgedToday
                        ? Icons.check_circle_rounded
                        : Icons.task_alt_rounded,
                    variant: _nextReminder!.isAcknowledgedToday
                        ? ElderlyButtonVariant.surface
                        : ElderlyButtonVariant.emerald,
                    onPressed: _nextReminder!.isAcknowledgedToday
                        ? null
                        : () => _acknowledgeReminder(_nextReminder!.id),
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppDimensions.spacingXLarge),
          ],

          // -------------------------------------------------------------------
          // 3. Hero Primary Action Button: Cognitive Daily Workout
          // -------------------------------------------------------------------
          const ElderlyHeader(
            title: 'दैनिक दिमागी कसरत (Daily Workout)',
            subtitle: 'Gentle errorless cognitive practice',
            icon: Icons.psychology_rounded,
            iconColor: AppColors.darkAmber,
          ),
          const SizedBox(height: AppDimensions.spacingSmall),
          ElderlyButton(
            label: 'दिमागी कसरत शुरू करें\nSTART DAILY WORKOUT',
            icon: Icons.play_circle_fill_rounded,
            variant: ElderlyButtonVariant.primary,
            height: AppDimensions.heroButtonHeight,
            onPressed: () => widget.onNavigate(AppRoutes.gamesIndex),
          ),
          const SizedBox(height: AppDimensions.spacingXXLarge),

          // -------------------------------------------------------------------
          // 4. Giant 1-Tap Navigation Shortcuts (Elderly Tactile Ergonomics)
          // -------------------------------------------------------------------
          const ElderlyHeader(
            title: 'त्वरित मेनू (Quick Shortcuts)',
            subtitle: 'Tap any card to open that section',
          ),
          const SizedBox(height: AppDimensions.spacingSmall),

          // Shortcut to Reminders
          ElderlyCard(
            onTap: () => widget.onNavigate(AppRoutes.remindersIndex),
            semanticLabel: 'Go to Reminders screen',
            child: Row(
              children: [
                const Icon(
                  Icons.alarm_rounded,
                  size: AppDimensions.iconLarge,
                  color: AppColors.darkPrimary,
                ),
                const SizedBox(width: AppDimensions.spacingMedium),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'सभी अनुस्मारक (Reminders)',
                        style: TextStyle(
                          fontSize: AppTypography.titleMedium,
                          fontWeight: AppTypography.weightBold,
                          color: AppColors.darkTextPrimary,
                        ),
                      ),
                      Text(
                        'दवा और पानी की पूरी सूची',
                        style: TextStyle(
                          fontSize: AppTypography.bodySmall,
                          color: AppColors.darkTextSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
                const Icon(
                  Icons.arrow_forward_ios_rounded,
                  size: AppDimensions.iconSmall,
                  color: AppColors.darkBorder,
                ),
              ],
            ),
          ),
          const SizedBox(height: AppDimensions.spacingMedium),

          // Shortcut to Progress
          ElderlyCard(
            onTap: () => widget.onNavigate(AppRoutes.progressIndex),
            semanticLabel: 'Go to Progress screen',
            child: Row(
              children: [
                const Icon(
                  Icons.insights_rounded,
                  size: AppDimensions.iconLarge,
                  color: AppColors.darkAmber,
                ),
                const SizedBox(width: AppDimensions.spacingMedium),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'मेरी प्रगति (My Progress)',
                        style: TextStyle(
                          fontSize: AppTypography.titleMedium,
                          fontWeight: AppTypography.weightBold,
                          color: AppColors.darkTextPrimary,
                        ),
                      ),
                      Text(
                        'रोज़ाना का अभ्यास और स्ट्रीक',
                        style: TextStyle(
                          fontSize: AppTypography.bodySmall,
                          color: AppColors.darkTextSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
                const Icon(
                  Icons.arrow_forward_ios_rounded,
                  size: AppDimensions.iconSmall,
                  color: AppColors.darkBorder,
                ),
              ],
            ),
          ),
          const SizedBox(height: AppDimensions.spacingMedium),

          // Shortcut to Caregiver
          ElderlyCard(
            onTap: () => widget.onNavigate(AppRoutes.caregiverIndex),
            semanticLabel: 'Go to Caregiver portal',
            child: Row(
              children: [
                const Icon(
                  Icons.supervisor_account_rounded,
                  size: AppDimensions.iconLarge,
                  color: AppColors.darkEmerald,
                ),
                const SizedBox(width: AppDimensions.spacingMedium),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'देखभालकर्ता (Caregiver Portal)',
                        style: TextStyle(
                          fontSize: AppTypography.titleMedium,
                          fontWeight: AppTypography.weightBold,
                          color: AppColors.darkTextPrimary,
                        ),
                      ),
                      Text(
                        'पारिवारिक आवाज़ रिकॉर्ड करें',
                        style: TextStyle(
                          fontSize: AppTypography.bodySmall,
                          color: AppColors.darkTextSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
                const Icon(
                  Icons.arrow_forward_ios_rounded,
                  size: AppDimensions.iconSmall,
                  color: AppColors.darkBorder,
                ),
              ],
            ),
          ),
          const SizedBox(height: AppDimensions.spacingMedium),

          // Shortcut to Settings
          ElderlyCard(
            onTap: () => widget.onNavigate(AppRoutes.settingsIndex),
            semanticLabel: 'Go to Settings screen',
            child: Row(
              children: [
                const Icon(
                  Icons.settings_rounded,
                  size: AppDimensions.iconLarge,
                  color: AppColors.darkTextMuted,
                ),
                const SizedBox(width: AppDimensions.spacingMedium),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'ऐप सेटिंग्स (App Settings)',
                        style: TextStyle(
                          fontSize: AppTypography.titleMedium,
                          fontWeight: AppTypography.weightBold,
                          color: AppColors.darkTextPrimary,
                        ),
                      ),
                      Text(
                        'भाषा, फॉन्ट और हाई कंट्रास्ट',
                        style: TextStyle(
                          fontSize: AppTypography.bodySmall,
                          color: AppColors.darkTextSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
                const Icon(
                  Icons.arrow_forward_ios_rounded,
                  size: AppDimensions.iconSmall,
                  color: AppColors.darkBorder,
                ),
              ],
            ),
          ),
          const SizedBox(height: AppDimensions.spacingLarge),
        ],
      ),
    );
  }
}
