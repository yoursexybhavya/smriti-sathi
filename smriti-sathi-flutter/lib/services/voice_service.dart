import 'package:flutter/foundation.dart';

/// Audio service managing familiar caregiver voice cues and playback state.
/// Research indicates familiar voices increase reminder adherence by up to 40% in dementia elders.
class VoiceService {
  static final VoiceService _instance = VoiceService._internal();
  factory VoiceService() => _instance;

  VoiceService._internal();

  final ValueNotifier<bool> isPlayingNotifier = ValueNotifier<bool>(false);
  final ValueNotifier<String?> currentPlayingAudioNotifier =
      ValueNotifier<String?>(null);

  bool get isPlaying => isPlayingNotifier.value;

  /// Plays familiar voice reminder cue or simulated read-aloud prompt.
  Future<void> playReminderVoice(String reminderLabel,
      {String? audioPath}) async {
    isPlayingNotifier.value = true;
    currentPlayingAudioNotifier.value = audioPath ?? reminderLabel;

    // Simulates natural audio playback duration
    await Future.delayed(const Duration(milliseconds: 1500));

    isPlayingNotifier.value = false;
    currentPlayingAudioNotifier.value = null;
  }

  /// Stops current voice cue playback.
  void stopPlayback() {
    isPlayingNotifier.value = false;
    currentPlayingAudioNotifier.value = null;
  }

  /// Simulates recording a caregiver voice prompt for a reminder.
  Future<String> recordVoicePrompt(String reminderKey) async {
    // In production, records via platform microphone API
    await Future.delayed(const Duration(milliseconds: 800));
    return 'caregiver_${reminderKey}_${DateTime.now().millisecondsSinceEpoch}.m4a';
  }
}
