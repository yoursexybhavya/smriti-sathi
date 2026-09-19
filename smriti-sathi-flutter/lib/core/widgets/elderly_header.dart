import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../constants/app_dimensions.dart';
import '../constants/app_typography.dart';
import '../utils/accessibility_utils.dart';

/// Reusable high-visibility screen header with optional icon and dual-language text.
class ElderlyHeader extends StatelessWidget {
  final String title;
  final String? subtitle;
  final IconData? icon;
  final Color? iconColor;

  const ElderlyHeader({
    super.key,
    required this.title,
    this.subtitle,
    this.icon,
    this.iconColor,
  });

  @override
  Widget build(BuildContext context) {
    return AccessibilityUtils.wrapSemantics(
      label: subtitle != null ? '$title. $subtitle' : title,
      isButton: false,
      isHeader: true,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              if (icon != null) ...[
                Icon(
                  icon,
                  size: AppDimensions.iconLarge,
                  color: iconColor ?? AppColors.darkPrimary,
                ),
                const SizedBox(width: AppDimensions.spacingSmall),
              ],
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(
                    fontSize: AppTypography.headlineLarge,
                    fontWeight: AppTypography.weightHeavy,
                    color: AppColors.darkTextPrimary,
                    height: AppTypography.lineHeightTight,
                  ),
                ),
              ),
            ],
          ),
          if (subtitle != null) ...[
            const SizedBox(height: AppDimensions.spacingXSmall),
            Text(
              subtitle!,
              style: const TextStyle(
                fontSize: AppTypography.bodyMedium,
                fontWeight: AppTypography.weightMedium,
                color: AppColors.darkTextSecondary,
                height: AppTypography.lineHeightComfort,
              ),
            ),
          ],
        ],
      ),
    );
  }
}
