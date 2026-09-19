/// Historical log entry recording when a reminder was acknowledged by the elder.
class ReminderLog {
  final int? id;
  final int reminderId;
  final int patientId;
  final DateTime scheduledAt;
  final DateTime? acknowledgedAt;
  final bool synced;

  const ReminderLog({
    this.id,
    required this.reminderId,
    required this.patientId,
    required this.scheduledAt,
    this.acknowledgedAt,
    this.synced = false,
  });

  bool get isCompleted => acknowledgedAt != null;

  ReminderLog copyWith({
    int? id,
    int? reminderId,
    int? patientId,
    DateTime? scheduledAt,
    DateTime? acknowledgedAt,
    bool? synced,
  }) {
    return ReminderLog(
      id: id ?? this.id,
      reminderId: reminderId ?? this.reminderId,
      patientId: patientId ?? this.patientId,
      scheduledAt: scheduledAt ?? this.scheduledAt,
      acknowledgedAt: acknowledgedAt ?? this.acknowledgedAt,
      synced: synced ?? this.synced,
    );
  }
}
