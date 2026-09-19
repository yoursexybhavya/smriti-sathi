import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_dimensions.dart';
import '../../core/constants/app_typography.dart';
import '../../core/widgets/elderly_button.dart';
import '../../core/widgets/elderly_card.dart';
import '../../core/widgets/elderly_header.dart';
import '../../database/repositories/reminder_repository.dart';
import '../../models/reminder.dart';
import '../../services/voice_service.dart';

/// Reminders Screen — Displays daily medication, hydration, and routine schedule
/// with large voice read-aloud buttons and 64px direct acknowledgment CTAs.
class RemindersScreen extends StatefulWidget {
  const RemindersScreen({super.key});

  @override
  State<RemindersScreen> createState() => _RemindersScreenState();
}

class _RemindersScreenState extends State<RemindersScreen> {
  final ReminderRepository _repo = InMemoryReminderRepository();
  final VoiceService _voiceService = VoiceService();
  List<Reminder> _reminders = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadReminders();
  }

  Future<void> _loadReminders() async {
    final items = await _repo.getReminders();
    if (mounted) {
      setState(() {
        _reminders = items;
        _isLoading = false;
      });
    }
  }

  Future<void> _acknowledge(int id, String label) async {
    await _repo.acknowledgeReminder(id);
    await _loadReminders();
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: AppColors.darkEmerald,
          content: Text(
            'बहुत अच्छा! $label पूर्ण हुआ (Acknowledged ✓)',
            style: const TextStyle(
              fontSize: AppTypography.button,
              fontWeight: AppTypography.weightBold,
              color: AppColors.darkOnEmerald,
            ),
          ),
          duration: const Duration(seconds: 3),
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
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          const ElderlyHeader(
            title: 'दैनिक अनुस्मारक (Daily Schedule)',
            subtitle: 'Never miss medication or water. Tap button after taking.',
            icon: Icons.alarm_rounded,
            iconColor: AppColors.darkPrimary,
          ),
          const SizedBox(height: AppDimensions.spacingLarge),

          // List of Reminder Cards
          ..._reminders.map((item) {
            final isAcked = item.isAcknowledgedToday;

            return ElderlyCard(
              margin: const EdgeInsets.only(bottom: AppDimensions.spacingMedium),
              borderColor: isAcked ? AppColors.darkEmerald : AppColors.darkBorder,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Top Row: Time, Type Icon, and Voice Badge
                  Wrap(
                    alignment: WrapAlignment.spaceBetween,
                    crossAxisAlignment: WrapCrossAlignment.center,
                    spacing: 12,
                    runSpacing: 8,
                    children: [
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            item.type == 'medicine'
                                ? Icons.medication_rounded
                                : (item.type == 'water'
                                    ? Icons.water_drop_rounded
                                    : Icons.fitness_center_rounded),
                            size: AppDimensions.iconMedium,
                            color: AppColors.darkPrimary,
                          ),
                          const SizedBox(width: AppDimensions.spacingSmall),
                          Flexible(
                            child: FittedBox(
                              fit: BoxFit.scaleDown,
                              alignment: Alignment.centerLeft,
                              child: Text(
                                item.formattedTime,
                                style: const TextStyle(
                                  fontSize: AppTypography.headlineSmall,
                                  fontWeight: AppTypography.weightHeavy,
                                  color: AppColors.darkAmber,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    if (item.audioPath != null)
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppColors.darkSurfaceElevated,
                          borderRadius: BorderRadius.circular(12),
                          border: const Border.fromBorderSide(
                            BorderSide(color: AppColors.darkAmber, width: 1.5),
                          ),
                        ),
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              Icons.record_voice_over_rounded,
                              size: AppDimensions.iconSmall, // 28px
                              color: AppColors.darkAmber,
                            ),
                            SizedBox(width: AppDimensions.spacingXSmall),
                            Flexible(
                              child: Text(
                                'पारिवारिक आवाज़',
                                style: TextStyle(
                                  fontSize: AppTypography.titleMedium, // 24.0px (>= 24px)
                                  fontWeight: AppTypography.weightBold,
                                  color: AppColors.darkAmber,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: AppDimensions.spacingSmall),

                // Reminder Label
                Text(
                  item.label,
                  style: const TextStyle(
                    fontSize: AppTypography.titleMedium,
                    fontWeight: AppTypography.weightBold,
                    color: AppColors.darkTextPrimary,
                  ),
                ),
                const SizedBox(height: AppDimensions.spacingMedium),

                // Voice Playback & Large Acknowledgment Button
                Row(
                  children: [
                    // Voice read-aloud button
                    IconButton(
                      icon: const Icon(
                        Icons.volume_up_rounded,
                        size: AppDimensions.iconLarge,
                        color: AppColors.darkAmber,
                      ),
                      tooltip: 'Play voice prompt',
                      onPressed: () {
                        _voiceService.playReminderVoice(
                          item.label,
                          audioPath: item.audioPath,
                        );
                      },
                    ),
                    const SizedBox(width: AppDimensions.spacingSmall),

                    // Primary 64px Acknowledgment Button
                    Expanded(
                      child: ElderlyButton(
                        label: isAcked ? 'पूर्ण (Taken ✓)' : 'दवाई ले ली (TAKE NOW)',
                        icon: isAcked ? Icons.check_circle_rounded : Icons.check_rounded,
                        variant: isAcked
                            ? ElderlyButtonVariant.surface
                            : ElderlyButtonVariant.emerald,
                        onPressed: isAcked ? null : () => _acknowledge(item.id, item.label),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          );
        }),
      ],
    ),
  );
}
}
