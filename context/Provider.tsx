"use client";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { MapProvider } from "react-map-gl";
import { usersControllerGetProfile } from "~/lib/api";
import { User } from "~/lib/schemas";
import { DashboardSelection, LocationData } from "~/lib/types";
import { withAuth } from "~/lib/utils";
import { InteractionContext, SessionContext } from ".";

export function ContextProvider({ children }: { children: React.ReactNode }) {
  const [dashboardSelection, setDashboardSelection] = useState<DashboardSelection>({
    active: false,
    entityName: undefined,
    edit: false,
    previewLocation: undefined,
  });
  const [selectedLocation, setSelectedLocation] = useState<LocationData | undefined>(undefined);

  const [user, setUser] = useState<User | null | undefined>(undefined);

  async function parseUser() {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      setUser(null);
      return;
    }
    const data = jwtDecode(jwt) as any;
    if (data?.userId) {
      const updatedUser = await usersControllerGetProfile(withAuth);
      if (updatedUser && updatedUser.data) setUser(updatedUser.data);
    }
  }

  useEffect(() => {
    parseUser();
  }, []);

  return (
    <SessionContext.Provider value={{ user, setUser }}>
      <InteractionContext.Provider
        value={{
          dashboardSelection,
          setDashboardSelection,
          selectedLocation,
          setSelectedLocation,
        }}
      >
        <MapProvider>{children}</MapProvider>
      </InteractionContext.Provider>
    </SessionContext.Provider>
  );
}
