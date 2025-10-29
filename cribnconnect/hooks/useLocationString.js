import { useEffect, useState } from 'react';
import { reverseGeocode } from '@/utils/geocodingUtils';

export const useLocationString = (location) => {
  const [locationString, setLocationString] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getLocationString = async () => {
      if (!location?.coordinates) {
        setLocationString("Location not specified");
        return;
      }

      setLoading(true);
      try {
        const address = await reverseGeocode(location.coordinates);
        setLocationString(address);
        setError(null);
      } catch (err) {
        setError(err);
        setLocationString("Location not available");
      } finally {
        setLoading(false);
      }
    };

    getLocationString();
  }, [location]);

  return { locationString, loading, error };
};