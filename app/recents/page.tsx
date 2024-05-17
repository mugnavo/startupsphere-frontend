"use client";

import { Image, MoreVertical, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Startup {
  id: number;
  name: string;
  locationName: string;
  categories: string[];
}

export default function Recents() {
  const router = useRouter();
  const [recentStartups, setRecentStartups] = useState<Startup[]>([]);
  const [selectedStartupId, setSelectedStartupId] = useState<number | null>(null);


  const fetchRecentStartups = () => {
    // Fetch recent startups from a database or static data
    // For demonstration purposes, using static data
    const recent: Startup[] = [
      {
        id: 1,
        name: "Doce Much",
        locationName: "Luyo sa cebu doc, Cebu City",
        categories: ["Education", "EdTech"],
      },
      {
        id: 2,
        name: "Vonnitation Albs",
        locationName: "Mingming Lair, Cebu City",
        categories: ["Tech", "Innovation"],
      },
      // Add more recent startups as needed
    ];
    setRecentStartups(recent);
  };

  // Call fetchRecentStartups when component mounts
  useEffect(() => {
    fetchRecentStartups();
  }, []);


  return (
    <div className="absolute left-20 top-0 z-10 h-screen w-[22rem] bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold">Recents</span>
        <X size={20} onClick={() => router.replace("/")} className="cursor-pointer" />
      </div>
      <div className="relative mt-2">
        {/* List of recent startups */}
        <div className="mt-2">
          {recentStartups.map((startup) => (
            <div
              key={startup.id}
              className="mb-2 flex cursor-pointer items-center justify-between rounded-md p-4 hover:bg-gray-100"
              style={{ height: "6rem", width: "100%" }}
              onClick={() => router.push(`/details/${startup.id}`)}
            >
              <div className="flex items-center">
                <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-md bg-gray-200">
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <Image size={24} color="#6B7280" />
                </div>
                <div>
                  <div className="flex flex-col">
                    <div className="text-sm font-semibold">{startup.name}</div>
                    <div className="text-xs text-gray-500">{startup.locationName}</div>
                    <div className="mt-1 flex flex-wrap">
                      {startup.categories.map((category, index) => (
                        <span
                          key={index}
                          className="mb-1 mr-2 rounded-full bg-gray-200 px-2 py-1 text-xs"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
