import 'package:flutter/foundation.dart';

/// Service managing offline queuing and opportunistic background synchronization
/// of telemetry and reminder logs to caregiver cloud endpoints.
class SyncService {
  static final SyncService _instance = SyncService._internal();
  factory SyncService() => _instance;

  SyncService._internal();

  final ValueNotifier<String> syncStatusNotifier =
      ValueNotifier<String>('सुरक्षित स्थानीय डेटा (Saved locally - Offline First)');
  final ValueNotifier<bool> isSyncingNotifier = ValueNotifier<bool>(false);
  final ValueNotifier<int> pendingRecordsNotifier = ValueNotifier<int>(4);

  String get syncStatus => syncStatusNotifier.value;
  bool get isSyncing => isSyncingNotifier.value;
  int get pendingRecords => pendingRecordsNotifier.value;

  /// Simulates opportunistic synchronization when connectivity is available.
  Future<void> triggerSync() async {
    isSyncingNotifier.value = true;
    syncStatusNotifier.value = 'सिंक हो रहा है... (Syncing to Caregiver Cloud...)';

    await Future.delayed(const Duration(milliseconds: 1200));

    pendingRecordsNotifier.value = 0;
    isSyncingNotifier.value = false;
    syncStatusNotifier.value = 'सभी रिकॉर्ड सिंक हो गए (All records synced successfully)';
  }
}
