"use client";

import { Dispatch, SetStateAction, createContext } from "react";
import { User } from "~/lib/schemas";
import { DashboardSelection, LocationData } from "../lib/types";

export const InteractionContext = createContext<
  | {
      dashboardSelection: DashboardSelection;
      setDashboardSelection: Dispatch<SetStateAction<DashboardSelection>>;
      selectedLocation: LocationData | undefined;
      setSelectedLocation: Dispatch<SetStateAction<LocationData | undefined>>;
    }
  | undefined
>(undefined);

export const SessionContext = createContext<
  | {
      user: User | null;
      setUser: Dispatch<SetStateAction<User | null>>;
    }
  | undefined
>(undefined);
