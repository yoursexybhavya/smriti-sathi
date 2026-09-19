import 'cognitive_domain.dart';

/// Cognitive exercise session telemetry model.
class GameSession {
  final int? id;
  final int patientId;
  final String gameType;
  final CognitiveDomain domain;
  final int difficulty;
  final int score;
  final double accuracy;
  final int responseTimeMs;
  final DateTime playedAt;
  final bool synced;

  const GameSession({
    this.id,
    required this.patientId,
    required this.gameType,
    required this.domain,
    required this.difficulty,
    required this.score,
    required this.accuracy,
    required this.responseTimeMs,
    required this.playedAt,
    this.synced = false,
  });

  GameSession copyWith({
    int? id,
    int? patientId,
    String? gameType,
    CognitiveDomain? domain,
    int? difficulty,
    int? score,
    double? accuracy,
    int? responseTimeMs,
    DateTime? playedAt,
    bool? synced,
  }) {
    return GameSession(
      id: id ?? this.id,
      patientId: patientId ?? this.patientId,
      gameType: gameType ?? this.gameType,
      domain: domain ?? this.domain,
      difficulty: difficulty ?? this.difficulty,
      score: score ?? this.score,
      accuracy: accuracy ?? this.accuracy,
      responseTimeMs: responseTimeMs ?? this.responseTimeMs,
      playedAt: playedAt ?? this.playedAt,
      synced: synced ?? this.synced,
    );
  }
}
