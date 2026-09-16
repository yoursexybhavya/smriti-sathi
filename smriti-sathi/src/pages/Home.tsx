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
  CheckCircle2
} from 'lucide-react';
import { usePatient } from '../contexts/PatientContext';
import { useVoice } from '../hooks/useVoice';
import { db } from '../db/database';

export function Home() {
  const { patient } = usePatient();
  const navigate = useNavigate();
  const { speak } = useVoice();

  const [todayPlayedCount, setTodayPlayedCount] = useState(0);

  useEffect(() => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    db.gameSessions
      .where('playedAt')
      .above(startOfDay)
      .count()
      .then((count) => setTodayPlayedCount(count));
  }, []);

  const elderName = patient?.name?.split(' ')[0] || 'Krishna';

  return (
    <div className="page" style={{ padding: '8px 16px 32px 16px', gap: '20px' }}>
      {/* Personalized Greeting */}
      <div>
        <h1
          style={{
            fontSize: 'var(--font-size-2xl)',
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '-0.5px',
          }}
        >
          Hi, {elderName}
        </h1>
        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
          Memory care that speaks your language — online or offline
        </p>
      </div>

      {/* Hero Workout Card (Lumosity "Your First Workout" Style) */}
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
              strokeDashoffset={todayPlayedCount > 0 ? 132 : 230}
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

        {/* Workout subtitle */}
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
          Workout {todayPlayedCount + 1} of 30
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
          {todayPlayedCount > 0 ? "Today's Cognitive Routine" : 'Your First Workout'}
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
          Each game exercises a different domain of your thinking. Let&apos;s give them all a try.
        </p>

        {/* Start Button */}
        <button
          className="btn-primary-lumos"
          onClick={() => navigate('/games/memory-match')}
          style={{ maxWidth: '360px', margin: '0 auto' }}
        >
          <Play size={20} fill="#FFFFFF" />
          <span>{todayPlayedCount > 0 ? 'Continue Workout' : 'Start'}</span>
        </button>
      </div>

      {/* Today's Exercises Section (Lumosity List Style) */}
      <div>
        <h3
          style={{
            fontSize: 'var(--font-size-lg)',
            fontWeight: 700,
            color: '#FFFFFF',
            marginBottom: '12px',
          }}
        >
          Today&apos;s Exercises
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
              {/* Cyan Triangle Icon Badge */}
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
                  Speed Match
                </div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#38BDF8', letterSpacing: '0.5px' }}>
                  SPEED &bull; MEMORY
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
              {/* Blue Mountain Peaks Badge */}
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
                  Masterpiece (Daily Routine)
                </div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#60A5FA', letterSpacing: '0.5px' }}>
                  REASONING &bull; ORIENTATION
                </div>
              </div>
            </div>

            <ChevronRight size={20} color="#647B99" />
          </div>

          {/* Exercise 3: Reminiscence & Voice Care */}
          <div
            className="lumos-card"
            onClick={() => {
              speak('Ebb and Flow. Memory stimulation with family memories and folk melodies.');
              navigate('/games/memory-match');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {/* Teal Leaf Badge */}
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#0D9488',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)',
                }}
              >
                <Sparkles size={24} color="#FFFFFF" />
              </div>
              <div>
                <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: '#FFFFFF' }}>
                  Ebb and Flow (Reminiscence)
                </div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#2DD4BF', letterSpacing: '0.5px' }}>
                  FLEXIBILITY &bull; HERITAGE
                </div>
              </div>
            </div>

            <ChevronRight size={20} color="#647B99" />
          </div>

          {/* Exercise 4: Train of Thought */}
          <div
            className="lumos-card"
            onClick={() => navigate('/reminders')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {/* Lime Train Badge */}
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#16A34A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
                }}
              >
                <CheckCircle2 size={24} color="#FFFFFF" />
              </div>
              <div>
                <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: '#FFFFFF' }}>
                  Train of Thought (Routine & Meds)
                </div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#4ADE80', letterSpacing: '0.5px' }}>
                  ATTENTION &bull; DAILY SCHEDULE
                </div>
              </div>
            </div>

            <ChevronRight size={20} color="#647B99" />
          </div>
        </div>
      </div>

      {/* More Workouts Section (from screenshot IMG_2035.png) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 700,
              color: '#FFFFFF',
            }}
          >
            More Workouts
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
            ALL INCLUDED &bull; OFFLINE
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                  Math & Estimation
                </div>
                <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 800 }}>PLAY NOW →</span>
              </div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                Challenge your estimation, counting, and everyday grocery currency skills.
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
                  Language (Bhashini AI)
                </div>
                <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 800 }}>PLAY NOW →</span>
              </div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                Explore Assamese, Bodo, and Manipuri proverbs, vocabulary, and stories.
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
                  Favorites
                </div>
                <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 800 }}>PLAY NOW →</span>
              </div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                Treat your brain to the cognitive care games you enjoy playing the most.
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
                  Strengthen (Errorless Care)
                </div>
                <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 800 }}>PLAY NOW →</span>
              </div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                Gentle guided practice that boosts confidence and prevents cognitive frustration.
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
                  Quick Routine
                </div>
                <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 800 }}>PLAY NOW →</span>
              </div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                Short, calm memory exercises in 5 minutes or less.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Evidence & Prescription Notice Card (LumosityRx style from IMG_2034.png) */}
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
            Evidence-Based Cognitive Stimulation
          </h4>
        </div>
        <p style={{ fontSize: 'var(--font-size-xs)', color: '#A7F3D0', lineHeight: 1.5 }}>
          Built on Cochrane-reviewed Cognitive Stimulation Therapy (CST) and errorless learning principles, specifically tuned for low-connectivity care in the North Eastern Region.
        </p>
      </div>
    </div>
  );
}
