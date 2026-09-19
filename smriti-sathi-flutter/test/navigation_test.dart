import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:smriti_sathi_flutter/features/caregiver/caregiver_screen.dart';
import 'package:smriti_sathi_flutter/features/games/games_hub_screen.dart';
import 'package:smriti_sathi_flutter/features/home/home_screen.dart';
import 'package:smriti_sathi_flutter/features/progress/progress_screen.dart';
import 'package:smriti_sathi_flutter/features/reminders/reminders_screen.dart';
import 'package:smriti_sathi_flutter/features/settings/settings_screen.dart';
import 'package:smriti_sathi_flutter/main.dart';

void main() {
  group('Navigation & Shell Functional Tests (R2)', () {
    testWidgets('Can navigate across all 6 screens via bottom nav, app bar, and shortcuts',
        (tester) async {
      // Configure realistic mobile viewport dimensions
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 2.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      await tester.pumpWidget(const SmritiSathiApp());
      await tester.pumpAndSettle();

      // 1. Initial view: HomeScreen
      expect(find.byType(HomeScreen), findsOneWidget);
      expect(find.textContaining('दादा जी (Dadu)!'), findsOneWidget);

      // 2. Navigate to Games via Bottom Navigation
      await tester.tap(find.text('Games'));
      await tester.pumpAndSettle();
      expect(find.byType(GamesHubScreen), findsOneWidget);
      expect(find.text('दिमागी कसरत (Brain Exercises)'), findsWidgets);

      // 3. Navigate to Reminders via Bottom Navigation
      await tester.tap(find.text('Reminders'));
      await tester.pumpAndSettle();
      expect(find.byType(RemindersScreen), findsOneWidget);
      expect(find.text('दैनिक अनुस्मारक (Daily Schedule)'), findsOneWidget);

      // 4. Navigate to Progress via Bottom Navigation
      await tester.tap(find.text('Progress'));
      await tester.pumpAndSettle();
      expect(find.byType(ProgressScreen), findsOneWidget);
      expect(find.text('मेरी प्रगति (My Progress)'), findsWidgets);

      // 5. Navigate to Caregiver Screen via Top AppBar Action
      final caregiverButton = find.byTooltip('Caregiver Portal');
      expect(caregiverButton, findsOneWidget);
      await tester.tap(caregiverButton);
      await tester.pumpAndSettle();
      expect(find.byType(CaregiverScreen), findsOneWidget);
      expect(find.text('देखभालकर्ता पोर्टल (Caregiver Portal)'), findsOneWidget);

      // 6. Test Back button from Caregiver Screen back to Home
      final backButton = find.byTooltip('मुख्य पृष्ठ पर वापस जाएं (Back to Home)');
      expect(backButton, findsOneWidget);
      await tester.tap(backButton);
      await tester.pumpAndSettle();
      expect(find.byType(HomeScreen), findsOneWidget);

      // 7. Navigate to Settings Screen via Top AppBar Action
      final settingsButton = find.byTooltip('Settings');
      expect(settingsButton, findsOneWidget);
      await tester.tap(settingsButton);
      await tester.pumpAndSettle();
      expect(find.byType(SettingsScreen), findsOneWidget);
      expect(find.text('ऐप सेटिंग्स (App Settings)'), findsWidgets);

      // 8. Return back to Home from Settings
      await tester.tap(find.byTooltip('मुख्य पृष्ठ पर वापस जाएं (Back to Home)'));
      await tester.pumpAndSettle();
      expect(find.byType(HomeScreen), findsOneWidget);

      // 9. Navigate via Home Screen Hero Button to Games Hub
      final dailyGameButton = find.text('दिमागी कसरत शुरू करें\nSTART DAILY WORKOUT');
      expect(dailyGameButton, findsOneWidget);
      await tester.ensureVisible(dailyGameButton);
      await tester.tap(dailyGameButton);
      await tester.pumpAndSettle();
      expect(find.byType(GamesHubScreen), findsOneWidget);
    });
  });
}
