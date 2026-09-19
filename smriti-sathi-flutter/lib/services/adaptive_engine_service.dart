import 'dart:async';
import 'dart:math';
import '../models/game_session.dart';

/// Clinical Adaptive Engine for cognitive therapy difficulty calibration
/// and 3-second Errorless Learning visual scaffolding.
class AdaptiveEngineService {
  static final AdaptiveEngineService _instance =
      AdaptiveEngineService._internal();
  factory AdaptiveEngineService() => _instance;

  AdaptiveEngineService._internal();

  Timer? _scaffoldingTimer;
  final StreamController<bool> _scaffoldingStreamController =
      StreamController<bool>.broadcast();

  /// Stream emitting true when 3-second inactivity scaffolding is triggered.
  Stream<bool> get scaffoldingStream => _scaffoldingStreamController.stream;

  /// Calculates the Standardized Performance Index (SPI) from recent sessions.
  double calculateSPI(List<GameSession> sessions) {
    if (sessions.isEmpty) return 75.0;
    final totalAccuracy = sessions.fold(0.0, (sum, s) => sum + s.accuracy);
    return (totalAccuracy / sessions.length) * 100;
  }

  /// Calculates next exercise difficulty based on SPI without frustrating spikes.
  int getNextDifficulty(double spi) {
    if (spi >= 85.0) return min(4, 3);
    if (spi >= 60.0) return 2;
    return 1;
  }

  /// Starts the 3-second Errorless Learning inactivity countdown.
  void startInactivityTimer({void Function()? onScaffold}) {
    cancelInactivityTimer();
    _scaffoldingTimer = Timer(const Duration(seconds: 3), () {
      _scaffoldingStreamController.add(true);
      onScaffold?.call();
    });
  }

  /// Resets or cancels the inactivity timer when the user interacts.
  void cancelInactivityTimer() {
    _scaffoldingTimer?.cancel();
    _scaffoldingTimer = null;
    _scaffoldingStreamController.add(false);
  }

  /// Manually triggers scaffolding hint.
  void triggerScaffoldingHint() {
    _scaffoldingStreamController.add(true);
  }
}
