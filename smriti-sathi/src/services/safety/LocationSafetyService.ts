/**
 * SMRITI SATHI — Location Safety Service
 * 
 * ⚠️ PROTOTYPE — NOT FOR EMERGENCY USE
 * 
 * This service provides architecture for location-based safety features.
 * It does NOT provide real-time tracking or emergency services.
 * 
 * Current implementation:
 * - Safe zone management
 * - Mock location for testing
 * - Boundary event detection (enter/exit)
 * - No continuous GPS in prototype
 * 
 * Future implementation could include:
 * - Real GPS integration
 * - Background location tracking
 * - Geofencing with native APIs
 * - Emergency services integration
 * 
 * IMPORTANT: This is NOT a substitute for proper safety monitoring.
 */

import { generateUUID } from '../../utils/uuid';

// Safe zone definition
export interface SafeZone {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  createdAt: number;
  active: boolean;
}

// Location point
export interface LocationPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
  accuracy?: number;
}

// Boundary event
export interface BoundaryEvent {
  id: string;
  zoneId: string;
  zoneName: string;
  eventType: 'enter' | 'exit';
  timestamp: number;
  location: LocationPoint;
  notified: boolean;
}

// Location safety configuration
export interface LocationSafetyConfig {
  enabled: boolean;
  checkIntervalMs: number; // How often to check location (demo)
  notifyOnExit: boolean;
  notifyOnEnter: boolean;
}

type BoundaryEventListener = (event: BoundaryEvent) => void;

class LocationSafetyServiceClass {
  private config: LocationSafetyConfig;
  private safeZones: Map<string, SafeZone> = new Map();
  private currentLocation: LocationPoint | null = null;
  private listeners: Set<BoundaryEventListener> = new Set();
  private eventHistory: BoundaryEvent[] = [];
  private isMonitoring: boolean = false;
  private checkInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.config = {
      enabled: false,
      checkIntervalMs: 60000, // 1 minute (demo)
      notifyOnExit: true,
      notifyOnEnter: false,
    };

