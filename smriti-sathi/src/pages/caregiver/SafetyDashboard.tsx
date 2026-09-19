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
    <div className="min-h-screen bg-[#F5F0E8] pb-8">
      {/* Header */}
      <div className="bg-white border-b border-[#E0D8CC] px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-[#1B5E20] font-semibold text-lg">
            ← Back
          </button>
          <h1 className="text-lg font-bold text-[#1A1A1A]">Safety Features</h1>
          <button
            onClick={clearAllData}
            className="text-sm text-red-600 font-medium"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Important Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-amber-800">Demo & Research Features</h3>
              <p className="text-xs text-amber-700 mt-1">
                These features are for demonstration and testing only.
                They are NOT medically validated and do NOT replace proper monitoring.
                In a real emergency, call local emergency services.
              </p>
            </div>
          </div>
        </div>

        {/* Active Alerts */}
        {unacknowledgedAlerts.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <h2 className="text-sm font-semibold text-red-800 mb-3 flex items-center gap-2">
              <Bell size={16} />
              Active Alerts ({unacknowledgedAlerts.length})
            </h2>
            <div className="space-y-2">
              {unacknowledgedAlerts.slice(0, 3).map(alert => (
                <div key={alert.id} className="bg-white rounded-xl p-3 border border-red-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                        alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="text-xs text-[#7A7A7A]">{alert.type}</span>
                    </div>
                    <span className="text-xs text-[#7A7A7A]">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-[#1A1A1A] mb-2">{alert.message}</p>
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="w-full py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                  >
                    Acknowledge
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fall Detection */}
        <div className="bg-white rounded-2xl border border-[#E0D8CC] p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[#4A4A4A] flex items-center gap-2">
              <Activity size={16} />
              Fall Detection
            </h2>
            <span className={`text-xs px-2 py-1 rounded-full ${
              isFallMonitoring ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {isFallMonitoring ? 'Active' : 'Inactive'}
            </span>
          </div>
          <p className="text-xs text-[#7A7A7A] mb-3">
            Demo fall detection with threshold-based algorithm.
            Not medically validated.
          </p>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <button
              onClick={() => triggerDemoFall('low')}
              className="py-2 bg-amber-100 text-amber-800 rounded-lg text-xs font-medium hover:bg-amber-200"
            >
              Demo: Low
            </button>
            <button
              onClick={() => triggerDemoFall('medium')}
              className="py-2 bg-orange-100 text-orange-800 rounded-lg text-xs font-medium hover:bg-orange-200"
            >
              Demo: Medium
            </button>
            <button
              onClick={() => triggerDemoFall('high')}
              className="py-2 bg-red-100 text-red-800 rounded-lg text-xs font-medium hover:bg-red-200"
            >
              Demo: High
            </button>
          </div>
          {fallEvents.length > 0 && (
            <div className="text-xs text-[#7A7A7A]">
              {fallEvents.length} event{fallEvents.length !== 1 ? 's' : ''} detected
            </div>
          )}
        </div>

        {/* Location Safety */}
        <div className="bg-white rounded-2xl border border-[#E0D8CC] p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[#4A4A4A] flex items-center gap-2">
              <MapPin size={16} />
              Location Safety
            </h2>
            <span className={`text-xs px-2 py-1 rounded-full ${
              isLocationMonitoring ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {isLocationMonitoring ? 'Active' : 'Inactive'}
            </span>
          </div>
          <p className="text-xs text-[#7A7A7A] mb-3">
            Safe zone monitoring with simulated location.
            No real GPS tracking in prototype.
          </p>
          <div className="space-y-2 mb-3">
            {zones.map(zone => (
              <div key={zone.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-[#1A1A1A]">{zone.name}</div>
                  <div className="text-xs text-[#7A7A7A]">{zone.radiusMeters}m radius</div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => triggerDemoBoundary(zone.id, 'enter')}
                    className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200"
                  >
                    Enter
                  </button>
                  <button
                    onClick={() => triggerDemoBoundary(zone.id, 'exit')}
                    className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
                  >
                    Exit
                  </button>
                </div>
              </div>
            ))}
          </div>
          {boundaryEvents.length > 0 && (
            <div className="text-xs text-[#7A7A7A]">
              {boundaryEvents.length} boundary event{boundaryEvents.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Emergency SOS */}
        <div className="bg-white rounded-2xl border border-[#E0D8CC] p-4">
          <h2 className="text-sm font-semibold text-[#4A4A4A] mb-3 flex items-center gap-2">
            <Zap size={16} />
            Emergency SOS
          </h2>
          <p className="text-xs text-[#7A7A7A] mb-3">
            Manual emergency alert. Demo only — does not contact real services.
          </p>
          <button
            onClick={triggerSOS}
            className="w-full py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700"
          >
            Trigger Demo SOS
          </button>
        </div>

        {/* Future Research Feature */}
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <Info size={20} className="text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-purple-800 mb-1">
                Future Research Feature
              </h3>
              <p className="text-xs text-purple-700">
                <strong>Emotion Recognition:</strong> Camera-based emotion analysis is being researched
                for future versions. This is NOT implemented in the current prototype.
                No continuous monitoring or clinical claims are made.
              </p>
              <div className="mt-2 text-xs text-purple-600">
                Status: Architecture-ready for future research
              </div>
            </div>
          </div>
        </div>

        {/* Event History */}
        {(fallEvents.length > 0 || boundaryEvents.length > 0) && (
          <div className="bg-white rounded-2xl border border-[#E0D8CC] p-4">
            <h2 className="text-sm font-semibold text-[#4A4A4A] mb-3 flex items-center gap-2">
              <Clock size={16} />
              Recent Events
            </h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {[...fallEvents.map(e => ({ ...e, type: 'fall' as const })),
                ...boundaryEvents.map(e => ({ ...e, type: 'boundary' as const }))]
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, 10)
                .map((event, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      {event.type === 'fall' ? (
                        <Activity size={14} className="text-orange-600" />
                      ) : (
                        <MapPin size={14} className="text-blue-600" />
                      )}
                      <div>
                        <div className="text-xs font-medium text-[#1A1A1A]">
                          {event.type === 'fall' ? 'Fall detected' : `Zone ${event.eventType}`}
                        </div>
                        <div className="text-xs text-[#7A7A7A]">
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
        <div className="bg-white rounded-2xl border border-[#E0D8CC] p-4">
          <h2 className="text-sm font-semibold text-[#4A4A4A] mb-3">Feature Status</h2>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#4A4A4A]">Fall Detection</span>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded">SIMULATED</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#4A4A4A]">Location Safety</span>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded">SIMULATED</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#4A4A4A]">Emergency Alerts</span>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded">SIMULATED</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#4A4A4A]">Sensor Integration</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded">ARCHITECTURE-READY</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#4A4A4A]">ML Models</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded">ARCHITECTURE-READY</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#4A4A4A]">Emotion Recognition</span>
              <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded">FUTURE RESEARCH</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
