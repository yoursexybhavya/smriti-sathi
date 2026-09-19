/**
 * SMRITI SATHI — Emergency Alert Service
 * 
 * ⚠️ PROTOTYPE — NOT FOR REAL EMERGENCIES
 * 
 * This service provides architecture for emergency notifications.
 * It does NOT contact emergency services or real caregivers.
 * 
 * Current implementation:
 * - Alert pipeline (detect → validate → notify)
 * - Mock notification (console + UI toast)
 * - Alert history tracking
 * - Integration with fall detection and location safety
 * 
 * Future implementation could include:
 * - SMS/email notifications
 * - Push notifications
 * - Emergency services integration
 * - Caregiver app notifications
 * - Voice calls
 * 
 * IMPORTANT: This is NOT a substitute for emergency services.
 * In a real emergency, call local emergency numbers.
 */

import { generateUUID } from '../../utils/uuid';
import { FallEvent, FallDetectionService } from './FallDetectionService';
import { BoundaryEvent, LocationSafetyService } from './LocationSafetyService';

// Alert types
export type AlertType = 'fall' | 'geofence_exit' | 'geofence_enter' | 'manual_sos' | 'medical';

// Alert severity
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

// Alert target (who to notify)
export interface AlertTarget {
  id: string;
  name: string;
  relationship: string; // e.g., "Son", "Daughter", "ASHA Worker"
  phone?: string;
  email?: string;
  notifyOnFall: boolean;
  notifyOnGeofence: boolean;
  notifyOnSOS: boolean;
}

// Emergency alert
export interface EmergencyAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  timestamp: number;
  message: string;
  patientName: string;
  patientId: string;
  sourceEventId?: string;
  targets: string[]; // Alert target IDs
  notificationStatus: 'pending' | 'sent' | 'delivered' | 'failed';
  acknowledged: boolean;
  acknowledgedAt?: number;
  acknowledgedBy?: string;
}

// Alert configuration
export interface EmergencyAlertConfig {
  enabled: boolean;
  autoNotifyOnFall: boolean;
  autoNotifyOnGeofenceExit: boolean;
  requireConfirmation: boolean; // Require caregiver confirmation before sending
}

type AlertListener = (alert: EmergencyAlert) => void;

class EmergencyAlertServiceClass {
  private config: EmergencyAlertConfig;
  private targets: Map<string, AlertTarget> = new Map();
  private alerts: EmergencyAlert[] = [];
  private listeners: Set<AlertListener> = new Set();
  private fallUnsubscribe: (() => void) | null = null;
  private boundaryUnsubscribe: (() => void) | null = null;

  constructor() {
    this.config = {
      enabled: true,
      autoNotifyOnFall: true,
      autoNotifyOnGeofenceExit: true,
      requireConfirmation: false,
    };

    // Add demo alert targets
    this.addDemoTargets();

    // Subscribe to safety services
    this.setupSafetyListeners();
  }

  private addDemoTargets(): void {
    // Demo: Family caregiver
    this.addTarget({
      id: generateUUID(),
      name: 'Arjun Kumar',
      relationship: 'Son',
      phone: '+91-9876543210',
      email: 'arjun@example.com',
      notifyOnFall: true,
      notifyOnGeofence: true,
      notifyOnSOS: true,
    });

    // Demo: ASHA worker
    this.addTarget({
      id: generateUUID(),
      name: 'Priya Sharma',
      relationship: 'ASHA Worker',
      phone: '+91-9876543211',
      email: 'priya.asha@example.com',
      notifyOnFall: true,
      notifyOnGeofence: false,
      notifyOnSOS: true,
    });
  }

  private setupSafetyListeners(): void {
    // Listen to fall detection events
    this.fallUnsubscribe = FallDetectionService.subscribe((event) => {
      if (this.config.autoNotifyOnFall) {
        this.createAlertFromFall(event);
      }
    });

    // Listen to boundary events
    this.boundaryUnsubscribe = LocationSafetyService.subscribe((event) => {
      if (event.eventType === 'exit' && this.config.autoNotifyOnGeofenceExit) {
        this.createAlertFromBoundary(event);
      }
    });
  }

  // Configuration
  setConfig(config: Partial<EmergencyAlertConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): EmergencyAlertConfig {
    return { ...this.config };
  }

  // Alert target management
  addTarget(target: AlertTarget): void {
    this.targets.set(target.id, target);
    console.log(`[EmergencyAlert] Target added: ${target.name}`);
  }

  removeTarget(targetId: string): void {
    this.targets.delete(targetId);
  }

  getTargets(): AlertTarget[] {
    return Array.from(this.targets.values());
  }

