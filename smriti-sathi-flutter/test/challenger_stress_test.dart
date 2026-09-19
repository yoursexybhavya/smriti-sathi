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
  group('Challenger Stress Test: Viewport Boundaries & Text Scaling', () {
    final viewports = [
      const Size(320, 640),
      const Size(360, 640),
      const Size(400, 800),
      const Size(600, 900),
    ];

    for (final vp in viewports) {
      testWidgets('Viewport stress: Screen renders with zero overflow at ${vp.width}x${vp.height}',
          (tester) async {
        tester.view.physicalSize = Size(vp.width * 2.0, vp.height * 2.0);
        tester.view.devicePixelRatio = 2.0;
        addTearDown(() {
          tester.view.resetPhysicalSize();
          tester.view.resetDevicePixelRatio();
        });

        final List<FlutterErrorDetails> detectedOverflows = [];
        final originalOnError = FlutterError.onError;
        FlutterError.onError = (FlutterErrorDetails details) {
          if (details.exceptionAsString().contains('overflowed') ||
              details.exceptionAsString().contains('RenderFlex')) {
            detectedOverflows.add(details);
          }
          originalOnError?.call(details);
        };
        addTearDown(() {
          FlutterError.onError = originalOnError;
        });

        await tester.pumpWidget(const SmritiSathiApp());
        await tester.pumpAndSettle();

        expect(find.byType(HomeScreen), findsOneWidget);
        expect(tester.takeException(), isNull);
        expect(detectedOverflows, isEmpty);

        // Games screen
        await tester.tap(find.text('Games'));
        await tester.pumpAndSettle();
        expect(find.byType(GamesHubScreen), findsOneWidget);
        expect(tester.takeException(), isNull);
        expect(detectedOverflows, isEmpty);

        // Reminders screen
        await tester.tap(find.text('Reminders'));
        await tester.pumpAndSettle();
        expect(find.byType(RemindersScreen), findsOneWidget);
        expect(tester.takeException(), isNull);
        expect(detectedOverflows, isEmpty);

        // Progress screen
        await tester.tap(find.text('Progress'));
        await tester.pumpAndSettle();
        expect(find.byType(ProgressScreen), findsOneWidget);
        expect(tester.takeException(), isNull);
        expect(detectedOverflows, isEmpty);

        // Caregiver screen
        final caregiverBtn = find.byTooltip('Caregiver Portal');
        expect(caregiverBtn, findsOneWidget);
        await tester.tap(caregiverBtn);
        await tester.pumpAndSettle();
        expect(find.byType(CaregiverScreen), findsOneWidget);
        expect(tester.takeException(), isNull);
        expect(detectedOverflows, isEmpty);

        // Back to Home
        await tester.tap(find.byTooltip('मुख्य पृष्ठ पर वापस जाएं (Back to Home)'));
        await tester.pumpAndSettle();

        // Settings screen
        final settingsBtn = find.byTooltip('Settings');
        expect(settingsBtn, findsOneWidget);
        await tester.tap(settingsBtn);
        await tester.pumpAndSettle();
        expect(find.byType(SettingsScreen), findsOneWidget);
        expect(tester.takeException(), isNull);
        expect(detectedOverflows, isEmpty);
      });
    }

    final scalers = [
      const TextScaler.linear(1.5),
      const TextScaler.linear(2.0),
    ];

    for (final scaler in scalers) {
      testWidgets('Accessibility scaling stress: RemindersScreen renders without overflow at ${scaler.scale(1.0)}x scale',
          (tester) async {
        tester.view.physicalSize = const Size(720, 1280);
        tester.view.devicePixelRatio = 2.0;
        addTearDown(() {
          tester.view.resetPhysicalSize();
          tester.view.resetDevicePixelRatio();
        });

        final List<FlutterErrorDetails> detectedOverflows = [];
        final originalOnError = FlutterError.onError;
        FlutterError.onError = (FlutterErrorDetails details) {
          if (details.exceptionAsString().contains('overflowed') ||
              details.exceptionAsString().contains('RenderFlex')) {
            detectedOverflows.add(details);
          }
          originalOnError?.call(details);
        };
        addTearDown(() {
          FlutterError.onError = originalOnError;
        });

        await tester.pumpWidget(
          MediaQuery(
            data: MediaQueryData(
              size: const Size(360, 640),
              textScaler: scaler,
            ),
            child: const SmritiSathiApp(),
          ),
        );
        await tester.pumpAndSettle();

        // Navigate to Reminders
        await tester.tap(find.text('Reminders'));
        await tester.pumpAndSettle();

        expect(find.byType(RemindersScreen), findsOneWidget);
        expect(find.text('पारिवारिक आवाज़'), findsWidgets);
        expect(tester.takeException(), isNull);
        expect(detectedOverflows, isEmpty);
      });

      testWidgets('Accessibility scaling stress: All screens render without overflow at ${scaler.scale(1.0)}x scale',
          (tester) async {
        tester.view.physicalSize = const Size(800, 1600);
        tester.view.devicePixelRatio = 2.0;
        addTearDown(() {
          tester.view.resetPhysicalSize();
          tester.view.resetDevicePixelRatio();
        });

        final List<FlutterErrorDetails> detectedOverflows = [];
        final originalOnError = FlutterError.onError;
        FlutterError.onError = (FlutterErrorDetails details) {
          if (details.exceptionAsString().contains('overflowed') ||
              details.exceptionAsString().contains('RenderFlex')) {
            detectedOverflows.add(details);
          }
          originalOnError?.call(details);
        };
        addTearDown(() {
          FlutterError.onError = originalOnError;
        });

        await tester.pumpWidget(
          MediaQuery(
            data: MediaQueryData(
              size: const Size(400, 800),
              textScaler: scaler,
            ),
            child: const SmritiSathiApp(),
          ),
        );
        await tester.pumpAndSettle();

        // Home
        expect(find.byType(HomeScreen), findsOneWidget);
        expect(detectedOverflows, isEmpty);

        // Games
        await tester.tap(find.text('Games'));
        await tester.pumpAndSettle();
        expect(find.byType(GamesHubScreen), findsOneWidget);
        expect(detectedOverflows, isEmpty);

        // Progress
        await tester.tap(find.text('Progress'));
        await tester.pumpAndSettle();
        expect(find.byType(ProgressScreen), findsOneWidget);
        expect(detectedOverflows, isEmpty);

        // Caregiver
        await tester.tap(find.byTooltip('Caregiver Portal'));
        await tester.pumpAndSettle();
        expect(find.byType(CaregiverScreen), findsOneWidget);
        expect(detectedOverflows, isEmpty);

        // Settings
        await tester.tap(find.byTooltip('मुख्य पृष्ठ पर वापस जाएं (Back to Home)'));
        await tester.pumpAndSettle();
        await tester.tap(find.byTooltip('Settings'));
        await tester.pumpAndSettle();
        expect(find.byType(SettingsScreen), findsOneWidget);
        expect(detectedOverflows, isEmpty);
        expect(tester.takeException(), isNull);
      });
    }

    testWidgets('Regression Verification: AppBar trailing action row renders without overflow on narrow viewports (<= 320px)',
        (tester) async {
      tester.view.physicalSize = const Size(640, 1136); // 320x568 at 2.0 DPR
      tester.view.devicePixelRatio = 2.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      final List<FlutterErrorDetails> detectedOverflows = [];
      final originalOnError = FlutterError.onError;
      FlutterError.onError = (FlutterErrorDetails details) {
        if (details.exceptionAsString().contains('overflowed') ||
            details.exceptionAsString().contains('RenderFlex')) {
          detectedOverflows.add(details);
        }
        originalOnError?.call(details);
      };
      addTearDown(() {
        FlutterError.onError = originalOnError;
      });

      await tester.pumpWidget(const SmritiSathiApp());
      await tester.pumpAndSettle();

      final appBarFinder = find.byType(AppBar);
      expect(appBarFinder, findsOneWidget);
      expect(detectedOverflows, isEmpty);
      expect(tester.takeException(), isNull);
    });

    testWidgets('Regression Verification: RemindersScreen voice badge renders without overflow on 1.5x font scale',
        (tester) async {
      tester.view.physicalSize = const Size(640, 1136); // 320x568 at 2.0 DPR
      tester.view.devicePixelRatio = 2.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      final List<FlutterErrorDetails> detectedOverflows = [];
      final originalOnError = FlutterError.onError;
      FlutterError.onError = (FlutterErrorDetails details) {
        if (details.exceptionAsString().contains('overflowed') ||
            details.exceptionAsString().contains('RenderFlex')) {
          detectedOverflows.add(details);
        }
        originalOnError?.call(details);
      };
      addTearDown(() {
        FlutterError.onError = originalOnError;
      });

      await tester.pumpWidget(
        const MediaQuery(
          data: MediaQueryData(
            size: Size(320, 568),
            textScaler: TextScaler.linear(1.5),
          ),
          child: SmritiSathiApp(),
        ),
      );
      await tester.pumpAndSettle();

      await tester.tap(find.text('Reminders'));
      await tester.pumpAndSettle();

      expect(find.byType(RemindersScreen), findsOneWidget);
      expect(find.text('पारिवारिक आवाज़'), findsWidgets);
      expect(detectedOverflows, isEmpty);
      expect(tester.takeException(), isNull);
    });
  });
}
