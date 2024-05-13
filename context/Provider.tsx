"use client";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { User } from "~/lib/schemas";
import { DashboardSelection, LocationData } from "~/lib/types";
import { InteractionContext, SessionContext } from ".";

export function ContextProvider({ children }: { children: React.ReactNode }) {
  const [dashboardSelection, setDashboardSelection] = useState<DashboardSelection>({
    active: false,
    startupName: undefined,
  });
  const [selectedLocation, setSelectedLocation] = useState<LocationData | undefined>(
    undefined
  );

  const [user, setUser] = useState<User | null>(null);

  function parseUser() {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      setUser(null);
      return;
    }
    const user = jwtDecode(jwt);
    console.log(user);
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
        {children}
      </InteractionContext.Provider>
    </SessionContext.Provider>
  );
}
