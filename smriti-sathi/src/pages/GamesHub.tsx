import { useNavigate } from 'react-router-dom';
import { Layers, CalendarCheck, ChevronRight, Play, Calculator, BookOpen } from 'lucide-react';
import { usePatient } from '../contexts/PatientContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAdaptiveDifficulty } from '../hooks/useAdaptiveDifficulty';

export function GamesHub() {
  const { patient } = usePatient();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const { currentLevel: memLevel } = useAdaptiveDifficulty(patient?.id, 'memoryMatch');
  const { currentLevel: routineLevel } = useAdaptiveDifficulty(patient?.id, 'dailyRoutine');

  return (
    <div className="page" style={{ padding: '8px 16px 32px 16px', gap: '20px' }}>
      {/* Title */}
      <div>
        <h1
          style={{
            fontSize: 'var(--font-size-2xl)',
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '-0.5px',
          }}
        >
          {t.games}
        </h1>
        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
          {t.evidenceBasedWorkouts}
        </p>
      </div>

      {/* Featured Workout Banner */}
      <div
        className="lumos-card"
        style={{
          padding: '18px 20px',
          border: '1px solid #284469',
          background: 'linear-gradient(90deg, #172B45 0%, #112134 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <span
            style={{
              backgroundColor: 'rgba(255, 114, 71, 0.2)',
              color: '#FF7247',
              padding: '4px 10px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.5px',
            }}
          >
            {t.dailyRecommendation}
          </span>
          <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 800, color: '#FFFFFF', marginTop: '6px' }}>
            {t.speedMatchTitle} &bull; {t.domainMemory}
          </div>
          <p style={{ fontSize: 'var(--font-size-xs)', color: '#94A9C4', marginTop: '2px' }}>
            {t.level} {memLevel} &bull; Adaptive Staircase Engine
          </p>
        </div>

        <button
          onClick={() => navigate('/games/memory-match')}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#FF7247',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 0 16px rgba(255, 114, 71, 0.4)',
          }}
        >
          <Play size={22} fill="#FFFFFF" color="#FFFFFF" />
        </button>
      </div>

      {/* Core Exercises */}
      <div>
        <h3
          style={{
            fontSize: 'var(--font-size-base)',
            fontWeight: 800,
            color: '#647B99',
            letterSpacing: '0.8px',
            marginBottom: '12px',
            textTransform: 'uppercase',
          }}
        >
          {t.coreCognitiveDomains}
        </h3>

        <div className="responsive-card-grid">
          {/* Game 1 */}
          <div
            className="lumos-card"
            onClick={() => navigate('/games/memory-match')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  backgroundColor: '#0284C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
                }}
              >
                <Layers size={26} color="#FFFFFF" />
              </div>
              <div>
                <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: '#FFFFFF' }}>
                  {t.speedMatchTitle}
                </div>
                <div style={{ fontSize: '12px', color: '#94A9C4', marginTop: '2px' }}>
                  {t.speedMatchSubtitle}
                </div>
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                  <span className="pill-badge pill-memory">{t.domainMemory.toUpperCase()}</span>
                  <span style={{ fontSize: '11px', color: '#38BDF8', fontWeight: 700 }}>{t.level.toUpperCase()} {memLevel}</span>
                </div>
              </div>
            </div>

            <ChevronRight size={20} color="#647B99" />
          </div>

          {/* Game 2 */}
          <div
            className="lumos-card"
            onClick={() => navigate('/games/daily-routine')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  backgroundColor: '#3B82F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                }}
              >
                <CalendarCheck size={26} color="#FFFFFF" />
              </div>
              <div>
                <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: '#FFFFFF' }}>
                  {t.masterpieceTitle}
                </div>
                <div style={{ fontSize: '12px', color: '#94A9C4', marginTop: '2px' }}>
                  {t.masterpieceSubtitle}
                </div>
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                  <span className="pill-badge pill-routine">{t.domainRoutine.toUpperCase()}</span>
                  <span style={{ fontSize: '11px', color: '#60A5FA', fontWeight: 700 }}>{t.level.toUpperCase()} {routineLevel}</span>
                </div>
              </div>
            </div>

            <ChevronRight size={20} color="#647B99" />
          </div>

          {/* Game 3: Math & Currency */}
          <div
            className="lumos-card"
            onClick={() => navigate('/games/math')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  backgroundColor: '#DB2777',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(219, 39, 119, 0.3)',
                }}
              >
                <Calculator size={26} color="#FFFFFF" />
              </div>
              <div>
                <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: '#FFFFFF' }}>
                  {t.mathEstimation}
                </div>
                <div style={{ fontSize: '12px', color: '#94A9C4', marginTop: '2px' }}>
                  {t.mathDesc}
                </div>
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                  <span className="pill-badge pill-attention">{t.domainCalculation.toUpperCase()}</span>
                  <span style={{ fontSize: '11px', color: '#F472B6', fontWeight: 700 }}>{t.level.toUpperCase()} 1</span>
                </div>
              </div>
            </div>

            <ChevronRight size={20} color="#647B99" />
          </div>

          {/* Game 4: Language & Bhashini */}
          <div
            className="lumos-card"
            onClick={() => navigate('/games/language')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  backgroundColor: '#0891B2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(8, 145, 178, 0.3)',
                }}
              >
                <BookOpen size={26} color="#FFFFFF" />
              </div>
              <div>
                <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: '#FFFFFF' }}>
                  {t.languageBhashini}
                </div>
                <div style={{ fontSize: '12px', color: '#94A9C4', marginTop: '2px' }}>
                  {t.languageDesc}
                </div>
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                  <span className="pill-badge pill-speed">BHASHINI AI</span>
                  <span style={{ fontSize: '11px', color: '#22D3EE', fontWeight: 700 }}>MULTILINGUAL</span>
                </div>
              </div>
            </div>

            <ChevronRight size={20} color="#647B99" />
          </div>
        </div>
      </div>
    </div>
  );
}
