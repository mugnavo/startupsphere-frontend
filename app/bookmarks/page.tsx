"use client";

import { MoreVertical, Search, X } from "lucide-react";
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
  const [selectedStartupId, setSelectedStartupId] = useState<number | null>(null);

  const handleMoreOptionsClick = (id: number) => {
    setSelectedStartupId((prevId) => (prevId === id ? null : id));
  };

  const handleMenuItemClick = (action: string) => {
    console.log(`${action} is clicked`);
  };

  const fetchBookmarkStartups = async () => {
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
  };

  useEffect(() => {
    if (userId) {
      fetchBookmarkStartups();
    }
  }, [userId]);

  const filteredBookmarks = bookmarkStartups.filter((bookmark) =>
    bookmark.startup.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="absolute left-20 top-0 z-10 h-screen w-[22rem] bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold">Bookmarks</span>
        <X size={20} onClick={() => router.replace("/")} className="cursor-pointer" />
      </div>
      <div className="relative mt-2">
        <div className="relative">
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
        <div className="mt-2">
          {filteredBookmarks.map(({ id, startup }) => (
            <div
              key={id}
              className="mb-2 flex cursor-pointer items-center justify-between rounded-md p-4 hover:bg-gray-100"
              style={{ height: "6rem", width: "100%" }}
              onClick={() => router.push(`/details/${startup.id}`)}
            >
              <div className="flex items-center">
                <div className="mr-4 flex w-16 items-center justify-center rounded-md bg-gray-200">
                  <img src={startup.logoUrl} alt={startup.name} />
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
              <div className="relative flex items-center">
                <MoreVertical
                  size={24}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoreOptionsClick(id);
                  }}
                />
                {selectedStartupId === id && (
                  <div className="absolute left-5 top-2 mt-1 rounded border border-gray-200 bg-white text-sm shadow-md">
                    <ul>
                      <li
                        className="cursor-pointer px-5 py-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMenuItemClick("Remove");
                        }}
                      >
                        Remove
                      </li>
                      <li
                        className="cursor-pointer border-t px-5 py-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMenuItemClick("Share");
                        }}
                      >
                        Share
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
