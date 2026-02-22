import React, { createContext, useContext, useMemo, useState } from 'react';

import type { AppLocation } from './types';
import { MAKKAH_LOCATION } from './types';

type LocationContextValue = {
  location: AppLocation;
  setLocation: (loc: AppLocation) => void;
};

const LocationContext = createContext<LocationContextValue | null>(null);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<AppLocation>(MAKKAH_LOCATION);

  const value = useMemo<LocationContextValue>(() => ({ location, setLocation }), [location]);

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useAppLocation(): LocationContextValue {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useAppLocation must be used within LocationProvider');
  return ctx;
}
