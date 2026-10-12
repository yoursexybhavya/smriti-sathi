import { useState, useCallback } from 'react';
import { LatLng } from '../lib/haversine';

interface GeolocationState {
  loading: boolean;
  position: LatLng | null;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    loading: false,
    position: null,
    error: null,
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({ ...prev, error: 'Geolocation is not supported by your browser.' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          loading: false,
          position: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
          error: null,
        });
      },
      (err) => {
        let msg = 'Unable to retrieve location.';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Location access was denied.';
        }
        setState({
          loading: false,
          position: null,
          error: msg,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  return {
    ...state,
    requestLocation,
  };
}