  // Create alert from fall event
  private createAlertFromFall(event: FallEvent): void {
    const alert: EmergencyAlert = {
      id: generateUUID(),
      type: 'fall',
      severity: this.mapFallSeverity(event.severity),
      timestamp: event.timestamp,
      message: `Potential fall detected for patient. Confidence: ${Math.round(event.confidence * 100)}%`,
      patientName: 'Patient', // Would be resolved from auth context
      patientId: 'patient_demo_001',
      sourceEventId: event.id,
      targets: this.getTargetsForAlert('fall'),
      notificationStatus: 'pending',
      acknowledged: false,
    };

    this.alerts.push(alert);
    this.sendNotification(alert);
    this.notifyListeners(alert);

    // Mark fall event as alerted
    FallDetectionService.markAlertSent(event.id);

    console.log(`[EmergencyAlert] Fall alert created: ${alert.severity} severity`);
  }

  // Create alert from boundary event
  private createAlertFromBoundary(event: BoundaryEvent): void {
    const alert: EmergencyAlert = {
      id: generateUUID(),
      type: 'geofence_exit',
      severity: 'medium',
      timestamp: event.timestamp,
      message: `Patient left safe zone: ${event.zoneName}`,
      patientName: 'Patient',
      patientId: 'patient_demo_001',
      sourceEventId: event.id,
      targets: this.getTargetsForAlert('geofence'),
      notificationStatus: 'pending',
      acknowledged: false,
    };

    this.alerts.push(alert);
    this.sendNotification(alert);
    this.notifyListeners(alert);

    // Mark boundary event as notified
    LocationSafetyService.markEventNotified(event.id);

    console.log(`[EmergencyAlert] Geofence alert created: ${event.zoneName}`);
  }

  // Manual SOS alert
  triggerManualSOS(message: string = 'Emergency SOS'): EmergencyAlert {
    const alert: EmergencyAlert = {
      id: generateUUID(),
      type: 'manual_sos',
      severity: 'critical',
      timestamp: Date.now(),
      message,
      patientName: 'Patient',
      patientId: 'patient_demo_001',
      targets: this.getTargetsForAlert('sos'),
      notificationStatus: 'pending',
      acknowledged: false,
    };

    this.alerts.push(alert);
    this.sendNotification(alert);
    this.notifyListeners(alert);

    console.log(`[EmergencyAlert] Manual SOS triggered`);

    return alert;
  }

  // Send notification (mock)
  private sendNotification(alert: EmergencyAlert): void {
    // In production, this would send SMS/email/push notifications
    // For demo, we just log and update status

    console.log(`[EmergencyAlert] Sending notification for alert ${alert.id}`);
    console.log(`  Type: ${alert.type}`);
    console.log(`  Severity: ${alert.severity}`);
    console.log(`  Message: ${alert.message}`);
    console.log(`  Targets: ${alert.targets.length} recipients`);

    // Simulate notification delay
    setTimeout(() => {
      alert.notificationStatus = 'sent';
      console.log(`[EmergencyAlert] Notification sent (DEMO)`);
    }, 500);
  }

  // Acknowledge alert
  acknowledgeAlert(alertId: string, acknowledgedBy: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      alert.acknowledgedAt = Date.now();
      alert.acknowledgedBy = acknowledgedBy;
      console.log(`[EmergencyAlert] Alert ${alertId} acknowledged by ${acknowledgedBy}`);
    }
  }

  // Get alerts
  getAlerts(): EmergencyAlert[] {
    return [...this.alerts].sort((a, b) => b.timestamp - a.timestamp);
  }

  getUnacknowledgedAlerts(): EmergencyAlert[] {
    return this.getAlerts().filter(a => !a.acknowledged);
  }

  getAlertsByType(type: AlertType): EmergencyAlert[] {
    return this.getAlerts().filter(a => a.type === type);
  }

  // Clear alerts
  clearAlerts(): void {
    this.alerts = [];
  }

  // Event subscription
  subscribe(listener: AlertListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Cleanup
  destroy(): void {
    if (this.fallUnsubscribe) {
      this.fallUnsubscribe();
    }
    if (this.boundaryUnsubscribe) {
      this.boundaryUnsubscribe();
    }
    this.listeners.clear();
  }

  // Private helpers
  private mapFallSeverity(severity: 'low' | 'medium' | 'high'): AlertSeverity {
    switch (severity) {
      case 'high': return 'critical';
      case 'medium': return 'high';
      case 'low': return 'medium';
    }
  }

  private getTargetsForAlert(type: AlertType | 'geofence' | 'sos'): string[] {
    return Array.from(this.targets.values())
      .filter(target => {
        switch (type) {
          case 'fall': return target.notifyOnFall;
          case 'geofence':
          case 'geofence_exit':
          case 'geofence_enter': return target.notifyOnGeofence;
          case 'sos':
          case 'manual_sos': return target.notifyOnSOS;
          default: return true;
        }
      })
      .map(t => t.id);
  }

  private notifyListeners(alert: EmergencyAlert): void {
    this.listeners.forEach(listener => listener(alert));
  }
}

// Singleton
export const EmergencyAlertService = new EmergencyAlertServiceClass();
