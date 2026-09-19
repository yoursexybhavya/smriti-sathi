import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:smriti_sathi_flutter/core/constants/app_typography.dart';
import 'package:smriti_sathi_flutter/core/theme/app_theme.dart';
import 'package:smriti_sathi_flutter/main.dart';

void main() {
  group('R3 Empirical Challenge: Typography Floor & Motor Ergonomics', () {
    test('AppTypography constants adhere to strict >= 24px floor', () {
      expect(AppTypography.body, greaterThanOrEqualTo(24.0));
      expect(AppTypography.bodyMedium, greaterThanOrEqualTo(24.0));
      expect(AppTypography.bodySmall, greaterThanOrEqualTo(24.0));
      expect(AppTypography.bodyLarge, greaterThanOrEqualTo(24.0));
      expect(AppTypography.button, greaterThanOrEqualTo(24.0));
      expect(AppTypography.navLabel, greaterThanOrEqualTo(24.0));
      expect(AppTypography.metadata, greaterThanOrEqualTo(24.0));
      expect(AppTypography.titleSmall, greaterThanOrEqualTo(24.0));
      expect(AppTypography.titleMedium, greaterThanOrEqualTo(24.0));
      expect(AppTypography.titleLarge, greaterThanOrEqualTo(24.0));
      expect(AppTypography.headlineSmall, greaterThanOrEqualTo(24.0));
      expect(AppTypography.headlineMedium, greaterThanOrEqualTo(24.0));
      expect(AppTypography.headlineLarge, greaterThanOrEqualTo(24.0));
      expect(AppTypography.displaySmall, greaterThanOrEqualTo(24.0));
      expect(AppTypography.displayMedium, greaterThanOrEqualTo(24.0));
      expect(AppTypography.displayLarge, greaterThanOrEqualTo(24.0));
    });

    test('AppTheme dark text theme adheres to strict >= 24px floor', () {
      final textTheme = AppTheme.darkTheme.textTheme;
      expect(textTheme.bodyLarge?.fontSize, greaterThanOrEqualTo(24.0));
      expect(textTheme.bodyMedium?.fontSize, greaterThanOrEqualTo(24.0));
      expect(textTheme.bodySmall?.fontSize, greaterThanOrEqualTo(24.0));
      expect(textTheme.labelLarge?.fontSize, greaterThanOrEqualTo(24.0));
      expect(textTheme.labelMedium?.fontSize, greaterThanOrEqualTo(24.0));
      expect(textTheme.labelSmall?.fontSize, greaterThanOrEqualTo(24.0));
      expect(textTheme.titleSmall?.fontSize, greaterThanOrEqualTo(24.0));
      expect(textTheme.titleMedium?.fontSize, greaterThanOrEqualTo(24.0));
      expect(textTheme.titleLarge?.fontSize, greaterThanOrEqualTo(24.0));
    });

    testWidgets('Interactive touch targets in MainNavigationShell meet >= 48x48px floor',
        (tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 2.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      await tester.pumpWidget(const SmritiSathiApp());
      await tester.pumpAndSettle();

      // Top bar actions: Caregiver IconButton, Settings IconButton, Status Badge InkWell
      final caregiverFinder = find.byTooltip('Caregiver Portal');
      expect(caregiverFinder, findsOneWidget);
      final caregiverSize = tester.getSize(caregiverFinder);
      expect(caregiverSize.width, greaterThanOrEqualTo(48.0));
      expect(caregiverSize.height, greaterThanOrEqualTo(48.0));

      final settingsFinder = find.byTooltip('Settings');
      expect(settingsFinder, findsOneWidget);
      final settingsSize = tester.getSize(settingsFinder);
      expect(settingsSize.width, greaterThanOrEqualTo(48.0));
      expect(settingsSize.height, greaterThanOrEqualTo(48.0));

      final statusBadgeFinder = find.byType(InkWell).first;
      final statusBadgeSize = tester.getSize(statusBadgeFinder);
      expect(statusBadgeSize.width, greaterThanOrEqualTo(48.0));
      expect(statusBadgeSize.height, greaterThanOrEqualTo(48.0));

      // Bottom navigation destinations
      final bottomNavFinder = find.byType(NavigationBar);
      expect(bottomNavFinder, findsOneWidget);
      final bottomNavSize = tester.getSize(bottomNavFinder);
      expect(bottomNavSize.height, greaterThanOrEqualTo(80.0));
    });

    testWidgets('Interactive buttons across all screens meet >= 48x48px floor',
        (tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 2.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      await tester.pumpWidget(const SmritiSathiApp());
      await tester.pumpAndSettle();

      // Verify all ElevatedButton on HomeScreen
      final elevatedButtons = find.byType(ElevatedButton);
      for (var i = 0; i < elevatedButtons.evaluate().length; i++) {
        final btnFinder = elevatedButtons.at(i);
        final size = tester.getSize(btnFinder);
        expect(size.width, greaterThanOrEqualTo(48.0));
        expect(size.height, greaterThanOrEqualTo(48.0));
      }

      // Navigate to Games and check buttons
      await tester.tap(find.text('Games'));
      await tester.pumpAndSettle();
      final textButtons = find.byType(TextButton);
      for (var i = 0; i < textButtons.evaluate().length; i++) {
        final btnFinder = textButtons.at(i);
        final size = tester.getSize(btnFinder);
        expect(size.width, greaterThanOrEqualTo(48.0));
        expect(size.height, greaterThanOrEqualTo(48.0));
      }

      // Navigate to Reminders and check buttons
      await tester.tap(find.text('Reminders'));
      await tester.pumpAndSettle();
      final outlinedButtons = find.byType(OutlinedButton);
      for (var i = 0; i < outlinedButtons.evaluate().length; i++) {
        final btnFinder = outlinedButtons.at(i);
        final size = tester.getSize(btnFinder);
        expect(size.width, greaterThanOrEqualTo(48.0));
        expect(size.height, greaterThanOrEqualTo(48.0));
      }
    });

    testWidgets('Empirical scan: Zero sub-24px rendered Text widgets on HomeScreen',
        (tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 2.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      await tester.pumpWidget(const SmritiSathiApp());
      await tester.pumpAndSettle();

      final textWidgets = tester.widgetList<Text>(find.byType(Text));
      final List<String> sub24Texts = [];

      for (final text in textWidgets) {
        final fontSize = text.style?.fontSize;
        if (fontSize != null && fontSize < 24.0) {
          sub24Texts.add('"${text.data}": ${fontSize}px');
        }
      }

      expect(sub24Texts, isEmpty,
          reason: 'All rendered Text widgets must have fontSize >= 24.0px');
    });

    testWidgets('Empirical scan: Zero sub-24px rendered Text widgets across GamesHubScreen',
        (tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 2.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      await tester.pumpWidget(const SmritiSathiApp());
      await tester.pumpAndSettle();
      await tester.tap(find.text('Games'));
      await tester.pumpAndSettle();

      final textWidgets = tester.widgetList<Text>(find.byType(Text));
      final List<String> sub24Texts = [];

      for (final text in textWidgets) {
        final fontSize = text.style?.fontSize;
        if (fontSize != null && fontSize < 24.0) {
          sub24Texts.add('"${text.data}": ${fontSize}px');
        }
      }

      expect(sub24Texts, isEmpty,
          reason: 'All rendered Text widgets on GamesHubScreen must have fontSize >= 24.0px');
    });

    testWidgets('Empirical scan: Zero sub-24px rendered Text widgets across RemindersScreen',
        (tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 2.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      await tester.pumpWidget(const SmritiSathiApp());
      await tester.pumpAndSettle();
      await tester.tap(find.text('Reminders'));
      await tester.pumpAndSettle();

      final textWidgets = tester.widgetList<Text>(find.byType(Text));
      final List<String> sub24Texts = [];

      for (final text in textWidgets) {
        final fontSize = text.style?.fontSize;
        if (fontSize != null && fontSize < 24.0) {
          sub24Texts.add('"${text.data}": ${fontSize}px');
        }
      }

      expect(sub24Texts, isEmpty,
          reason: 'All rendered Text widgets on RemindersScreen must have fontSize >= 24.0px');
    });
  });
}
