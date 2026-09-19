import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_dimensions.dart';
import '../../core/constants/app_routes.dart';
import '../../core/constants/app_typography.dart';
import '../../core/utils/accessibility_utils.dart';
import '../../services/connectivity_service.dart';
import '../caregiver/caregiver_screen.dart';
import '../games/games_hub_screen.dart';
import '../home/home_screen.dart';
import '../progress/progress_screen.dart';
import '../reminders/reminders_screen.dart';
import '../settings/settings_screen.dart';

/// Main Application Shell housing the native state-preserving IndexedStack,
/// 4-tab patient bottom navigation bar, accessible top bar, and offline indicator.
class MainNavigationShell extends StatefulWidget {
  const MainNavigationShell({super.key});

  @override
  State<MainNavigationShell> createState() => _MainNavigationShellState();
}

class _MainNavigationShellState extends State<MainNavigationShell> {
  int _currentIndex = AppRoutes.homeIndex;
  final ConnectivityService _connectivityService = ConnectivityService();

  void _navigateTo(int index) {
    if (_currentIndex != index) {
      AccessibilityUtils.triggerHaptic();
      setState(() {
        _currentIndex = index;
      });
    }
  }

  String _getTitleForIndex(int index) {
    switch (index) {
      case AppRoutes.homeIndex:
        return 'स्मृति साथी (SMRITI SATHI)';
      case AppRoutes.gamesIndex:
        return 'दिमागी कसरत (Brain Games)';
      case AppRoutes.remindersIndex:
        return 'दैनिक अनुस्मारक (Reminders)';
      case AppRoutes.progressIndex:
        return 'मेरी प्रगति (My Progress)';
      case AppRoutes.caregiverIndex:
        return 'देखभालकर्ता (Caregiver Portal)';
      case AppRoutes.settingsIndex:
        return 'ऐप सेटिंग्स (App Settings)';
      default:
        return 'स्मृति साथी (SMRITI SATHI)';
    }
  }

  @override
  Widget build(BuildContext context) {
    final isSubScreen = _currentIndex == AppRoutes.caregiverIndex ||
        _currentIndex == AppRoutes.settingsIndex;

    return Scaffold(
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(AppDimensions.appBarHeight),
        child: AppBar(
          toolbarHeight: AppDimensions.appBarHeight,
          leadingWidth: AppDimensions.appBarHeight, // 72.0px allows 56x56 button
          title: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Flexible(
                child: Text(
                  _getTitleForIndex(_currentIndex),
                  overflow: TextOverflow.ellipsis,
                  maxLines: 1,
                  style: const TextStyle(
                    fontSize: AppTypography.titleLarge,
                    fontWeight: AppTypography.weightBold,
                    color: AppColors.darkTextPrimary,
                  ),
                ),
              ),
            ],
          ),
          leading: isSubScreen
              ? Center(
                  child: SizedBox(
                    width: AppDimensions.backButtonTarget, // 56.0 (>= 48px)
                    height: AppDimensions.backButtonTarget, // 56.0 (>= 48px)
                    child: IconButton(
                      icon: const Icon(
                        Icons.arrow_back_rounded,
                        size: AppDimensions.iconMedium,
                        color: AppColors.darkAmber,
                      ),
                      tooltip: 'मुख्य पृष्ठ पर वापस जाएं (Back to Home)',
                      onPressed: () => _navigateTo(AppRoutes.homeIndex),
                    ),
                  ),
                )
              : null,
          actions: [
            // Offline/Online Status Badge
            ValueListenableBuilder<bool>(
              valueListenable: _connectivityService.isOnlineNotifier,
              builder: (context, isOnline, _) {
                final textScale = MediaQuery.textScalerOf(context).scale(1.0);
                final screenWidth = MediaQuery.sizeOf(context).width;
                // Gracefully collapse status label to icon on compact viewports (<= 360px),
                // under accessibility text scaling (> 1.0 on standard screens, > 1.2 on large screens),
                // or on sub-screens with leading back button to guarantee zero RenderFlex overflow.
                final showStatusText = !isSubScreen &&
                    ((screenWidth > 360 && textScale <= 1.0) ||
                     (screenWidth >= 500 && textScale <= 1.2));

                return Tooltip(
                  message: isOnline ? 'Online' : 'Offline Mode (Active)',
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(
                      minHeight: AppDimensions.minTouchTarget, // 48.0
                      minWidth: AppDimensions.minTouchTarget,
                    ),
                    child: InkWell(
                      borderRadius: BorderRadius.circular(20),
                      onTap: () {
                        _connectivityService.toggleStatus();
                        AccessibilityUtils.triggerHaptic();
                      },
                      child: Padding(
                        padding: EdgeInsets.symmetric(
                          horizontal: showStatusText ? 8.0 : 10.0,
                          vertical: 8.0,
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              isOnline
                                  ? Icons.wifi_rounded
                                  : Icons.wifi_off_rounded,
                              size: AppDimensions.iconSmall,
                              color: isOnline
                                  ? AppColors.darkEmerald
                                  : AppColors.darkAmber,
                            ),
                            if (showStatusText) ...[
                              const SizedBox(width: AppDimensions.spacingXSmall),
                              Text(
                                isOnline ? 'Online' : 'Offline',
                                style: TextStyle(
                                  fontSize: AppTypography.titleMedium, // 24.0px (>= 24px)
                                  fontWeight: AppTypography.weightSemiBold,
                                  color: isOnline
                                      ? AppColors.darkEmerald
                                      : AppColors.darkAmber,
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
            const SizedBox(width: 4),

            // Caregiver Portal Action Target
            IconButton(
              icon: const Icon(
                Icons.supervisor_account_rounded,
                size: AppDimensions.iconMedium,
                color: AppColors.darkPrimary,
              ),
              tooltip: 'Caregiver Portal',
              onPressed: () => _navigateTo(AppRoutes.caregiverIndex),
            ),

            // Settings Action Target
            IconButton(
              icon: const Icon(
                Icons.settings_rounded,
                size: AppDimensions.iconMedium,
                color: AppColors.darkTextSecondary,
              ),
              tooltip: 'Settings',
              onPressed: () => _navigateTo(AppRoutes.settingsIndex),
            ),
            const SizedBox(width: 4),
          ],
        ),
      ),
      body: IndexedStack(
        index: _currentIndex,
        children: [
          HomeScreen(onNavigate: _navigateTo),
          const GamesHubScreen(),
          const RemindersScreen(),
          const ProgressScreen(),
          const CaregiverScreen(),
          const SettingsScreen(),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex > 3 ? 0 : _currentIndex,
        onDestinationSelected: _navigateTo,
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_rounded),
            selectedIcon: Icon(Icons.home_rounded, color: AppColors.darkPrimary),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.psychology_rounded),
            selectedIcon: Icon(Icons.psychology_rounded, color: AppColors.darkPrimary),
            label: 'Games',
          ),
          NavigationDestination(
            icon: Icon(Icons.alarm_rounded),
            selectedIcon: Icon(Icons.alarm_rounded, color: AppColors.darkPrimary),
            label: 'Reminders',
          ),
          NavigationDestination(
            icon: Icon(Icons.insights_rounded),
            selectedIcon: Icon(Icons.insights_rounded, color: AppColors.darkPrimary),
            label: 'Progress',
          ),
        ],
      ),
    );
  }
}
