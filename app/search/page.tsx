"use client";
import { Image, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { startupControllerGetAll } from "~/lib/api";
import { Startup } from "~/lib/schemas";
import { sectors } from "~/lib/utils";

export default function SearchContent() {
  const router = useRouter();

  const [startups, setStartups] = useState<Startup[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState(
    sectors.map((sector, index) => ({
      id: index + 1,
      name: sector,
      isActive: false,
    }))
  );

  async function fetchStartups() {
    const { data } = await startupControllerGetAll();
    if (data) {
      setStartups(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    fetchStartups();
  }, []);

  const filteredStartups = startups.filter(
    (startup) =>
      (searchQuery === "" || startup.name.toLowerCase().includes(searchQuery.toLowerCase())) && // check if searchquery is empty to show startups
      (categories.every((category) => !category.isActive) || // check if no category is selected to show all startups
        startup.categories.some((startupCategory) =>
          categories
            .filter((category) => category.isActive)
            .some((activeCategory) => startupCategory === activeCategory.name)
        ))
  );

  const filterSelected = (index: number) => {
    const updatedItems = [...categories];
    const itemToMove = updatedItems.splice(index, 1)[0]; // Remove item at index and store it

    if (!itemToMove.isActive) {
      updatedItems.unshift({ ...itemToMove, isActive: true }); // Add the removed item to the beginning with isActive set to true
      setCategories(updatedItems);
    }
  };

  const filterDeselected = (index: number) => {
    const updatedItems = [...categories];
    const itemToMove = updatedItems.splice(index, 1)[0]; // Remove item at index and store it

    const activeCategories = categories.filter((category) => category.isActive);

    updatedItems.splice(activeCategories.length - 1, 0, {
      ...itemToMove,
      isActive: false,
    }); // Add the removed item to the beginning with isActive set to true
    setCategories(updatedItems);
  };

  return (
    <div className=" absolute left-20 top-0 z-10 h-screen w-[22rem] bg-white p-6">
      <div className=" flex items-center justify-between">
        <span>Search</span>
        <X size={20} onClick={() => router.replace("/")} className="cursor-pointer" />
      </div>
      <div className="relative mt-2 rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
          <Search size={15} className="  text-gray-500" />
        </div>
        <input
          type="search"
          name="search-startup"
          id="search-startup"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full rounded-md border-0 py-1.5 pl-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
          placeholder="Search Startups"
        />
      </div>
      <div className="flex gap-3 overflow-x-scroll pb-2.5 pt-1">
        {categories.map((category, index) => (
          <button
            key={category.id}
            onClick={() => filterSelected(index)}
            type="button"
            className={`flex items-center gap-3 ${category.isActive ? "btn-active" : "btn-primary"}`}
          >
            {category.name}
            {category.isActive && <X size={15} onClick={() => filterDeselected(index)} />}
          </button>
        ))}
      </div>
      <div className="h-[78vh] overflow-y-scroll">
        <div className="relative mt-2 h-screen">
          <div className="mt-2 h-screen">
            {loading ? (
              <div className="mt-5 flex h-screen flex-col gap-8">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="flex w-[90%] flex-row items-center gap-2">
                        <div className="h-16 w-10 animate-pulse rounded-lg bg-base-300" />
                        <div className="h-16 w-[80%] animate-pulse rounded-lg bg-base-300" />
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              filteredStartups.map((startup) => (
                <div
                  key={startup.id}
                  className="mb-2 flex cursor-pointer items-center justify-between rounded-md p-4 hover:bg-gray-100"
                  style={{ height: "6rem", width: "100%" }}
                  onClick={() => router.push(`/details/${startup.id}`)}
                >
                  <div className="flex items-center">
                    <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-md bg-gray-200">
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
