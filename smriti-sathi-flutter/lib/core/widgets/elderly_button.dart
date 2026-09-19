import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../constants/app_dimensions.dart';
import '../constants/app_typography.dart';
import '../utils/accessibility_utils.dart';

enum ElderlyButtonVariant {
  primary,
  emerald,
  amber,
  surface,
}

/// Reusable high-contrast, tactile-safe button with dual-coded icon + text.
/// Enforces minimum 64px height and >=24px bold typography.
class ElderlyButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final IconData? icon;
  final ElderlyButtonVariant variant;
  final double height;
  final String? semanticLabel;

  const ElderlyButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon,
    this.variant = ElderlyButtonVariant.primary,
    this.height = AppDimensions.primaryButtonHeight,
    this.semanticLabel,
  });

  @override
  Widget build(BuildContext context) {
    Color bg;
    Color fg;
    Color border;

    switch (variant) {
      case ElderlyButtonVariant.primary:
        bg = AppColors.darkPrimary;
        fg = AppColors.darkOnPrimary;
        border = AppColors.darkBorder;
        break;
      case ElderlyButtonVariant.emerald:
        bg = AppColors.darkEmerald;
        fg = AppColors.darkOnEmerald;
        border = AppColors.darkBorder;
        break;
      case ElderlyButtonVariant.amber:
        bg = AppColors.darkAmber;
        fg = AppColors.darkOnAmber;
        border = AppColors.darkBorder;
        break;
      case ElderlyButtonVariant.surface:
        bg = AppColors.darkSurfaceElevated;
        fg = AppColors.darkTextPrimary;
        border = AppColors.darkBorder;
        break;
    }

    final buttonWidget = ElevatedButton(
      style: ElevatedButton.styleFrom(
        minimumSize: Size(double.infinity, height),
        backgroundColor: bg,
        foregroundColor: fg,
        padding: AppDimensions.buttonPadding,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppDimensions.radiusMedium),
          side: BorderSide(color: border, width: AppDimensions.borderWidth),
        ),
      ),
      onPressed: onPressed == null
          ? null
          : () {
              AccessibilityUtils.triggerHaptic();
              onPressed!();
            },
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          if (icon != null) ...[
            Icon(icon, size: AppDimensions.iconMedium, color: fg),
            const SizedBox(width: AppDimensions.spacingSmall),
          ],
          Flexible(
            child: Text(
              label,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: AppTypography.button,
                fontWeight: AppTypography.weightBold,
                color: fg,
                letterSpacing: AppTypography.letterSpacingRelaxed,
              ),
            ),
          ),
        ],
      ),
    );

    return AccessibilityUtils.wrapSemantics(
      label: semanticLabel ?? label,
      isButton: true,
      child: buttonWidget,
    );
  }
}
