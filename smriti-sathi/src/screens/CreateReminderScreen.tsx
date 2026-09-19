import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Pill, Droplets, Activity, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { reminderService } from '../services/ReminderService';
import { Reminder } from '../database/db';
import { createTimestampForToday } from '../utils/dateUtils';

export default function CreateReminderScreen() {
  const navigate = useNavigate();
  const { state } = useApp();
  const userId = state.currentPatient?.id ? parseInt(state.currentPatient.id) : undefined;

  const [title, setTitle] = useState('');
  const [type, setType] = useState<Reminder['type']>('medicine');
  const [description, setDescription] = useState('');
  const [hour, setHour] = useState(9);
  const [minute, setMinute] = useState(0);
  const [repeatPattern, setRepeatPattern] = useState<Reminder['repeatPattern']>('none');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      setError('No patient selected');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const scheduledTime = createTimestampForToday(hour, minute);
      
      await reminderService.createReminder(
        userId,
        type,
        title.trim(),
        scheduledTime,
        description.trim() || undefined,
        repeatPattern
      );

      navigate('/reminders');
    } catch (err) {
      console.error('Failed to create reminder:', err);
      setError('Failed to create reminder. Please try again.');
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
              <h1 className="text-3xl font-bold text-gray-900">Create Reminder</h1>
              <p className="text-gray-600 mt-1">Set up a new reminder</p>
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
              {saving ? 'Saving...' : 'Save Reminder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
