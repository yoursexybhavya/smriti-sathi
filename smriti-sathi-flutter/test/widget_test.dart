import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:smriti_sathi_flutter/core/constants/app_colors.dart';
import 'package:smriti_sathi_flutter/features/shell/main_navigation_shell.dart';
import 'package:smriti_sathi_flutter/main.dart';

void main() {
  testWidgets('SmritiSathiApp boots and renders MainNavigationShell', (tester) async {
    await tester.pumpWidget(const SmritiSathiApp());
    await tester.pumpAndSettle();

    // Verify MainNavigationShell is rendered
    expect(find.byType(MainNavigationShell), findsOneWidget);

    // Verify Title
    expect(find.text('स्मृति साथी (SMRITI SATHI)'), findsOneWidget);

    // Verify Bottom Navigation Destinations
    expect(find.text('Home'), findsOneWidget);
    expect(find.text('Games'), findsOneWidget);
    expect(find.text('Reminders'), findsOneWidget);
    expect(find.text('Progress'), findsOneWidget);

    // Verify AppTheme is dark with WCAG AAA colors
    final materialApp = tester.widget<MaterialApp>(find.byType(MaterialApp));
    expect(materialApp.theme?.brightness, equals(Brightness.dark));
    expect(materialApp.theme?.scaffoldBackgroundColor, equals(AppColors.darkBg));
  });
}
