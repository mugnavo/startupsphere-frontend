"use client";

import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";

export interface LocationData {
  name: string;
  latitude: number;
  longitude: number;
}

interface DashboardSelection {
  active: boolean;
  startupName: string | undefined;
}

const InteractionContext = createContext<
  | {
      dashboardSelection: DashboardSelection;
      setDashboardSelection: Dispatch<SetStateAction<DashboardSelection>>;
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
  const [dashboardSelection, setDashboardSelection] = useState<DashboardSelection>({
    active: false,
    startupName: undefined,
  });
  const [selectedLocation, setSelectedLocation] = useState<LocationData | undefined>(
    undefined
  );

  return (
    <InteractionContext.Provider
      value={{
        dashboardSelection,
        setDashboardSelection,
        selectedLocation,
        setSelectedLocation,
      }}
    >
      {children}
    </InteractionContext.Provider>
  );
}
