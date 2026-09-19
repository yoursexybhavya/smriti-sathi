import React, { useState, useEffect } from 'react';
const useNavigate = () => (path: string) => {}; const useParams = <T extends Record<string, string | undefined>>(): T => ({} as T);
import { ArrowLeft, Save, Pill, Droplets, Activity, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { reminderService } from '../services/ReminderService';
import { reminderRepository } from '../database/repositories/ReminderRepository';
import { Reminder } from '../database/db';

export default function EditReminderScreen() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { state } = useApp();
  const userId = state.currentPatient?.id ? parseInt(state.currentPatient.id) : undefined;

  const [title, setTitle] = useState('');
  const [type, setType] = useState<Reminder['type']>('medicine');
  const [description, setDescription] = useState('');
  const [hour, setHour] = useState(9);
  const [minute, setMinute] = useState(0);
  const [repeatPattern, setRepeatPattern] = useState<Reminder['repeatPattern']>('none');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const reminderTypes: Array<{ value: Reminder['type']; label: string; icon: React.ReactNode }> = [
    { value: 'medicine', label: 'Medicine', icon: <Pill className="w-5 h-5" /> },
    { value: 'hydration', label: 'Hydration', icon: <Droplets className="w-5 h-5" /> },
    { value: 'activity', label: 'Activity', icon: <Activity className="w-5 h-5" /> },
    { value: 'appointment', label: 'Appointment', icon: <Calendar className="w-5 h-5" /> },
  ];

  const repeatOptions: Array<{ value: Reminder['repeatPattern']; label: string }> = [
    { value: 'none', label: 'One time' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
  ];

  useEffect(() => {
    if (id && userId) {
      loadReminder();
    }
  }, [id, userId]);

  const loadReminder = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const reminder = await reminderRepository.getById(parseInt(id));
      if (!reminder) {
        setError('Reminder not found');
        return;
      }

      const date = new Date(reminder.scheduledTime);
      setTitle(reminder.title);
      setType(reminder.type);
      setDescription(reminder.description || '');
      setHour(date.getHours());
      setMinute(date.getMinutes());
      setRepeatPattern(reminder.repeatPattern || 'none');
    } catch (err) {
      console.error('Failed to load reminder:', err);
      setError('Failed to load reminder');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !userId) {
      setError('Invalid reminder or patient');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const reminder = await reminderRepository.getById(parseInt(id));
      if (!reminder) {
        setError('Reminder not found');
        return;
      }

      // Create new timestamp with updated time
      const date = new Date(reminder.scheduledTime);
      date.setHours(hour, minute, 0, 0);
      const scheduledTime = date.getTime();

      await reminderService.updateReminder(parseInt(id), {
        title: title.trim(),
        type,
        description: description.trim() || undefined,
        scheduledTime,
        repeatPattern,
      });

      navigate('/reminders');
    } catch (err) {
      console.error('Failed to update reminder:', err);
      setError('Failed to update reminder. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No patient selected</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading reminder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/reminders')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Reminder</h1>
              <p className="text-gray-600 mt-1">Update reminder details</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Morning Medicine"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
              required
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {reminderTypes.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setType(option.value)}
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${
                    type === option.value
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {option.icon}
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Time
            </label>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">Hour</label>
                <select
                  value={hour}
                  onChange={(e) => setHour(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>
                      {i.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">Minute</label>
                <select
                  value={minute}
                  onChange={(e) => setMinute(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                >
                  {Array.from({ length: 60 }, (_, i) => (
                    <option key={i} value={i}>
                      {i.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Repeat Pattern */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Repeat
            </label>
            <div className="flex gap-3">
              {repeatOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setRepeatPattern(option.value)}
                  className={`flex-1 p-3 border-2 rounded-lg transition-all ${
                    repeatPattern === option.value
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any additional details..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/reminders')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Update Reminder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
