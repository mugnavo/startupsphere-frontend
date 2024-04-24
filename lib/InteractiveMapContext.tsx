"use client";

import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";

interface LocationData {
  name: string;
  latitude: number;
  longitude: number;
}

const InteractionContext = createContext<
  | {
      hideDashboard: boolean;
      setHideDashboard: Dispatch<SetStateAction<boolean>>;
      selectedLocation: LocationData | undefined;
      setSelectedLocation: Dispatch<SetStateAction<LocationData | undefined>>;
    }
  | undefined
>(undefined);

export function useInteractiveMap() {
  const context = useContext(InteractionContext);
  if (!context) {
    throw new Error("useInteractiveMap must be used within a ContextProvider");
  }

  return context;
}

export function ContextProvider({ children }: { children: React.ReactNode }) {
  const [hideDashboard, setHideDashboard] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | undefined>(
    undefined
  );

  return (
    <InteractionContext.Provider
      value={{ hideDashboard, setHideDashboard, selectedLocation, setSelectedLocation }}
    >
      {children}
    </InteractionContext.Provider>
  );
}
