import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:smriti_sathi_flutter/core/constants/app_typography.dart';
import 'package:smriti_sathi_flutter/core/theme/app_theme.dart';
import 'package:smriti_sathi_flutter/features/caregiver/caregiver_screen.dart';
import 'package:smriti_sathi_flutter/features/games/games_hub_screen.dart';
import 'package:smriti_sathi_flutter/features/home/home_screen.dart';
import 'package:smriti_sathi_flutter/features/progress/progress_screen.dart';
import 'package:smriti_sathi_flutter/features/reminders/reminders_screen.dart';
import 'package:smriti_sathi_flutter/features/settings/settings_screen.dart';
import 'package:smriti_sathi_flutter/features/shell/main_navigation_shell.dart';
import 'package:smriti_sathi_flutter/main.dart';
import 'package:smriti_sathi_flutter/services/connectivity_service.dart';

void main() {
  group('Empirical Adversarial Stress Suite (challenger_12_2)', () {
    late List<String> detectedOverflows;
    late void Function(FlutterErrorDetails)? originalOnError;

    setUp(() {
      ConnectivityService().setOnlineStatus(false);
      detectedOverflows = [];
      originalOnError = FlutterError.onError;
      FlutterError.onError = (FlutterErrorDetails details) {
        final message = details.exceptionAsString();
        if (message.contains('overflowed') || message.contains('RenderFlex')) {
          detectedOverflows.add(message);
        } else {
          originalOnError?.call(details);
        }
      };
    });

    tearDown(() {
      ConnectivityService().setOnlineStatus(false);
      FlutterError.onError = originalOnError;
    });

    // =========================================================================
    // SECTION 1: Defect 1 Regression Guard - RemindersScreen Voice Badge
    // =========================================================================
    group('Defect 1: RemindersScreen Voice Badge Overflow Regression', () {
      testWidgets('RemindersScreen renders without overflow on 540px width under 1.5x font scale',
          (tester) async {
        tester.view.physicalSize = const Size(540, 1200);
        tester.view.devicePixelRatio = 1.0;
        addTearDown(() {
          tester.view.resetPhysicalSize();
          tester.view.resetDevicePixelRatio();
        });

        await tester.pumpWidget(
          MediaQuery(
            data: const MediaQueryData(
              size: Size(540, 1200),
              textScaler: TextScaler.linear(1.5),
            ),
            child: MaterialApp(
              theme: AppTheme.darkTheme,
              home: const Scaffold(
                body: RemindersScreen(),
              ),
            ),
          ),
        );
        await tester.pumpAndSettle();

        expect(find.byType(RemindersScreen), findsOneWidget);
        expect(find.text('पारिवारिक आवाज़'), findsOneWidget);
        expect(
          detectedOverflows,
          isEmpty,
          reason: 'Voice badge overflowed on 540px with 1.5x scale: ${detectedOverflows.join("; ")}',
        );
      });

      testWidgets('RemindersScreen renders without overflow on compact 320px width under 1.5x scale',
          (tester) async {
        tester.view.physicalSize = const Size(320, 640);
        tester.view.devicePixelRatio = 1.0;
        addTearDown(() {
          tester.view.resetPhysicalSize();
          tester.view.resetDevicePixelRatio();
        });

        await tester.pumpWidget(
          MediaQuery(
            data: const MediaQueryData(
              size: Size(320, 640),
              textScaler: TextScaler.linear(1.5),
            ),
            child: MaterialApp(
              theme: AppTheme.darkTheme,
              home: const Scaffold(
                body: RemindersScreen(),
              ),
            ),
          ),
        );
        await tester.pumpAndSettle();

        expect(find.byType(RemindersScreen), findsOneWidget);
        expect(
          detectedOverflows,
          isEmpty,
          reason: 'Voice badge overflowed on 320px with 1.5x scale: ${detectedOverflows.join("; ")}',
        );
      });

      testWidgets('RemindersScreen voice badge text wraps flexibly without overflow under 2.0x scale',
          (tester) async {
        tester.view.physicalSize = const Size(400, 800);
        tester.view.devicePixelRatio = 1.0;
        addTearDown(() {
          tester.view.resetPhysicalSize();
          tester.view.resetDevicePixelRatio();
        });

        await tester.pumpWidget(
          MediaQuery(
            data: const MediaQueryData(
              size: Size(400, 800),
              textScaler: TextScaler.linear(2.0),
            ),
            child: MaterialApp(
              theme: AppTheme.darkTheme,
              home: const Scaffold(
                body: RemindersScreen(),
              ),
            ),
          ),
        );
        await tester.pumpAndSettle();

        expect(find.byType(RemindersScreen), findsOneWidget);
        expect(
          detectedOverflows,
          isEmpty,
          reason: 'RemindersScreen overflowed on 400px with 2.0x scale: ${detectedOverflows.join("; ")}',
        );
      });
    });

    // =========================================================================
    // SECTION 2: Defect 2 Regression Guard - MainNavigationShell AppBar
    // =========================================================================
    group('Defect 2: MainNavigationShell AppBar Overflow Regression', () {
      testWidgets('AppBar trailing actions row renders without overflow on narrow 320px width',
          (tester) async {
        tester.view.physicalSize = const Size(320, 640);
        tester.view.devicePixelRatio = 1.0;
        addTearDown(() {
          tester.view.resetPhysicalSize();
          tester.view.resetDevicePixelRatio();
        });

        await tester.pumpWidget(const SmritiSathiApp());
        await tester.pumpAndSettle();

        expect(find.byType(MainNavigationShell), findsOneWidget);
        // On width <= 360, status text label should be collapsed
        expect(find.text('Offline'), findsNothing);
        expect(find.byIcon(Icons.wifi_off_rounded), findsOneWidget);
        expect(find.byTooltip('Caregiver Portal'), findsOneWidget);
        expect(find.byTooltip('Settings'), findsOneWidget);

        expect(
          detectedOverflows,
          isEmpty,
          reason: 'AppBar overflowed on 320px width: ${detectedOverflows.join("; ")}',
        );
      });

      testWidgets('AppBar with leading back button on subscreen renders without overflow on 320px width',
          (tester) async {
        tester.view.physicalSize = const Size(320, 640);
        tester.view.devicePixelRatio = 1.0;
        addTearDown(() {
          tester.view.resetPhysicalSize();
          tester.view.resetDevicePixelRatio();
        });

        await tester.pumpWidget(const SmritiSathiApp());
        await tester.pumpAndSettle();

        // Navigate to Caregiver subscreen (adds 72px leading back button)
        await tester.tap(find.byTooltip('Caregiver Portal'));
        await tester.pumpAndSettle();

        expect(find.byType(CaregiverScreen), findsOneWidget);
        expect(find.byTooltip('मुख्य पृष्ठ पर वापस जाएं (Back to Home)'), findsOneWidget);

        expect(
          detectedOverflows,
          isEmpty,
          reason: 'Caregiver AppBar with back button overflowed on 320px: ${detectedOverflows.join("; ")}',
        );

        // Navigate to Settings subscreen
        await tester.tap(find.byTooltip('Settings'));
        await tester.pumpAndSettle();

        expect(find.byType(SettingsScreen), findsOneWidget);
        expect(
          detectedOverflows,
          isEmpty,
          reason: 'Settings AppBar with back button overflowed on 320px: ${detectedOverflows.join("; ")}',
        );
      });

      testWidgets('AppBar expands status text when width exceeds 360px breakpoint',
          (tester) async {
        tester.view.physicalSize = const Size(361, 700);
        tester.view.devicePixelRatio = 1.0;
        addTearDown(() {
          tester.view.resetPhysicalSize();
          tester.view.resetDevicePixelRatio();
        });

        await tester.pumpWidget(const SmritiSathiApp());
        await tester.pumpAndSettle();

        // Above 360px, status text should appear (default is Offline)
        expect(find.text('Offline'), findsOneWidget);
        expect(find.byIcon(Icons.wifi_off_rounded), findsOneWidget);

        expect(detectedOverflows, isEmpty);
      });

      testWidgets('AppBar trailing actions row handles offline toggle without overflow on 320px',
          (tester) async {
        tester.view.physicalSize = const Size(320, 640);
        tester.view.devicePixelRatio = 1.0;
        addTearDown(() {
          tester.view.resetPhysicalSize();
          tester.view.resetDevicePixelRatio();
        });

        await tester.pumpWidget(const SmritiSathiApp());
        await tester.pumpAndSettle();

        // Initially offline
        expect(find.byIcon(Icons.wifi_off_rounded), findsOneWidget);

        // Tap the wifi icon to toggle online mode
        await tester.tap(find.byIcon(Icons.wifi_off_rounded));
        await tester.pumpAndSettle();

        // Should now show wifi_rounded icon
        expect(find.byIcon(Icons.wifi_rounded), findsOneWidget);
        expect(
          detectedOverflows,
          isEmpty,
          reason: 'AppBar overflowed after toggle to online on 320px: ${detectedOverflows.join("; ")}',
        );

        // Toggle back to offline
        await tester.tap(find.byIcon(Icons.wifi_rounded));
        await tester.pumpAndSettle();
        expect(find.byIcon(Icons.wifi_off_rounded), findsOneWidget);
        expect(detectedOverflows, isEmpty);
      });

      testWidgets('AppBar renders with zero overflow under 1.5x and 2.0x scale on compact and standard viewports',
          (tester) async {
        for (final width in [320.0, 360.0, 375.0, 400.0]) {
          for (final scale in [1.5, 2.0]) {
            tester.view.physicalSize = Size(width, 700);
            tester.view.devicePixelRatio = 1.0;

            await tester.pumpWidget(
              MediaQuery(
                data: MediaQueryData(
                  size: Size(width, 700),
                  textScaler: TextScaler.linear(scale),
                ),
                child: const SmritiSathiApp(),
              ),
            );
            await tester.pumpAndSettle();

            expect(
              detectedOverflows,
              isEmpty,
              reason: 'AppBar overflowed on Home screen at width $width, scale $scale: ${detectedOverflows.join("; ")}',
            );

            // Test on Caregiver subscreen (with leading back button)
            await tester.tap(find.byTooltip('Caregiver Portal'));
            await tester.pumpAndSettle();

            expect(
              detectedOverflows,
              isEmpty,
              reason: 'AppBar overflowed on Caregiver at width $width, scale $scale: ${detectedOverflows.join("; ")}',
            );

            // Test on Settings subscreen
            await tester.tap(find.byTooltip('Settings'));
            await tester.pumpAndSettle();

            expect(
              detectedOverflows,
              isEmpty,
              reason: 'AppBar overflowed on Settings at width $width, scale $scale: ${detectedOverflows.join("; ")}',
            );

            // Return to Home
            await tester.tap(find.byTooltip('मुख्य पृष्ठ पर वापस जाएं (Back to Home)'));
            await tester.pumpAndSettle();
          }
        }
      });
    });

    // =========================================================================
    // SECTION 3: Rapid Navigation Transitions Across All 6 Screens
    // =========================================================================
    group('Adversarial Rapid Navigation Transitions Matrix', () {
      testWidgets('Stress: High-velocity cycling across all 6 screens with zero exceptions',
          (tester) async {
        tester.view.physicalSize = const Size(400, 800);
        tester.view.devicePixelRatio = 1.0;
        addTearDown(() {
          tester.view.resetPhysicalSize();
          tester.view.resetDevicePixelRatio();
        });

        await tester.pumpWidget(const SmritiSathiApp());
        await tester.pumpAndSettle();

        // Cycle through all 6 screens repeatedly with minimal pump delays
        for (int cycle = 0; cycle < 3; cycle++) {
          // 0 -> 1 (Games)
          await tester.tap(find.text('Games'));
          await tester.pump(const Duration(milliseconds: 5));

          // 1 -> 2 (Reminders)
          await tester.tap(find.text('Reminders'));
          await tester.pump(const Duration(milliseconds: 5));

          // 2 -> 3 (Progress)
          await tester.tap(find.text('Progress'));
          await tester.pump(const Duration(milliseconds: 5));

          // 3 -> 4 (Caregiver via AppBar)
          await tester.tap(find.byTooltip('Caregiver Portal'));
          await tester.pump(const Duration(milliseconds: 5));

          // 4 -> 5 (Settings via AppBar)
          await tester.tap(find.byTooltip('Settings'));
          await tester.pump(const Duration(milliseconds: 5));

          // 5 -> 0 (Back to Home)
          await tester.tap(find.byTooltip('मुख्य पृष्ठ पर वापस जाएं (Back to Home)'));
          await tester.pump(const Duration(milliseconds: 5));
        }

        await tester.pumpAndSettle();
        expect(find.byType(HomeScreen), findsOneWidget);
        expect(detectedOverflows, isEmpty);
      });

      testWidgets('Stress: Rapid alternation between sub-screens and bottom navigation tabs',
          (tester) async {
        tester.view.physicalSize = const Size(400, 800);
        tester.view.devicePixelRatio = 1.0;
        addTearDown(() {
          tester.view.resetPhysicalSize();
          tester.view.resetDevicePixelRatio();
        });

        await tester.pumpWidget(const SmritiSathiApp());
        await tester.pumpAndSettle();

        final sequence = [
          () => tester.tap(find.byTooltip('Caregiver Portal')),
          () => tester.tap(find.text('Games')),
          () => tester.tap(find.byTooltip('Settings')),
          () => tester.tap(find.text('Reminders')),
          () => tester.tap(find.byTooltip('Caregiver Portal')),
          () => tester.tap(find.text('Home')),
        ];

        for (final step in sequence) {
          await step();
          await tester.pump(const Duration(milliseconds: 16)); // 1 frame
        }

        await tester.pumpAndSettle();
        expect(find.byType(HomeScreen), findsOneWidget);
        expect(detectedOverflows, isEmpty);
      });
    });

    // =========================================================================
    // SECTION 4: Compact Viewport & Orientation Stress
    // =========================================================================
    group('Compact Viewport & Orientation Stress Across All 6 Screens', () {
      final testConfigs = [
        {'name': 'Compact Portrait (320x640)', 'size': const Size(320, 640)},
        {'name': 'Ultra-compact Portrait (320x480)', 'size': const Size(320, 480)},
        {'name': 'Compact Landscape (640x320)', 'size': const Size(640, 320)},
        {'name': 'Wide Landscape (800x360)', 'size': const Size(800, 360)},
      ];

      for (final config in testConfigs) {
        final configName = config['name'] as String;
        final configSize = config['size'] as Size;

        testWidgets('All 6 screens render without overflow on $configName', (tester) async {
          tester.view.physicalSize = configSize;
          tester.view.devicePixelRatio = 1.0;
          addTearDown(() {
            tester.view.resetPhysicalSize();
            tester.view.resetDevicePixelRatio();
          });

          await tester.pumpWidget(const SmritiSathiApp());
          await tester.pumpAndSettle();

          // Screen 0: Home
          expect(find.byType(HomeScreen), findsOneWidget);
          expect(
            detectedOverflows,
            isEmpty,
            reason: 'HomeScreen overflow on $configName: ${detectedOverflows.join("; ")}',
          );

          // Screen 1: Games
          await tester.tap(find.text('Games'));
          await tester.pumpAndSettle();
          expect(find.byType(GamesHubScreen), findsOneWidget);
          expect(
            detectedOverflows,
            isEmpty,
            reason: 'GamesHubScreen overflow on $configName: ${detectedOverflows.join("; ")}',
          );

          // Screen 2: Reminders
          await tester.tap(find.text('Reminders'));
          await tester.pumpAndSettle();
          expect(find.byType(RemindersScreen), findsOneWidget);
          expect(
            detectedOverflows,
            isEmpty,
            reason: 'RemindersScreen overflow on $configName: ${detectedOverflows.join("; ")}',
          );

          // Screen 3: Progress
          await tester.tap(find.text('Progress'));
          await tester.pumpAndSettle();
          expect(find.byType(ProgressScreen), findsOneWidget);
          expect(
            detectedOverflows,
            isEmpty,
            reason: 'ProgressScreen overflow on $configName: ${detectedOverflows.join("; ")}',
          );

          // Screen 4: Caregiver
          await tester.tap(find.byTooltip('Caregiver Portal'));
          await tester.pumpAndSettle();
          expect(find.byType(CaregiverScreen), findsOneWidget);
          expect(
            detectedOverflows,
            isEmpty,
            reason: 'CaregiverScreen overflow on $configName: ${detectedOverflows.join("; ")}',
          );

          // Screen 5: Settings
          await tester.tap(find.byTooltip('Settings'));
          await tester.pumpAndSettle();
          expect(find.byType(SettingsScreen), findsOneWidget);
          expect(
            detectedOverflows,
            isEmpty,
            reason: 'SettingsScreen overflow on $configName: ${detectedOverflows.join("; ")}',
          );
        });
      }
    });

    // =========================================================================
    // SECTION 5: Motor Ergonomics & Touch Target Verification (>= 48x48)
    // =========================================================================
    group('Motor Ergonomics: Touch Target Bounding Box Verification', () {
      testWidgets('AppBar Status Badge maintains >= 48x48 touch target on <= 360px width',
          (tester) async {
        tester.view.physicalSize = const Size(320, 640);
        tester.view.devicePixelRatio = 1.0;
        addTearDown(() {
          tester.view.resetPhysicalSize();
          tester.view.resetDevicePixelRatio();
        });

        await tester.pumpWidget(const SmritiSathiApp());
        await tester.pumpAndSettle();

        final inkWellFinder = find.ancestor(
          of: find.byIcon(Icons.wifi_off_rounded),
          matching: find.byType(InkWell),
        );
        expect(inkWellFinder, findsOneWidget);
        final size = tester.getSize(inkWellFinder);

        expect(
          size.width >= 48.0,
          isTrue,
          reason: 'Status badge width is ${size.width}, expected >= 48.0',
        );
        expect(
          size.height >= 48.0,
          isTrue,
          reason: 'Status badge height is ${size.height}, expected >= 48.0',
        );
      });

      testWidgets('AppBar action icons maintain >= 48x48 touch target dimensions',
          (tester) async {
        tester.view.physicalSize = const Size(320, 640);
        tester.view.devicePixelRatio = 1.0;
        addTearDown(() {
          tester.view.resetPhysicalSize();
          tester.view.resetDevicePixelRatio();
        });

        await tester.pumpWidget(const SmritiSathiApp());
        await tester.pumpAndSettle();

        final caregiverBtn = find.byTooltip('Caregiver Portal');
        final caregiverSize = tester.getSize(caregiverBtn);
        expect(caregiverSize.width >= 48.0, isTrue);
        expect(caregiverSize.height >= 48.0, isTrue);

        final settingsBtn = find.byTooltip('Settings');
        final settingsSize = tester.getSize(settingsBtn);
        expect(settingsSize.width >= 48.0, isTrue);
        expect(settingsSize.height >= 48.0, isTrue);
      });

      testWidgets('Subscreen back button maintains >= 48x48 touch target',
          (tester) async {
        tester.view.physicalSize = const Size(320, 640);
        tester.view.devicePixelRatio = 1.0;
        addTearDown(() {
          tester.view.resetPhysicalSize();
          tester.view.resetDevicePixelRatio();
        });

        await tester.pumpWidget(const SmritiSathiApp());
        await tester.pumpAndSettle();

        await tester.tap(find.byTooltip('Caregiver Portal'));
        await tester.pumpAndSettle();

        final backBtn = find.byTooltip('मुख्य पृष्ठ पर वापस जाएं (Back to Home)');
        final backSize = tester.getSize(backBtn);
        expect(backSize.width >= 48.0, isTrue);
        expect(backSize.height >= 48.0, isTrue);
      });
    });

    // =========================================================================
    // SECTION 6: Typography Floor Verification (Strict >= 24.0px)
    // =========================================================================
    group('Typography Floor Verification', () {
      test('Design system typography constants strictly respect >= 24px floor', () {
        expect(AppTypography.headlineLarge >= 24.0, isTrue);
        expect(AppTypography.headlineMedium >= 24.0, isTrue);
        expect(AppTypography.headlineSmall >= 24.0, isTrue);
        expect(AppTypography.titleLarge >= 24.0, isTrue);
        expect(AppTypography.titleMedium >= 24.0, isTrue);
        expect(AppTypography.titleSmall >= 24.0, isTrue);
        expect(AppTypography.body >= 24.0, isTrue);
        expect(AppTypography.bodyLarge >= 24.0, isTrue);
        expect(AppTypography.bodyMedium >= 24.0, isTrue);
        expect(AppTypography.bodySmall >= 24.0, isTrue);
        expect(AppTypography.button >= 24.0, isTrue);
        expect(AppTypography.navLabel >= 24.0, isTrue);
        expect(AppTypography.metadata >= 24.0, isTrue);
      });

      testWidgets('RemindersScreen voice badge text fontSize is strictly >= 24.0px',
          (tester) async {
        tester.view.physicalSize = const Size(540, 1200);
        tester.view.devicePixelRatio = 1.0;
        addTearDown(() {
          tester.view.resetPhysicalSize();
          tester.view.resetDevicePixelRatio();
        });

        await tester.pumpWidget(
          MaterialApp(
            theme: AppTheme.darkTheme,
            home: const Scaffold(
              body: RemindersScreen(),
            ),
          ),
        );
        await tester.pumpAndSettle();

        final textWidget = tester.widget<Text>(find.text('पारिवारिक आवाज़'));
        final fontSize = textWidget.style?.fontSize ?? 0;
        expect(
          fontSize >= 24.0,
          isTrue,
          reason: 'Voice badge text font size is $fontSize, expected >= 24.0',
        );
      });

      testWidgets('Status badge text fontSize is strictly >= 24.0px when expanded',
          (tester) async {
        tester.view.physicalSize = const Size(540, 1200);
        tester.view.devicePixelRatio = 1.0;
        addTearDown(() {
          tester.view.resetPhysicalSize();
          tester.view.resetDevicePixelRatio();
        });

        // 1. Check Offline text font size (default)
        await tester.pumpWidget(const SmritiSathiApp());
        await tester.pumpAndSettle();

        final offlineText = tester.widget<Text>(find.text('Offline'));
        final offlineFontSize = offlineText.style?.fontSize ?? 0;
        expect(
          offlineFontSize >= 24.0,
          isTrue,
          reason: 'Offline badge text font size is $offlineFontSize, expected >= 24.0',
        );

        // 2. Toggle to Online and check Online text font size
        ConnectivityService().setOnlineStatus(true);
        await tester.pumpAndSettle();

        final onlineText = tester.widget<Text>(find.text('Online'));
        final onlineFontSize = onlineText.style?.fontSize ?? 0;
        expect(
          onlineFontSize >= 24.0,
          isTrue,
          reason: 'Online badge text font size is $onlineFontSize, expected >= 24.0',
        );
      });
    });
  });
}
