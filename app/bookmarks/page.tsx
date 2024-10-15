"use client";

import axios from "axios";
import { ArrowLeft, Cog, HandCoins, Search, X } from "lucide-react";
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
  const [searchFocus, setSearchFocus] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const searchFocusType = [
    { name: "Startups", icon: <Cog size={24} /> },
    { name: "Investors", icon: <HandCoins size={24} /> },
  ];

  const [profilePictures, setProfilePictures] = useState<any>({});

  async function fetchStartupProfilePictures() {
    const pictures = {} as any;

    await Promise.all([
      ...bookmarkStartups.map(async (startup) => {
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
    setProfilePictures((oldPfps: any) => ({ ...oldPfps, ...pictures }));
  }

  // async function fetchInvestorProfilePictures() {
  //   const pictures = {} as any;

  //   await Promise.all([
  //     ...bookmarkInvestors.map(async (investor) => {
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
  //   setProfilePictures((oldPfps: any) => ({ ...oldPfps, ...pictures }));
  // }

  useEffect(() => {
    if (bookmarkStartups.length > 0) {
      fetchStartupProfilePictures();
    }
  }, [bookmarkStartups]);

  // useEffect(() => {
  //   if (bookmarkInvestors.length > 0) {
  //     fetchInvestorProfilePictures();
  //   }
  // }, [bookmarkInvestors]);

  async function fetchBookmarkStartups() {
    try {
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
    bookmark.startup?.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="absolute left-20 top-0 z-10 flex h-screen w-[22rem] flex-col bg-[#fefefe] p-6 pb-3 shadow-sm shadow-slate-400">
      {/* the gradient div */}
      <div className="absolute inset-0 z-[-10] h-[9.5rem] bg-gradient-to-b from-yellow-600 to-transparent opacity-80" />

      <div className="mb-2 flex items-center justify-between px-1">
        <span className="text-lg font-semibold">Bookmarks</span>
        <X size={20} onClick={() => router.replace("/")} className="cursor-pointer" />
      </div>

      {/* Search bar */}
      <div className="relative flex items-center gap-2 py-1">
        <div
          onClick={() => {
            setSearchFocus("");
            setShowFilters(false);
          }}
          className="absolute inset-0 flex w-fit cursor-pointer items-center pl-2 text-gray-500"
        >
          {searchFocus ? <ArrowLeft size={15} /> : <Search size={15} />}
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

      {/* Filter buttons */}
      <div className={` ${!searchFocus ? "flex" : "hidden"}`}>
        {searchFocusType.map((item, index) => (
          <button
            key={item.name}
            onClick={() => setSearchFocus(item.name)}
            type="button"
            className={`flex w-full items-center gap-3 bg-white px-3 py-1 text-gray-400 ring-1 ring-gray-300 hover:bg-gradient-to-r hover:font-bold hover:text-white ${index === 0 ? "rounded-l-full hover:from-[#FFC312] hover:via-[#EE5A24] hover:to-[#EA2027]" : "rounded-r-full hover:from-[#68d8d6] hover:via-[#00a6fb] hover:to-[#00509d]"}`}
          >
            {item.icon} {item.name}
          </button>
        ))}
      </div>

      {/* Bookmarks list */}
      <div className="mt-4 flex-1 overflow-y-auto">
        {filteredBookmarks.length === 0 ? (
          <div className="mt-5 flex flex-col items-center">
            <p className="text-gray-500">No bookmarks found</p>
          </div>
        ) : (
          filteredBookmarks.map(({ id, startup }) => (
            <div
              key={id}
              className="mb-2 flex cursor-pointer items-center justify-between rounded-md p-2 shadow-none hover:bg-gray-100"
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
  );
}
