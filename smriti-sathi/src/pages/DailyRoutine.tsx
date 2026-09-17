import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, RotateCcw, Home, CalendarCheck, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePatient } from '../contexts/PatientContext';
import { useAdaptiveDifficulty } from '../hooks/useAdaptiveDifficulty';
import { useVoice } from '../hooks/useVoice';
import { useInactivityScaffold } from '../hooks/useInactivityScaffold';
import {
  createGame,
  selectCard,
  placeCard,
  getResult,
  type DailyRoutineState,
} from '../games/dailyRoutine';

export function DailyRoutine() {
  const { t } = useLanguage();
  const { patient, refreshStats } = usePatient();
  const navigate = useNavigate();
  const { speak, playSuccessChime, playCardFlip } = useVoice();

  const { currentLevel, saveGameAndAdjust, isLoading: isDiffLoading } = useAdaptiveDifficulty(
    patient?.id,
    'dailyRoutine'
  );

  const [gameState, setGameState] = useState<DailyRoutineState | null>(null);
  const [showHints, setShowHints] = useState(true);
  const [hasSaved, setHasSaved] = useState(false);
  const { showScaffold, resetInactivity } = useInactivityScaffold(3000);

  const getActivityLabel = (key: string): string => {
    return (t as unknown as Record<string, string>)[key] || key;
  };

  const startNewGame = useCallback((level: number) => {
    const newGame = createGame(level);
    setGameState(newGame);
    setShowHints(true);
    setHasSaved(false);
    resetInactivity();

    if (newGame.config.hintDurationMs > 0) {
      setTimeout(() => {
        setShowHints(false);
      }, newGame.config.hintDurationMs);
    }
  }, [resetInactivity]);

  useEffect(() => {
    if (!isDiffLoading && !gameState) {
      startNewGame(currentLevel || 1);
    }
  }, [isDiffLoading, currentLevel, gameState, startNewGame]);

  useEffect(() => {
    if (gameState && !gameState.isComplete && gameState.attempts === 0) {
      speak(`${t.orderYourDay}. Masterpiece Sequencing Level ${gameState.level}`);
    }
  }, [gameState?.level]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectCard = (index: number) => {
    if (!gameState || gameState.isComplete) return;
    playCardFlip();
    resetInactivity();
    setGameState((prev) => (prev ? selectCard(prev, index) : null));
  };

  const handleSlotClick = (slotIndex: number) => {
    if (!gameState || gameState.selectedCardIndex === null || gameState.isComplete) return;

    // Errorless learning: prevent invalid placement in slots
    const card = gameState.shuffledCards[gameState.selectedCardIndex];
    if (!card || card.order !== slotIndex) return;

    resetInactivity();
    const updated = placeCard(gameState, slotIndex);
    setGameState(updated);

    if (updated.lastPlacementCorrect) {
      playSuccessChime();

      if (updated.isComplete && !hasSaved) {
        const result = getResult(updated);
        const score = Math.max(10, Math.round(result.accuracy * 100));
        saveGameAndAdjust(result.accuracy, score, result.timeMs).then(() => refreshStats());
        setHasSaved(true);

        const labels = updated.placedCards.map((c) => (c ? getActivityLabel(c.label) : ''));
        speak(`${t.greatJob}! ${t.correctOrder}. ${labels.join(', ')}.`);
      }
    }
  };

  if (!gameState) {
    return (
      <div className="page" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#60A5FA', fontSize: '18px' }}>Loading Daily Routine...</p>
      </div>
    );
  }

  const selectedCard =
    gameState.selectedCardIndex !== null ? gameState.shuffledCards[gameState.selectedCardIndex] : null;

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

        <div
          style={{
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.35)',
            borderRadius: 'var(--radius-pill)',
            padding: '6px 16px',
            fontSize: '13px',
            fontWeight: 800,
            color: '#60A5FA',
            letterSpacing: '0.5px',
          }}
        >
          LEVEL {gameState.level}
        </div>

        <button
          onClick={() => speak(`${t.putInOrder}. Sequencing Level ${gameState.level}`)}
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

      {/* Instruction Banner */}
      <div
        className="lumos-card"
        style={{
          padding: '16px',
          textAlign: 'center',
          border: '1px solid #223752',
        }}
      >
        <h2 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: '#FFFFFF' }}>
          {t.putInOrder}
        </h2>
        <p style={{ fontSize: '13px', color: '#94A9C4', marginTop: '4px' }}>
          {selectedCard
            ? `👉 Tap an open slot below to place "${getActivityLabel(selectedCard.label)}"`
            : '👉 Tap a card below from the tray, then place it in timeline order'}
        </p>
      </div>

      {/* Target Timeline Slots */}
      <div>
        <div style={{ fontSize: '12px', fontWeight: 800, color: '#647B99', letterSpacing: '0.8px', marginBottom: '8px', textTransform: 'uppercase' }}>
          TIMELINE SLOTS
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {gameState.placedCards.map((placed, slotIdx) => {
            const isFilled = placed !== null;
            const slotNumberHint =
              gameState.config.showSlotNumbers || showHints ? `#${slotIdx + 1}` : '';
            const isCorrectSlot = selectedCard !== null && slotIdx === selectedCard.order;
            const shouldPulseSlot = isCorrectSlot && showScaffold;

            return (
              <button
                key={slotIdx}
                onClick={() => handleSlotClick(slotIdx)}
                disabled={isFilled || !isCorrectSlot}
                className={shouldPulseSlot ? 'scaffold-pulse-active' : ''}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isFilled
                    ? '#0F3025'
                    : isCorrectSlot
                    ? '#1C314E'
                    : '#15253B',
                  border: isFilled
                    ? '2px solid #10B981'
                    : shouldPulseSlot
                    ? '2px solid #10B981'
                    : isCorrectSlot
                    ? '2px dashed #FF7247'
                    : '1px solid #223752',
                  minHeight: '68px',
                  width: '100%',
                  cursor: isFilled ? 'default' : isCorrectSlot ? 'pointer' : 'not-allowed',
                  pointerEvents: isFilled ? 'none' : isCorrectSlot ? 'auto' : 'none',
                  opacity: isFilled ? 1 : selectedCard ? (isCorrectSlot ? 1 : 0.35) : 1,
                  textAlign: 'left',
                  transition: 'all 0.18s ease',
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: isFilled ? '#10B981' : '#223752',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '15px',
                    flexShrink: 0,
                  }}
                >
                  {isFilled ? <Check size={20} strokeWidth={3} /> : slotIdx + 1}
                </div>

                {isFilled ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '32px' }}>{placed.emoji}</span>
                    <span style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: '#FFFFFF' }}>
                      {getActivityLabel(placed.label)}
                    </span>
                  </div>
                ) : (
                  <span style={{ fontSize: 'var(--font-size-sm)', color: '#647B99' }}>
                    {selectedCard ? (isCorrectSlot ? `Place here (${slotNumberHint})` : `Slot ${slotIdx + 1}`) : `Empty Slot ${slotIdx + 1}`}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Available Cards Tray */}
      {!gameState.isComplete && (
        <div>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#647B99', letterSpacing: '0.8px', marginBottom: '8px', textTransform: 'uppercase' }}>
            CARDS TO ORDER
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '10px',
            }}
          >
            {(() => {
              const firstEmptySlot = gameState.placedCards.findIndex((p) => p === null);

              return gameState.shuffledCards.map((card, idx) => {
                const isPlaced = gameState.placedCards.some((p) => p?.id === card.id);
                const isSelected = gameState.selectedCardIndex === idx;

                if (isPlaced) return null;

                const isNextCard = card.order === firstEmptySlot;
                const shouldPulseCard = selectedCard === null && showScaffold && isNextCard;

                return (
                  <button
                    key={card.id}
                    onClick={() => handleSelectCard(idx)}
                    className={shouldPulseCard ? 'scaffold-pulse-active' : ''}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '14px 10px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isSelected ? '#253E5C' : '#15253B',
                      border: isSelected
                        ? '2px solid #FF7247'
                        : shouldPulseCard
                        ? '2px solid #10B981'
                        : '1px solid #223752',
                      boxShadow: isSelected
                        ? '0 0 16px rgba(255, 114, 71, 0.4)'
                        : shouldPulseCard
                        ? '0 0 20px rgba(16, 185, 129, 0.4)'
                        : 'var(--shadow-card)',
                      cursor: 'pointer',
                      minHeight: '88px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ fontSize: '36px' }}>{card.emoji}</span>
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        textAlign: 'center',
                        color: '#FFFFFF',
                      }}
                    >
                      {getActivityLabel(card.label)}
                    </span>
                  </button>
                );
              });
            })()}
          </div>
        </div>
      )}

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
              border: '2px solid #3B82F6',
              boxShadow: '0 0 40px rgba(59, 130, 246, 0.3)',
              background: 'linear-gradient(180deg, #172A43 0%, #101F33 100%)',
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                border: '2px solid #3B82F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
              }}
            >
              <CalendarCheck size={38} color="#60A5FA" />
            </div>

            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: '#FFFFFF', marginBottom: '4px' }}>
              Masterpiece Complete!
            </h2>
            <p style={{ fontSize: 'var(--font-size-sm)', color: '#94A9C4', marginBottom: '20px' }}>
              Daily Routine Sequencing &bull; Chronological Orientation
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
                <span style={{ fontSize: '14px', color: '#94A9C4' }}>Attempts</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>{gameState.attempts}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', color: '#94A9C4' }}>Sequence Status</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#60A5FA' }}>✓ Correctly Ordered</span>
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
