import '../core/utils/date_formatter.dart';

/// Medication, hydration, or activity reminder entity with audio cue support.
class Reminder {
  final int id;
  final int patientId;
  final String type; // medicine, water, activity, appointment
  final String label;
  final int timeHour;
  final int timeMinute;
  final List<int> repeatDays;
  final bool isActive;
  final DateTime? lastAcked;
  final String? audioPath;

  const Reminder({
    required this.id,
    required this.patientId,
    required this.type,
    required this.label,
    required this.timeHour,
    required this.timeMinute,
    required this.repeatDays,
    this.isActive = true,
    this.lastAcked,
    this.audioPath,
  });

  String get formattedTime => DateFormatter.formatTime(timeHour, timeMinute);

  bool get isAcknowledgedToday {
    if (lastAcked == null) return false;
    final now = DateTime.now();
    return lastAcked!.year == now.year &&
        lastAcked!.month == now.month &&
        lastAcked!.day == now.day;
  }

  Reminder copyWith({
    int? id,
    int? patientId,
    String? type,
    String? label,
    int? timeHour,
    int? timeMinute,
    List<int>? repeatDays,
    bool? isActive,
    DateTime? lastAcked,
    String? audioPath,
  }) {
    return Reminder(
      id: id ?? this.id,
      patientId: patientId ?? this.patientId,
      type: type ?? this.type,
      label: label ?? this.label,
      timeHour: timeHour ?? this.timeHour,
      timeMinute: timeMinute ?? this.timeMinute,
      repeatDays: repeatDays ?? this.repeatDays,
      isActive: isActive ?? this.isActive,
      lastAcked: lastAcked ?? this.lastAcked,
      audioPath: audioPath ?? this.audioPath,
    );
  }
}
