"use client";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { MapProvider } from "react-map-gl";
import { User } from "~/lib/schemas";
import { DashboardSelection, LocationData } from "~/lib/types";
import { InteractionContext, SessionContext } from ".";
import { authControllerMe } from "~/lib/api";
import { withAuth } from "~/lib/utils";

export function ContextProvider({ children }: { children: React.ReactNode }) {
  const [dashboardSelection, setDashboardSelection] = useState<DashboardSelection>({
    active: false,
    startupName: undefined,
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
    const user = jwtDecode(jwt) as User;
    if (user?.email) {
      setUser(user);

      if (user?.id) {
        const updatedUser = await authControllerMe(user.id, withAuth);
        if (updatedUser && updatedUser.data) setUser(updatedUser.data);
      }
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
