import '../../models/reminder.dart';

/// Abstract contract for reminder schedule operations.
abstract class ReminderRepository {
  Future<List<Reminder>> getReminders();
  Future<Reminder?> getNextUpcomingReminder();
  Future<void> acknowledgeReminder(int id);
  Future<void> addReminder(Reminder reminder);
}

/// In-memory pre-seeded reminder repository providing realistic daily routines.
class InMemoryReminderRepository implements ReminderRepository {
  static final InMemoryReminderRepository _instance =
      InMemoryReminderRepository._internal();
  factory InMemoryReminderRepository() => _instance;

  final List<Reminder> _reminders = [
    const Reminder(
      id: 1,
      patientId: 1,
      type: 'medicine',
      label: 'सुबह की बीपी की गोली (BP Medicine)',
      timeHour: 8,
      timeMinute: 30,
      repeatDays: [0, 1, 2, 3, 4, 5, 6],
      audioPath: 'caregiver_voice_bp.m4a',
    ),
    const Reminder(
      id: 2,
      patientId: 1,
      type: 'water',
      label: 'ताज़ा पानी पिएं (Glass of Water)',
      timeHour: 11,
      timeMinute: 0,
      repeatDays: [0, 1, 2, 3, 4, 5, 6],
    ),
    const Reminder(
      id: 3,
      patientId: 1,
      type: 'activity',
      label: 'दिमागी कसरत (Daily Brain Workout)',
      timeHour: 16,
      timeMinute: 0,
      repeatDays: [0, 1, 2, 3, 4, 5, 6],
    ),
    const Reminder(
      id: 4,
      patientId: 1,
      type: 'medicine',
      label: 'रात की दिल की गोली (Heart Medicine)',
      timeHour: 20,
      timeMinute: 30,
      repeatDays: [0, 1, 2, 3, 4, 5, 6],
    ),
  ];

  InMemoryReminderRepository._internal();

  @override
  Future<List<Reminder>> getReminders() async {
    return List.unmodifiable(_reminders);
  }

  @override
  Future<Reminder?> getNextUpcomingReminder() async {
    if (_reminders.isEmpty) return null;
    final now = DateTime.now();
    final currentMinutes = now.hour * 60 + now.minute;

    for (final reminder in _reminders) {
      final reminderMinutes = reminder.timeHour * 60 + reminder.timeMinute;
      if (reminderMinutes >= currentMinutes && !reminder.isAcknowledgedToday) {
        return reminder;
      }
    }
    // Fallback to first unacknowledged or first reminder
    return _reminders.firstWhere(
      (r) => !r.isAcknowledgedToday,
      orElse: () => _reminders.first,
    );
  }

  @override
  Future<void> acknowledgeReminder(int id) async {
    final index = _reminders.indexWhere((r) => r.id == id);
    if (index != -1) {
      final current = _reminders[index];
      _reminders[index] = current.copyWith(lastAcked: DateTime.now());
    }
  }

  @override
  Future<void> addReminder(Reminder reminder) async {
    _reminders.add(reminder);
  }
}
