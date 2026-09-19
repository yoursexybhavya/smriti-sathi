/**
 * SMRITI SATHI — Sync Test Screen
 * 
 * Comprehensive test screen for Phase 9 synchronization.
 * Demonstrates the full offline → online sync flow.
 * 
 * Test scenarios:
 * 1. Start online, create data
 * 2. Go offline, create multiple records
 * 3. Verify pending sync
 * 4. Reconnect, trigger sync
 * 5. Verify synced
 * 6. Simulate failed sync
 * 7. Verify local data remains safe
 */

import { useState, useEffect, useCallback } from 'react';
import { SyncService } from '../../services/sync/SyncService';
import { ConnectivityService } from '../../services/sync/ConnectivityService';
import { MockCloudRepository } from '../../services/sync/MockCloudRepository';
import { useSyncState, useSyncStats } from '../../services/sync/useSync';
import { db, SyncEvent } from '../../database/db';
import { gameSessionRepository } from '../../database/repositories/GameSessionRepository';
import { reminderRepository } from '../../database/repositories/ReminderRepository';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Cloud,
  CloudOff,
  Plus,
  Trash2,
  RotateCcw,
  Play,
  Pause,
  Activity,
  Database,
  Server,
  ArrowRight,
  Shield,
  Clock,
  Zap,
} from 'lucide-react';

interface SyncTestScreenProps {
  onBack: () => void;
}

