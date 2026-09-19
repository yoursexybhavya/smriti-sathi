import '../../models/cognitive_domain.dart';
import '../../models/game_session.dart';

/// Abstract contract for recording and querying cognitive therapy game sessions.
abstract class GameSessionRepository {
  Future<List<GameSession>> getRecentSessions();
  Future<void> recordSession(GameSession session);
  Future<int> getCurrentStreakDays();
  Future<double> getAverageAccuracy();
}

/// In-memory pre-seeded repository for cognitive telemetry.
class InMemoryGameSessionRepository implements GameSessionRepository {
  static final InMemoryGameSessionRepository _instance =
      InMemoryGameSessionRepository._internal();
  factory InMemoryGameSessionRepository() => _instance;

  final List<GameSession> _sessions = [
    GameSession(
      id: 1,
      patientId: 1,
      gameType: 'memoryMatch',
      domain: CognitiveDomain.workingMemory,
      difficulty: 1,
      score: 95,
      accuracy: 1.0,
      responseTimeMs: 1450,
      playedAt: DateTime.now().subtract(const Duration(hours: 3)),
    ),
    GameSession(
      id: 2,
      patientId: 1,
      gameType: 'dailyRoutine',
      domain: CognitiveDomain.temporalOrientation,
      difficulty: 1,
      score: 90,
      accuracy: 0.92,
      responseTimeMs: 1800,
      playedAt: DateTime.now().subtract(const Duration(days: 1)),
    ),
    GameSession(
      id: 3,
      patientId: 1,
      gameType: 'gentleMath',
      domain: CognitiveDomain.processingSpeed,
      difficulty: 1,
      score: 88,
      accuracy: 0.88,
      responseTimeMs: 2100,
      playedAt: DateTime.now().subtract(const Duration(days: 2)),
    ),
    GameSession(
      id: 4,
      patientId: 1,
      gameType: 'wordRecall',
      domain: CognitiveDomain.attentionFocus,
      difficulty: 1,
      score: 92,
      accuracy: 0.95,
      responseTimeMs: 1600,
      playedAt: DateTime.now().subtract(const Duration(days: 3)),
    ),
  ];

  InMemoryGameSessionRepository._internal();

  @override
  Future<List<GameSession>> getRecentSessions() async {
    return List.unmodifiable(_sessions);
  }

  @override
  Future<void> recordSession(GameSession session) async {
    _sessions.add(session);
  }

  @override
  Future<int> getCurrentStreakDays() async {
    return 5; // 5-day continuous streak
  }

  @override
  Future<double> getAverageAccuracy() async {
    if (_sessions.isEmpty) return 1.0;
    final total = _sessions.fold(0.0, (sum, s) => sum + s.accuracy);
    return total / _sessions.length;
  }
}