    // Add some demo safe zones
    this.addDemoZones();
  }

  private addDemoZones(): void {
    // Demo: Patient's home
    this.addZone({
      id: generateUUID(),
      name: 'Home',
      latitude: 28.6139, // Delhi coordinates (demo)
      longitude: 77.2090,
      radiusMeters: 200,
      createdAt: Date.now(),
      active: true,
    });

    // Demo: Local park
    this.addZone({
      id: generateUUID(),
      name: 'Neighborhood Park',
      latitude: 28.6150,
      longitude: 77.2100,
      radiusMeters: 300,
      createdAt: Date.now(),
      active: true,
    });
  }

  // Configuration
  setConfig(config: Partial<LocationSafetyConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): LocationSafetyConfig {
    return { ...this.config };
  }

  // Safe zone management
  addZone(zone: SafeZone): void {
    this.safeZones.set(zone.id, zone);
    console.log(`[LocationSafety] Zone added: ${zone.name}`);
  }

  removeZone(zoneId: string): void {
    this.safeZones.delete(zoneId);
    console.log(`[LocationSafety] Zone removed: ${zoneId}`);
  }

  updateZone(zoneId: string, updates: Partial<SafeZone>): void {
    const zone = this.safeZones.get(zoneId);
    if (zone) {
      this.safeZones.set(zoneId, { ...zone, ...updates });
    }
  }

  getZones(): SafeZone[] {
    return Array.from(this.safeZones.values());
  }

  getActiveZones(): SafeZone[] {
    return this.getZones().filter(z => z.active);
  }

  // Location management
  setCurrentLocation(location: LocationPoint): void {
    this.currentLocation = location;
    
    if (this.isMonitoring) {
      this.checkBoundaries();
    }
  }

  getCurrentLocation(): LocationPoint | null {
    return this.currentLocation;
  }

  // Demo: Simulate location
  simulateLocation(latitude: number, longitude: number): void {
    const location: LocationPoint = {
      latitude,
      longitude,
      timestamp: Date.now(),
      accuracy: 10, // meters (demo)
    };

    this.setCurrentLocation(location);
    console.log(`[LocationSafety] Location simulated: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
  }

  // Monitoring control
  startMonitoring(): void {
    if (!this.config.enabled) {
      console.warn('[LocationSafety] Service is disabled');
      return;
    }

    this.isMonitoring = true;
    
    // Start periodic checks (demo)
    this.checkInterval = setInterval(() => {
      this.checkBoundaries();
    }, this.config.checkIntervalMs);

    console.log('[LocationSafety] Monitoring started (DEMO MODE)');
  }

  stopMonitoring(): void {
    this.isMonitoring = false;
    
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }

    console.log('[LocationSafety] Monitoring stopped');
  }

  isMonitoringActive(): boolean {
    return this.isMonitoring;
  }

  // Check if location is within a zone
  isWithinZone(location: LocationPoint, zone: SafeZone): boolean {
    const distance = this.calculateDistance(
      location.latitude,
      location.longitude,
      zone.latitude,
      zone.longitude
    );

    return distance <= zone.radiusMeters;
  }

  // Get zones containing location
  getZonesContainingLocation(location: LocationPoint): SafeZone[] {
    return this.getActiveZones().filter(zone => this.isWithinZone(location, zone));
  }

  // Check boundaries and trigger events
  private checkBoundaries(): void {
    if (!this.currentLocation) return;

    const containingZones = this.getZonesContainingLocation(this.currentLocation);

    // For each active zone, check if we entered or exited
    for (const zone of this.getActiveZones()) {
      const isInside = containingZones.some(z => z.id === zone.id);
      
      // Check if this is a state change (simplified — would need state tracking in production)
      // For demo, we'll just create events based on current state
      if (isInside && this.config.notifyOnEnter) {
        this.createBoundaryEvent(zone, 'enter');
      } else if (!isInside && this.config.notifyOnExit) {
        this.createBoundaryEvent(zone, 'exit');
      }
    }
  }

  private createBoundaryEvent(zone: SafeZone, eventType: 'enter' | 'exit'): BoundaryEvent {
    const event: BoundaryEvent = {
      id: generateUUID(),
      zoneId: zone.id,
      zoneName: zone.name,
      eventType,
      timestamp: Date.now(),
      location: this.currentLocation!,
      notified: false,
    };

    this.eventHistory.push(event);
    this.notifyListeners(event);

    console.log(`[LocationSafety] Boundary event: ${eventType} ${zone.name}`);

    return event;
  }

  // Demo: Trigger boundary event manually
  triggerDemoBoundaryEvent(zoneId: string, eventType: 'enter' | 'exit'): BoundaryEvent | null {
    const zone = this.safeZones.get(zoneId);
    if (!zone) return null;

    const event: BoundaryEvent = {
      id: generateUUID(),
      zoneId: zone.id,
      zoneName: zone.name,
      eventType,
      timestamp: Date.now(),
      location: this.currentLocation || {
        latitude: zone.latitude,
        longitude: zone.longitude,
        timestamp: Date.now(),
      },
      notified: false,
    };

    this.eventHistory.push(event);
    this.notifyListeners(event);

    console.log(`[LocationSafety] DEMO boundary event: ${eventType} ${zone.name}`);

    return event;
  }

  // Mark event as notified
  markEventNotified(eventId: string): void {
    const event = this.eventHistory.find(e => e.id === eventId);
    if (event) {
      event.notified = true;
    }
  }

  // Get event history
  getEventHistory(): BoundaryEvent[] {
    return [...this.eventHistory];
  }

  // Clear history
  clearHistory(): void {
    this.eventHistory = [];
  }

  // Event subscription
  subscribe(listener: BoundaryEventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Utility: Calculate distance between two points (Haversine formula)
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private notifyListeners(event: BoundaryEvent): void {
    this.listeners.forEach(listener => listener(event));
  }
}

// Singleton
export const LocationSafetyService = new LocationSafetyServiceClass();
