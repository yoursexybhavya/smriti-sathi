import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Bell, Check, Clock, AlertCircle, Pill, Droplets, Activity, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { reminderService } from '../services/ReminderService';
import { Reminder } from '../database/db';
import { formatTime, formatDate, isToday } from '../utils/dateUtils';

export default function ReminderListScreen() {
  const navigate = useNavigate();
  const { state } = useApp();
  const userId = state.currentPatient?.id ? parseInt(state.currentPatient.id) : undefined;

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'today' | 'pending'>('today');

  useEffect(() => {
    if (userId) {
      loadReminders();
    }
  }, [userId, filter]);

  const loadReminders = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      let data: Reminder[];
      switch (filter) {
        case 'today':
          data = await reminderService.getTodayReminders(userId);
          break;
        case 'pending':
          data = await reminderService.getPendingReminders(userId);
          break;
        default:
          data = await reminderService.getAllReminders(userId);
      }
      setReminders(data);
    } catch (error) {
      console.error('Failed to load reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (reminderId: number) => {
    if (!userId) return;

    try {
      await reminderService.completeReminder(reminderId, userId);
      await loadReminders();
    } catch (error) {
      console.error('Failed to complete reminder:', error);
    }
  };

  const handleSnooze = async (reminderId: number) => {
    try {
      await reminderService.snoozeReminder(reminderId, 10);
      await loadReminders();
    } catch (error) {
      console.error('Failed to snooze reminder:', error);
    }
  };

  const handleDelete = async (reminderId: number) => {
    if (!confirm('Delete this reminder?')) return;

    try {
      await reminderService.deleteReminder(reminderId);
      await loadReminders();
    } catch (error) {
      console.error('Failed to delete reminder:', error);
    }
  };

  const getReminderIcon = (type: Reminder['type']) => {
    switch (type) {
      case 'medicine':
        return <Pill className="w-6 h-6 text-purple-600" />;
      case 'hydration':
        return <Droplets className="w-6 h-6 text-blue-600" />;
      case 'activity':
        return <Activity className="w-6 h-6 text-green-600" />;
      case 'appointment':
        return <Calendar className="w-6 h-6 text-orange-600" />;
    }
  };

  const getStatusColor = (status: Reminder['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'missed':
        return 'bg-red-100 text-red-800';
    }
  };

  const getStatusIcon = (status: Reminder['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <Check className="w-4 h-4" />;
      case 'missed':
        return <AlertCircle className="w-4 h-4" />;
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
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reminders</h1>
              <p className="text-gray-600 mt-1">Manage your daily reminders</p>
            </div>
            <button
              onClick={() => navigate('/reminders/create')}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="font-semibold">Add Reminder</span>
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mt-6">
            {(['today', 'pending', 'all'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === f
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading reminders...</p>
          </div>
        ) : reminders.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No reminders found</p>
            <button
              onClick={() => navigate('/reminders/create')}
              className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Create Your First Reminder
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {reminders.map((reminder) => (
              <div
                key={reminder.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 p-3 bg-gray-50 rounded-lg">
                    {getReminderIcon(reminder.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {reminder.title}
                        </h3>
                        {reminder.description && (
                          <p className="text-gray-600 mt-1">{reminder.description}</p>
                        )}
                      </div>
                      <span
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          reminder.status
                        )}`}
                      >
                        {getStatusIcon(reminder.status)}
                        {reminder.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(reminder.scheduledTime)}</span>
                      </div>
                      {isToday(reminder.scheduledTime) ? (
                        <span className="text-green-600 font-medium">Today</span>
                      ) : (
                        <span>{formatDate(reminder.scheduledTime)}</span>
                      )}
                      {reminder.repeatPattern && reminder.repeatPattern !== 'none' && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                          Repeats {reminder.repeatPattern}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    {reminder.status === 'pending' && (
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleComplete(reminder.id!)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                          Complete
                        </button>
                        <button
                          onClick={() => handleSnooze(reminder.id!)}
                          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                        >
                          <Clock className="w-4 h-4" />
                          Snooze 10m
                        </button>
                        <button
                          onClick={() => navigate(`/reminders/${reminder.id}/edit`)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(reminder.id!)}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
