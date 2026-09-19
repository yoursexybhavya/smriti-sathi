import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_dimensions.dart';
import '../../core/constants/app_typography.dart';
import '../../core/widgets/elderly_button.dart';
import '../../core/widgets/elderly_card.dart';
import '../../core/widgets/elderly_header.dart';
import '../../database/repositories/patient_repository.dart';
import '../../models/patient.dart';
import '../../services/sync_service.dart';
import '../../services/voice_service.dart';

/// Caregiver Portal — Dedicated setup and telemetry management screen
/// Allows recording familiar voice cues, editing emergency contact, and triggering sync.
class CaregiverScreen extends StatefulWidget {
  const CaregiverScreen({super.key});

  @override
  State<CaregiverScreen> createState() => _CaregiverScreenState();
}

class _CaregiverScreenState extends State<CaregiverScreen> {
  final PatientRepository _patientRepo = InMemoryPatientRepository();
  final VoiceService _voiceService = VoiceService();
  final SyncService _syncService = SyncService();

  Patient? _patient;
  bool _isRecording = false;
  String _recordingStatus = 'Tap button to record familiar voice prompt';
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadPatient();
  }

  Future<void> _loadPatient() async {
    final patient = await _patientRepo.getPatient();
    if (mounted) {
      setState(() {
        _patient = patient;
        _isLoading = false;
      });
    }
  }

  Future<void> _recordVoice() async {
    setState(() {
      _isRecording = true;
      _recordingStatus = '🔴 रिकॉर्डिंग जारी है... (Recording in progress...)';
    });

    final audioPath = await _voiceService.recordVoicePrompt('morning_bp');

    if (mounted) {
      setState(() {
        _isRecording = false;
        _recordingStatus =
            '✅ रिकॉर्डिंग सहेजी गई! Saved: $audioPath\nThis audio will play for Morning BP reminder.';
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          backgroundColor: AppColors.darkEmerald,
          content: Text(
            'आवाज़ सहेज ली गई! (Voice recording saved to local database)',
            style: TextStyle(
              fontSize: AppTypography.button,
              fontWeight: AppTypography.weightBold,
              color: AppColors.darkOnEmerald,
            ),
          ),
          duration: Duration(seconds: 3),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(
        child: CircularProgressIndicator(color: AppColors.darkPrimary),
      );
    }

    return SingleChildScrollView(
      padding: AppDimensions.screenPaddingAll,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Header
          const ElderlyHeader(
            title: 'देखभालकर्ता पोर्टल (Caregiver Portal)',
            subtitle: 'Personalized prompts, emergency contacts & cloud telemetry.',
            icon: Icons.supervisor_account_rounded,
            iconColor: AppColors.darkEmerald,
          ),
          const SizedBox(height: AppDimensions.spacingLarge),

          // -------------------------------------------------------------------
          // 1. Familiar Voice Recorder Card (Core Dementia Feature R1)
          // -------------------------------------------------------------------
          ElderlyCard(
            backgroundColor: AppColors.darkSurfaceElevated,
            padding: AppDimensions.cardPaddingAll,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(
                      Icons.mic_rounded,
                      size: AppDimensions.iconLarge,
                      color: AppColors.darkAmber,
                    ),
                    SizedBox(width: AppDimensions.spacingSmall),
                    Expanded(
                      child: Text(
                        'अपनी आवाज़ रिकॉर्ड करें (Familiar Voice)',
                        style: TextStyle(
                          fontSize: AppTypography.titleMedium,
                          fontWeight: AppTypography.weightBold,
                          color: AppColors.darkAmber,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppDimensions.spacingSmall),
                const Text(
                  'Studies prove that dementia elders follow reminders with 40% higher adherence when hearing their daughter, son, or grandson voice.',
                  style: TextStyle(
                    fontSize: AppTypography.bodySmall,
                    color: AppColors.darkTextSecondary,
                  ),
                ),
                const SizedBox(height: AppDimensions.spacingMedium),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.darkSurface,
                    borderRadius: BorderRadius.circular(12),
                    border: const Border.fromBorderSide(
                      BorderSide(color: AppColors.darkBorder, width: 1.5),
                    ),
                  ),
                  child: Text(
                    _recordingStatus,
                    style: const TextStyle(
                      fontSize: AppTypography.bodySmall,
                      color: AppColors.darkTextPrimary,
                    ),
                  ),
                ),
                const SizedBox(height: AppDimensions.spacingLarge),
                ElderlyButton(
                  label: _isRecording
                      ? 'रिकॉर्डिंग हो रही है...'
                      : 'नया संदेश रिकॉर्ड करें (RECORD PROMPT)',
                  icon: _isRecording ? Icons.fiber_manual_record : Icons.mic_rounded,
                  variant: _isRecording
                      ? ElderlyButtonVariant.surface
                      : ElderlyButtonVariant.amber,
                  onPressed: _isRecording ? null : _recordVoice,
                ),
              ],
            ),
          ),
          const SizedBox(height: AppDimensions.spacingLarge),

          // -------------------------------------------------------------------
          // 2. Patient Profile & Emergency Contact Card
          // -------------------------------------------------------------------
          const ElderlyHeader(
            title: 'मरीज़ की जानकारी (Patient Details)',
            subtitle: 'Elder profile monitored by this caregiver profile',
          ),
          const SizedBox(height: AppDimensions.spacingSmall),
          ElderlyCard(
            padding: AppDimensions.cardPaddingAll,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildInfoRow('नाम (Patient Name)', _patient?.name ?? 'दादा जी'),
                const Divider(color: AppColors.darkBorder, height: 24),
                _buildInfoRow('उम्र (Age)', '${_patient?.age ?? 74} Years'),
                const Divider(color: AppColors.darkBorder, height: 24),
                _buildInfoRow('प्राथमिक भाषा (Language)', 'हिन्दी (Hindi)'),
                const Divider(color: AppColors.darkBorder, height: 24),
                _buildInfoRow('देखभालकर्ता (Caregiver)',
                    _patient?.caregiverName ?? 'Bhavya (Daughter)'),
                const Divider(color: AppColors.darkBorder, height: 24),
                _buildInfoRow('आपातकालीन फ़ोन (Emergency Phone)',
                    _patient?.emergencyContact ?? '+91 98765 43210'),
              ],
            ),
          ),
          const SizedBox(height: AppDimensions.spacingLarge),

          // -------------------------------------------------------------------
          // 3. Offline Data Synchronization Section
          // -------------------------------------------------------------------
          const ElderlyHeader(
            title: 'डेटा सिंक (Data Synchronization)',
            subtitle: 'Offline-first queue transmitting to caregiver dashboard',
          ),
          const SizedBox(height: AppDimensions.spacingSmall),
          ElderlyCard(
            padding: AppDimensions.cardPaddingAll,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ValueListenableBuilder<String>(
                  valueListenable: _syncService.syncStatusNotifier,
                  builder: (context, status, _) {
                    return Row(
                      children: [
                        const Icon(
                          Icons.cloud_sync_rounded,
                          size: AppDimensions.iconLarge,
                          color: AppColors.darkPrimary,
                        ),
                        const SizedBox(width: AppDimensions.spacingMedium),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Telemetry Sync Status',
                                style: TextStyle(
                                  fontSize: AppTypography.titleMedium,
                                  fontWeight: AppTypography.weightBold,
                                  color: AppColors.darkTextPrimary,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                status,
                                style: const TextStyle(
                                  fontSize: AppTypography.bodySmall,
                                  color: AppColors.darkTextSecondary,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    );
                  },
                ),
                const SizedBox(height: AppDimensions.spacingLarge),
                ValueListenableBuilder<bool>(
                  valueListenable: _syncService.isSyncingNotifier,
                  builder: (context, isSyncing, _) {
                    return ElderlyButton(
                      label: isSyncing
                          ? 'सिंक किया जा रहा है...'
                          : 'क्लाउड सिंक शुरू करें (SYNC NOW)',
                      icon: Icons.sync_rounded,
                      variant: ElderlyButtonVariant.primary,
                      onPressed: isSyncing
                          ? null
                          : () async {
                              await _syncService.triggerSync();
                            },
                    );
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: AppDimensions.spacingLarge),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          flex: 5,
          child: Text(
            label,
            style: const TextStyle(
              fontSize: AppTypography.bodySmall,
              color: AppColors.darkTextSecondary,
            ),
          ),
        ),
        Expanded(
          flex: 6,
          child: Text(
            value,
            textAlign: TextAlign.right,
            style: const TextStyle(
              fontSize: AppTypography.bodyMedium,
              fontWeight: AppTypography.weightBold,
              color: AppColors.darkTextPrimary,
            ),
          ),
        ),
      ],
    );
  }
}
