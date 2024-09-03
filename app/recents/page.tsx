"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "~/context/hooks";
import { viewControllerFindRecentsByUserId } from "~/lib/api";
import { View } from "~/lib/schemas";
import { withAuth } from "~/lib/utils";

export default function Recents() {
  const router = useRouter();
  const [recentViews, setRecentViews] = useState<View[]>([]);
  const { user } = useSession();

  async function fetchRecentStartups() {
    if (!user) return;
    const { data } = await viewControllerFindRecentsByUserId(user.id, withAuth);

    // remove duplicate startups
    const uniqueData = data.filter(
      (value, index, self) => self.findIndex((t) => t.startup.id === value.startup.id) === index
    );
    setRecentViews(uniqueData);
  };

  useEffect(() => {
    fetchRecentStartups();
  }, [user]);

  return (
    <div className="absolute left-20 top-0 z-10 h-screen w-[22rem] bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold">Recents</span>
        <X size={20} onClick={() => router.replace("/")} className="cursor-pointer" />
      </div>
      <div className="relative mt-2">
        {/* List of recent startups */}
        <div className="mt-2">
          {recentViews.map((view) => (
            <div
              key={view.id}
              className="mb-2 flex cursor-pointer items-center justify-between rounded-md p-4 hover:bg-gray-100"
              style={{ height: "6rem", width: "100%" }}
              onClick={() => router.push(`/details/${view.startup.id}`)}
            >
              <div className="flex items-center">
                <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-md bg-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={view.startup.logoUrl} alt={view.startup.name} />
                </div>
                <div>
                  <div className="flex flex-col">
                    <div className="text-sm font-semibold">{view.startup.name}</div>
                    <div className="text-xs text-gray-500">{view.startup.locationName}</div>
                    <div className="mt-1 flex flex-wrap">
                      {view.startup.categories.map((category, index) => (
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
