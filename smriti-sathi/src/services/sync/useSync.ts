/**
 * SMRITI SATHI — Sync React Hook
 * 
 * Connects SyncService and ConnectivityService to React components.
 * Provides reactive sync state for UI updates.
 */

import { useState, useEffect, useCallback } from 'react';
import { SyncService, SyncState, SyncStats } from './SyncService';
import { ConnectivityService, ConnectivityState } from './ConnectivityService';

export function useSyncState(): SyncState & {
  connectivityState: ConnectivityState;
  triggerSync: () => Promise<{ success: number; failed: number; skipped: number }>;
  retryFailed: () => Promise<{ success: number; failed: number }>;
} {
  const [syncState, setSyncState] = useState<SyncState>(SyncService.getState());
  const [connectivityState, setConnectivityState] = useState<ConnectivityState>(
    ConnectivityService.getState()
  );

  useEffect(() => {
    const unsubSync = SyncService.subscribe((state) => {
      setSyncState(state);
    });

    const unsubConnectivity = ConnectivityService.subscribe((event) => {
      setConnectivityState(event.state);
    });

    // Initial state
    setSyncState(SyncService.getState());
    setConnectivityState(ConnectivityService.getState());

    return () => {
      unsubSync();
      unsubConnectivity();
    };
  }, []);

  const triggerSync = useCallback(async () => {
    return await SyncService.triggerSync();
  }, []);

  const retryFailed = useCallback(async () => {
    return await SyncService.retryFailed();
  }, []);

  return {
    ...syncState,
    connectivityState,
    triggerSync,
    retryFailed,
  };
}

export function useSyncStats() {
  const [stats, setStats] = useState<SyncStats | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const s = await SyncService.getStats();
    setStats(s);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    
    const unsub = SyncService.subscribe(() => {
      refresh();
    });

    return () => {
      unsub();
    };
  }, [refresh]);

  return { stats, loading, refresh };
}
