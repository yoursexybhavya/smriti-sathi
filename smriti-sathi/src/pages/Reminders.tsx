import { useState, useEffect, useCallback } from 'react';
import {
  Bell,
  Clock,
  CheckCircle2,
  Plus,
  Volume2,
  Droplets,
  Pill,
  Calendar,
  Sparkles,
  X
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePatient } from '../contexts/PatientContext';
import { useVoice } from '../hooks/useVoice';
import { db, type Reminder } from '../db/database';

export function Reminders() {
  const { t } = useLanguage();
  const { patient } = usePatient();
  const { speak, playReminderChime, playSuccessChime } = useVoice();

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeAlert, setActiveAlert] = useState<Reminder | null>(null);

  const [newType, setNewType] = useState<'medicine' | 'water' | 'activity' | 'appointment'>('medicine');
  const [newLabel, setNewLabel] = useState('');
  const [newHour, setNewHour] = useState(8);
  const [newMinute, setNewMinute] = useState(0);

  const loadReminders = useCallback(async () => {
    const list = await db.reminders.toArray();
    if (list.length === 0) {
      const defaults: Reminder[] = [
        {
          patientId: patient?.id || 1,
          type: 'medicine',
          label: 'Morning Memory & BP Tablet',
          timeHour: 8,
          timeMinute: 0,
          repeatDays: [0, 1, 2, 3, 4, 5, 6],
          isActive: true,
          lastAcked: null,
        },
        {
          patientId: patient?.id || 1,
          type: 'water',
          label: 'Fresh Hydration Water Glass',
          timeHour: 10,
          timeMinute: 30,
          repeatDays: [0, 1, 2, 3, 4, 5, 6],
          isActive: true,
          lastAcked: null,
        },
        {
          patientId: patient?.id || 1,
          type: 'activity',
          label: 'Smriti Sathi Mind Workout',
          timeHour: 11,
          timeMinute: 0,
          repeatDays: [0, 1, 2, 3, 4, 5, 6],
          isActive: true,
          lastAcked: null,
        },
      ];
      for (const d of defaults) await db.reminders.add(d);
      setReminders(defaults);
    } else {
      setReminders(list);
    }
  }, [patient?.id]);

  useEffect(() => {
    loadReminders();
  }, [loadReminders]);

  const triggerVoiceAlert = (rem: Reminder) => {
    setActiveAlert(rem);
    playReminderChime();

    let text = t.timeForMedicine;
    if (rem.type === 'water') text = t.timeForWater;
    if (rem.type === 'activity') text = t.timeForActivity;
    speak(`${text}. ${rem.label}`);
  };

  const handleAcknowledge = async (rem: Reminder) => {
    playSuccessChime();

    await db.reminderLogs.add({
      reminderId: rem.id || 0,
      patientId: patient?.id || 1,
      scheduledAt: new Date(),
      acknowledgedAt: new Date(),
      synced: 0,
    });

    if (rem.id) {
      await db.reminders.update(rem.id, { lastAcked: new Date() });
    }

    setActiveAlert(null);
    speak(t.reminderAcknowledged);
    loadReminders();
  };

  const handleSaveReminder = async () => {
    if (!newLabel.trim()) return;

    const reminder: Reminder = {
      patientId: patient?.id || 1,
      type: newType,
      label: newLabel.trim(),
      timeHour: newHour,
      timeMinute: newMinute,
      repeatDays: [0, 1, 2, 3, 4, 5, 6],
      isActive: true,
      lastAcked: null,
    };

    await db.reminders.add(reminder);
    setNewLabel('');
    setShowAddModal(false);
    loadReminders();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'medicine': return <Pill size={24} color="#F59E0B" />;
      case 'water': return <Droplets size={24} color="#38BDF8" />;
      case 'activity': return <Sparkles size={24} color="#10B981" />;
      case 'appointment': return <Calendar size={24} color="#A855F7" />;
      default: return <Bell size={24} color="#FF7247" />;
    }
  };

  const formatTime = (hour: number, minute: number) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h = hour % 12 || 12;
    const m = minute.toString().padStart(2, '0');
    return `${h}:${m} ${ampm}`;
  };

  return (
    <div className="page" style={{ padding: '8px 16px 32px 16px', gap: '18px' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1
            style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.5px',
            }}
          >
            Care Reminders
          </h1>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Offline-first daily health schedules & medication tracking
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          style={{
            backgroundColor: '#FF7247',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 'var(--radius-pill)',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            boxShadow: '0 0 12px rgba(255, 114, 71, 0.35)',
          }}
        >
          <Plus size={16} />
          <span>Add</span>
        </button>
      </div>

      {/* Active Spoken Alert Banner */}
      {activeAlert && (
        <div
          className="lumos-card"
          style={{
            padding: '20px',
            border: '2px solid #FF7247',
            background: 'linear-gradient(180deg, #261D22 0%, #15253B 100%)',
            textAlign: 'center',
            boxShadow: '0 0 30px rgba(255, 114, 71, 0.35)',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 114, 71, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
            }}
          >
            {getTypeIcon(activeAlert.type)}
          </div>
          <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 800, color: '#FFFFFF', marginBottom: '4px' }}>
            {activeAlert.label}
          </h2>
          <p style={{ fontSize: 'var(--font-size-sm)', color: '#FF7247', fontWeight: 700, marginBottom: '16px' }}>
            Scheduled for {formatTime(activeAlert.timeHour, activeAlert.timeMinute)}
          </p>

          <button
            className="btn-primary-lumos"
            onClick={() => handleAcknowledge(activeAlert)}
          >
            <CheckCircle2 size={20} />
            <span>Completed ({t.dismiss})</span>
          </button>
        </div>
      )}

      {/* Reminders List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {reminders.map((rem) => {
          const isAckedToday =
            rem.lastAcked &&
            new Date(rem.lastAcked).toDateString() === new Date().toDateString();

          return (
            <div
              key={rem.id}
              className="lumos-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                border: isAckedToday ? '1px solid #10B981' : '1px solid #223752',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    backgroundColor: '#0F1D2F',
                    border: '1px solid #1E344F',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {getTypeIcon(rem.type)}
                </div>
                <div>
                  <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: '#FFFFFF' }}>
                    {rem.label}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <Clock size={13} color="#647B99" />
                    <span style={{ fontSize: '13px', color: '#94A9C4', fontWeight: 600 }}>
                      {formatTime(rem.timeHour, rem.timeMinute)}
                    </span>
                    {isAckedToday && (
                      <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 800, marginLeft: '6px' }}>
                        &bull; DONE TODAY
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Voice Test button */}
                <button
                  onClick={() => triggerVoiceAlert(rem)}
                  style={{
                    background: '#0F1D2F',
                    border: '1px solid #223752',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94A9C4',
                    cursor: 'pointer',
                  }}
                  title="Test spoken prompt"
                >
                  <Volume2 size={18} />
                </button>

                {/* Done check button */}
                <button
                  onClick={() => handleAcknowledge(rem)}
                  style={{
                    background: isAckedToday ? '#10B981' : '#172A43',
                    border: isAckedToday ? 'none' : '1px solid #284469',
                    borderRadius: 'var(--radius-pill)',
                    padding: '8px 14px',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>{isAckedToday ? 'Done' : 'Take'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Reminder Modal */}
      {showAddModal && (
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
              padding: '24px',
              maxWidth: '420px',
              width: '100%',
              border: '1px solid #284469',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: 'var(--font-size-base)', fontWeight: 800, color: '#FFFFFF' }}>
                Add Care Reminder
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', color: '#94A9C4', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#647B99', textTransform: 'uppercase' }}>
                  Type
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '6px' }}>
                  {(['medicine', 'water', 'activity', 'appointment'] as const).map((typ) => (
                    <button
                      key={typ}
                      type="button"
                      onClick={() => setNewType(typ)}
                      style={{
                        padding: '12px 6px',
                        borderRadius: 'var(--radius-sm)',
                        border: newType === typ ? '2px solid #FF7247' : '1px solid #223752',
                        backgroundColor: newType === typ ? '#241D2B' : '#0F1D2F',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      {getTypeIcon(typ)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#647B99', textTransform: 'uppercase' }}>
                  Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. Morning Blood Pressure Tablet"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid #223752',
                    backgroundColor: '#0F1D2F',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    marginTop: '6px',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#647B99', textTransform: 'uppercase' }}>
                    Hour (0-23)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={23}
                    value={newHour}
                    onChange={(e) => setNewHour(parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid #223752',
                      backgroundColor: '#0F1D2F',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      marginTop: '6px',
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#647B99', textTransform: 'uppercase' }}>
                    Minute (0-59)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={newMinute}
                    onChange={(e) => setNewMinute(parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid #223752',
                      backgroundColor: '#0F1D2F',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      marginTop: '6px',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  className="btn-primary-lumos"
                  onClick={handleSaveReminder}
                >
                  Save Reminder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
