"use client";

import axios from "axios";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "~/context/hooks";
import { startupsControllerFindAll } from "~/lib/api";
import { Startup } from "~/lib/schemas";
import { withAuth } from "~/lib/utils";

export default function OwnedStartups() {
  const router = useRouter();
  const [startups, setStartups] = useState<Startup[]>([]);
  const { user } = useSession();

  async function fetchOwnedStartups() {
    if (!user) return;
    const { data } = await startupsControllerFindAll(withAuth);
    setStartups(data);
  }

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
          pictures[`startup_${startup.id}`] = URL.createObjectURL(response.data);
        } catch (error) {
          console.error(`Failed to fetch profile picture for startup ID ${startup.id}:`, error);
        }
      }),
    ]);
    setProfilePictures({ ...profilePictures, ...pictures });
  }

  // async function fetchInvestorProfilePictures() {
  //   const pictures = {} as any;

  //   await Promise.all([
  //     ...investors.map(async (investor) => {
  //       try {
  //         const response = await axios.get(
  //           `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile-picture/investor/${investor.id}`,
  //           {
  //             headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  //             responseType: "blob",
  //           }
  //         );
  //         pictures[`investor_${investor.id}`] = URL.createObjectURL(response.data);
  //       } catch (error) {
  //         console.error(`Failed to fetch profile picture for investor ID ${investor.id}:`, error);
  //       }
  //     }),
  //   ]);
  //   setProfilePictures({ ...profilePictures, ...pictures });
  // }

  useEffect(() => {
    if (startups.length > 0) {
      fetchStartupProfilePictures();
    }
  }, [startups]);

  // useEffect(() => {
  //   if (investors.length > 0) {
  //     fetchInvestorProfilePictures();
  //   }
  // }, [investors]);

  useEffect(() => {
    fetchOwnedStartups();
  }, [user]);

  return (
    <div className="absolute left-20 top-0 z-10 flex h-screen w-[22rem] flex-col bg-white p-6">
      {/* the gradient div */}
      <div className="absolute inset-0 z-[-10] h-[8rem] bg-gradient-to-b from-yellow-600 to-transparent opacity-80" />
      <div className="mb-4 flex items-center justify-between">
        <span className="text-lg font-semibold">Owned Startups</span>
        <X size={20} onClick={() => router.replace("/")} className="cursor-pointer" />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="mt-2">
          {startups.length === 0 ? (
            <div className="mt-5 flex flex-col items-center">
              <p className="text-gray-500">No owned startups</p>
            </div>
          ) : (
            startups.map((startup) => (
              <div
                key={startup.id}
                className="mb-1 flex cursor-pointer items-center justify-between rounded-md p-2 shadow-none hover:bg-gray-100"
                onClick={() => router.push(`/startup/${startup?.id}`)}
              >
                <div className="flex w-full items-center">
                  <div className="mr-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-md bg-gray-100">
                    <img
                      src={profilePictures[`startup_${startup?.id}`]}
                      alt={startup?.companyName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col">
                      <div className="text-sm font-semibold">{startup?.companyName}</div>
                      <div className="text-xs text-gray-500">{startup?.locationName}</div>
                      <div className="mt-1 flex flex-wrap">
                        <span className="mb-1 mr-2 rounded-full bg-gray-200 px-2 py-1 text-xs">
                          {startup?.industry}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
