/**
 * SMRITI SATHI — Fall Detection Service
 * 
 * ⚠️ PROTOTYPE — NOT A MEDICAL DEVICE
 * 
 * This service provides architecture for future fall detection.
 * It does NOT provide medical-grade fall detection.
 * It does NOT claim clinical accuracy.
 * 
 * Current implementation:
 * - Clean interface for sensor input
 * - Threshold-based detection algorithm (demo)
 * - Event window to reduce false positives
 * - Manual demo trigger for testing
 * 
 * Future implementation could include:
 * - Accelerometer/gyroscope sensor fusion
 * - ML-based fall classification
 * - Pattern recognition
 * - Integration with wearable devices
 * 
 * IMPORTANT: This is NOT a substitute for proper medical monitoring.
 */

import { generateUUID } from '../../utils/uuid';

// Sensor data interface (for future hardware integration)
export interface SensorData {
  timestamp: number;
  accelerometer?: {
    x: number;
    y: number;
    z: number;
  };
  gyroscope?: {
    x: number;
    y: number;
    z: number;
  };
}

// Fall event
export interface FallEvent {
  id: string;
  timestamp: number;
  confidence: number; // 0.0 to 1.0
  severity: 'low' | 'medium' | 'high';
  sensorData?: SensorData;
  validated: boolean;
  alertSent: boolean;
}

// Detection configuration
export interface FallDetectionConfig {
  // Acceleration threshold (m/s²) — demo values
  accelerationThreshold: number;
  
  // Minimum impact duration (ms)
  minImpactDuration: number;
  
  // Event window — ignore subsequent events for this duration
  eventWindowMs: number;
  
  // Confidence threshold to trigger alert
  alertConfidenceThreshold: number;
  
  // Enable/disable detection
  enabled: boolean;
}

type FallEventListener = (event: FallEvent) => void;

class FallDetectionServiceClass {
  private config: FallDetectionConfig;
  private lastEventTime: number = 0;
  private listeners: Set<FallEventListener> = new Set();
  private eventHistory: FallEvent[] = [];
  private isMonitoring: boolean = false;

  constructor() {
    // Demo configuration — NOT medically validated
    this.config = {
      accelerationThreshold: 2.5, // g-force (demo value)
      minImpactDuration: 50, // ms
      eventWindowMs: 5000, // 5 seconds
      alertConfidenceThreshold: 0.7,
      enabled: false, // Disabled by default
    };
  }

  // Configuration
  setConfig(config: Partial<FallDetectionConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): FallDetectionConfig {
    return { ...this.config };
  }

  // Monitoring control
  startMonitoring(): void {
    if (!this.config.enabled) {
      console.warn('[FallDetection] Service is disabled');
      return;
    }
    this.isMonitoring = true;
    console.log('[FallDetection] Monitoring started (DEMO MODE)');
  }

  stopMonitoring(): void {
    this.isMonitoring = false;
    console.log('[FallDetection] Monitoring stopped');
  }

  isMonitoringActive(): boolean {
    return this.isMonitoring;
  }

  // Process sensor data (for future hardware integration)
  processSensorData(data: SensorData): void {
    if (!this.isMonitoring || !this.config.enabled) {
      return;
    }

    // Simple threshold-based detection (demo algorithm)
    // In production, this would use sensor fusion and ML
    if (data.accelerometer) {
      const magnitude = Math.sqrt(
        data.accelerometer.x ** 2 +
        data.accelerometer.y ** 2 +
        data.accelerometer.z ** 2
      );

      if (magnitude > this.config.accelerationThreshold) {
        this.detectFall(data, magnitude);
      }
    }
  }

  // Demo: Manually trigger a fall event
  triggerDemoFall(severity: 'low' | 'medium' | 'high' = 'medium'): FallEvent {
    const event: FallEvent = {
      id: generateUUID(),
      timestamp: Date.now(),
      confidence: 0.85, // Demo confidence
      severity,
      validated: false,
      alertSent: false,
    };

    this.eventHistory.push(event);
    this.notifyListeners(event);

    console.log(`[FallDetection] DEMO fall event triggered: ${severity} severity`);

    return event;
  }

  // Validate fall event (for future ML validation)
  validateFallEvent(eventId: string, validated: boolean): void {
    const event = this.eventHistory.find(e => e.id === eventId);
    if (event) {
      event.validated = validated;
      console.log(`[FallDetection] Event ${eventId} ${validated ? 'validated' : 'invalidated'}`);
    }
  }

  // Mark alert as sent
  markAlertSent(eventId: string): void {
    const event = this.eventHistory.find(e => e.id === eventId);
    if (event) {
      event.alertSent = true;
    }
  }

  // Get event history
  getEventHistory(): FallEvent[] {
    return [...this.eventHistory];
  }

  // Clear history
  clearHistory(): void {
    this.eventHistory = [];
  }

  // Event subscription
  subscribe(listener: FallEventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Private methods
  private detectFall(sensorData: SensorData, magnitude: number): void {
    // Event window check — avoid duplicate events
    const now = Date.now();
    if (now - this.lastEventTime < this.config.eventWindowMs) {
      return;
    }

    this.lastEventTime = now;

    // Calculate confidence (simple demo algorithm)
    const confidence = Math.min(magnitude / (this.config.accelerationThreshold * 2), 1.0);

    const event: FallEvent = {
      id: generateUUID(),
      timestamp: now,
      confidence,
      severity: this.calculateSeverity(confidence),
      sensorData,
      validated: false,
      alertSent: false,
    };

    this.eventHistory.push(event);

    // Only notify if confidence is high enough
    if (confidence >= this.config.alertConfidenceThreshold) {
      this.notifyListeners(event);
    }
  }

  private calculateSeverity(confidence: number): 'low' | 'medium' | 'high' {
    if (confidence >= 0.9) return 'high';
    if (confidence >= 0.7) return 'medium';
    return 'low';
  }

  private notifyListeners(event: FallEvent): void {
    this.listeners.forEach(listener => listener(event));
  }
}

// Singleton
export const FallDetectionService = new FallDetectionServiceClass();
