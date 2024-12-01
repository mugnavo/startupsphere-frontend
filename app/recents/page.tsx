"use client";

import { Cog, HandCoins, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useEcosystem, useSession } from "~/context/hooks";
import { viewControllerFindRecentsByUserId } from "~/lib/api";
import { View } from "~/lib/schemas";
import { placeholderImageUrl, withAuth } from "~/lib/utils";

export default function Recents() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [recentViews, setRecentViews] = useState<View[]>([]);
  const { user } = useSession();
  const { profilePictures } = useEcosystem();

  const searchFocusType = [
    { name: "Startups", icon: <Cog size={24} /> },
    { name: "Investors", icon: <HandCoins size={24} /> },
  ];

  async function fetchRecentViews() {
    if (!user) return;
    const { data } = await viewControllerFindRecentsByUserId(user.id, withAuth);

    const uniqueData = data.filter((value, index, self) => {
      return (
        self.findIndex((t) => t.startup?.id === value.startup?.id) === index ||
        self.findIndex((t) => t.investor?.id === value.investor?.id) === index
      );
    });

    setRecentViews(uniqueData);
  }

  useEffect(() => {
    fetchRecentViews();
  }, [user]);

  const filteredViews = recentViews.filter((view) => {
    if (activeIndex === null) return true;
    if (activeIndex === 0) return !!view.startup;
    if (activeIndex === 1) return !!view.investor;
  });

  return (
    <div className="absolute left-20 top-0 z-10 flex h-screen w-[22rem] flex-col bg-[#fefefe] p-6 pb-3 shadow-sm shadow-slate-400">
      <div className="absolute inset-0 z-[-10] h-[9.5rem] bg-gradient-to-b from-[#004A98] to-transparent opacity-80" />

      <div className="mb-4 flex items-center justify-between">
        <span className="px-1 text-lg font-semibold">Recents</span>
        <X size={20} onClick={() => router.replace("/")} className="cursor-pointer" />
      </div>

      <div className="flex py-5 pt-0">
        {searchFocusType.map((item, index) => (
          <button
            key={item.name}
            onClick={() => setActiveIndex(index === activeIndex ? null : index)}
            type="button"
            className={`flex w-full items-center gap-3 px-3 py-1 text-gray-400 ring-1 ring-gray-300 ${
              activeIndex === index
                ? index === 0
                  ? "bg-gradient-to-r from-[#FFC312] via-[#EE5A24] to-[#EA2027] font-bold text-white"
                  : "bg-gradient-to-r from-[#68d8d6] via-[#00a6fb] to-[#00509d] font-bold text-white"
                : "bg-white hover:bg-gradient-to-r hover:font-bold hover:text-white"
            } rounded-${index === 0 ? "l-full" : "r-full"} ${
              index === 0
                ? "hover:from-[#FFC312] hover:via-[#EE5A24] hover:to-[#EA2027]"
                : "hover:from-[#68d8d6] hover:via-[#00a6fb] hover:to-[#00509d]"
            }`}
          >
            {item.icon} {item.name}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mt-2">
          {filteredViews.length === 0 ? (
            <div className="mt-5 flex flex-col items-center">
              <p className="text-gray-500">No recent startups or investors</p>
            </div>
          ) : (
            filteredViews.map((view) => (
              <div
                key={view.id}
                className="mb-1 flex cursor-pointer items-center justify-between rounded-md p-2 shadow-none hover:bg-gray-100"
                onClick={() =>
                  router.push(
                    view.startup ? `/startup/${view.startup.id}` : `/investor/${view.investor?.id}`
                  )
                }
              >
                <div className="flex w-full items-center">
                  <div className="mr-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-md bg-gray-100">
                    <img
                      src={
                        profilePictures[
                          view.startup
                            ? `startup_${view.startup.id}`
                            : `investor_${view.investor?.id}`
                        ] || placeholderImageUrl
                      }
                      alt={
                        view.startup
                          ? view.startup.companyName
                          : `${view.investor?.firstName} ${view.investor?.lastName}`
                      }
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col">
                      <div className="text-sm font-semibold">
                        {view.startup
                          ? view.startup.companyName
                          : `${view.investor?.firstName} ${view.investor?.lastName}`}
                      </div>
                      <div className="text-xs text-gray-500">
                        {view.startup ? view.startup.locationName : view.investor?.locationName}
                      </div>
                      <div className="mt-1 flex flex-wrap">
                        <span className="mb-1 mr-2 rounded-full bg-gray-200 px-2 py-1 text-xs">
                          {view.startup ? view.startup.industry : "Investor"}
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
