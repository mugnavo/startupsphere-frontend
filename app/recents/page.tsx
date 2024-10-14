"use client";

import axios from "axios";
import { Cog, HandCoins, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "~/context/hooks";
import { viewControllerFindRecentsByUserId } from "~/lib/api";
import { View } from "~/lib/schemas";
import { withAuth } from "~/lib/utils";

export default function Recents() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [recentViews, setRecentViews] = useState<View[]>([]);
  const { user } = useSession();

  const searchFocusType = [
    { name: "Startups", icon: <Cog size={24} /> },
    { name: "Investors", icon: <HandCoins size={24} /> },
  ];

  const [profilePictures, setProfilePictures] = useState<any>({});

  async function fetchProfilePictures() {
    const pictures = {} as any;

    await Promise.all([
      ...recentViews.map(async (view) => {
        try {
          if (view.startup) {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile-picture/startup/${view.startup?.id}`,
              {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                responseType: "blob",
              }
            );
            pictures[`startup_${view.id}`] = URL.createObjectURL(response.data);
          } else {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile-picture/investor/${view.investor?.id}`,
              {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                responseType: "blob",
              }
            );
            pictures[`investor_${view.id}`] = URL.createObjectURL(response.data);
          }
        } catch (error) {
          console.error(`Failed to fetch profile picture for view ID ${view.id}:`, error);
        }
      }),
    ]);
    setProfilePictures({ ...profilePictures, ...pictures });
  }

  useEffect(() => {
    if (recentViews.length > 0) {
      fetchProfilePictures();
    }
  }, [recentViews]);

  async function fetchRecentStartups() {
    if (!user) return;
    const { data } = await viewControllerFindRecentsByUserId(user.id, withAuth);

    // Remove duplicate startups
    const uniqueData = data.filter(
      (value, index, self) => self.findIndex((t) => t.startup?.id === value.startup?.id) === index
    );
    setRecentViews(uniqueData);
  }

  useEffect(() => {
    fetchRecentStartups();
  }, [user]);

  return (
    <div className="absolute left-20 top-0 z-10 flex h-screen w-[22rem] flex-col bg-white p-6">
      {/* the gradient div */}
      <div className="absolute inset-0 z-[-10] h-[8rem] bg-gradient-to-b from-yellow-600 to-transparent opacity-80" />

      <div className="flex items-center justify-between">
        <span className="text-yellow-800"> Recents </span>
        <X size={20} onClick={() => router.replace("/")} className="cursor-pointer" />
      </div>

      {/* Filter buttons */}
      <div className="flex py-3">
        {searchFocusType.map((item, index) => (
          <button
            key={item.name}
            onClick={() => {
              // setSearchFocus(item.name);
              setActiveIndex(index); // Set the active index when clicked
            }}
            type="button"
            className={`flex w-full items-center gap-3 px-3 py-2 text-gray-400 ring-1 ring-gray-300 ${
              activeIndex === index
                ? index === 0
                  ? "bg-gradient-to-r from-[#FFC312] via-[#EE5A24] to-[#EA2027] font-bold text-white"
                  : "bg-gradient-to-r from-[#68d8d6] via-[#00a6fb] to-[#00509d] font-bold text-white"
                : "bg-white hover:bg-gradient-to-r hover:font-bold hover:text-white"
            } rounded-${index === 0 ? "l-full" : "r-full"} ${index === 0 ? "hover:from-[#FFC312] hover:via-[#EE5A24] hover:to-[#EA2027]" : "hover:from-[#68d8d6] hover:via-[#00a6fb] hover:to-[#00509d]"}`}
          >
            {item.icon} {item.name}
          </button>
        ))}
      </div>

      {/* Recents list */}
      <div className="flex-1 overflow-y-auto">
        <div className="mt-2">
          {recentViews.length === 0 ? (
            <div className="mt-5 flex flex-col items-center">
              <p className="text-gray-500">No recent startups</p>
            </div>
          ) : (
            recentViews.map((view) => (
              <div
                key={view.id}
                className="mb-1 flex cursor-pointer items-center justify-between rounded-md p-2 shadow-none hover:bg-gray-100"
                onClick={() => router.push(`/startup/${view.startup?.id}`)}
              >
                <div className="flex w-full items-center">
                  <div className="mr-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-md bg-gray-100">
                    <img
                      src={profilePictures[`${view.startup ? "startup" : "investor"}_${view.id}`]}
                      alt={view.startup?.companyName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col">
                      <div className="text-sm font-semibold">{view.startup?.companyName}</div>
                      <div className="text-xs text-gray-500">{view.startup?.locationName}</div>
                      <div className="mt-1 flex flex-wrap">
                        <span className="mb-1 mr-2 rounded-full bg-gray-200 px-2 py-1 text-xs">
                          {view.startup?.industry}
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
