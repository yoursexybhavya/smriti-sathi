/**
 * SMRITI SATHI — Safety Dashboard
 * 
 * Caregiver interface for advanced safety features.
 * 
 * ⚠️ IMPORTANT DISCLAIMERS:
 * - Fall detection is DEMO ONLY — not medically validated
 * - Location tracking is SIMULATED — not real GPS
 * - Emergency alerts are MOCK — do not contact real services
 * - Emotion recognition is FUTURE RESEARCH — not implemented
 * 
 * These features are for demonstration and testing only.
 * They are NOT substitutes for proper medical monitoring or emergency services.
 */

import { useState, useEffect } from 'react';
import { FallDetectionService, FallEvent } from '../../services/safety/FallDetectionService';
import { LocationSafetyService, SafeZone, BoundaryEvent } from '../../services/safety/LocationSafetyService';
import { EmergencyAlertService, EmergencyAlert } from '../../services/safety/EmergencyAlertService';
import {
  AlertTriangle,
  MapPin,
  Bell,
  Activity,
  Shield,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Info,
  Zap,
} from 'lucide-react';

interface SafetyDashboardProps {
  onBack: () => void;
}

export default function SafetyDashboard({ onBack }: SafetyDashboardProps) {
  const [fallEvents, setFallEvents] = useState<FallEvent[]>([]);
  const [boundaryEvents, setBoundaryEvents] = useState<BoundaryEvent[]>([]);
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [zones, setZones] = useState<SafeZone[]>([]);
  const [isFallMonitoring, setIsFallMonitoring] = useState(false);
  const [isLocationMonitoring, setIsLocationMonitoring] = useState(false);

  useEffect(() => {
    // Subscribe to services
    const unsubFall = FallDetectionService.subscribe((event) => {
      setFallEvents(FallDetectionService.getEventHistory());
    });

    const unsubBoundary = LocationSafetyService.subscribe((event) => {
      setBoundaryEvents(LocationSafetyService.getEventHistory());
    });

    const unsubAlert = EmergencyAlertService.subscribe((alert) => {
      setAlerts(EmergencyAlertService.getAlerts());
    });

    // Load initial data
    setFallEvents(FallDetectionService.getEventHistory());
    setBoundaryEvents(LocationSafetyService.getEventHistory());
    setAlerts(EmergencyAlertService.getAlerts());
    setZones(LocationSafetyService.getZones());
    setIsFallMonitoring(FallDetectionService.isMonitoringActive());
    setIsLocationMonitoring(LocationSafetyService.isMonitoringActive());

    return () => {
      unsubFall();
      unsubBoundary();
      unsubAlert();
    };
  }, []);

  const triggerDemoFall = (severity: 'low' | 'medium' | 'high') => {
    FallDetectionService.triggerDemoFall(severity);
  };

  const triggerDemoBoundary = (zoneId: string, eventType: 'enter' | 'exit') => {
    LocationSafetyService.triggerDemoBoundaryEvent(zoneId, eventType);
  };

  const triggerSOS = () => {
    EmergencyAlertService.triggerManualSOS('Demo SOS triggered');
  };

  const acknowledgeAlert = (alertId: string) => {
    EmergencyAlertService.acknowledgeAlert(alertId, 'Caregiver');
    setAlerts(EmergencyAlertService.getAlerts());
  };

  const clearAllData = () => {
    FallDetectionService.clearHistory();
    LocationSafetyService.clearHistory();
    EmergencyAlertService.clearAlerts();
    setFallEvents([]);
    setBoundaryEvents([]);
    setAlerts([]);
  };

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);

  return (
    <div className="min-h-screen bg-[var(--color-bg-subtle)] pb-8">
      {/* Header */}
      <div className="bg-[var(--color-card)] border-b border-[var(--color-border)] px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-[var(--color-success)] font-semibold text-lg">
            ← Back
          </button>
          <h1 className="text-lg font-bold text-[var(--color-text)]">Safety Features</h1>
          <button
            onClick={clearAllData}
            className="text-sm text-[var(--color-error)] font-medium"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Important Notice */}
        <div className="bg-[var(--color-warning-bg)] border border-[var(--color-accent-amber)]/30 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-[var(--color-accent-amber)] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-accent-amber)]">Demo & Research Features</h3>
              <p className="text-xs text-[var(--color-accent-amber)]/90 mt-1">
                These features are for demonstration and testing only.
                They are NOT medically validated and do NOT replace proper monitoring.
                In a real emergency, call local emergency services.
              </p>
            </div>
          </div>
        </div>

        {/* Active Alerts */}
        {unacknowledgedAlerts.length > 0 && (
          <div className="bg-[var(--color-error-bg)] border border-[var(--color-error)]/30 rounded-2xl p-4">
            <h2 className="text-sm font-semibold text-[var(--color-error)] mb-3 flex items-center gap-2">
              <Bell size={16} />
              Active Alerts ({unacknowledgedAlerts.length})
            </h2>
            <div className="space-y-2">
              {unacknowledgedAlerts.slice(0, 3).map(alert => (
                <div key={alert.id} className="bg-[var(--color-card)] rounded-xl p-3 border border-[var(--color-error)]/20">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                        alert.severity === 'critical' ? 'bg-[var(--color-error-bg)] text-[var(--color-error)]' :
                        alert.severity === 'high' ? 'bg-[var(--color-warning-bg)] text-[var(--color-accent-amber)]' :
                        'bg-[var(--color-accent-amber)/15] text-[var(--color-accent-amber)]'
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="text-xs text-[var(--color-text-muted)]">{alert.type}</span>
                    </div>
                    <span className="text-xs text-[var(--color-text-muted)]">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-text)] mb-2">{alert.message}</p>
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="w-full py-2 bg-[var(--color-error)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-error)]/90"
                  >
                    Acknowledge
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fall Detection */}
        <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] flex items-center gap-2">
              <Activity size={16} />
              Fall Detection
            </h2>
            <span className={`text-xs px-2 py-1 rounded-full ${
              isFallMonitoring ? 'bg-[var(--color-success-bg)] text-[var(--color-success)]' : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)]'
            }`}>
              {isFallMonitoring ? 'Active' : 'Inactive'}
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mb-3">
            Demo fall detection with threshold-based algorithm.
            Not medically validated.
          </p>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <button
              onClick={() => triggerDemoFall('low')}
              className="py-2 bg-[var(--color-warning-bg)] text-[var(--color-accent-amber)] rounded-lg text-xs font-medium hover:bg-[var(--color-warning-bg)]/80"
            >
              Demo: Low
            </button>
            <button
              onClick={() => triggerDemoFall('medium')}
              className="py-2 bg-[var(--color-accent-amber)/15] text-[var(--color-accent-amber)] rounded-lg text-xs font-medium hover:bg-[var(--color-accent-amber)]/25"
            >
              Demo: Medium
            </button>
            <button
              onClick={() => triggerDemoFall('high')}
              className="py-2 bg-[var(--color-error-bg)] text-[var(--color-error)] rounded-lg text-xs font-medium hover:bg-[var(--color-error-bg)]/80"
            >
              Demo: High
            </button>
          </div>
          {fallEvents.length > 0 && (
            <div className="text-xs text-[var(--color-text-muted)]">
              {fallEvents.length} event{fallEvents.length !== 1 ? 's' : ''} detected
            </div>
          )}
        </div>

        {/* Location Safety */}
        <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] flex items-center gap-2">
              <MapPin size={16} />
              Location Safety
            </h2>
            <span className={`text-xs px-2 py-1 rounded-full ${
              isLocationMonitoring ? 'bg-[var(--color-success-bg)] text-[var(--color-success)]' : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)]'
            }`}>
              {isLocationMonitoring ? 'Active' : 'Inactive'}
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mb-3">
            Safe zone monitoring with simulated location.
            No real GPS tracking in prototype.
          </p>
          <div className="space-y-2 mb-3">
            {zones.map(zone => (
              <div key={zone.id} className="flex items-center justify-between p-2 bg-[var(--color-bg-subtle)] rounded-lg">
                <div>
                  <div className="text-sm font-medium text-[var(--color-text)]">{zone.name}</div>
                  <div className="text-xs text-[var(--color-text-muted)]">{zone.radiusMeters}m radius</div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => triggerDemoBoundary(zone.id, 'enter')}
                    className="px-2 py-1 bg-[var(--color-success-bg)] text-[var(--color-success)] rounded text-xs hover:bg-[var(--color-success-bg)]/80"
                  >
                    Enter
                  </button>
                  <button
                    onClick={() => triggerDemoBoundary(zone.id, 'exit')}
                    className="px-2 py-1 bg-[var(--color-error-bg)] text-[var(--color-error)] rounded text-xs hover:bg-[var(--color-error-bg)]/80"
                  >
                    Exit
                  </button>
                </div>
              </div>
            ))}
          </div>
          {boundaryEvents.length > 0 && (
            <div className="text-xs text-[var(--color-text-muted)]">
              {boundaryEvents.length} boundary event{boundaryEvents.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Emergency SOS */}
        <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-4">
          <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3 flex items-center gap-2">
            <Zap size={16} />
            Emergency SOS
          </h2>
          <p className="text-xs text-[var(--color-text-muted)] mb-3">
            Manual emergency alert. Demo only — does not contact real services.
          </p>
          <button
            onClick={triggerSOS}
            className="w-full py-3 bg-[var(--color-error)] text-white rounded-xl font-semibold hover:bg-[var(--color-error)]/90"
          >
            Trigger Demo SOS
          </button>
        </div>

        {/* Future Research Feature */}
        <div className="bg-[var(--color-accent-purple)/10] border border-[var(--color-accent-purple)]/30 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <Info size={20} className="text-[var(--color-accent-purple)] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-accent-purple)] mb-1">
                Future Research Feature
              </h3>
              <p className="text-xs text-[var(--color-accent-purple)]/90">
                <strong>Emotion Recognition:</strong> Camera-based emotion analysis is being researched
                for future versions. This is NOT implemented in the current prototype.
                No continuous monitoring or clinical claims are made.
              </p>
              <div className="mt-2 text-xs text-[var(--color-accent-purple)]">
                Status: Architecture-ready for future research
              </div>
            </div>
          </div>
        </div>

        {/* Event History */}
        {(fallEvents.length > 0 || boundaryEvents.length > 0) && (
          <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-4">
            <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3 flex items-center gap-2">
              <Clock size={16} />
              Recent Events
            </h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {[...fallEvents.map(e => ({ ...e, type: 'fall' as const })),
                ...boundaryEvents.map(e => ({ ...e, type: 'boundary' as const }))]
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, 10)
                .map((event, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-[var(--color-bg-subtle)] rounded-lg">
                    <div className="flex items-center gap-2">
                      {event.type === 'fall' ? (
                        <Activity size={14} className="text-[var(--color-accent-amber)]" />
                      ) : (
                        <MapPin size={14} className="text-[var(--color-accent-blue)]" />
                      )}
                      <div>
                        <div className="text-xs font-medium text-[var(--color-text)]">
                          {event.type === 'fall' ? 'Fall detected' : `Zone ${event.eventType}`}
                        </div>
                        <div className="text-xs text-[var(--color-text-muted)]">
                          {new Date(event.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Feature Status Summary */}
        <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-4">
          <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3">Feature Status</h2>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-secondary)]">Fall Detection</span>
              <span className="px-2 py-0.5 bg-[var(--color-accent-amber)/15] text-[var(--color-accent-amber)] rounded">SIMULATED</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-secondary)]">Location Safety</span>
              <span className="px-2 py-0.5 bg-[var(--color-accent-amber)/15] text-[var(--color-accent-amber)] rounded">SIMULATED</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-secondary)]">Emergency Alerts</span>
              <span className="px-2 py-0.5 bg-[var(--color-accent-amber)/15] text-[var(--color-accent-amber)] rounded">SIMULATED</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-secondary)]">Sensor Integration</span>
              <span className="px-2 py-0.5 bg-[var(--color-accent-blue)/15] text-[var(--color-accent-blue)] rounded">ARCHITECTURE-READY</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-secondary)]">ML Models</span>
              <span className="px-2 py-0.5 bg-[var(--color-accent-blue)/15] text-[var(--color-accent-blue)] rounded">ARCHITECTURE-READY</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-secondary)]">Emotion Recognition</span>
              <span className="px-2 py-0.5 bg-[var(--color-accent-purple)/15] text-[var(--color-accent-purple)] rounded">FUTURE RESEARCH</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
