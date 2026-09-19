/**
 * SMRITI SATHI — Connectivity React Hook (Legacy compatibility)
 * 
 * This file provides backward compatibility with the existing useConnectivity hook
 * while delegating to the new ConnectivityService.
 */

import { useState, useEffect } from 'react';
import { ConnectivityService } from './sync/ConnectivityService';

export interface ConnectivityStatus {
  isOnline: boolean;
  lastChecked: number;
}

export function useConnectivity(): ConnectivityStatus {
  const [status, setStatus] = useState<ConnectivityStatus>({
    isOnline: ConnectivityService.isOnline(),
    lastChecked: Date.now(),
  });

  useEffect(() => {
    const unsubscribe = ConnectivityService.subscribe((event) => {
      setStatus({
        isOnline: event.state === 'online',
        lastChecked: event.timestamp,
      });
    });

    // Set initial state
    setStatus({
      isOnline: ConnectivityService.isOnline(),
      lastChecked: Date.now(),
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return status;
}
