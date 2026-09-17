import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, RotateCcw, Home, Award, Calculator } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePatient } from '../contexts/PatientContext';
import { useVoice } from '../hooks/useVoice';
import { useInactivityScaffold } from '../hooks/useInactivityScaffold';
import { db } from '../db/database';

interface MathQuestion {
  id: number;
  prompt: Record<string, string>;
  items: { emoji: string; name: Record<string, string>; cost: number }[];
  correctAnswer: number;
  options: number[];
}

const MATH_QUESTIONS: MathQuestion[] = [
  {
    id: 1,
    prompt: {
      en: 'Buying morning tea and biscuits at the local stall:',
      as: 'ৰাতিপুৱাৰ চাহ আৰু বিস্কুট কিনাৰ হিচাপ:',
      brx: 'फुंनि साहा आरो बिस्कुट बायनायनि साननाय:',
      mni: 'অয়ুক্কী চা অমসুং বিস্কুত লৈবগী মমল:',
    },
    items: [
      { emoji: '☕', name: { en: 'Assam Chai', as: 'অসমীয়া চাহ', brx: 'साहा', mni: 'চা' }, cost: 15 },
      { emoji: '🍪', name: { en: 'Biscuits', as: 'বিস্কুট', brx: 'बिस्कुट', mni: 'বিস্কুত' }, cost: 10 },
    ],
    correctAnswer: 25,
    options: [20, 25, 30],
  },
  {
    id: 2,
    prompt: {
      en: 'Purchasing fresh seasonal fruits from the market:',
      as: 'বজাৰৰ পৰা সতেজ ফল-মূল কিনাৰ হিচাপ:',
      brx: 'हाथाइनिफ्राय फिथाइ बायनायনি সाननाय:',
      mni: 'কৈথেলদগী হৌরবা ঊহৈ লৈবগী মমল:',
    },
    items: [
      { emoji: '🍌', name: { en: 'Bananas', as: 'কল', brx: 'थालिर', mni: 'হায়দোং' }, cost: 30 },
      { emoji: '🍎', name: { en: 'Apples', as: 'আপেল', brx: 'आपेल', mni: 'সেব' }, cost: 40 },
    ],
    correctAnswer: 70,
    options: [60, 70, 80],
  },
  {
    id: 3,
    prompt: {
      en: 'Grocery essentials for evening dinner:',
      as: 'ৰাতিৰ আহাৰৰ বাবে গেলামাল সামগ্ৰী:',
      brx: 'मोनाबिलिनि ओंखामनि थाखाय मैगं-थासै:',
      mni: 'নুমিদাংগী চাক্কী পোৎ-চৈ:',
    },
    items: [
      { emoji: '🍚', name: { en: 'Rice packet', as: 'চাউলৰ টোপোলা', brx: 'माय', mni: 'চেংগী পোৎ' }, cost: 50 },
      { emoji: '🥬', name: { en: 'Fresh Greens', as: 'সতেজ শাক', brx: 'मैगं', mni: 'নাপী-শিঙাউ' }, cost: 20 },
    ],
    correctAnswer: 70,
    options: [65, 70, 75],
  },
];

export function MathWorkout() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { patient, refreshStats } = usePatient();
  const { speak, playSuccessChime, playCardFlip } = useVoice();
  const { showScaffold, resetInactivity } = useInactivityScaffold(3000);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const question = MATH_QUESTIONS[currentIndex];
  const langKey = language in question.prompt ? language : 'en';

  const currentPrompt = question.prompt[langKey] || question.prompt.en;

  useEffect(() => {
    resetInactivity();
    if (question && !isComplete) {
      const totalText = question.items
        .map((it) => `${it.name[langKey] || it.name.en} ${it.cost}`)
        .join(', ');
      speak(`${currentPrompt}. ${totalText}.`, language);
    }
  }, [currentIndex, isComplete, language, resetInactivity]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOptionSelect = (opt: number) => {
    if (selectedOption !== null || isComplete) return;

    // Errorless learning: prevent incorrect selections entirely
    if (opt !== question.correctAnswer) return;

    playCardFlip();
    setSelectedOption(opt);
    playSuccessChime();
    setIsCorrect(true);
    setScore((prev) => prev + 1);
    speak(t.greatJob, language);

    setTimeout(() => {
      if (currentIndex < MATH_QUESTIONS.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
        setIsCorrect(null);
        resetInactivity();
      } else {
        setIsComplete(true);
        if (patient?.id) {
          db.gameSessions.add({
            patientId: patient.id,
            gameType: 'math',
            domain: 'processingSpeed',
            difficulty: 1,
            score: 100,
            accuracy: 1.0,
            responseTimeMs: 3500,
            latencyMs: 3500,
            playedAt: new Date(),
            synced: 0,
          }).then(() => refreshStats());
        }
        speak(t.gameComplete, language);
      }
    }, 1500);
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
          <span>{t.backToHome}</span>
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
          {currentIndex + 1} / {MATH_QUESTIONS.length}
        </div>

        <button
          onClick={() => {
            const totalText = question.items
              .map((it) => `${it.name[langKey] || it.name.en} ${it.cost}`)
              .join(', ');
            speak(`${currentPrompt}. ${totalText}.`, language);
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
          title={t.voiceGuide}
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
          {t.mathEstimation}
        </h2>
        <p style={{ fontSize: 'var(--font-size-xs)', color: '#94A9C4', marginBottom: '18px' }}>
          {currentPrompt}
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
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>
                  {item.name[langKey] || item.name.en}
                </span>
              </div>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#F472B6' }}>₹{item.cost}</span>
            </div>
          ))}
        </div>

        <div style={{ fontSize: '14px', fontWeight: 800, color: '#647B99', marginBottom: '10px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
          {t.score}:
        </div>

        {/* Option Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {question.options.map((opt) => {
            const isTarget = opt === question.correctAnswer;
            const isSelected = selectedOption === opt;
            const isThisCorrect = isSelected && isCorrect === true;
            const shouldPulse = isTarget && showScaffold && selectedOption === null;

            return (
              <button
                key={opt}
                onClick={() => handleOptionSelect(opt)}
                disabled={selectedOption !== null || !isTarget}
                className={shouldPulse ? 'scaffold-pulse-active' : ''}
                style={{
                  padding: '16px 8px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isThisCorrect ? '#064E3B' : '#15253B',
                  border: isThisCorrect
                    ? '2px solid #10B981'
                    : shouldPulse
                    ? '2px solid #10B981'
                    : '1px solid #223752',
                  color: '#FFFFFF',
                  fontSize: '22px',
                  fontWeight: 800,
                  opacity: isTarget ? 1 : 0.35,
                  cursor: !isTarget ? 'not-allowed' : selectedOption !== null ? 'default' : 'pointer',
                  pointerEvents: isTarget ? 'auto' : 'none',
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
              {t.gameComplete}
            </h2>
            <p style={{ fontSize: 'var(--font-size-sm)', color: '#94A9C4', marginBottom: '20px' }}>
              {t.mathDesc}
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
                <span style={{ fontSize: '14px', color: '#94A9C4' }}>{t.score}</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>{score} / {MATH_QUESTIONS.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', color: '#94A9C4' }}>SPI</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#34D399' }}>✓ Saved</span>
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
                  resetInactivity();
                }}
              >
                <RotateCcw size={18} />
                <span>{t.playAgain}</span>
              </button>
              <button
                className="btn-secondary-lumos"
                onClick={() => navigate('/games')}
              >
                <Home size={18} />
                <span>{t.backToHome}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
