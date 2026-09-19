// Deterministic UUID generation for sync events
// Uses crypto.randomUUID() when available, falls back to manual generation

export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback: manual UUID v4 generation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Generate a deterministic sync key for idempotency
export function generateSyncKey(
  entityType: string,
  entityId: number,
  operation: string
): string {
  return `${entityType}:${entityId}:${operation}:${Date.now()}`;
}
