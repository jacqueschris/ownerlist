import { useEffect, useState } from 'react';

export interface Location {
  lat: number;
  lon: number;
}

export const useLocation = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setLocation({ lat, lon });

          // Send location data to Telegram bot (if needed)
          if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.sendData(JSON.stringify({ latitude: lat, longitude: lon }));
          }
        },
        (err) => setError(err.message)
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

  const getLocation = async () => {
    let webApp = (window.Telegram.WebApp as any)
    await webApp.LocationManager.getLocation(updateLocation)
  }

  const updateLocation = async (newLocation: any) => {
    setLocation({
      lat: newLocation.latitude,
      lon: newLocation.longitude,
    })
  }

  return { location, error, getLocation };
};
