import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, RotateCcw, Home, Award, Calculator } from 'lucide-react';
import { useVoice } from '../hooks/useVoice';
import { db } from '../db/database';

interface MathQuestion {
  id: number;
  prompt: string;
  items: { emoji: string; name: string; cost: number }[];
  correctAnswer: number;
  options: number[];
}

const MATH_QUESTIONS: MathQuestion[] = [
  {
    id: 1,
    prompt: 'Buying morning tea and biscuits at the local stall:',
    items: [
      { emoji: '☕', name: 'Assam Chai', cost: 15 },
      { emoji: '🍪', name: 'Biscuits', cost: 10 },
    ],
    correctAnswer: 25,
    options: [20, 25, 30],
  },
  {
    id: 2,
    prompt: 'Purchasing fresh seasonal fruits from the market:',
    items: [
      { emoji: '🍌', name: 'Bananas', cost: 30 },
      { emoji: '🍎', name: 'Apples', cost: 40 },
    ],
    correctAnswer: 70,
    options: [60, 70, 80],
  },
  {
    id: 3,
    prompt: 'Grocery essentials for evening dinner:',
    items: [
      { emoji: '🍚', name: 'Rice packet', cost: 50 },
      { emoji: '🥬', name: 'Fresh Greens', cost: 20 },
    ],
    correctAnswer: 70,
    options: [65, 70, 75],
  },
];

export function MathWorkout() {
  const navigate = useNavigate();
  const { speak, playSuccessChime, playCardFlip } = useVoice();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const question = MATH_QUESTIONS[currentIndex];

  useEffect(() => {
    if (question && !isComplete) {
      const totalText = question.items.map((it) => `${it.name} ${it.cost} rupees`).join(' and ');
      speak(`${question.prompt}. ${totalText}. What is the total?`);
    }
  }, [currentIndex, isComplete]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOptionSelect = (opt: number) => {
    if (selectedOption !== null || isComplete) return;

    playCardFlip();
    setSelectedOption(opt);

    if (opt === question.correctAnswer) {
      playSuccessChime();
      setIsCorrect(true);
      setScore((prev) => prev + 1);
      speak('Correct! Wonderful calculation.');

      setTimeout(() => {
        if (currentIndex < MATH_QUESTIONS.length - 1) {
          setCurrentIndex((prev) => prev + 1);
          setSelectedOption(null);
          setIsCorrect(null);
        } else {
          setIsComplete(true);
          db.gameSessions.add({
            patientId: 1,
            gameType: 'dailyRoutine',
            difficulty: 1,
            score: 100,
            accuracy: 1.0,
            responseTimeMs: 3500,
            playedAt: new Date(),
            synced: 0,
          });
          speak('Workout complete! You did great on everyday market calculations.');
        }
      }, 1500);
    } else {
      setIsCorrect(false);
      speak('Almost there! Take your time.');
      setTimeout(() => {
        setSelectedOption(null);
        setIsCorrect(null);
      }, 1400);
    }
  };

  return (
    <div className="page" style={{ padding: '12px 16px 32px 16px', gap: '16px' }}>
      {/* Top Bar */}
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
            backgroundColor: 'rgba(219, 39, 119, 0.15)',
            border: '1px solid rgba(219, 39, 119, 0.35)',
            borderRadius: 'var(--radius-pill)',
            padding: '6px 16px',
            fontSize: '13px',
            fontWeight: 800,
            color: '#F472B6',
            letterSpacing: '0.5px',
          }}
        >
          QUESTION {currentIndex + 1} OF {MATH_QUESTIONS.length}
        </div>

        <button
          onClick={() => {
            const totalText = question.items.map((it) => `${it.name} ${it.cost} rupees`).join(' and ');
            speak(`${question.prompt}. ${totalText}. What is the total?`);
          }}
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

      {/* Main Question Card */}
      <div
        className="lumos-card"
        style={{
          padding: '24px 20px',
          textAlign: 'center',
          border: '1px solid #284469',
          background: 'linear-gradient(180deg, #172B45 0%, #112134 100%)',
        }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#DB2777',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto',
            boxShadow: '0 4px 16px rgba(219, 39, 119, 0.3)',
          }}
        >
          <Calculator size={30} color="#FFFFFF" />
        </div>

        <h2 style={{ fontSize: 'var(--font-size-base)', fontWeight: 800, color: '#FFFFFF', marginBottom: '4px' }}>
          Market & Currency Estimation
        </h2>
        <p style={{ fontSize: 'var(--font-size-xs)', color: '#94A9C4', marginBottom: '18px' }}>
          {question.prompt}
        </p>

        {/* Item bill receipt */}
        <div
          style={{
            backgroundColor: '#0F1D2F',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            border: '1px solid #1E344F',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginBottom: '20px',
          }}
        >
          {question.items.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '6px 8px',
                borderBottom: idx < question.items.length - 1 ? '1px dashed #1E344F' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>{item.emoji}</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>{item.name}</span>
              </div>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#F472B6' }}>₹{item.cost}</span>
            </div>
          ))}
        </div>

        <div style={{ fontSize: '14px', fontWeight: 800, color: '#647B99', marginBottom: '10px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
          SELECT TOTAL AMOUNT:
        </div>

        {/* Option Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {question.options.map((opt) => {
            const isSelected = selectedOption === opt;
            const isThisCorrect = isSelected && isCorrect === true;
            const isThisWrong = isSelected && isCorrect === false;

            return (
              <button
                key={opt}
                onClick={() => handleOptionSelect(opt)}
                disabled={selectedOption !== null}
                style={{
                  padding: '16px 8px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isThisCorrect
                    ? '#064E3B'
                    : isThisWrong
                    ? '#7F1D1D'
                    : '#15253B',
                  border: isThisCorrect
                    ? '2px solid #10B981'
                    : isThisWrong
                    ? '2px solid #EF4444'
                    : '1px solid #223752',
                  color: '#FFFFFF',
                  fontSize: '22px',
                  fontWeight: 800,
                  cursor: selectedOption !== null ? 'default' : 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isThisCorrect ? '0 0 16px rgba(16, 185, 129, 0.4)' : 'var(--shadow-card)',
                }}
              >
                ₹{opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Completion Modal */}
      {isComplete && (
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
              border: '2px solid #DB2777',
              boxShadow: '0 0 40px rgba(219, 39, 119, 0.3)',
              background: 'linear-gradient(180deg, #172A43 0%, #101F33 100%)',
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: 'rgba(219, 39, 119, 0.2)',
                border: '2px solid #DB2777',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
              }}
            >
              <Award size={38} color="#F472B6" />
            </div>

            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: '#FFFFFF', marginBottom: '4px' }}>
              Math Workout Complete!
            </h2>
            <p style={{ fontSize: 'var(--font-size-sm)', color: '#94A9C4', marginBottom: '20px' }}>
              Everyday market currency and mental calculation
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
                <span style={{ fontSize: '14px', color: '#94A9C4' }}>Score</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>{score} / {MATH_QUESTIONS.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', color: '#94A9C4' }}>Telemetry Status</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#34D399' }}>✓ Saved to Local SPI</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                className="btn-primary-lumos"
                onClick={() => {
                  setCurrentIndex(0);
                  setSelectedOption(null);
                  setIsCorrect(null);
                  setScore(0);
                  setIsComplete(false);
                }}
              >
                <RotateCcw size={18} />
                <span>Play Again</span>
              </button>
              <button
                className="btn-secondary-lumos"
                onClick={() => navigate('/games')}
              >
                <Home size={18} />
                <span>Back to Games</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
