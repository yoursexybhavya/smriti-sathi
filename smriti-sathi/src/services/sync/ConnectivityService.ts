/**
 * SMRITI SATHI — Connectivity Service
 * 
 * Manages network connectivity detection and provides manual override
 * for testing synchronization behavior.
 * 
 * Architecture supports:
 * - Browser online/offline events
 * - Manual override for testing
 * - Event-based notifications
 * - Deterministic behavior
 */

export type ConnectivityState = 'online' | 'offline';

export interface ConnectivityEvent {
  state: ConnectivityState;
  timestamp: number;
  source: 'auto' | 'manual';
}

type ConnectivityListener = (event: ConnectivityEvent) => void;

class ConnectivityServiceClass {
  private state: ConnectivityState;
  private manualOverride: boolean = false;
  private listeners: Set<ConnectivityListener> = new Set();
  private lastEvent: ConnectivityEvent | null = null;

  constructor() {
    this.state = navigator.onLine ? 'online' : 'offline';
    this.setupBrowserListeners();
  }

  private setupBrowserListeners(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        if (!this.manualOverride) {
          this.setState('online', 'auto');
        }
      });

      window.addEventListener('offline', () => {
        if (!this.manualOverride) {
          this.setState('offline', 'auto');
        }
      });
    }
  }

  private setState(state: ConnectivityState, source: 'auto' | 'manual'): void {
    const previous = this.state;
    this.state = state;
    
    const event: ConnectivityEvent = {
      state,
      timestamp: Date.now(),
      source,
    };
    
    this.lastEvent = event;
    
    // Notify listeners only on state change
    if (previous !== state) {
      this.listeners.forEach(listener => listener(event));
    }
  }

  // Public API
  getState(): ConnectivityState {
    return this.state;
  }

  isOnline(): boolean {
    return this.state === 'online';
  }

  isOffline(): boolean {
    return this.state === 'offline';
  }

  getLastEvent(): ConnectivityEvent | null {
    return this.lastEvent;
  }

  // Manual override for testing
  setOnline(): void {
    this.manualOverride = true;
    this.setState('online', 'manual');
  }

  setOffline(): void {
    this.manualOverride = true;
    this.setState('offline', 'manual');
  }

  // Release manual override, return to auto-detection
  releaseOverride(): void {
    this.manualOverride = false;
    const browserState = navigator.onLine ? 'online' : 'offline';
    this.setState(browserState, 'auto');
  }

  isManualOverride(): boolean {
    return this.manualOverride;
  }

  // Event subscription
  subscribe(listener: ConnectivityListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Cleanup
  destroy(): void {
    this.listeners.clear();
    this.manualOverride = false;
  }
}

// Singleton instance
export const ConnectivityService = new ConnectivityServiceClass();

// React hook for components
export function useConnectivityState(): {
  state: ConnectivityState;
  isOnline: boolean;
  isOffline: boolean;
  setOnline: () => void;
  setOffline: () => void;
  releaseOverride: () => void;
  isManualOverride: boolean;
} {
  // This is a simplified hook - actual React hook is in ConnectivityService.tsx
  return {
    state: ConnectivityService.getState(),
    isOnline: ConnectivityService.isOnline(),
    isOffline: ConnectivityService.isOffline(),
    setOnline: () => ConnectivityService.setOnline(),
    setOffline: () => ConnectivityService.setOffline(),
    releaseOverride: () => ConnectivityService.releaseOverride(),
    isManualOverride: ConnectivityService.isManualOverride(),
  };
}
