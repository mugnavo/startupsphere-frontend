"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "~/context/hooks";
import { bookmarkControllerFindAllByUserId } from "~/lib/api";
import { Bookmark } from "~/lib/schemas";
import { withAuth } from "~/lib/utils";

export default function Bookmarks() {
  const router = useRouter();
  const { user } = useSession();
  const userId = user ? user.id : null;
  const [bookmarkStartups, setBookmarkStartups] = useState<Bookmark[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  async function fetchBookmarkStartups() {
    try {
      // Check if user is authenticated
      if (!userId) {
        console.error("User not authenticated.");
        return;
      }

      const { data } = await bookmarkControllerFindAllByUserId(userId, withAuth);
      setBookmarkStartups(data);
    } catch (error) {
      console.error("Error fetching bookmark startups:", error);
    }
  }

  useEffect(() => {
    if (userId) {
      fetchBookmarkStartups();
    }
  }, [userId]);

  const filteredBookmarks = bookmarkStartups.filter((bookmark) =>
    bookmark.startup.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="absolute left-20 top-0 z-10 flex h-screen w-[22rem] flex-col bg-white p-6">
      {/* the gradient div */}
      <div className="absolute inset-0 z-[-10] h-[8rem] bg-gradient-to-b from-yellow-600 to-transparent opacity-80" />

      <div className="mb-4 flex items-center justify-between">
        <span className="text-lg font-semibold">Bookmarks</span>
        <X size={20} onClick={() => router.replace("/")} className="cursor-pointer" />
      </div>
      <div className="relative mb-4">
        <input
          type="search"
          name="search-bookmarks"
          id="search-bookmarks"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full rounded-md border-0 py-1.5 pl-10 pr-4 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
          placeholder="Search Bookmarks"
        />
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search size={15} className="text-gray-500" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredBookmarks.length === 0 ? (
          <div className="mt-5 flex flex-col items-center">
            <p className="text-gray-500">No bookmarks found</p>
          </div>
        ) : (
          filteredBookmarks.map(({ id, startup }) => (
            <div
              key={id}
              className="mb-2 flex cursor-pointer items-center justify-between rounded-md p-2 shadow-none hover:bg-gray-100"
              onClick={() => router.push(`/startup/${startup.id}`)}
            >
              <div className="flex w-full items-center">
                <div className="mr-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-md bg-gray-100">
                  <img
                    src={startup.logoUrl}
                    alt={startup.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col">
                    <div className="text-sm font-semibold">{startup.name}</div>
                    <div className="text-xs text-gray-500">{startup.locationName}</div>
                    <div className="mt-1 flex flex-wrap">
                      {startup.categories.slice(0, 3).map((category, index) => (
                        <span
                          key={index}
                          className="mb-1 mr-2 rounded-full bg-gray-200 px-2 py-1 text-xs"
                        >
                          {category}
                        </span>
                      ))}
                      {startup.categories.length > 3 && (
                        <span className="mb-1 mr-2 rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-500">
                          ...
                        </span>
                      )}
                    </div>
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
