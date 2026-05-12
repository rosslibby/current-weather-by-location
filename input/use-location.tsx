'use client'

import { useCallback, useState } from 'react';

export const useLocation = () => {
  const [location, setLocation] = useState<GeolocationPosition | undefined>();

  const getCurrentLocation = useCallback(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation(position);
      });
    }
  }, [
  ]);

  return {
    location,
    getCurrentLocation,
  };
};
