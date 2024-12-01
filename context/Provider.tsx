"use client";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { MapProvider } from "react-map-gl";
import {
  investorsControllerFindAllInvestors,
  startupsControllerFindAllStartups,
  usersControllerGetProfile,
} from "~/lib/api";
import { Investor, Startup, User } from "~/lib/schemas";
import { DashboardSelection, LocationData } from "~/lib/types";
import { withAuth } from "~/lib/utils";
import { EcosystemContext, InteractionContext, SessionContext } from ".";

export function ContextProvider({ children }: { children: React.ReactNode }) {
  const [dashboardSelection, setDashboardSelection] = useState<DashboardSelection>({
    active: false,
    entityName: undefined,
    edit: false,
    previewLocation: undefined,
  });
  const [selectedLocation, setSelectedLocation] = useState<LocationData | undefined>(undefined);

  const [startups, setStartups] = useState<Startup[]>([]);
  const [investors, setInvestors] = useState<Investor[]>([]);

  const [profilePictures, setProfilePictures] = useState<any>({});

  async function fetchStartupProfilePictures() {
    const pictures = {} as any;

    await Promise.all([
      ...startups.map(async (startup) => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile-picture/startup/${startup.id}`,
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
              responseType: "blob",
            }
          );
          if (response.data?.size) {
            pictures[`startup_${startup.id}`] = URL.createObjectURL(response.data);
          }
        } catch (error) {
          console.error(`Failed to fetch profile picture for startup ID ${startup.id}:`, error);
        }
      }),
    ]);
    setProfilePictures((oldPfps: any) => ({ ...oldPfps, ...pictures }));
  }

  async function fetchInvestorProfilePictures() {
    const pictures = {} as any;

    await Promise.all([
      ...investors.map(async (investor) => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile-picture/investor/${investor.id}`,
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
              responseType: "blob",
            }
          );
          if (response.data?.size) {
            pictures[`investor_${investor.id}`] = URL.createObjectURL(response.data);
          }
        } catch (error) {
          console.error(`Failed to fetch profile picture for investor ID ${investor.id}:`, error);
        }
      }),
    ]);
    setProfilePictures((oldPfps: any) => ({ ...oldPfps, ...pictures }));
  }

  useEffect(() => {
    if (startups.length > 0) {
      fetchStartupProfilePictures();
    }
  }, [startups]);

  useEffect(() => {
    if (investors.length > 0) {
      fetchInvestorProfilePictures();
    }
  }, [investors]);

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

  async function fetchStartups() {
    const { data } = await startupsControllerFindAllStartups();
    if (data) {
      setStartups(data);
    }
  }

  async function fetchInvestors() {
    const { data } = await investorsControllerFindAllInvestors();
    if (data) {
      setInvestors(data);
    }
  }

  useEffect(() => {
    parseUser();
    fetchStartups();
    fetchInvestors();
  }, []);

  return (
    <SessionContext.Provider value={{ user, setUser }}>
      <EcosystemContext.Provider
        value={{
          startups,
          setStartups,
          investors,
          setInvestors,
          profilePictures,
          setProfilePictures,
        }}
      >
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
      </EcosystemContext.Provider>
    </SessionContext.Provider>
  );
}
