import 'package:flutter/material.dart';

/// Smriti Sathi — Elderly Typography Scale
/// Strict >= 24px floor for all body and button text styles.
/// Designed for low vision, presbyopia, and motor tremor scanning.
class AppTypography {
  AppTypography._();

  // Font Sizes (Logical Pixels)
  static const double displayLarge = 40.0;
  static const double displayMedium = 36.0;
  static const double displaySmall = 32.0;

  static const double headlineLarge = 30.0;
  static const double headlineMedium = 28.0;
  static const double headlineSmall = 26.0;

  static const double titleLarge = 26.0;
  static const double titleMedium = 24.0;
  static const double titleSmall = 24.0;

  // Strict >= 24px Floor for Body
  static const double body = 24.0; // Hard requirement floor
  static const double bodyLarge = 26.0;
  static const double bodyMedium = 24.0; // Hard minimum floor for body
  static const double bodySmall = 24.0; // Pinned to 24px to prevent tiny text

  // Strict >= 24px Floor for Button Labels
  static const double button = 24.0; // Hard minimum floor for buttons
  static const double navLabel = 24.0; // Bottom navigation label (>= 24px floor)
  static const double metadata = 24.0; // Absolute system floor for badges/meta (>= 24px floor)

  // Anti-Crowding Line Heights & Tracking
  static const double lineHeightTight = 1.30;
  static const double lineHeightComfort = 1.40;
  static const double lineHeightRelaxed = 1.50;

  static const double letterSpacingRelaxed = 0.50;
  static const double letterSpacingStandard = 0.25;

  // Approved Weights (w100-w300 banned for geriatric legibility)
  static const FontWeight weightMedium = FontWeight.w500;
  static const FontWeight weightSemiBold = FontWeight.w600;
  static const FontWeight weightBold = FontWeight.w700;
  static const FontWeight weightHeavy = FontWeight.w800;
}
