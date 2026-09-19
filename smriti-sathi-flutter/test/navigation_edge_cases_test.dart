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
  group('Adversarial Navigation & Shell Edge Cases', () {
    testWidgets('Rapid tab switching does not throw exceptions or corrupt state',
        (tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 2.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      await tester.pumpWidget(const SmritiSathiApp());
      await tester.pumpAndSettle();

      expect(find.byType(HomeScreen), findsOneWidget);

      // Rapidly trigger destination selections in quick succession without full pumpAndSettle
      final destinations = ['Games', 'Reminders', 'Progress', 'Home', 'Games', 'Progress'];
      for (final dest in destinations) {
        await tester.tap(find.text(dest));
        // Intentionally short pump to simulate frantic / tremor taps
        await tester.pump(const Duration(milliseconds: 10));
      }

      // Allow full settlement after rapid inputs
      await tester.pumpAndSettle();

      // Final active screen should match the last tapped destination: Progress
      expect(find.byType(ProgressScreen), findsOneWidget);
      expect(find.text('मेरी प्रगति (My Progress)'), findsWidgets);
    });

    testWidgets('Back button behavior from Caregiver and Settings', (tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 2.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      await tester.pumpWidget(const SmritiSathiApp());
      await tester.pumpAndSettle();

      // Baseline: Home screen has NO leading back button
      final appBarFinder = find.byType(AppBar);
      expect(appBarFinder, findsOneWidget);
      final homeAppBar = tester.widget<AppBar>(appBarFinder);
      expect(homeAppBar.leading, isNull);

      // Navigate to Caregiver
      await tester.tap(find.byTooltip('Caregiver Portal'));
      await tester.pumpAndSettle();

      expect(find.byType(CaregiverScreen), findsOneWidget);
      expect(find.text('देखभालकर्ता (Caregiver Portal)'), findsOneWidget);

      // Verify Caregiver has leading back button
      final caregiverBackButton = find.byTooltip('मुख्य पृष्ठ पर वापस जाएं (Back to Home)');
      expect(caregiverBackButton, findsOneWidget);

      // Tap back button -> should return to Home
      await tester.tap(caregiverBackButton);
      await tester.pumpAndSettle();

      expect(find.byType(HomeScreen), findsOneWidget);
      final returnedAppBar = tester.widget<AppBar>(appBarFinder);
      expect(returnedAppBar.leading, isNull);

      // Navigate to Settings
      await tester.tap(find.byTooltip('Settings'));
      await tester.pumpAndSettle();

      expect(find.byType(SettingsScreen), findsOneWidget);
      expect(find.text('ऐप सेटिंग्स (App Settings)'), findsWidgets);

      // Verify Settings has leading back button
      final settingsBackButton = find.byTooltip('मुख्य पृष्ठ पर वापस जाएं (Back to Home)');
      expect(settingsBackButton, findsOneWidget);

      // Tap back button -> should return to Home
      await tester.tap(settingsBackButton);
      await tester.pumpAndSettle();

      expect(find.byType(HomeScreen), findsOneWidget);
      final finalAppBar = tester.widget<AppBar>(appBarFinder);
      expect(finalAppBar.leading, isNull);
    });

    testWidgets('Subscreen cross-navigation and BottomNavigationBar interaction',
        (tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 2.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      await tester.pumpWidget(const SmritiSathiApp());
      await tester.pumpAndSettle();

      // Go to Caregiver
      await tester.tap(find.byTooltip('Caregiver Portal'));
      await tester.pumpAndSettle();
      expect(find.byType(CaregiverScreen), findsOneWidget);

      // Switch directly to Settings without hitting Back
      await tester.tap(find.byTooltip('Settings'));
      await tester.pumpAndSettle();
      expect(find.byType(SettingsScreen), findsOneWidget);

      // While on Settings, tap Reminders on the BottomNavigationBar
      await tester.tap(find.text('Reminders'));
      await tester.pumpAndSettle();
      expect(find.byType(RemindersScreen), findsOneWidget);
      expect(find.text('दैनिक अनुस्मारक (Reminders)'), findsOneWidget);

      // Verify leading back button is absent on Reminders
      final remindersAppBar = tester.widget<AppBar>(find.byType(AppBar));
      expect(remindersAppBar.leading, isNull);
    });

    testWidgets('State preservation across tabs via IndexedStack', (tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 2.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      await tester.pumpWidget(const SmritiSathiApp());
      await tester.pumpAndSettle();

      // 1. Navigate to Games tab
      await tester.tap(find.text('Games'));
      await tester.pumpAndSettle();
      expect(find.byType(GamesHubScreen), findsOneWidget);

      // 2. Perform action: Select correct answer in Scaffolding Demo
      final correctButton = find.text('कमल का फूल\n🌸 LOTUS');
      expect(correctButton, findsOneWidget);
      await tester.ensureVisible(correctButton);
      await tester.tap(correctButton);
      await tester.pumpAndSettle();

      // Verify state mutated: feedback updated
      const successMessage = 'शानदार! बिल्कुल सही उत्तर! (Correct! Great job!) ⭐';
      expect(find.text(successMessage), findsOneWidget);

      // 3. Navigate away to Reminders
      await tester.tap(find.text('Reminders'));
      await tester.pumpAndSettle();
      expect(find.byType(RemindersScreen), findsOneWidget);

      // 4. Navigate away to Caregiver
      await tester.tap(find.byTooltip('Caregiver Portal'));
      await tester.pumpAndSettle();
      expect(find.byType(CaregiverScreen), findsOneWidget);

      // 5. Perform action in Caregiver: Record familiar voice prompt
      final recordButton = find.text('नया संदेश रिकॉर्ड करें (RECORD PROMPT)');
      expect(recordButton, findsOneWidget);
      await tester.ensureVisible(recordButton);
      await tester.tap(recordButton);
      await tester.pumpAndSettle();

      // Verify state mutated in Caregiver
      expect(find.textContaining('✅ रिकॉर्डिंग सहेजी गई!'), findsOneWidget);

      // 6. Navigate to Home
      await tester.tap(find.byTooltip('मुख्य पृष्ठ पर वापस जाएं (Back to Home)'));
      await tester.pumpAndSettle();
      expect(find.byType(HomeScreen), findsOneWidget);

      // 7. Return to Games tab — verify state is preserved
      await tester.tap(find.text('Games'));
      await tester.pumpAndSettle();
      expect(find.byType(GamesHubScreen), findsOneWidget);
      expect(find.text(successMessage), findsOneWidget);

      // 8. Return to Caregiver — verify state is preserved
      await tester.tap(find.byTooltip('Caregiver Portal'));
      await tester.pumpAndSettle();
      expect(find.byType(CaregiverScreen), findsOneWidget);
      expect(find.textContaining('✅ रिकॉर्डिंग सहेजी गई!'), findsOneWidget);
    });

    testWidgets('System back gesture on root does not cause unhandled crashes',
        (tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 2.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      await tester.pumpWidget(const SmritiSathiApp());
      await tester.pumpAndSettle();

      // Navigate to Caregiver
      await tester.tap(find.byTooltip('Caregiver Portal'));
      await tester.pumpAndSettle();
      expect(find.byType(CaregiverScreen), findsOneWidget);

      // Simulate system pop route
      final handled = await tester.binding.handlePopRoute();
      // Documenting whether root navigator or shell handles system pop
      // Since MainNavigationShell does not currently wrap with PopScope,
      // handled returns false at root, meaning Android OS will minimize/exit the app.
      expect(handled, isFalse);
    });
  });
}
