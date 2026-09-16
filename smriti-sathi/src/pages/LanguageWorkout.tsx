import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, RotateCcw, Home, Award, BookOpen, Check } from 'lucide-react';
import { useVoice } from '../hooks/useVoice';
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
  const { speak, playSuccessChime, playCardFlip } = useVoice();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const card = LANGUAGE_DATA[currentIndex];

  useEffect(() => {
    if (card && !isComplete) {
      speak(`Language recall. The word is ${card.word} in ${card.langName}. What does it mean?`);
    }
  }, [currentIndex, isComplete]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOptionSelect = (opt: string) => {
    if (selectedOption !== null || isComplete) return;

    playCardFlip();
    setSelectedOption(opt);

    const isMatch = opt === card.options[0]; // first option in our array is the right answer
    if (isMatch) {
      playSuccessChime();
      setIsCorrect(true);
      setScore((prev) => prev + 1);
      speak(`Correct! ${card.word} means ${card.meaning}.`);

      setTimeout(() => {
        if (currentIndex < LANGUAGE_DATA.length - 1) {
          setCurrentIndex((prev) => prev + 1);
          setSelectedOption(null);
          setIsCorrect(null);
        } else {
          setIsComplete(true);
          db.gameSessions.add({
            patientId: 1,
            gameType: 'memoryMatch',
            difficulty: 2,
            score: 100,
            accuracy: 1.0,
            responseTimeMs: 3800,
            playedAt: new Date(),
            synced: 0,
          });
          speak('Language workout complete! You have rich cultural memory.');
        }
      }, 1600);
    } else {
      setIsCorrect(false);
      speak('Take your time, let the memory come naturally.');
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
          WORD {currentIndex + 1} OF {LANGUAGE_DATA.length}
        </div>

        <button
          onClick={() => speak(`The word is ${card.word} in ${card.langName}. Pronounced ${card.pronunciation}.`)}
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
            const isSelected = selectedOption === opt;
            const isThisCorrect = isSelected && isCorrect === true;
            const isThisWrong = isSelected && isCorrect === false;

            return (
              <button
                key={opt}
                onClick={() => handleOptionSelect(opt)}
                disabled={selectedOption !== null}
                style={{
                  padding: '16px 20px',
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
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: selectedOption !== null ? 'default' : 'pointer',
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
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
              Language Workout Complete!
            </h2>
            <p style={{ fontSize: 'var(--font-size-sm)', color: '#94A9C4', marginBottom: '20px' }}>
              Regional vocabulary & proverbs recall
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
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>{score} / {LANGUAGE_DATA.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', color: '#94A9C4' }}>Dialects Exercised</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#38BDF8' }}>Assamese, Bodo, Manipuri</span>
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
