import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, RotateCcw, Home, Award } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePatient } from '../contexts/PatientContext';
import { useAdaptiveDifficulty } from '../hooks/useAdaptiveDifficulty';
import { useVoice } from '../hooks/useVoice';
import {
  createGame,
  flipCard,
  checkMatch,
  getResult,
  findMatchIndex,
  type MemoryMatchState,
} from '../games/memoryMatch';

export function MemoryMatch() {
  const { t } = useLanguage();
  const { patient, refreshStats } = usePatient();
  const navigate = useNavigate();
  const { speak, playSuccessChime, playCardFlip } = useVoice();

  const { currentLevel, saveGameAndAdjust, isLoading: isDiffLoading } = useAdaptiveDifficulty(
    patient?.id,
    'memoryMatch'
  );

  const [gameState, setGameState] = useState<MemoryMatchState | null>(null);
  const [hasSaved, setHasSaved] = useState(false);
  const checkTimerRef = useRef<number | null>(null);

  const startNewGame = useCallback((level: number) => {
    if (checkTimerRef.current) {
      clearTimeout(checkTimerRef.current);
      checkTimerRef.current = null;
    }
    const newGame = createGame(level);
    setGameState(newGame);
    setHasSaved(false);
  }, []);

  useEffect(() => {
    if (!isDiffLoading && !gameState) {
      startNewGame(currentLevel || 1);
    }
  }, [isDiffLoading, currentLevel, gameState, startNewGame]);

  useEffect(() => {
    if (gameState && !gameState.isComplete && gameState.attempts === 0) {
      speak(`${t.findThePairs}. Speed Match Level ${gameState.level}`);
    }
  }, [gameState?.level]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCardClick = (index: number) => {
    if (!gameState || gameState.isChecking || gameState.isComplete) return;

    playCardFlip();
    const updated = flipCard(gameState, index);
    setGameState(updated);

    if (updated.isChecking) {
      checkTimerRef.current = window.setTimeout(() => {
        setGameState((prev) => {
          if (!prev) return prev;
          const evaluated = checkMatch(prev);

          if (evaluated.matchesFound > prev.matchesFound) {
            playSuccessChime();
          }

          if (evaluated.isComplete && !hasSaved) {
            const result = getResult(evaluated);
            const score = Math.max(10, Math.round(result.accuracy * 100));
            saveGameAndAdjust(result.accuracy, score, result.timeMs).then(() => refreshStats());
            setHasSaved(true);
            speak(`${t.wellDone}! Workout complete.`);
          }

          return evaluated;
        });
      }, updated.config.revealTimeMs);
    }
  };

  if (!gameState) {
    return (
      <div className="page" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#38BDF8', fontSize: '18px' }}>Loading Speed Match...</p>
      </div>
    );
  }

  const hintIndex =
    gameState.config.showHints && gameState.firstFlipped !== null && !gameState.isChecking
      ? findMatchIndex(gameState, gameState.firstFlipped)
      : null;

  const gridCols = gameState.config.cols;

  return (
    <div className="page" style={{ padding: '12px 16px 32px 16px', gap: '16px' }}>
      {/* Top Game Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => navigate('/games')}
          style={{
            background: '#15253B',
            border: '1px solid #223752',
            borderRadius: 'var(--radius-pill)',
            padding: '8px 16px',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 700,
          }}
        >
          <ArrowLeft size={18} />
          <span>Exit</span>
        </button>

        {/* Level Tag */}
        <div
          style={{
            backgroundColor: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            borderRadius: 'var(--radius-pill)',
            padding: '6px 16px',
            fontSize: '13px',
            fontWeight: 800,
            color: '#38BDF8',
            letterSpacing: '0.5px',
          }}
        >
          LEVEL {gameState.level}
        </div>

        {/* Voice Audio Prompt */}
        <button
          onClick={() => speak(`${t.findThePairs}. Speed Match Level ${gameState.level}`)}
          style={{
            background: '#15253B',
            border: '1px solid #223752',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            cursor: 'pointer',
          }}
          title="Voice prompt"
        >
          <Volume2 size={20} />
        </button>
      </div>

      {/* Score / Status HUD Card */}
      <div
        className="lumos-card"
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '14px 20px',
          border: '1px solid #223752',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#647B99', letterSpacing: '0.5px' }}>
            PAIRS MATCHED
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#10B981', marginTop: '2px' }}>
            {gameState.matchesFound} / {gameState.totalPairs}
          </div>
        </div>

        <div style={{ width: '1px', height: '32px', backgroundColor: '#1E344F' }} />

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#647B99', letterSpacing: '0.5px' }}>
            TOTAL ATTEMPTS
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
            {gameState.attempts}
          </div>
        </div>
      </div>

      {/* Lumosity Speed Match Card Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
          gap: '12px',
          margin: '8px 0',
        }}
      >
        {gameState.cards.map((card, index) => {
          const isHinted = hintIndex === index;
          const isFlippedOrMatched = card.isFlipped || card.isMatched;

          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(index)}
              disabled={isFlippedOrMatched || gameState.isChecking}
              style={{
                aspectRatio: '1 / 1',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: gridCols > 3 ? '42px' : '56px',
                backgroundColor: isFlippedOrMatched
                  ? card.isMatched
                    ? '#064E3B'
                    : '#1E334D'
                  : '#15253B',
                border: card.isMatched
                  ? '3px solid #10B981'
                  : isHinted
                  ? '3px dashed #F59E0B'
                  : '2px solid #223752',
                boxShadow: isHinted
                  ? '0 0 16px rgba(245, 158, 11, 0.45)'
                  : card.isMatched
                  ? '0 0 16px rgba(16, 185, 129, 0.3)'
                  : 'var(--shadow-card)',
                transform: isFlippedOrMatched ? 'scale(1)' : 'scale(0.97)',
                transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: isFlippedOrMatched ? 'default' : 'pointer',
              }}
              aria-label={isFlippedOrMatched ? 'Revealed card' : 'Hidden card'}
            >
              {isFlippedOrMatched ? (
                <span>{card.emoji}</span>
              ) : (
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '2px solid #2A4466',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#38BDF8',
                    fontSize: '18px',
                  }}
                >
                  ✦
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Completion Modal */}
      {gameState.isComplete && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(10, 20, 32, 0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            className="lumos-card"
            style={{
              padding: '28px 24px',
              maxWidth: '440px',
              width: '100%',
              textAlign: 'center',
              border: '2px solid #10B981',
              boxShadow: '0 0 40px rgba(16, 185, 129, 0.3)',
              background: 'linear-gradient(180deg, #172A43 0%, #101F33 100%)',
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                border: '2px solid #10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
              }}
            >
              <Award size={38} color="#34D399" />
            </div>

            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: '#FFFFFF', marginBottom: '4px' }}>
              Workout Complete!
            </h2>
            <p style={{ fontSize: 'var(--font-size-sm)', color: '#94A9C4', marginBottom: '20px' }}>
              Speed Match &bull; Working Memory Stimulation
            </p>

            <div
              style={{
                backgroundColor: '#0F1D2F',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                marginBottom: '24px',
                border: '1px solid #1E344F',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', color: '#94A9C4' }}>Level Played</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>Level {gameState.level}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', color: '#94A9C4' }}>Total Attempts</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>{gameState.attempts}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', color: '#94A9C4' }}>Telemetry Status</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#34D399' }}>✓ Saved & Logged</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                className="btn-primary-lumos"
                onClick={() => startNewGame(currentLevel)}
              >
                <RotateCcw size={18} />
                <span>Play Again</span>
              </button>
              <button
                className="btn-secondary-lumos"
                onClick={() => navigate('/games')}
              >
                <Home size={18} />
                <span>Back to Games Hub</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
