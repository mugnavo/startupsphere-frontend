"use client";

import { Cog, HandCoins, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useEcosystem, useSession } from "~/context/hooks";
import { bookmarkControllerFindAllByUserId } from "~/lib/api";
import { Bookmark } from "~/lib/schemas";
import { placeholderImageUrl, withAuth } from "~/lib/utils";

export default function Bookmarks() {
  const router = useRouter();
  const { user } = useSession();
  const userId = user ? user.id : null;
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null); // Toggle between 0 (startups), 1 (investors), and null (both)
  const { profilePictures } = useEcosystem();

  const searchFocusType = [
    { name: "Startups", icon: <Cog size={24} /> },
    { name: "Investors", icon: <HandCoins size={24} /> },
  ];

  async function fetchBookmarks() {
    try {
      if (!userId) {
        console.error("User not authenticated.");
        return;
      }

      const { data } = await bookmarkControllerFindAllByUserId(userId, withAuth);
      setBookmarks(data);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  }

  useEffect(() => {
    if (userId) {
      fetchBookmarks();
    }
  }, [userId]);

  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const name = bookmark.startup
      ? bookmark.startup.companyName
      : `${bookmark.investor?.firstName} ${bookmark.investor?.lastName}`;

    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeIndex === null) return matchesSearch;

    return activeIndex === 0
      ? bookmark.startup && matchesSearch
      : bookmark.investor && matchesSearch;
  });

  return (
    <div className="absolute left-20 top-0 z-10 flex h-screen w-[22rem] flex-col bg-[#fefefe] p-6 pb-3 shadow-sm shadow-slate-400">
      <div className="absolute inset-0 z-[-10] h-[9.5rem] bg-gradient-to-b from-[#004A98] to-transparent opacity-80" />

      <div className="mb-2 flex items-center justify-between px-1">
        <span className="text-lg font-semibold">Bookmarks</span>
        <X size={20} onClick={() => router.replace("/")} className="cursor-pointer" />
      </div>

      <div className="relative flex items-center gap-2 py-1">
        <div className="absolute inset-0 flex w-fit cursor-pointer items-center pl-2 text-gray-500">
          <Search size={15} />
        </div>
        <input
          type="search"
          name="search-bookmark"
          id="search-bookmark"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full rounded-full border-0 py-2 pl-7 pr-3 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
          placeholder={`Search Bookmarks...`}
        />
      </div>

      <div className="flex py-3 pt-0">
        {searchFocusType.map((item, index) => (
          <button
            key={item.name}
            onClick={() => setActiveIndex(index === activeIndex ? null : index)} // Toggle off filter
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

      <div className="mt-4 flex-1 overflow-y-auto">
        {filteredBookmarks.length === 0 ? (
          <div className="mt-5 flex flex-col items-center">
            <p className="text-gray-500">No bookmarks found</p>
          </div>
        ) : (
          filteredBookmarks.map(({ id, startup, investor }) => (
            <div
              key={id}
              className="mb-2 flex cursor-pointer items-center justify-between rounded-md p-2 shadow-none hover:bg-gray-100"
              onClick={() => {
                if (startup) {
                  router.push(`/startup/${startup.id}`);
                } else if (investor) {
                  router.push(`/investor/${investor?.id}`);
                }
              }}
            >
              <div className="flex w-full items-center">
                <div className="mr-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-md bg-gray-100">
                  <img
                    src={
                      (startup
                        ? profilePictures[`startup_${startup.id}`]
                        : profilePictures[`investor_${investor?.id}`]) || placeholderImageUrl
                    }
                    alt={
                      startup ? startup.companyName : `${investor?.firstName} ${investor?.lastName}`
                    }
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col">
                    {startup ? (
                      <>
                        <div className="text-sm font-semibold">{startup.companyName}</div>
                        <div className="text-xs text-gray-500">{startup.locationName}</div>
                        <div className="mt-1 flex flex-wrap">
                          <span className="mb-1 mr-2 rounded-full bg-gray-200 px-2 py-1 text-xs">
                            {startup.industry}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-sm font-semibold">{`${investor?.firstName} ${investor?.lastName}`}</div>
                        <div className="text-xs text-gray-500">{investor?.locationName}</div>
                        <div className="mt-1 flex overflow-hidden whitespace-nowrap">
                          <span className="mb-1 mr-2 rounded-full bg-gray-200 px-2 py-1 text-xs">
                            Investor
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
