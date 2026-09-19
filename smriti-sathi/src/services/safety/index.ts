export { FallDetectionService } from './FallDetectionService';
export type { 
  FallEvent, 
  SensorData, 
  FallDetectionConfig 
} from './FallDetectionService';

export { LocationSafetyService } from './LocationSafetyService';
export type {
  SafeZone,
  LocationPoint,
  BoundaryEvent,
  LocationSafetyConfig,
} from './LocationSafetyService';

export { EmergencyAlertService } from './EmergencyAlertService';
export type {
  AlertType,
  AlertSeverity,
  AlertTarget,
  EmergencyAlert,
  EmergencyAlertConfig,
} from './EmergencyAlertService';
