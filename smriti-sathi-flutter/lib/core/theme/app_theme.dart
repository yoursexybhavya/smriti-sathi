import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../constants/app_dimensions.dart';
import '../constants/app_typography.dart';

/// Smriti Sathi — Complete Material 3 ThemeData Engine
/// Strictly WCAG 2.2 AAA compliant with large text and motor tremor support.
class AppTheme {
  AppTheme._();

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: AppColors.darkBg,
      colorScheme: const ColorScheme(
        brightness: Brightness.dark,
        primary: AppColors.darkPrimary,
        onPrimary: AppColors.darkOnPrimary,
        primaryContainer: AppColors.darkPrimaryContainer,
        onPrimaryContainer: AppColors.darkOnPrimaryContainer,
        secondary: AppColors.darkAmber,
        onSecondary: AppColors.darkOnAmber,
        secondaryContainer: AppColors.darkAmberContainer,
        onSecondaryContainer: AppColors.darkOnAmberContainer,
        tertiary: AppColors.darkEmerald,
        onTertiary: AppColors.darkOnEmerald,
        tertiaryContainer: AppColors.darkEmeraldContainer,
        onTertiaryContainer: AppColors.darkOnEmeraldContainer,
        error: AppColors.darkError,
        onError: AppColors.darkOnError,
        errorContainer: AppColors.darkErrorContainer,
        onErrorContainer: AppColors.darkOnErrorContainer,
        surface: AppColors.darkSurface,
        onSurface: AppColors.darkTextPrimary,
        onSurfaceVariant: AppColors.darkTextSecondary,
        outline: AppColors.darkBorder,
        outlineVariant: Color(0xFF475569),
        shadow: Colors.black,
        scrim: Colors.black,
        inverseSurface: AppColors.darkTextSecondary,
        onInverseSurface: AppColors.darkBg,
        inversePrimary: Color(0xFF0284C7),
        surfaceContainerHighest: AppColors.darkSurfaceElevated,
      ),
      textTheme: const TextTheme(
        displayLarge: TextStyle(
          fontSize: AppTypography.displayLarge,
          fontWeight: AppTypography.weightHeavy,
          height: 1.25,
          letterSpacing: -0.5,
          color: AppColors.darkTextPrimary,
        ),
        displayMedium: TextStyle(
          fontSize: AppTypography.displayMedium,
          fontWeight: AppTypography.weightBold,
          height: AppTypography.lineHeightTight,
          letterSpacing: 0.0,
          color: AppColors.darkTextPrimary,
        ),
        displaySmall: TextStyle(
          fontSize: AppTypography.displaySmall,
          fontWeight: AppTypography.weightBold,
          height: AppTypography.lineHeightTight,
          letterSpacing: 0.0,
          color: AppColors.darkTextPrimary,
        ),
        headlineLarge: TextStyle(
          fontSize: AppTypography.headlineLarge,
          fontWeight: AppTypography.weightBold,
          height: 1.35,
          letterSpacing: 0.0,
          color: AppColors.darkTextPrimary,
        ),
        headlineMedium: TextStyle(
          fontSize: AppTypography.headlineMedium,
          fontWeight: AppTypography.weightSemiBold,
          height: 1.35,
          letterSpacing: 0.0,
          color: AppColors.darkTextPrimary,
        ),
        headlineSmall: TextStyle(
          fontSize: AppTypography.headlineSmall,
          fontWeight: AppTypography.weightSemiBold,
          height: AppTypography.lineHeightComfort,
          letterSpacing: 0.0,
          color: AppColors.darkTextPrimary,
        ),
        titleLarge: TextStyle(
          fontSize: AppTypography.titleLarge,
          fontWeight: AppTypography.weightBold,
          height: AppTypography.lineHeightComfort,
          letterSpacing: 0.15,
          color: AppColors.darkTextPrimary,
        ),
        titleMedium: TextStyle(
          fontSize: AppTypography.titleMedium,
          fontWeight: AppTypography.weightSemiBold,
          height: AppTypography.lineHeightComfort,
          letterSpacing: 0.15,
          color: AppColors.darkTextPrimary,
        ),
        titleSmall: TextStyle(
          fontSize: AppTypography.titleSmall,
          fontWeight: AppTypography.weightSemiBold,
          height: AppTypography.lineHeightComfort,
          letterSpacing: 0.1,
          color: AppColors.darkTextPrimary,
        ),
        // BODY TEXT MUST BE >= 24px
        bodyLarge: TextStyle(
          fontSize: AppTypography.bodyLarge,
          fontWeight: AppTypography.weightMedium,
          height: AppTypography.lineHeightRelaxed,
          letterSpacing: AppTypography.letterSpacingRelaxed,
          color: AppColors.darkTextPrimary,
        ),
        bodyMedium: TextStyle(
          fontSize: AppTypography.bodyMedium,
          fontWeight: AppTypography.weightMedium,
          height: AppTypography.lineHeightRelaxed,
          letterSpacing: AppTypography.letterSpacingStandard,
          color: AppColors.darkTextPrimary,
        ),
        bodySmall: TextStyle(
          fontSize: AppTypography.bodySmall,
          fontWeight: AppTypography.weightMedium,
          height: 1.45,
          letterSpacing: 0.4,
          color: AppColors.darkTextSecondary,
        ),
        // BUTTON LABELS MUST BE >= 24px
        labelLarge: TextStyle(
          fontSize: AppTypography.button,
          fontWeight: AppTypography.weightBold,
          height: 1.35,
          letterSpacing: AppTypography.letterSpacingRelaxed,
          color: AppColors.darkOnPrimary,
        ),
        labelMedium: TextStyle(
          fontSize: AppTypography.button, // 24.0
          fontWeight: AppTypography.weightSemiBold,
          height: AppTypography.lineHeightTight,
          letterSpacing: AppTypography.letterSpacingRelaxed,
          color: AppColors.darkTextSecondary,
        ),
        labelSmall: TextStyle(
          fontSize: AppTypography.metadata, // 24.0
          fontWeight: AppTypography.weightSemiBold,
          height: AppTypography.lineHeightTight,
          letterSpacing: AppTypography.letterSpacingRelaxed,
          color: AppColors.darkTextMuted,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          minimumSize: const Size(double.infinity, AppDimensions.primaryButtonHeight),
          backgroundColor: AppColors.darkPrimary,
          foregroundColor: AppColors.darkOnPrimary,
          elevation: 0,
          padding: AppDimensions.buttonPadding,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppDimensions.radiusMedium),
            side: const BorderSide(color: AppColors.darkBorder, width: AppDimensions.borderWidth),
          ),
          textStyle: const TextStyle(
            fontSize: AppTypography.button,
            fontWeight: AppTypography.weightBold,
            letterSpacing: AppTypography.letterSpacingRelaxed,
          ),
        ),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          minimumSize: const Size(double.infinity, AppDimensions.primaryButtonHeight),
          backgroundColor: AppColors.darkPrimary,
          foregroundColor: AppColors.darkOnPrimary,
          elevation: 0,
          padding: AppDimensions.buttonPadding,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppDimensions.radiusMedium),
            side: const BorderSide(color: AppColors.darkBorder, width: AppDimensions.borderWidth),
          ),
          textStyle: const TextStyle(
            fontSize: AppTypography.button,
            fontWeight: AppTypography.weightBold,
            letterSpacing: AppTypography.letterSpacingRelaxed,
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          minimumSize: const Size(double.infinity, AppDimensions.standardButtonHeight),
          foregroundColor: AppColors.darkTextPrimary,
          padding: AppDimensions.buttonPadding,
          side: const BorderSide(color: AppColors.darkBorder, width: AppDimensions.borderWidth),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppDimensions.radiusMedium),
          ),
          textStyle: const TextStyle(
            fontSize: AppTypography.button,
            fontWeight: AppTypography.weightSemiBold,
            letterSpacing: AppTypography.letterSpacingRelaxed,
          ),
        ),
      ),
      cardTheme: CardThemeData(
        color: AppColors.darkSurface,
        elevation: 0,
        margin: const EdgeInsets.symmetric(vertical: AppDimensions.spacingXSmall),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppDimensions.radiusMedium),
          side: const BorderSide(color: AppColors.darkBorder, width: AppDimensions.borderWidth),
        ),
      ),
      navigationBarTheme: NavigationBarThemeData(
        height: AppDimensions.bottomNavHeight,
        backgroundColor: AppColors.darkBg,
        indicatorColor: AppColors.darkSurfaceElevated,
        labelTextStyle: WidgetStateProperty.resolveWith<TextStyle>((states) {
          if (states.contains(WidgetState.selected)) {
            return const TextStyle(
              fontSize: AppTypography.button, // 24.0
              fontWeight: AppTypography.weightBold,
              color: AppColors.darkPrimary,
            );
          }
          return const TextStyle(
            fontSize: AppTypography.navLabel, // 24.0
            fontWeight: AppTypography.weightSemiBold,
            color: AppColors.darkTextMuted,
          );
        }),
        iconTheme: WidgetStateProperty.resolveWith<IconThemeData>((states) {
          if (states.contains(WidgetState.selected)) {
            return const IconThemeData(size: AppDimensions.iconMedium, color: AppColors.darkPrimary);
          }
          return const IconThemeData(size: AppDimensions.iconMedium, color: AppColors.darkTextMuted);
        }),
      ),
      appBarTheme: const AppBarTheme(
        toolbarHeight: AppDimensions.appBarHeight,
        backgroundColor: AppColors.darkBg,
        foregroundColor: AppColors.darkTextPrimary,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          fontSize: AppTypography.titleLarge,
          fontWeight: AppTypography.weightBold,
          letterSpacing: 0.15,
          color: AppColors.darkTextPrimary,
        ),
        iconTheme: IconThemeData(size: AppDimensions.iconMedium, color: AppColors.darkTextPrimary),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.darkSurface,
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
        labelStyle: const TextStyle(fontSize: AppTypography.bodyMedium, color: AppColors.darkTextSecondary),
        hintStyle: const TextStyle(fontSize: AppTypography.bodyMedium, color: AppColors.darkTextMuted),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppDimensions.radiusMedium),
          borderSide: const BorderSide(color: AppColors.darkBorder, width: AppDimensions.borderWidth),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppDimensions.radiusMedium),
          borderSide: const BorderSide(color: AppColors.darkBorderActive, width: AppDimensions.borderActiveWidth),
        ),
      ),
    );
  }
}
