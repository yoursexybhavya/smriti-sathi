import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../constants/app_dimensions.dart';

/// Accessibility utilities for screen reader announcements, haptics, and touch constraints.
class AccessibilityUtils {
  AccessibilityUtils._();

  /// Wraps a widget with TalkBack / VoiceOver semantics.
  static Widget wrapSemantics({
    required Widget child,
    required String label,
    String? hint,
    bool isButton = true,
    bool isHeader = false,
  }) {
    return Semantics(
      label: label,
      hint: hint,
      button: isButton,
      header: isHeader,
      child: child,
    );
  }

  /// Triggers reassuring tactile feedback for tremor and tactile verification.
  static void triggerHaptic() {
    HapticFeedback.lightImpact();
  }

  /// Triggers a stronger haptic feedback for alert/acknowledgment confirmation.
  static void triggerAffirmativeHaptic() {
    HapticFeedback.mediumImpact();
  }

  /// Ensures a widget satisfies the minimum 48x48 logical pixel touch target.
  static Widget enforceMinTouchTarget({required Widget child}) {
    return ConstrainedBox(
      constraints: const BoxConstraints(
        minWidth: AppDimensions.minTouchTarget,
        minHeight: AppDimensions.minTouchTarget,
      ),
      child: child,
    );
  }
}
