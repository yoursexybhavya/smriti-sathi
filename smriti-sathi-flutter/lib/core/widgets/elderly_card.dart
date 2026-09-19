import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../constants/app_dimensions.dart';
import '../utils/accessibility_utils.dart';

/// Reusable high-contrast card container with crisp 2px solid borders.
/// Anti-gradient, anti-blur, anti-infantilization design for elder dignity.
class ElderlyCard extends StatelessWidget {
  final Widget child;
  final VoidCallback? onTap;
  final Color? backgroundColor;
  final Color? borderColor;
  final double borderWidth;
  final EdgeInsetsGeometry padding;
  final EdgeInsetsGeometry margin;
  final String? semanticLabel;

  const ElderlyCard({
    super.key,
    required this.child,
    this.onTap,
    this.backgroundColor,
    this.borderColor,
    this.borderWidth = AppDimensions.borderWidth,
    this.padding = AppDimensions.cardPaddingAll,
    this.margin = const EdgeInsets.symmetric(vertical: AppDimensions.spacingXSmall),
    this.semanticLabel,
  });

  @override
  Widget build(BuildContext context) {
    final border = BorderSide(
      color: borderColor ?? AppColors.darkBorder,
      width: borderWidth,
    );

    Widget cardContent = Container(
      margin: margin,
      constraints: onTap != null
          ? const BoxConstraints(
              minWidth: AppDimensions.minTouchTarget,
              minHeight: AppDimensions.minTouchTarget,
            )
          : null,
      decoration: BoxDecoration(
        color: backgroundColor ?? AppColors.darkSurface,
        borderRadius: BorderRadius.circular(AppDimensions.radiusMedium),
        border: Border.fromBorderSide(border),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(AppDimensions.radiusMedium),
          onTap: onTap == null
              ? null
              : () {
                  AccessibilityUtils.triggerHaptic();
                  onTap!();
                },
          child: Padding(
            padding: padding,
            child: child,
          ),
        ),
      ),
    );

    if (semanticLabel != null) {
      cardContent = AccessibilityUtils.wrapSemantics(
        label: semanticLabel!,
        isButton: onTap != null,
        child: cardContent,
      );
    }

    return cardContent;
  }
}
