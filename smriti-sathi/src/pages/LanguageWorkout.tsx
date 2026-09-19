import { useState, useEffect } from 'react';
const useNavigate = () => (path: string) => {};
import { ArrowLeft, Volume2, RotateCcw, Home, Award, BookOpen, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePatient } from '../contexts/PatientContext';
import { useVoice } from '../hooks/useVoice';
import { useInactivityScaffold } from '../hooks/useInactivityScaffold';
import { db } from '../db/database';

interface LanguageCard {
  id: number;
  word: string;
  langName: string;
  meaning: string;
  pronunciation: string;
  options: string[];
}

const LANGUAGE_DATA: LanguageCard[] = [
  {
    id: 1,
    word: 'বৰষা (Borsha)',
    langName: 'Assamese (অসমীয়া)',
    meaning: 'The soothing monsoon rains that nurture Assam tea gardens',
    pronunciation: 'Bor-shaa',
    options: ['Monsoon Rains', 'Morning Walk', 'Evening Tea'],
  },
  {
    id: 2,
    word: 'सोंसाइ (Songsai)',
    langName: 'Bodo (बर\')',
    meaning: 'Peaceful community living and brotherhood in the village',
    pronunciation: 'Song-saai',
    options: ['Peaceful Harmony', 'Heavy Thunder', 'River Boat'],
  },
  {
    id: 3,
    word: 'নুংশিবা (Nungshiba)',
    langName: 'Manipuri (মৈতৈলোন্)',
    meaning: 'Deep affectionate love, care, and kindness for family',
    pronunciation: 'Noong-shee-baa',
    options: ['Kind Love & Care', 'Running Fast', 'Market Day'],
  },
];

export function LanguageWorkout() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { patient, refreshStats } = usePatient();
  const { speak, playSuccessChime, playCardFlip } = useVoice();
  const { showScaffold, resetInactivity } = useInactivityScaffold(3000);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const card = LANGUAGE_DATA[currentIndex];

  useEffect(() => {
    resetInactivity();
    if (card && !isComplete) {
      speak(`${card.word}. ${card.meaning}`, language);
    }
  }, [currentIndex, isComplete, language, resetInactivity]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOptionSelect = (opt: string) => {
    if (selectedOption !== null || isComplete) return;

    const isMatch = opt === card.options[0]; // first option in our array is the right answer
    if (!isMatch) return;

    playCardFlip();
    setSelectedOption(opt);
    playSuccessChime();
    setIsCorrect(true);
    setScore((prev) => prev + 1);
    speak(t.greatJob, language);

    setTimeout(() => {
      if (currentIndex < LANGUAGE_DATA.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
        setIsCorrect(null);
        resetInactivity();
      } else {
        setIsComplete(true);
        if (patient?.id) {
          db.gameSessions.add({
            patientId: patient.id,
            gameType: 'language',
            domain: 'attentionFocus',
            difficulty: 2,
            score: 100,
            accuracy: 1.0,
            responseTimeMs: 3800,
            distractorRejectionRate: 1.0,
            playedAt: new Date(),
            synced: 0,
          }).then(() => refreshStats());
        }
        speak(t.gameComplete, language);
      }
    }, 1600);
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
            backgroundColor: 'rgba(8, 145, 178, 0.15)',
            border: '1px solid rgba(8, 145, 178, 0.35)',
            borderRadius: 'var(--radius-pill)',
            padding: '6px 16px',
            fontSize: '13px',
            fontWeight: 800,
            color: '#38BDF8',
            letterSpacing: '0.5px',
          }}
        >
          {currentIndex + 1} / {LANGUAGE_DATA.length}
        </div>

        <button
          onClick={() => speak(`${card.word}. ${card.meaning}`, language)}
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

      {/* Main Flashcard */}
      <div
        className="lumos-card"
        style={{
          padding: '28px 20px',
          textAlign: 'center',
          border: '1px solid #284469',
          background: 'linear-gradient(180deg, #162B44 0%, #101F33 100%)',
        }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#0891B2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px auto',
            boxShadow: '0 4px 16px rgba(8, 145, 178, 0.3)',
          }}
        >
          <BookOpen size={30} color="#FFFFFF" />
        </div>

        <span
          style={{
            backgroundColor: 'rgba(56, 189, 248, 0.15)',
            color: '#38BDF8',
            padding: '4px 12px',
            borderRadius: 'var(--radius-pill)',
            fontSize: '12px',
            fontWeight: 700,
          }}
        >
          {card.langName}
        </span>

        {/* Word Display */}
        <h2
          style={{
            fontSize: '36px',
            fontWeight: 800,
            color: '#FFFFFF',
            marginTop: '16px',
            marginBottom: '4px',
          }}
        >
          {card.word}
        </h2>
        <p style={{ fontSize: '14px', color: '#94A9C4', marginBottom: '24px' }}>
          Pronunciation: <em>{card.pronunciation}</em>
        </p>

        <div style={{ fontSize: '13px', fontWeight: 800, color: '#647B99', marginBottom: '12px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
          SELECT CULTURAL MEANING:
        </div>

        {/* Meaning Option Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {card.options.map((opt) => {
            const isTarget = opt === card.options[0];
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
                  padding: '16px 20px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isThisCorrect ? '#064E3B' : '#15253B',
                  border: isThisCorrect
                    ? '2px solid #10B981'
                    : shouldPulse
                    ? '2px solid #10B981'
                    : '1px solid #223752',
                  color: '#FFFFFF',
                  fontSize: '16px',
                  fontWeight: 700,
                  opacity: isTarget ? 1 : 0.35,
                  cursor: !isTarget ? 'not-allowed' : selectedOption !== null ? 'default' : 'pointer',
                  pointerEvents: isTarget ? 'auto' : 'none',
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: isThisCorrect ? '0 0 16px rgba(16, 185, 129, 0.4)' : 'var(--shadow-card)',
                }}
              >
                <span>{opt}</span>
                {isThisCorrect && <Check size={20} color="#10B981" />}
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
              border: '2px solid #0891B2',
              boxShadow: '0 0 40px rgba(8, 145, 178, 0.3)',
              background: 'linear-gradient(180deg, #172A43 0%, #101F33 100%)',
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: 'rgba(8, 145, 178, 0.2)',
                border: '2px solid #0891B2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
              }}
            >
              <Award size={38} color="#38BDF8" />
            </div>

            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: '#FFFFFF', marginBottom: '4px' }}>
              {t.gameComplete}
            </h2>
            <p style={{ fontSize: 'var(--font-size-sm)', color: '#94A9C4', marginBottom: '20px' }}>
              {t.languageDesc}
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
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>{score} / {LANGUAGE_DATA.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', color: '#94A9C4' }}>SPI</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#38BDF8' }}>✓ Saved</span>
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
