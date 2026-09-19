import 'package:flutter/foundation.dart';

/// Offline-first connectivity manager for rural and intermittent network conditions.
class ConnectivityService {
  static final ConnectivityService _instance = ConnectivityService._internal();
  factory ConnectivityService() => _instance;

  ConnectivityService._internal();

  /// Defaulting to offline-first mode to guarantee all functionality works without connectivity.
  final ValueNotifier<bool> isOnlineNotifier = ValueNotifier<bool>(false);

  bool get isOnline => isOnlineNotifier.value;

  void setOnlineStatus(bool online) {
    isOnlineNotifier.value = online;
  }

  void toggleStatus() {
    isOnlineNotifier.value = !isOnlineNotifier.value;
  }
}
