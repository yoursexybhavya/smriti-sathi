import { useState, useEffect } from 'react';
import { Plus, Pill, Calendar, Clock, Bell, Check, Edit2, Trash2, Volume2 } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import Card from '../components/Card';
import { useApp } from '../context/AppContext';
import { reminderService } from '../services/ReminderService';
import { notificationService } from '../services/NotificationService';
import { Reminder } from '../database/db';
import { formatTime, formatDate, isToday } from '../utils/dateUtils';

interface RemindersScreenProps {
  onNavigate: (screen: string) => void;
  isOnline?: boolean;
}

export default function RemindersScreen({ onNavigate, isOnline = true }: RemindersScreenProps) {
  const { state } = useApp();
  const userId = state.currentPatient?.id ? parseInt(state.currentPatient.id) : undefined;

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Reminder['type']>('medicine');
  const [description, setDescription] = useState('');
  const [hour, setHour] = useState(9);
  const [minute, setMinute] = useState(0);
  const [repeatPattern, setRepeatPattern] = useState<Reminder['repeatPattern']>('none');

  useEffect(() => {
    if (userId) {
      loadReminders();
      reminderService.initialize(userId, state.currentPatient?.name);
    }
  }, [userId]);

  const loadReminders = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await reminderService.getAllReminders(userId);
      setReminders(data);
    } catch (error) {
      console.error('Failed to load reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!userId || !title.trim()) return;

    try {
      const now = new Date();
      const scheduledTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hour,
        minute
      ).getTime();

      await reminderService.createReminder(
        userId,
        type,
        title.trim(),
        scheduledTime,
        description.trim() || undefined,
        repeatPattern
      );

      resetForm();
      await loadReminders();
    } catch (error) {
      console.error('Failed to create reminder:', error);
    }
  };

  const handleUpdate = async () => {
    if (!editingReminder || !title.trim()) return;

    try {
      const now = new Date();
      const scheduledTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hour,
        minute
      ).getTime();

      await reminderService.updateReminder(editingReminder.id!, {
        title: title.trim(),
        type,
        description: description.trim() || undefined,
        scheduledTime,
        repeatPattern,
      });

      resetForm();
      setEditingReminder(null);
      await loadReminders();
    } catch (error) {
      console.error('Failed to update reminder:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this reminder?')) return;

    try {
      await reminderService.deleteReminder(id);
      await loadReminders();
    } catch (error) {
      console.error('Failed to delete reminder:', error);
    }
  };

  const handleComplete = async (id: number) => {
    if (!userId) return;

    try {
      await reminderService.completeReminder(id, userId);
      await loadReminders();
    } catch (error) {
      console.error('Failed to complete reminder:', error);
    }
  };

  const handleSnooze = async (id: number) => {
    try {
      await reminderService.snoozeReminder(id, 10);
      await loadReminders();
    } catch (error) {
      console.error('Failed to snooze reminder:', error);
    }
  };

  const startEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setTitle(reminder.title);
    setType(reminder.type);
    setDescription(reminder.description || '');
    const date = new Date(reminder.scheduledTime);
    setHour(date.getHours());
    setMinute(date.getMinutes());
    setRepeatPattern(reminder.repeatPattern || 'none');
    setShowCreateForm(true);
  };

  const resetForm = () => {
    setTitle('');
    setType('medicine');
    setDescription('');
    setHour(9);
    setMinute(0);
    setRepeatPattern('none');
    setShowCreateForm(false);
    setEditingReminder(null);
  };

  const getReminderIcon = (reminderType: Reminder['type']) => {
    switch (reminderType) {
      case 'medicine':
        return <Pill size={20} className="text-[var(--color-accent-purple)]" />;
      case 'hydration':
        return <Pill size={20} className="text-[var(--color-accent-blue)]" />;
      case 'activity':
        return <Calendar size={20} className="text-[var(--color-success)]" />;
      case 'appointment':
        return <Calendar size={20} className="text-[var(--color-accent-amber)]" />;
    }
  };

  const getReminderBgColor = (reminderType: Reminder['type']) => {
    switch (reminderType) {
      case 'medicine':
        return 'bg-[var(--color-accent-purple)/15]';
      case 'hydration':
        return 'bg-[var(--color-accent-blue)/15]';
      case 'activity':
        return 'bg-[var(--color-success-bg)]';
      case 'appointment':
        return 'bg-[var(--color-warning-bg)]';
    }
  };

  const todayReminders = reminders.filter(r => isToday(r.scheduledTime));
  const upcomingReminders = reminders.filter(r => !isToday(r.scheduledTime) && r.status === 'pending');

  return (
    <>
      <AppHeader 
        title="Reminders" 
        subtitle="Never miss what matters" 
        isOnline={isOnline} 
        showBack 
        onBack={() => onNavigate('home')} 
        showSettings
        onSettingsPress={() => onNavigate('settings')}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28 space-y-6">
        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full flex items-center justify-center gap-2.5 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-base py-3.5 px-5 rounded-2xl shadow-md active:scale-[0.98] transition-all min-h-[52px]"
          >
            <Plus size={20} />
            <span>Add New Reminder</span>
          </button>
          <button
            type="button"
            onClick={async () => {
              await notificationService.triggerBuzzer(
                '🔔 Care Schedule Test Alarm',
                'Testing the audible chime and vibration for scheduled care routines.'
              );
            }}
            className="w-full flex items-center justify-center gap-2.5 bg-[var(--color-bg-subtle)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-[#F59E0B] font-semibold text-base py-3.5 px-5 rounded-2xl shadow-sm active:scale-[0.98] transition-all min-h-[52px]"
          >
            <Volume2 size={20} className="text-[#F59E0B]" />
            <span>Test Care Alarm & Buzzer</span>
          </button>
        </div>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <Card className="p-5 space-y-4">
            <h3 className="text-lg font-semibold text-[var(--color-text)]">
              {editingReminder ? 'Edit Reminder' : 'Create Reminder'}
            </h3>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Morning Medicine"
                className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-success)]"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Type</label>
              <div className="grid grid-cols-2 gap-2">
                {(['medicine', 'hydration', 'activity', 'appointment'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      type === t
                        ? 'border-[var(--color-success)] bg-[var(--color-success-bg)]'
                        : 'border-[var(--color-border)] bg-[var(--color-card)]'
                    }`}
                  >
                    <span className="text-sm font-medium capitalize">{t}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Time</label>
              <div className="flex gap-2">
                <select
                  value={hour}
                  onChange={(e) => setHour(parseInt(e.target.value))}
                  className="flex-1 px-4 py-3 border border-[var(--color-border)] rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-success)]"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>
                      {i.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <select
                  value={minute}
                  onChange={(e) => setMinute(parseInt(e.target.value))}
                  className="flex-1 px-4 py-3 border border-[var(--color-border)] rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-success)]"
                >
                  {Array.from({ length: 60 }, (_, i) => (
                    <option key={i} value={i}>
                      {i.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Repeat Pattern */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Repeat</label>
              <div className="flex gap-2">
                {(['none', 'daily', 'weekly'] as const).map((pattern) => (
                  <button
                    key={pattern}
                    onClick={() => setRepeatPattern(pattern)}
                    className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                      repeatPattern === pattern
                        ? 'border-[var(--color-success)] bg-[var(--color-success-bg)]'
                        : 'border-[var(--color-border)] bg-[var(--color-card)]'
                    }`}
                  >
                    <span className="text-sm font-medium capitalize">
                      {pattern === 'none' ? 'One time' : pattern}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Description (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add notes..."
                rows={2}
                className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-success)]"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={resetForm}
                className="flex-1 py-3 px-4 border border-[var(--color-border)] rounded-xl text-base font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)]"
              >
                Cancel
              </button>
              <button
                onClick={editingReminder ? handleUpdate : handleCreate}
                disabled={!title.trim()}
                className="flex-1 py-3 px-4 bg-[var(--color-success)] text-white rounded-xl text-base font-medium hover:bg-[var(--color-success)]/90 disabled:opacity-50"
              >
                {editingReminder ? 'Update' : 'Create'}
              </button>
            </div>
          </Card>
        )}

        {/* Today's Reminders */}
        {todayReminders.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-[var(--color-text)] px-1">Today</h3>
            {todayReminders.map((reminder) => (
              <Card key={reminder.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-xl ${getReminderBgColor(reminder.type)} flex items-center justify-center flex-shrink-0`}>
                    {getReminderIcon(reminder.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-[var(--color-text)]">{reminder.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock size={13} className="text-[var(--color-text-muted)]" />
                      <span className="text-sm text-[var(--color-text-secondary)]">{formatTime(reminder.scheduledTime)}</span>
                      {reminder.repeatPattern && reminder.repeatPattern !== 'none' && (
                        <span className="text-xs text-[var(--color-text-muted)] bg-[var(--color-bg-subtle)] px-2 py-0.5 rounded">
                          {reminder.repeatPattern}
                        </span>
                      )}
                    </div>
                    {reminder.description && (
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">{reminder.description}</p>
                    )}
                    {reminder.status === 'pending' && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleComplete(reminder.id!)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-[var(--color-success)] text-white rounded-lg text-xs font-medium hover:bg-[var(--color-success)]/90"
                        >
                          <Check size={14} />
                          Complete
                        </button>
                        <button
                          onClick={() => handleSnooze(reminder.id!)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-[var(--color-accent-amber)] text-white rounded-lg text-xs font-medium hover:bg-[var(--color-warning)]"
                        >
                          <Clock size={14} />
                          Snooze
                        </button>
                        <button
                          onClick={() => startEdit(reminder)}
                          className="p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)] rounded-lg"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(reminder.id!)}
                          className="p-1.5 text-[var(--color-error)] hover:bg-[var(--color-error-bg)] rounded-lg"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                    {reminder.status === 'completed' && (
                      <div className="mt-2 flex items-center gap-1 text-[var(--color-success)] text-xs font-medium">
                        <Check size={14} />
                        Completed
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Upcoming Reminders */}
        {upcomingReminders.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-[var(--color-text)] px-1">Upcoming</h3>
            {upcomingReminders.map((reminder) => (
              <Card key={reminder.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-xl ${getReminderBgColor(reminder.type)} flex items-center justify-center flex-shrink-0`}>
                    {getReminderIcon(reminder.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-[var(--color-text)]">{reminder.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar size={13} className="text-[var(--color-text-muted)]" />
                      <span className="text-sm text-[var(--color-text-secondary)]">{formatDate(reminder.scheduledTime)}</span>
                    </div>
                    {reminder.description && (
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">{reminder.description}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && reminders.length === 0 && !showCreateForm && (
          <div className="text-center py-12">
            <Bell size={48} className="text-[var(--color-border)] mx-auto mb-4" />
            <p className="text-[var(--color-text-muted)] text-base">No reminders yet</p>
            <p className="text-[var(--color-text-muted)] text-sm mt-1">Tap "Add New Reminder" to get started</p>
          </div>
        )}

        {/* Offline Notice */}
        <div className="flex items-start gap-3 p-4 bg-[var(--color-bg-subtle)] rounded-2xl border border-[var(--color-border)]">
          <Bell size={18} className="text-[var(--color-text-secondary)] mt-0.5 flex-shrink-0" />
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            Reminders work offline. They'll sync when you're back online.
          </p>
        </div>
      </div>
    </>
  );
}
