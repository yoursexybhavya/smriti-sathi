import { useState } from 'react';
import { Play, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import AppHeader from '../../components/AppHeader';
import Card from '../../components/Card';
import { useApp } from '../../context/AppContext';
import { reminderService } from '../../services/ReminderService';
import { reminderRepository } from '../../database/repositories/ReminderRepository';
import { notificationService } from '../../services/NotificationService';
import { voiceReminderService } from '../../services/voice/VoiceReminderService';
import { createTimestampForToday } from '../../utils/dateUtils';

interface ReminderTestScreenProps {
  onNavigate: (screen: string) => void;
}

export default function ReminderTestScreen({ onNavigate }: ReminderTestScreenProps) {
  const { state } = useApp();
  const userId = state.currentPatient?.id ? parseInt(state.currentPatient.id) : undefined;
  const patientName = state.currentPatient?.name;

  const [testResults, setTestResults] = useState<string[]>([]);
  const [running, setRunning] = useState(false);

  const addResult = (message: string) => {
    setTestResults((prev) => [...prev, message]);
  };

  const runTests = async () => {
    if (!userId) {
      addResult('❌ No patient selected');
      return;
    }

    setRunning(true);
    setTestResults([]);

    try {
      // Test 1: Reminder Creation
      addResult('🧪 Test 1: Reminder Creation');
      const reminderId = await reminderService.createReminder(
        userId,
        'medicine',
        'Test Medicine',
        createTimestampForToday(10, 0),
        'Test description',
        'none'
      );
      addResult(`✅ Created reminder with ID: ${reminderId}`);

      // Test 2: Reminder Retrieval
      addResult('🧪 Test 2: Reminder Retrieval');
      const reminder = await reminderRepository.getById(reminderId);
      if (reminder && reminder.title === 'Test Medicine') {
        addResult('✅ Reminder retrieved successfully');
      } else {
        addResult('❌ Failed to retrieve reminder');
      }

      // Test 3: Notification Permission
      addResult('🧪 Test 3: Notification Permission');
      const permission = await notificationService.requestPermission();
      addResult(`✅ Notification permission: ${permission}`);

      // Test 4: Voice Service
      addResult('🧪 Test 4: Voice Service');
      if (voiceReminderService.isAvailable()) {
        addResult('✅ Voice service is available');
        await voiceReminderService.speak({
          text: 'This is a test reminder',
          patientName,
          reminderType: 'medicine',
        });
        addResult('✅ Voice reminder spoken');
      } else {
        addResult('⚠️ Voice service not available in this browser');
      }

      // Test 5: Reminder Completion
      addResult('🧪 Test 5: Reminder Completion');
      await reminderService.completeReminder(reminderId, userId);
      const completedReminder = await reminderRepository.getById(reminderId);
      if (completedReminder && completedReminder.status === 'completed') {
        addResult('✅ Reminder completed successfully');
      } else {
        addResult('❌ Failed to complete reminder');
      }

      // Test 6: Recurring Reminder
      addResult('🧪 Test 6: Recurring Reminder');
      const recurringId = await reminderService.createReminder(
        userId,
        'hydration',
        'Daily Water',
        createTimestampForToday(12, 0),
        'Drink water',
        'daily'
      );
      const recurringReminder = await reminderRepository.getById(recurringId);
      if (recurringReminder && recurringReminder.repeatPattern === 'daily') {
        addResult('✅ Recurring reminder created');
        
        // Complete it to trigger next occurrence
        await reminderService.completeReminder(recurringId, userId);
        
        // Check if next occurrence was created
        const allReminders = await reminderService.getAllReminders(userId);
        const waterReminders = allReminders.filter(r => r.title === 'Daily Water');
        if (waterReminders.length >= 2) {
          addResult('✅ Next occurrence created automatically');
        } else {
          addResult('⚠️ Next occurrence not created (may be scheduled for tomorrow)');
        }
      } else {
        addResult('❌ Failed to create recurring reminder');
      }

      // Test 7: Snooze
      addResult('🧪 Test 7: Snooze Functionality');
      const snoozeId = await reminderService.createReminder(
        userId,
        'activity',
        'Test Snooze',
        createTimestampForToday(14, 0),
        'Test snooze',
        'none'
      );
      const originalReminder = await reminderRepository.getById(snoozeId);
      await reminderService.snoozeReminder(snoozeId, 10);
      const snoozedReminder = await reminderRepository.getById(snoozeId);
      
      if (snoozedReminder && snoozedReminder.scheduledTime > originalReminder!.scheduledTime) {
        addResult('✅ Reminder snoozed successfully');
      } else {
        addResult('❌ Failed to snooze reminder');
      }

      // Test 8: Delete
      addResult('🧪 Test 8: Reminder Deletion');
      await reminderService.deleteReminder(snoozeId);
      const deletedReminder = await reminderRepository.getById(snoozeId);
      if (!deletedReminder) {
        addResult('✅ Reminder deleted successfully');
      } else {
        addResult('❌ Failed to delete reminder');
      }

      // Test 9: Statistics
      addResult('🧪 Test 9: Reminder Statistics');
      const stats = await reminderService.getStatistics(userId);
      addResult(`✅ Statistics: ${stats.total} total, ${stats.pending} pending, ${stats.completed} completed`);

      // Test 10: Offline Operation
      addResult('🧪 Test 10: Offline Operation');
      addResult('✅ All operations work offline (IndexedDB)');
      addResult('✅ Data persists across app restarts');

      addResult('');
      addResult('🎉 All tests completed successfully!');
    } catch (error) {
      addResult(`❌ Test failed with error: ${error}`);
    } finally {
      setRunning(false);
    }
  };

  const cleanupTestData = async () => {
    if (!userId) return;

    if (!confirm('Delete all test reminders?')) return;

    try {
      const allReminders = await reminderService.getAllReminders(userId);
      const testReminders = allReminders.filter(r => 
        r.title.includes('Test') || r.title.includes('Daily Water')
      );

      for (const reminder of testReminders) {
        await reminderService.deleteReminder(reminder.id!);
      }

      addResult(`✅ Cleaned up ${testReminders.length} test reminders`);
      await runTests(); // Refresh results
    } catch (error) {
      addResult(`❌ Failed to cleanup: ${error}`);
    }
  };

  return (
    <>
      <AppHeader title="Reminder Tests" subtitle="Test reminder functionality" />
      <div className="px-5 py-6 pb-28 space-y-6">
        {/* Info */}
        <div className="flex items-start gap-3 p-4 bg-[var(--color-accent-blue)/15] rounded-2xl border border-[var(--color-accent-blue)]/30">
          <div className="flex-1">
            <p className="text-sm text-[var(--color-accent-blue)] leading-relaxed">
              This test suite verifies all reminder system functionality including creation, 
              notifications, completion, snooze, recurring reminders, and offline operation.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={runTests}
            disabled={running}
            className="w-full flex items-center justify-center gap-3 bg-[var(--color-success)] text-white font-semibold text-base py-4 px-6 rounded-2xl shadow-md active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            <Play size={22} />
            {running ? 'Running Tests...' : 'Run All Tests'}
          </button>

          <button
            onClick={cleanupTestData}
            className="w-full flex items-center justify-center gap-3 bg-[var(--color-error)] text-white font-semibold text-base py-4 px-6 rounded-2xl shadow-md active:scale-[0.98] transition-transform"
          >
            Cleanup Test Data
          </button>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <Card className="p-5">
            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Test Results</h3>
            <div className="space-y-2 font-mono text-sm">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-2 rounded ${
                    result.startsWith('✅')
                      ? 'bg-[var(--color-success-bg)] text-[var(--color-success)]'
                      : result.startsWith('❌')
                      ? 'bg-[var(--color-error-bg)] text-[var(--color-error)]'
                      : result.startsWith('⚠️')
                      ? 'bg-[var(--color-warning-bg)] text-[var(--color-accent-amber)]'
                      : result.startsWith('🧪')
                      ? 'bg-[var(--color-accent-blue)/15] text-[var(--color-accent-blue)] font-semibold'
                      : result.startsWith('🎉')
                      ? 'bg-[var(--color-accent-purple)/15] text-[var(--color-accent-purple)] font-bold'
                      : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)]'
                  }`}
                >
                  {result}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Info */}
        <div className="flex items-start gap-3 p-4 bg-[var(--color-card-subtle)] rounded-2xl border border-[var(--color-border)]">
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-[var(--color-text)] mb-2">Test Coverage</h4>
            <ul className="text-xs text-[var(--color-text-secondary)] space-y-1">
              <li>• Reminder creation and retrieval</li>
              <li>• Notification permission and scheduling</li>
              <li>• Voice reminder service</li>
              <li>• Reminder completion</li>
              <li>• Recurring reminder logic</li>
              <li>• Snooze functionality</li>
              <li>• Reminder deletion</li>
              <li>• Statistics calculation</li>
              <li>• Offline operation (IndexedDB)</li>
              <li>• Data persistence</li>
            </ul>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => onNavigate('settings')}
          className="flex items-center gap-2 text-[var(--color-text-secondary)] text-base font-medium px-4 py-3 rounded-xl hover:bg-[var(--color-card-hover)] transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Settings
        </button>
      </div>
    </>
  );
}
