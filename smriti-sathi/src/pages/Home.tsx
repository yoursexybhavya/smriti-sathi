import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play,
  Calculator,
  BookOpen,
  Heart,
  Flag,
  Timer,
  Sparkles,
  ChevronRight,
  Brain,
  Layers,
  CalendarCheck,
} from 'lucide-react';
import { usePatient } from '../contexts/PatientContext';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../db/database';

export function Home() {
  const { patient, refreshStats } = usePatient();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [todayPlayedCount, setTodayPlayedCount] = useState(0);

  useEffect(() => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const query = patient?.id
      ? db.gameSessions.where('patientId').equals(patient.id).filter((s) => s.playedAt >= startOfDay)
      : db.gameSessions.where('playedAt').above(startOfDay);

    query.count().then((count) => {
      setTodayPlayedCount(count);
      refreshStats();
    });
  }, [patient?.id, refreshStats]);

  const elderName = patient?.name?.split(' ')[0] || 'Elder';

  return (
    <div className="page" style={{ padding: '8px 16px 32px 16px', gap: '20px' }}>
      {/* Personalized Greeting Header */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '9999px', padding: '4px 12px', marginBottom: '8px' }}>
          <Brain size={14} color="#38BDF8" />
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#38BDF8', letterSpacing: '0.5px' }}>
            Smriti Sathi (স্মৃতি সাথী) — Memory Care Companion
          </span>
        </div>
        <h1
          style={{
            fontSize: 'var(--font-size-2xl)',
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '-0.5px',
          }}
        >
          {t.hi}, {elderName}
        </h1>
        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
          {t.appTagline}
        </p>
      </div>

      {/* Responsive Two-Column Layout for Tablet & Mobile */}
      <div className="responsive-layout-2col">
        {/* Left Column: Hero Workout Card & Clinical Evidence */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Hero Workout Card */}
          <div
            className="lumos-card"
            style={{
              padding: '24px 20px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid #233A57',
              background: 'linear-gradient(180deg, #172A43 0%, #122033 100%)',
            }}
          >
            {/* Subtle decorative glow */}
            <div
              style={{
                position: 'absolute',
                top: '-50px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '180px',
                height: '180px',
                background: 'radial-gradient(circle, rgba(255, 114, 71, 0.25) 0%, rgba(255,114,71,0) 70%)',
                pointerEvents: 'none',
              }}
            />

            {/* Circular Progress Avatar */}
            <div
              style={{
                position: 'relative',
                width: '94px',
                height: '94px',
                margin: '0 auto 14px auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Circular progress SVG */}
              <svg
                width="94"
                height="94"
                viewBox="0 0 94 94"
                style={{ transform: 'rotate(-90deg)', position: 'absolute', inset: 0 }}
              >
                <circle
                  cx="47"
                  cy="47"
                  r="42"
                  fill="transparent"
                  stroke="#21354F"
                  strokeWidth="5"
                />
                <circle
                  cx="47"
                  cy="47"
                  r="42"
                  fill="transparent"
                  stroke="#FF7247"
                  strokeWidth="5"
                  strokeDasharray={264}
                  strokeDashoffset={264 - Math.min(264, Math.round((todayPlayedCount / 3) * 264))}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                />
              </svg>

              {/* Glowing Center Brain Icon */}
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#FF7247',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(255, 114, 71, 0.45)',
                }}
              >
                <Brain size={34} color="#FFFFFF" />
              </div>
            </div>

            {/* Workout count badge */}
            <div
              style={{
                fontSize: 'var(--font-size-xs)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: 'var(--color-text-secondary)',
                marginBottom: '6px',
              }}
            >
              {t.dailyGoalProgress(todayPlayedCount, 3)}
            </div>

            {/* Workout Title */}
            <h2
              style={{
                fontSize: 'var(--font-size-xl)',
                fontWeight: 800,
                color: '#FFFFFF',
                marginBottom: '8px',
                letterSpacing: '-0.3px',
              }}
            >
              {todayPlayedCount > 0 ? t.todaysRoutine : t.firstWorkout}
            </h2>

            {/* Workout Description */}
            <p
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.5,
                maxWidth: '420px',
                margin: '0 auto 20px auto',
              }}
            >
              {t.workoutDesc}
            </p>

            {/* Start Button */}
            <button
              className="btn-primary-lumos"
              onClick={() => navigate('/games/memory-match')}
              style={{ maxWidth: '360px', margin: '0 auto' }}
            >
              <Play size={20} fill="#FFFFFF" />
              <span>{todayPlayedCount > 0 ? t.continueWorkout : t.start}</span>
            </button>
          </div>

          {/* Clinical Evidence Notice Card */}
          <div
            style={{
              backgroundColor: '#0F262B',
              border: '1px solid #134E4A',
              borderRadius: 'var(--radius-lg)',
              padding: '18px 20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Sparkles size={18} color="#2DD4BF" />
              <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 800, color: '#2DD4BF' }}>
                {t.clinicalEvidenceTitle}
              </h4>
            </div>
            <p style={{ fontSize: 'var(--font-size-xs)', color: '#A7F3D0', lineHeight: 1.5 }}>
              {t.clinicalEvidenceDesc}
            </p>
          </div>
        </div>

        {/* Right Column: Today's Exercises & More Workouts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Today's Exercises Section */}
          <div>
            <h3
              style={{
                fontSize: 'var(--font-size-lg)',
                fontWeight: 700,
                color: '#FFFFFF',
                marginBottom: '12px',
              }}
            >
              {t.todaysExercises}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Exercise 1: Speed Match */}
              <div
                className="lumos-card"
                onClick={() => navigate('/games/memory-match')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: '#0284C7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
                    }}
                  >
                    <Layers size={24} color="#FFFFFF" />
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: '#FFFFFF' }}>
                      {t.speedMatchTitle}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#38BDF8', letterSpacing: '0.5px' }}>
                      {t.speedMatchSubtitle}
                    </div>
                  </div>
                </div>

                <ChevronRight size={20} color="#647B99" />
              </div>

              {/* Exercise 2: Masterpiece / Daily Routine */}
              <div
                className="lumos-card"
                onClick={() => navigate('/games/daily-routine')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: '#3B82F6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                    }}
                  >
                    <CalendarCheck size={24} color="#FFFFFF" />
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: '#FFFFFF' }}>
                      {t.masterpieceTitle}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#60A5FA', letterSpacing: '0.5px' }}>
                      {t.masterpieceSubtitle}
                    </div>
                  </div>
                </div>

                <ChevronRight size={20} color="#647B99" />
              </div>

              {/* Exercise 3: Math Workout — Processing Speed */}
              <div
                className="lumos-card"
                onClick={() => navigate('/games/math')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: '#DB2777',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 4px 12px rgba(219, 39, 119, 0.3)',
                    }}
                  >
                    <Calculator size={24} color="#FFFFFF" />
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: '#FFFFFF' }}>
                      {t.mathEstimation}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#F472B6', letterSpacing: '0.5px' }}>
                      {t.mathWorkoutSubtitle || 'PROCESSING SPEED'}
                    </div>
                  </div>
                </div>

                <ChevronRight size={20} color="#647B99" />
              </div>

              {/* Exercise 4: Language & Proverbs — Attention & Focus */}
              <div
                className="lumos-card"
                onClick={() => navigate('/games/language')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: '#0891B2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 4px 12px rgba(8, 145, 178, 0.3)',
                    }}
                  >
                    <BookOpen size={24} color="#FFFFFF" />
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: '#FFFFFF' }}>
                      {t.languageBhashini}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#22D3EE', letterSpacing: '0.5px' }}>
                      {t.languageWorkoutSubtitle || 'ATTENTION & FOCUS'}
                    </div>
                  </div>
                </div>

                <ChevronRight size={20} color="#647B99" />
              </div>
            </div>
          </div>

          {/* More Workouts Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3
                style={{
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: 700,
                  color: '#FFFFFF',
                }}
              >
                {t.moreWorkouts}
              </h3>
              <span
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  color: '#34D399',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '4px 12px',
                  fontSize: '12px',
                  fontWeight: 700,
                }}
              >
                {t.allIncludedOffline}
              </span>
            </div>

            <div className="responsive-card-grid">
              {/* Card 1: Math */}
              <div
                className="lumos-card"
                onClick={() => navigate('/games/math')}
                style={{ padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '14px', cursor: 'pointer' }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: '#DB2777',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Calculator size={24} color="#FFFFFF" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: '#FFFFFF' }}>
                      {t.mathEstimation}
                    </div>
                    <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 800 }}>{t.playNow}</span>
                  </div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                    {t.mathDesc}
                  </p>
                </div>
              </div>

              {/* Card 2: Language */}
              <div
                className="lumos-card"
                onClick={() => navigate('/games/language')}
                style={{ padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '14px', cursor: 'pointer' }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: '#0891B2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <BookOpen size={24} color="#FFFFFF" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: '#FFFFFF' }}>
                      {t.languageBhashini}
                    </div>
                    <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 800 }}>{t.playNow}</span>
                  </div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                    {t.languageDesc}
                  </p>
                </div>
              </div>

              {/* Card 3: Favorites */}
              <div
                className="lumos-card"
                onClick={() => navigate('/games/memory-match')}
                style={{ padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '14px', cursor: 'pointer' }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: '#EA580C',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Heart size={24} color="#FFFFFF" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: '#FFFFFF' }}>
                      {t.favorites}
                    </div>
                    <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 800 }}>{t.playNow}</span>
                  </div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                    {t.favoritesDesc}
                  </p>
                </div>
              </div>

              {/* Card 4: Strengthen */}
              <div
                className="lumos-card"
                onClick={() => navigate('/games/daily-routine')}
                style={{ padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '14px', cursor: 'pointer' }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Flag size={24} color="#FFFFFF" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: '#FFFFFF' }}>
                      {t.strengthen}
                    </div>
                    <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 800 }}>{t.playNow}</span>
                  </div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                    {t.strengthenDesc}
                  </p>
                </div>
              </div>

              {/* Card 5: Quick */}
              <div
                className="lumos-card"
                onClick={() => navigate('/games/memory-match')}
                style={{ padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '14px', cursor: 'pointer' }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: '#65A30D',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Timer size={24} color="#FFFFFF" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: '#FFFFFF' }}>
                      {t.quickRoutine}
                    </div>
                    <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 800 }}>{t.playNow}</span>
                  </div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                    {t.quickDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
