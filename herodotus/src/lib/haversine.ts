export interface LatLng {
  lat: number;
  lng: number;
}

/**
 * Calculates Great-Circle distance using Haversine formula (Earth mean radius R = 6371 km).
 * Overloaded to support both scalar numbers (lat1, lon1, lat2, lon2) and coordinate objects ({lat, lng}, {lat, lng}).
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number;
export function calculateDistanceKm(coord1: LatLng, coord2: LatLng): number;
export function calculateDistanceKm(
  a: number | LatLng,
  b: number | LatLng,
  c?: number,
  d?: number
): number {
  let lat1: number;
  let lon1: number;
  let lat2: number;
  let lon2: number;

  if (typeof a === 'object' && a !== null && typeof b === 'object' && b !== null) {
    lat1 = a.lat;
    lon1 = a.lng;
    lat2 = b.lat;
    lon2 = b.lng;
  } else {
    lat1 = a as number;
    lon1 = b as number;
    lat2 = c as number;
    lon2 = d as number;
  }

  const R = 6371; // Earth's mean radius in km
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const sinHalfLat = Math.sin(dLat / 2);
  const sinHalfLon = Math.sin(dLon / 2);

  const h =
    sinHalfLat * sinHalfLat +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * sinHalfLon * sinHalfLon;

  const angle = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * angle;
}

/**
 * Formats a distance in kilometers into a human-friendly string.
 * Uses meters for distances < 1.0 km ("XXX m away") and km with one decimal ("X.X km away") for >= 1.0 km.
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1.0) {
    return `${Math.round(distanceKm * 1000)} m away`;
  }
  return `${distanceKm.toFixed(1)} km away`;
}

/**
 * Formats latitude and longitude coordinates into a cinematic GPS coordinate string.
 * Example: "27.1751° N · 78.0421° E"
 */
export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${latDir} · ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
}
