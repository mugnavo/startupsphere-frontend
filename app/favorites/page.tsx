"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Image, MoreVertical, Search, X } from "lucide-react";

interface Startup {
  id: number;
  name: string;
  location: string;
}

export default function Favorites() {
  const router = useRouter();
  const [favoriteStartups, setFavoriteStartups] = useState<Startup[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStartupId, setSelectedStartupId] = useState<number | null>(null);

  const handleMoreOptionsClick = (id: number) => {
    setSelectedStartupId((prevId) => (prevId === id ? null : id));
  };

  const handleMenuItemClick = (action: string) => {
    console.log(`${action} is clicked`);
  };

  const fetchFavoriteStartups = () => {
    // Fetch favorite startups from a database or static data
    // For demonstration purposes, using static data
    const favorites: Startup[] = [
      { id: 1, name: "Doce Much", location: "Luyo sa cebu doc, Cebu City" },
      { id: 2, name: "Vonnitation Albs", location: "Mingming Lair, Cebu City" },
      // Add more startups as needed
    ];
    setFavoriteStartups(favorites);
  };

  // Call fetchFavoriteStartups when component mounts
  useEffect(() => {
    fetchFavoriteStartups();
  }, []);

  // Filter favorite startups based on search query
  const filteredFavorites = favoriteStartups.filter((startup) =>
    startup.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="absolute left-20 top-0 z-10 h-screen w-[22rem] bg-white p-6">
      <div className="flex items-center justify-between">
        <span>Favorites</span>
        <X size={20} onClick={() => router.replace("/")} className="cursor-pointer" />
      </div>
      <div className="relative mt-2">
        {/* Search input with magnifying glass icon */}
        <div className="relative">
          <input
            type="search"
            name="search-favorites"
            id="search-favorites"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
            placeholder="Search Favorites"
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search size={15} className="text-gray-500" />
          </div>
        </div>
        {/* List of favorite startups */}
        <div className="mt-2 overflow-y-auto">
          {filteredFavorites.map((startup) => (
            <div
              key={startup.id}
              className="mb-4 flex cursor-pointer items-center justify-between"
              onClick={() => router.push(`/details/${startup.id}`)}
            >
              <div className="flex items-center">
                <div className="mr-4 flex h-12 w-12 items-center justify-center bg-gray-200">
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <Image size={24} color="#6B7280" />
                </div>
                <div>
                  <div className="text-lg font-semibold">{startup.name}</div>
                  <div className="text-gray-500">{startup.location}</div>
                </div>
              </div>
              {/* Three dots */}
              <div className="flex items-center">
                <MoreVertical
                  size={24}
                  className="cursor-pointer"
                  onClick={() => handleMoreOptionsClick(startup.id)}
                />
                {selectedStartupId === startup.id && (
                  <div className="absolute right-10 top-0 mt-8 rounded border border-gray-200 bg-white shadow-md">
                    <ul>
                      <li
                        className="cursor-pointer px-4 py-2"
                        onClick={() => handleMenuItemClick("Remove")}
                      >
                        Remove
                      </li>
                      <li
                        className="cursor-pointer px-4 py-2"
                        onClick={() => handleMenuItemClick("Share")}
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
