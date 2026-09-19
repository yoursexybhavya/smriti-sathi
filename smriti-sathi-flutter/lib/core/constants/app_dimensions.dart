import 'package:flutter/material.dart';

/// Smriti Sathi — Motor Ergonomics & Sizing Tokens
/// Engineered for Parkinsonian tremor, motor ataxia, and elderly tactile dexterity.
class AppDimensions {
  AppDimensions._();

  // ---------------------------------------------------------------------------
  // Touch Targets (Logical Pixels)
  // ---------------------------------------------------------------------------
  static const double minTouchTarget = 48.0; // Hard minimum floor
  static const double standardButtonHeight = 56.0;
  static const double primaryButtonHeight = 64.0; // Primary CTA height
  static const double heroButtonHeight = 72.0; // Hero workout button height
  static const double giantButtonHeight = 88.0; // Full-width action card height
  static const double cardMinHeight = 88.0;

  // ---------------------------------------------------------------------------
  // Motor Tremor Safety Spacing (16-24px Gaps)
  // ---------------------------------------------------------------------------
  static const double spacingXSmall = 8.0;
  static const double spacingSmall = 12.0;
  static const double spacingMedium = 16.0; // Min tremor gap
  static const double spacingLarge = 20.0; // Standard layout gap
  static const double spacingXLarge = 24.0; // Wide button separation gap
  static const double spacingXXLarge = 32.0;

  // ---------------------------------------------------------------------------
  // Card & Container Sizing
  // ---------------------------------------------------------------------------
  static const double cardPadding = 20.0;
  static const double screenPadding = 20.0;
  static const double borderWidth = 2.0;
  static const double borderActiveWidth = 3.0;
  static const double radiusMedium = 16.0;
  static const double radiusLarge = 24.0;

  // ---------------------------------------------------------------------------
  // Icon Sizing
  // ---------------------------------------------------------------------------
  static const double iconSmall = 28.0;
  static const double iconMedium = 36.0;
  static const double iconLarge = 48.0;
  static const double iconHero = 64.0;

  // ---------------------------------------------------------------------------
  // App Bar & Nav Bar
  // ---------------------------------------------------------------------------
  static const double appBarHeight = 72.0;
  static const double bottomNavHeight = 88.0;
  static const double backButtonTarget = 56.0;

  // Reusable EdgeInsets
  static const EdgeInsets screenPaddingAll = EdgeInsets.all(screenPadding);
  static const EdgeInsets cardPaddingAll = EdgeInsets.all(cardPadding);
  static const EdgeInsets buttonPadding = EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0);
}
