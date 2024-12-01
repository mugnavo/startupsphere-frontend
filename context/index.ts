"use client";

import { Dispatch, SetStateAction, createContext } from "react";
import { User } from "~/lib/schemas";
import type { Investor } from "~/lib/schemas/investor";
import type { Startup } from "~/lib/schemas/startup";
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
      user: User | undefined | null;
      setUser: Dispatch<SetStateAction<User | undefined | null>>;
    }
  | undefined
>(undefined);

export const EcosystemContext = createContext<
  | {
      startups: Startup[];
      setStartups: Dispatch<SetStateAction<Startup[]>>;
      investors: Investor[];
      setInvestors: Dispatch<SetStateAction<Investor[]>>;
      profilePictures: any;
      setProfilePictures: Dispatch<SetStateAction<any>>;
    }
  | undefined
>(undefined);