export default function SyncTestScreen({ onBack }: SyncTestScreenProps) {
  const syncState = useSyncState();
  const { stats, refresh: refreshStats } = useSyncStats();
  const [events, setEvents] = useState<SyncEvent[]>([]);
  const [testLog, setTestLog] = useState<string[]>([]);
  const [isRunningTest, setIsRunningTest] = useState(false);

  const addLog = useCallback((message: string) => {
    setTestLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  }, []);

  const refreshEvents = useCallback(async () => {
    const evts = await SyncService.getEvents();
    setEvents(evts);
  }, []);

  useEffect(() => {
    refreshEvents();
    const unsub = SyncService.subscribe(() => {
      refreshEvents();
      refreshStats();
    });
    return () => { unsub(); };
  }, [refreshEvents, refreshStats]);

  // Actions
  const goOnline = () => {
    ConnectivityService.setOnline();
    addLog('🟢 Connectivity: ONLINE (manual override)');
  };

  const goOffline = () => {
    ConnectivityService.setOffline();
    addLog('🔴 Connectivity: OFFLINE (manual override)');
  };

  const releaseConnectivity = () => {
    ConnectivityService.releaseOverride();
    addLog('⚪ Connectivity: Auto-detect mode');
  };

  const createGameResult = async () => {
    try {
      const id = await gameSessionRepository.create({
        userId: 1,
        gameType: Math.random() > 0.5 ? 'remember' : 'recognise',
        difficulty: Math.floor(Math.random() * 3) + 1,
        score: Math.floor(Math.random() * 100),
        totalObjects: Math.floor(Math.random() * 10) + 3,
        accuracy: Math.floor(Math.random() * 100),
        responseTime: Math.floor(Math.random() * 5000) + 500,
      });
      addLog(`📝 Created game session #${id} → sync event queued`);
      await refreshEvents();
    } catch (e) {
      addLog(`❌ Error creating game: ${e}`);
    }
  };

  const createReminder = async () => {
    try {
      const types: Array<'medicine' | 'hydration' | 'activity' | 'appointment'> = ['medicine', 'hydration', 'activity', 'appointment'];
      const id = await reminderRepository.create({
        userId: 1,
        type: types[Math.floor(Math.random() * types.length)],
        title: `Test Reminder ${Date.now() % 1000}`,
        scheduledTime: Date.now() + 3600000,
        status: 'pending',
      });
      addLog(`📝 Created reminder #${id} → sync event queued`);
      await refreshEvents();
    } catch (e) {
      addLog(`❌ Error creating reminder: ${e}`);
    }
  };

  const createMultipleRecords = async (count: number = 5) => {
    addLog(`📝 Creating ${count} records...`);
    for (let i = 0; i < count; i++) {
      await createGameResult();
      await new Promise(r => setTimeout(r, 50));
    }
    addLog(`✅ Created ${count} records`);
  };

  const triggerSync = async () => {
    addLog('🔄 Triggering sync...');
    const result = await SyncService.triggerSync();
    addLog(`✅ Sync complete: ${result.success} synced, ${result.failed} failed, ${result.skipped} skipped`);
  };

  const retryFailed = async () => {
    addLog('🔄 Retrying failed syncs...');
    const result = await SyncService.retryFailed();
    addLog(`✅ Retry: ${result.success} reset, ${result.failed} max retries exceeded`);
  };

  const enableFailures = () => {
    MockCloudRepository.setForceFailure(true);
    addLog('⚠️ Cloud: Force failure ENABLED');
  };

  const disableFailures = () => {
    MockCloudRepository.setForceFailure(false);
    addLog('✅ Cloud: Force failure DISABLED');
  };

  const setFailureRate = (rate: number) => {
    MockCloudRepository.setConfig({ failureRate: rate });
    addLog(`⚙️ Cloud: Failure rate set to ${(rate * 100).toFixed(0)}%`);
  };

  const resetAll = async () => {
    await SyncService.resetAll();
    MockCloudRepository.reset();
    ConnectivityService.releaseOverride();
    setTestLog([]);
    addLog('🗑️ All sync state reset');
    await refreshEvents();
  };

  const clearSynced = async () => {
    const count = await SyncService.clearSyncedEvents();
    addLog(`🧹 Cleared ${count} synced events`);
  };

  // Automated test sequence
  const runFullTest = async () => {
    setIsRunningTest(true);
    setTestLog([]);
    addLog('═══════════════════════════════════════');
    addLog('🧪 STARTING FULL SYNCHRONIZATION TEST');
    addLog('═══════════════════════════════════════');

    // Step 1: Start online
    addLog('');
    addLog('📋 Step 1: Start online');
    goOnline();
    await new Promise(r => setTimeout(r, 300));

    // Step 2: Create data while online
    addLog('');
    addLog('📋 Step 2: Create data while online');
    await createGameResult();
    await new Promise(r => setTimeout(r, 300));

    // Step 3: Sync immediately
    addLog('');
    addLog('📋 Step 3: Sync while online');
    await triggerSync();
    await new Promise(r => setTimeout(r, 300));

    // Step 4: Go offline
    addLog('');
    addLog('📋 Step 4: Go offline');
    goOffline();
    await new Promise(r => setTimeout(r, 300));

    // Step 5: Create multiple records offline
    addLog('');
    addLog('📋 Step 5: Create multiple records while offline');
    await createMultipleRecords(3);
    await new Promise(r => setTimeout(r, 300));

    // Step 6: Verify pending
    addLog('');
    addLog('📋 Step 6: Verify pending sync queue');
    const pendingBefore = await SyncService.getPendingEvents();
    addLog(`📊 Pending events: ${pendingBefore.length}`);

    // Step 7: Reconnect
    addLog('');
    addLog('📋 Step 7: Reconnect to network');
    goOnline();
    await new Promise(r => setTimeout(r, 500));

    // Step 8: Trigger sync
    addLog('');
    addLog('📋 Step 8: Trigger synchronization');
    await triggerSync();
    await new Promise(r => setTimeout(r, 300));

    // Step 9: Verify synced
    addLog('');
    addLog('📋 Step 9: Verify all synced');
    const statsAfter = await SyncService.getStats();
    addLog(`📊 Synced: ${statsAfter.synced}, Failed: ${statsAfter.failed}, Pending: ${statsAfter.pending}`);

    // Step 10: Simulate failed sync
    addLog('');
    addLog('📋 Step 10: Simulate failed sync');
    goOffline();
    await createMultipleRecords(2);
    goOnline();
    enableFailures();
    await triggerSync();
    await new Promise(r => setTimeout(r, 300));

    // Step 11: Verify local data safe
    addLog('');
    addLog('📋 Step 11: Verify local data remains safe');
    const allEvents = await db.syncEvents.toArray();
    addLog(`🛡️ Total sync events in local DB: ${allEvents.length} (data preserved!)`);
    const gameSessions = await db.gameSessions.toArray();
    addLog(`🛡️ Total game sessions in local DB: ${gameSessions.length} (data preserved!)`);

    // Cleanup
    disableFailures();
    
    addLog('');
    addLog('═══════════════════════════════════════');
    addLog('🧪 TEST COMPLETE');
    addLog('═══════════════════════════════════════');
    
    setIsRunningTest(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-[var(--color-accent-blue)/15] text-[var(--color-accent-blue)] border-[var(--color-accent-blue)]/30';
      case 'syncing': return 'bg-[var(--color-accent-blue)/15] text-[var(--color-accent-blue)] border-[var(--color-accent-blue)]/30';
      case 'synced': return 'bg-[var(--color-success-bg)] text-[var(--color-success)] border-[var(--color-success)]/30';
      case 'failed': return 'bg-[var(--color-error-bg)] text-[var(--color-error)] border-[var(--color-error)]/30';
      default: return 'bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] border-[var(--color-border)]';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-subtle)] pb-8">
      {/* Header */}
      <div className="bg-[var(--color-card)] border-b border-[var(--color-border)] px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-[var(--color-success)] font-semibold text-lg flex items-center gap-2"
          >
            ← Back
          </button>
          <h1 className="text-lg font-bold text-[var(--color-text)]">Sync Test</h1>
          <div className="w-16" />
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Current Status */}
        <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-4">
          <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3 flex items-center gap-2">
            <Activity size={16} />
            Current Sync Status
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-3 rounded-xl border ${
              syncState.connectivityState === 'online' 
                ? 'bg-[var(--color-success-bg)] border-[var(--color-success)]/30' 
                : 'bg-[var(--color-warning-bg)] border-[var(--color-accent-amber)]/30'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                {syncState.connectivityState === 'online' 
                  ? <Wifi size={16} className="text-[var(--color-success)]" />
                  : <WifiOff size={16} className="text-[var(--color-accent-amber)]" />
                }
                <span className={`text-xs font-medium ${
                  syncState.connectivityState === 'online' ? 'text-[var(--color-success)]' : 'text-[var(--color-accent-amber)]'
                }`}>
                  Connectivity
                </span>
              </div>
              <span className={`text-lg font-bold ${
                syncState.connectivityState === 'online' ? 'text-[var(--color-success)]' : 'text-[var(--color-accent-amber)]'
              }`}>
                {syncState.connectivityState.toUpperCase()}
              </span>
            </div>

            <div className={`p-3 rounded-xl border ${
              syncState.status === 'synced' ? 'bg-[var(--color-success-bg)] border-[var(--color-success)]/30' :
              syncState.status === 'syncing' ? 'bg-[var(--color-accent-blue)/15] border-[var(--color-accent-blue)]/30' :
              syncState.status === 'pending' ? 'bg-[var(--color-accent-blue)/15] border-[var(--color-accent-blue)]/30' :
              syncState.status === 'error' ? 'bg-[var(--color-error-bg)] border-[var(--color-error)]/30' :
              syncState.status === 'offline' ? 'bg-[var(--color-warning-bg)] border-[var(--color-accent-amber)]/30' :
              'bg-[var(--color-bg-subtle)] border-[var(--color-border)]'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <Cloud size={16} className={
                  syncState.status === 'synced' ? 'text-[var(--color-success)]' :
                  syncState.status === 'syncing' ? 'text-[var(--color-accent-blue)]' :
                  syncState.status === 'pending' ? 'text-[var(--color-accent-blue)]' :
                  syncState.status === 'error' ? 'text-[var(--color-error)]' :
                  'text-[var(--color-text-muted)]'
                } />
                <span className="text-xs font-medium text-[var(--color-text-secondary)]">Sync</span>
              </div>
              <span className={`text-lg font-bold ${
                syncState.status === 'synced' ? 'text-[var(--color-success)]' :
                syncState.status === 'syncing' ? 'text-[var(--color-accent-blue)]' :
                syncState.status === 'pending' ? 'text-[var(--color-accent-blue)]' :
                syncState.status === 'error' ? 'text-[var(--color-error)]' :
                'text-[var(--color-text-muted)]'
              }`}>
                {syncState.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Counters */}
          <div className="flex gap-2 mt-3">
            <div className="flex-1 text-center p-2 bg-[var(--color-accent-blue)/15] rounded-lg">
              <div className="text-lg font-bold text-[var(--color-accent-blue)]">{syncState.pendingCount}</div>
              <div className="text-xs text-[var(--color-accent-blue)]/80">Pending</div>
            </div>
            <div className="flex-1 text-center p-2 bg-[var(--color-success-bg)] rounded-lg">
              <div className="text-lg font-bold text-[var(--color-success)]">{syncState.syncedCount}</div>
              <div className="text-xs text-[var(--color-success)]/80">Synced</div>
            </div>
            <div className="flex-1 text-center p-2 bg-[var(--color-error-bg)] rounded-lg">
              <div className="text-lg font-bold text-[var(--color-error)]">{syncState.failedCount}</div>
              <div className="text-xs text-[var(--color-error)]/80">Failed</div>
            </div>
          </div>
        </div>

        {/* Connectivity Controls */}
        <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-4">
          <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3 flex items-center gap-2">
            <Wifi size={16} />
            Connectivity Control
          </h2>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={goOnline}
              className="flex items-center justify-center gap-1 px-3 py-3 bg-[var(--color-success-bg)] text-[var(--color-success)] rounded-xl font-medium text-sm hover:bg-[var(--color-success-bg)]/80 active:scale-95 transition-all"
            >
              <Wifi size={16} />
              Online
            </button>
            <button
              onClick={goOffline}
              className="flex items-center justify-center gap-1 px-3 py-3 bg-[var(--color-warning-bg)] text-[var(--color-accent-amber)] rounded-xl font-medium text-sm hover:bg-[var(--color-warning-bg)]/80 active:scale-95 transition-all"
            >
              <WifiOff size={16} />
              Offline
            </button>
            <button
              onClick={releaseConnectivity}
              className="flex items-center justify-center gap-1 px-3 py-3 bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] rounded-xl font-medium text-sm hover:bg-[var(--color-border)] active:scale-95 transition-all"
            >
              <RotateCcw size={16} />
              Auto
            </button>
          </div>
        </div>

        {/* Data Creation */}
        <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-4">
          <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3 flex items-center gap-2">
            <Database size={16} />
            Create Data (triggers sync events)
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={createGameResult}
              className="flex items-center justify-center gap-2 px-3 py-3 bg-[var(--color-success)] text-white rounded-xl font-medium text-sm hover:bg-[var(--color-success)]/90 active:scale-95 transition-all"
            >
              <Plus size={16} />
              Game Result
            </button>
            <button
              onClick={createReminder}
              className="flex items-center justify-center gap-2 px-3 py-3 bg-[var(--color-accent-amber)] text-white rounded-xl font-medium text-sm hover:bg-[var(--color-accent-amber)]/90 active:scale-95 transition-all"
            >
              <Plus size={16} />
              Reminder
            </button>
            <button
              onClick={() => createMultipleRecords(5)}
              className="col-span-2 flex items-center justify-center gap-2 px-3 py-3 bg-[var(--color-accent-blue)] text-white rounded-xl font-medium text-sm hover:bg-[var(--color-accent-blue)]/90 active:scale-95 transition-all"
            >
              <Plus size={16} />
              Create 5 Records
            </button>
          </div>
        </div>

        {/* Sync Actions */}
        <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-4">
          <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3 flex items-center gap-2">
            <RefreshCw size={16} />
            Sync Actions
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={triggerSync}
              disabled={syncState.isSyncing || ConnectivityService.isOffline()}
              className="flex items-center justify-center gap-2 px-3 py-3 bg-[var(--color-accent-blue)] text-white rounded-xl font-medium text-sm hover:bg-[var(--color-accent-blue)]/90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw size={16} className={syncState.isSyncing ? 'animate-spin' : ''} />
              Sync Now
            </button>
            <button
              onClick={retryFailed}
              disabled={syncState.failedCount === 0}
              className="flex items-center justify-center gap-2 px-3 py-3 bg-[var(--color-accent-amber)] text-white rounded-xl font-medium text-sm hover:bg-[var(--color-accent-amber)]/90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw size={16} />
              Retry Failed
            </button>
            <button
              onClick={clearSynced}
              className="flex items-center justify-center gap-2 px-3 py-3 bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] rounded-xl font-medium text-sm hover:bg-[var(--color-border)] active:scale-95 transition-all"
            >
              <Trash2 size={16} />
              Clear Synced
            </button>
            <button
              onClick={resetAll}
              className="flex items-center justify-center gap-2 px-3 py-3 bg-[var(--color-error-bg)] text-[var(--color-error)] rounded-xl font-medium text-sm hover:bg-[var(--color-error-bg)]/80 active:scale-95 transition-all"
            >
              <Trash2 size={16} />
              Reset All
            </button>
          </div>
        </div>

        {/* Cloud Simulation */}
        <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-4">
          <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3 flex items-center gap-2">
            <Server size={16} />
            Cloud Simulation
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={enableFailures}
              className="flex items-center justify-center gap-2 px-3 py-3 bg-[var(--color-error-bg)] text-[var(--color-error)] rounded-xl font-medium text-sm hover:bg-[var(--color-error-bg)]/80 active:scale-95 transition-all"
            >
              <AlertTriangle size={16} />
              Force Fail
            </button>
            <button
              onClick={disableFailures}
              className="flex items-center justify-center gap-2 px-3 py-3 bg-[var(--color-success-bg)] text-[var(--color-success)] rounded-xl font-medium text-sm hover:bg-[var(--color-success-bg)]/80 active:scale-95 transition-all"
            >
              <CheckCircle2 size={16} />
              Allow Success
            </button>
            <button
              onClick={() => setFailureRate(0.3)}
              className="flex items-center justify-center gap-1 px-3 py-3 bg-[var(--color-warning-bg)] text-[var(--color-accent-amber)] rounded-xl font-medium text-sm hover:bg-[var(--color-warning-bg)]/80 active:scale-95 transition-all"
            >
              30% Fail
            </button>
            <button
              onClick={() => setFailureRate(0)}
              className="flex items-center justify-center gap-1 px-3 py-3 bg-[var(--color-success-bg)] text-[var(--color-success)] rounded-xl font-medium text-sm hover:bg-[var(--color-success-bg)]/80 active:scale-95 transition-all"
            >
              0% Fail
            </button>
          </div>
        </div>

        {/* Automated Test */}
        <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-4">
          <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3 flex items-center gap-2">
            <Zap size={16} />
            Automated Test
          </h2>
          <button
            onClick={runFullTest}
            disabled={isRunningTest}
            className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-gradient-to-r from-[var(--color-success)] to-[var(--color-success)]/80 text-white rounded-xl font-bold text-base hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isRunningTest ? (
              <>
                <RefreshCw size={20} className="animate-spin" />
                Running Test...
              </>
            ) : (
              <>
                <Play size={20} />
                Run Full Sync Test
              </>
            )}
          </button>
          <p className="text-xs text-[var(--color-text-muted)] mt-2 text-center">
            Tests: online→create→offline→create→pending→reconnect→sync→verify→fail→verify safe
          </p>
        </div>

        {/* Sync Events List */}
        <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-4">
          <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3 flex items-center gap-2">
            <Clock size={16} />
            Sync Events ({events.length})
          </h2>
          {events.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)] text-center py-4">No sync events yet</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {events.slice(0, 20).map((event) => (
                <div
                  key={event.id}
                  className={`flex items-center justify-between p-2.5 rounded-lg border ${getStatusColor(event.syncStatus)}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono">#{event.id}</span>
                    <span className="text-xs font-medium">{event.entityType}</span>
                    <span className="text-xs opacity-75">#{event.entityId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold">{event.operation}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-white/50 font-medium">
                      {event.syncStatus}
                    </span>
                    {event.retryCount > 0 && (
                      <span className="text-xs text-[var(--color-error)]">×{event.retryCount}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Data Safety Verification */}
        <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-4">
          <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3 flex items-center gap-2">
            <Shield size={16} />
            Data Safety
          </h2>
          <div className="bg-[var(--color-success-bg)] border border-[var(--color-success)]/30 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={16} className="text-[var(--color-success)]" />
              <span className="text-sm font-medium text-[var(--color-success)]">Local data is NEVER deleted until sync confirmed</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[var(--color-card)] rounded-lg p-2">
                <span className="text-[var(--color-success)] font-bold">{stats?.synced || 0}</span>
                <span className="text-[var(--color-success)]/80 ml-1">confirmed in cloud</span>
              </div>
              <div className="bg-[var(--color-card)] rounded-lg p-2">
                <span className="text-[var(--color-accent-blue)] font-bold">{stats?.pending || 0}</span>
                <span className="text-[var(--color-accent-blue)]/80 ml-1">safe locally</span>
              </div>
              <div className="bg-[var(--color-card)] rounded-lg p-2">
                <span className="text-[var(--color-error)] font-bold">{stats?.failed || 0}</span>
                <span className="text-[var(--color-error)]/80 ml-1">preserved locally</span>
              </div>
              <div className="bg-[var(--color-card)] rounded-lg p-2">
                <span className="text-[var(--color-accent-purple)] font-bold">{stats?.cloudStats.totalSynced || 0}</span>
                <span className="text-[var(--color-accent-purple)]/80 ml-1">cloud records</span>
              </div>
            </div>
          </div>
        </div>

        {/* Idempotency Info */}
        <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-4">
          <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3 flex items-center gap-2">
            <Activity size={16} />
            Idempotency
          </h2>
          <div className="bg-[var(--color-accent-blue)/15] border border-[var(--color-accent-blue)]/30 rounded-xl p-3">
            <p className="text-xs text-[var(--color-accent-blue)]">
              Each sync event has a unique UUID. The cloud checks if a UUID was already processed 
              before syncing, preventing duplicate operations.
            </p>
            {stats && (
              <div className="mt-2 text-xs text-[var(--color-accent-blue)]/90">
                Cloud records: {stats.cloudStats.totalAttempts} attempts, 
                {stats.cloudStats.totalSynced} unique synced
              </div>
            )}
          </div>
        </div>

        {/* Test Log */}
        {testLog.length > 0 && (
          <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-4">
            <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3 flex items-center gap-2">
              <Activity size={16} />
              Test Log
            </h2>
            <div className="bg-[var(--color-bg)] rounded-xl p-3 max-h-64 overflow-y-auto">
              {testLog.map((log, i) => (
                <div key={i} className="text-xs font-mono text-[var(--color-success)] leading-5">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Architecture Info */}
        <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-4">
          <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3">Architecture Flow</h2>
          <div className="flex flex-col items-center gap-1 text-xs text-[var(--color-text-secondary)]">
            <div className="flex items-center gap-2 bg-[var(--color-accent-blue)/15] px-3 py-2 rounded-lg w-full justify-center">
              <Database size={14} /> Local SQLite (Dexie)
            </div>
            <ArrowRight size={14} className="rotate-90" />
            <div className="flex items-center gap-2 bg-[var(--color-warning-bg)] px-3 py-2 rounded-lg w-full justify-center">
              <Clock size={14} /> Pending Sync Queue
            </div>
            <ArrowRight size={14} className="rotate-90" />
            <div className="flex items-center gap-2 bg-[var(--color-success-bg)] px-3 py-2 rounded-lg w-full justify-center">
              <Wifi size={14} /> Connectivity Check
            </div>
            <ArrowRight size={14} className="rotate-90" />
            <div className="flex items-center gap-2 bg-[var(--color-accent-blue)/15] px-3 py-2 rounded-lg w-full justify-center">
              <RefreshCw size={14} /> SyncService (retry, idempotency)
            </div>
            <ArrowRight size={14} className="rotate-90" />
            <div className="flex items-center gap-2 bg-[var(--color-accent-purple)/15] px-3 py-2 rounded-lg w-full justify-center">
              <Server size={14} /> Cloud (Mock → FastAPI/PostgreSQL)
            </div>
            <ArrowRight size={14} className="rotate-90" />
            <div className="flex items-center gap-2 bg-[var(--color-success-bg)] px-3 py-2 rounded-lg w-full justify-center">
              <CheckCircle2 size={14} /> Synced ✓
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
