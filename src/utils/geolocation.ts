import { GPSLocation } from '../types';

export function getDeviceGeolocation(): Promise<GPSLocation> {
  return new Promise((resolve) => {
    const timestamp = new Date().toISOString();

    if (!navigator.geolocation) {
      resolve({
        latitude: null,
        longitude: null,
        accuracy: null,
        addressApprox: 'Geolocation unavailable (Please specify landmark)',
        timestamp,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = parseFloat(position.coords.latitude.toFixed(6));
        const lng = parseFloat(position.coords.longitude.toFixed(6));
        const acc = Math.round(position.coords.accuracy);

        resolve({
          latitude: lat,
          longitude: lng,
          accuracy: acc,
          addressApprox: `GPS: ${lat}, ${lng} (±${acc}m accuracy)`,
          timestamp,
        });
      },
      (error) => {
        let msg = 'Location access disabled (Enter nearest cross street or mile marker)';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission denied (Enter nearest highway exit or street)';
        }
        resolve({
          latitude: null,
          longitude: null,
          accuracy: null,
          addressApprox: msg,
          timestamp,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 6000,
        maximumAge: 30000,
      }
    );
  });
}
