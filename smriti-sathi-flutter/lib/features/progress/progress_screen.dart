import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_dimensions.dart';
import '../../core/constants/app_typography.dart';
import '../../core/widgets/elderly_card.dart';
import '../../core/widgets/elderly_header.dart';
import '../../database/repositories/game_session_repository.dart';
import '../../models/game_session.dart';

/// Progress Screen — Cognitive streak and daily care adherence summary
/// Designed with dignified medical aesthetics, avoiding childish gamification.
class ProgressScreen extends StatefulWidget {
  const ProgressScreen({super.key});

  @override
  State<ProgressScreen> createState() => _ProgressScreenState();
}

class _ProgressScreenState extends State<ProgressScreen> {
  final GameSessionRepository _repo = InMemoryGameSessionRepository();
  List<GameSession> _sessions = [];
  int _streakDays = 5;
  double _avgAccuracy = 0.95;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final sessions = await _repo.getRecentSessions();
    final streak = await _repo.getCurrentStreakDays();
    final accuracy = await _repo.getAverageAccuracy();
    if (mounted) {
      setState(() {
        _sessions = sessions;
        _streakDays = streak;
        _avgAccuracy = accuracy;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(
        child: CircularProgressIndicator(color: AppColors.darkPrimary),
      );
    }

    final accuracyPercent = (_avgAccuracy * 100).toInt();

    return SingleChildScrollView(
      padding: AppDimensions.screenPaddingAll,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Screen Header
          const ElderlyHeader(
            title: 'मेरी प्रगति (My Progress)',
            subtitle: 'Every day keeps your memory sharp and spirit strong.',
            icon: Icons.insights_rounded,
            iconColor: AppColors.darkAmber,
          ),
          const SizedBox(height: AppDimensions.spacingLarge),

          // -------------------------------------------------------------------
          // 1. Cognitive Streak Hero Card
          // -------------------------------------------------------------------
          ElderlyCard(
            backgroundColor: AppColors.darkSurfaceElevated,
            borderColor: AppColors.darkAmber,
            borderWidth: 2.5,
            padding: AppDimensions.cardPaddingAll,
            child: Column(
              children: [
                const Icon(
                  Icons.stars_rounded,
                  size: AppDimensions.iconHero,
                  color: AppColors.darkAmber,
                ),
                const SizedBox(height: AppDimensions.spacingSmall),
                Text(
                  '$_streakDays दिन का स्ट्रीक! ($_streakDays Days Streak)',
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: AppTypography.headlineMedium,
                    fontWeight: AppTypography.weightHeavy,
                    color: AppColors.darkAmber,
                  ),
                ),
                const SizedBox(height: AppDimensions.spacingSmall),
                const Text(
                  'बहुत बढ़िया! You have practiced memory exercises every day this week.',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: AppTypography.bodyMedium,
                    color: AppColors.darkTextSecondary,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppDimensions.spacingLarge),

          // -------------------------------------------------------------------
          // 2. Health & Adherence Metrics Cards
          // -------------------------------------------------------------------
          _buildMetricCard(
            title: 'दवा अनुपालन (Care Adherence)',
            value: '100% On Time',
            subtitle: 'All daily medications taken as scheduled',
            icon: Icons.check_circle_rounded,
            accentColor: AppColors.darkEmerald,
          ),
          const SizedBox(height: AppDimensions.spacingMedium),

          _buildMetricCard(
            title: 'अभ्यास सटीकता (Exercise Accuracy)',
            value: '$accuracyPercent% Accuracy',
            subtitle: 'Errorless guidance supports steady performance',
            icon: Icons.psychology_rounded,
            accentColor: AppColors.darkPrimary,
          ),
          const SizedBox(height: AppDimensions.spacingXXLarge),

          // -------------------------------------------------------------------
          // 3. Recent Cognitive Exercise Sessions
          // -------------------------------------------------------------------
          const ElderlyHeader(
            title: 'हाल के अभ्यास (Recent Sessions)',
            subtitle: 'Completed cognitive exercises',
          ),
          const SizedBox(height: AppDimensions.spacingSmall),

          ..._sessions.map((session) {
            return ElderlyCard(
              margin: const EdgeInsets.only(bottom: AppDimensions.spacingMedium),
              child: Row(
                children: [
                  Container(
                    width: 56,
                    height: 56,
                    decoration: BoxDecoration(
                      color: AppColors.darkSurfaceElevated,
                      borderRadius: BorderRadius.circular(12),
                      border: const Border.fromBorderSide(
                        BorderSide(color: AppColors.darkBorder, width: 2),
                      ),
                    ),
                    child: const Icon(
                      Icons.task_alt_rounded,
                      size: AppDimensions.iconMedium,
                      color: AppColors.darkEmerald,
                    ),
                  ),
                  const SizedBox(width: AppDimensions.spacingMedium),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          session.domain.localizedName,
                          style: const TextStyle(
                            fontSize: AppTypography.titleMedium,
                            fontWeight: AppTypography.weightBold,
                            color: AppColors.darkTextPrimary,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Score: ${session.score} | Response: ${session.responseTimeMs}ms',
                          style: const TextStyle(
                            fontSize: AppTypography.bodySmall,
                            color: AppColors.darkTextSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            );
          }),
          const SizedBox(height: AppDimensions.spacingLarge),
        ],
      ),
    );
  }

  Widget _buildMetricCard({
    required String title,
    required String value,
    required String subtitle,
    required IconData icon,
    required Color accentColor,
  }) {
    return ElderlyCard(
      padding: AppDimensions.cardPaddingAll,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: AppDimensions.iconLarge, color: accentColor),
          const SizedBox(width: AppDimensions.spacingMedium),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: AppTypography.titleMedium,
                    fontWeight: AppTypography.weightBold,
                    color: AppColors.darkTextPrimary,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  value,
                  style: TextStyle(
                    fontSize: AppTypography.headlineSmall,
                    fontWeight: AppTypography.weightHeavy,
                    color: accentColor,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: const TextStyle(
                    fontSize: AppTypography.bodySmall,
                    color: AppColors.darkTextSecondary,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
