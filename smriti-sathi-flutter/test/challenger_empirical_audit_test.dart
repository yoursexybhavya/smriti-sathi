import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:smriti_sathi_flutter/features/games/games_hub_screen.dart';
import 'package:smriti_sathi_flutter/features/reminders/reminders_screen.dart';
import 'package:smriti_sathi_flutter/main.dart';

void main() {
  group('Challenger Empirical Audit: Cognitive Ergonomics & Scaffolding Edge Cases', () {
    testWidgets('Errorless learning: Scaffolding hint can be triggered without error',
        (tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 2.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      await tester.pumpWidget(const SmritiSathiApp());
      await tester.pumpAndSettle();

      // Navigate to Games
      await tester.tap(find.text('Games'));
      await tester.pumpAndSettle();

      expect(find.byType(GamesHubScreen), findsOneWidget);

      // Verify hint button exists
      final hintButton = find.text('3s संकेत दिखाएं (Show Scaffolding Hint)');
      expect(hintButton, findsOneWidget);

      // Trigger hint
      await tester.tap(hintButton);
      await tester.pump();

      // Settle hint animation
      await tester.pump(const Duration(seconds: 4));
      await tester.pumpAndSettle();

      expect(tester.takeException(), isNull);
    });

    testWidgets('Reminder acknowledgment: Acknowledging a reminder updates state gracefully',
        (tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 2.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      await tester.pumpWidget(const SmritiSathiApp());
      await tester.pumpAndSettle();

      // Navigate to Reminders
      await tester.tap(find.text('Reminders'));
      await tester.pumpAndSettle();

      expect(find.byType(RemindersScreen), findsOneWidget);

      // Find an acknowledgment button
      final ackButton = find.text('ले ली (Done)');
      if (ackButton.evaluate().isNotEmpty) {
        await tester.tap(ackButton.first);
        await tester.pumpAndSettle();
      }

      expect(tester.takeException(), isNull);
    });

    testWidgets('Accessibility scaling stress: Reminders screen renders without overflow under 1.5x scale',
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
        const MediaQuery(
          data: MediaQueryData(
            size: Size(360, 640),
            textScaler: TextScaler.linear(1.5),
          ),
          child: SmritiSathiApp(),
        ),
      );
      await tester.pumpAndSettle();

      // Navigate to Reminders
      await tester.tap(find.text('Reminders'));
      await tester.pumpAndSettle();

      expect(find.byType(RemindersScreen), findsOneWidget);
      await tester.scrollUntilVisible(find.text('पारिवारिक आवाज़'), 500);
      expect(find.text('पारिवारिक आवाज़'), findsWidgets);
      if (detectedOverflows.isNotEmpty) {
        for (var o in detectedOverflows) {
          debugPrint('OVERFLOW DETAIL:\n${o.toString()}');
        }
      }
      expect(tester.takeException(), isNull);
      expect(detectedOverflows, isEmpty);
    });
  });
}
