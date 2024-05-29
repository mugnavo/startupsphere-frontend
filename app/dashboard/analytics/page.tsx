"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import LChart from "~/components/ui/line-chart";
import {
  bookmarkControllerGetAll,
  likeControllerGetAll,
  startupControllerGetAll,
  viewControllerGetAll,
} from "~/lib/api";
import { Bookmark, Like, Startup, View } from "~/lib/schemas";
import { withAuth } from "~/lib/utils";

type StartupStats = {
  views: number;
  likes: number;
  bookmarks: number;
};
export default function DashboardAnalytics() {
  const statKeys: (keyof StartupStats)[] = ["views", "likes", "bookmarks"];
  const [startups, setStartups] = useState<Startup[]>([]);
  const [selectedStartup, setSelectedStartup] = useState<Startup | Startup[]>([]);
  const [relatedStartups, setRelatedStartups] = useState<Startup[]>([]);

  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<Startup[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [stats, setStats] = useState<StartupStats>();
  const [categories, setCategories] = useState([
    { name: "All", isActive: true },
    { name: "Likes", isActive: false },
    { name: "Bookmarks", isActive: false },
    { name: "Views", isActive: false },
  ]);

  const [likes, setLikes] = useState<Like[]>([]);
  const [views, setViews] = useState<View[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  async function fetchChartData() {
    const likesPromise = likeControllerGetAll(withAuth);
    const viewsPromise = viewControllerGetAll(withAuth);
    const bookmarksPromise = bookmarkControllerGetAll(withAuth);

    const [likesRes, viewsRes, bookmarksRes] = await Promise.all([
      likesPromise,
      viewsPromise,
      bookmarksPromise,
    ]);

    if (likesRes.data) {
      setLikes(likesRes.data);
    }
    if (viewsRes.data) {
      setViews(viewsRes.data);
    }
    if (bookmarksRes.data) {
      setBookmarks(bookmarksRes.data);
    }
  }

  async function fetchStartups() {
    startupControllerGetAll()
      .then((result) => setStartups(result.data))
      .catch((error) => console.error("Error fetching startups:", error));
  }

  useEffect(() => {
    fetchChartData();
    fetchStartups();
  }, []);

  useEffect(() => {
    if (startups[0]) {
      setStats({
        views: getAverageStats("views"),
        likes: getAverageStats("likes"),
        bookmarks: getAverageStats("bookmarks"),
      });
    }
    // init all upon view
    handleFilters();
  }, [startups]);

  function getAverageStats (stat: keyof StartupStats): number {
    const result =
      startups.reduce((accumulator, currentValue) => accumulator + currentValue[stat], 0) /
      startups.length;
    return parseFloat(result.toFixed(1));
  };

  useEffect(() => {
    setSearchResults(
      startups.filter((startup) => startup.name.toLowerCase().includes(searchValue.toLowerCase()))
    );
  }, [searchValue]);

  // if a startup is selected, filters are off
  useEffect(() => {
    if (!Array.isArray(selectedStartup)) {
      let updatedItems = [...categories];
      updatedItems[0] = { ...updatedItems[0], isActive: false };
      setCategories(updatedItems);

      // set related startups based on the category of the selected startup
      setRelatedStartups(
        startups.filter(
          (startup) =>
            startup != selectedStartup &&
            startup.categories.some((category) => selectedStartup.categories.includes(category))
        )
      );
    }
  }, [selectedStartup]);


  function handleFilters  (
    statOne?: keyof StartupStats,
    statTwo?: keyof StartupStats,
    statThree?: keyof StartupStats
  )  {
    const stat_arr = startups.map((startup) => {
      let value: number;

      if (statTwo && statOne) {
        value = startup[statOne] + startup[statTwo];
        // console.log("2");
      } else if (statOne) {
        value = startup[statOne];
        // console.log("1");
      } else {
        value = startup.likes + startup.views + startup.bookmarks;
      }
      return {
        startup: startup,
        value: value,
      };
    });

    stat_arr.sort((a, b) => a.value - b.value).reverse();

    setSelectedStartup(statOne ? stat_arr[0].startup : []);
    setRelatedStartups(stat_arr.map((stat) => stat.startup).slice(statOne ? 1 : 0, 5));

    console.log(stat_arr, "hhh");
  };

  useEffect(() => {
    const activeCategories = categories.filter((category) => category.isActive);
    // console.log(activeCategories);

    switch (activeCategories.length) {
      case 1: {
        if (activeCategories[0].name.toLowerCase() == "likes") {
          handleFilters("likes");
        } else if (activeCategories[0].name.toLowerCase() == "views") {
          handleFilters("views");
        } else if (activeCategories[0].name.toLowerCase() == "bookmarks") {
          handleFilters("bookmarks");
        } else {
          // all cat and selecting all 3 cat are the same, no?
          handleFilters();
        }
        break;
      }
      case 2:
        {
          const activeCategoryNames = activeCategories.map((active) => active.name.toLowerCase());
          if (activeCategoryNames.includes("likes") && activeCategoryNames.includes("views")) {
            handleFilters("likes", "views");
          } else if (
            activeCategoryNames.includes("likes") &&
            activeCategoryNames.includes("bookmarks")
          ) {
            handleFilters("likes", "bookmarks");
          } else if (
            activeCategoryNames.includes("bookmarks") &&
            activeCategoryNames.includes("views")
          ) {
            handleFilters("views", "bookmarks");
          }
        }
        break;
      case 3: {
        handleFilters("likes", "bookmarks", "views");
      }
    }
  }, [categories]);

  function toggleSelected (index: number) {
    let updatedItems = [...categories];
    let itemToMove = updatedItems.splice(index, 1)[0]; // Remove item at index and store it
    updatedItems[0] = { ...updatedItems[0], isActive: false };
    let activeCategories = categories.filter((category) => category.isActive);
    const indexToInsert =
      categories.indexOf(activeCategories[activeCategories.length - 1]) +
      (itemToMove.isActive ? 0 : 1);

    if (itemToMove.name.toLowerCase() == "all") {
      updatedItems.forEach((item) => (item.isActive = false)); // Deselect all other categories
      updatedItems.unshift({ ...itemToMove, isActive: true }); // move all to beginning
    } //toggle selection & move it after all selected categories, if any
    else {
      updatedItems.splice(indexToInsert, 0, {
        ...itemToMove,
        isActive: !itemToMove.isActive,
      });
      if (itemToMove.isActive && activeCategories.length == 1)
        updatedItems[0] = { ...updatedItems[0], isActive: true }; //if all categories deselected, all is selected
    }
    setCategories(updatedItems);
  };

  return (
    <div className=" relative mx-auto h-auto w-3/5 ">
      {isSearching && (
        <div className="absolute left-1/2 top-16 z-10 flex h-48 w-full -translate-x-1/2 transform flex-col gap-2 overflow-auto rounded bg-white p-2 py-4 shadow">
          {searchValue ? (
            searchResults.length ? (
              searchResults.map((startup, index) => (
                <div
                  key={index}
                  className="rounded p-2 hover:bg-slate-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedStartup(startup);
                    setSearchValue("");
                    setIsSearching(false);
                  }}
                >
                  {startup.name}
                </div>
              ))
            ) : (
              <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-slate-500">
                No Startup Found
              </p>
            )
          ) : (
            startups.map((startup, index) => (
              <div
                key={index}
                className="rounded p-2 hover:bg-slate-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedStartup(startup);
                  setSearchValue("");
                  setIsSearching(false);
                }}
              >
                {startup.name}
              </div>
            ))
          )}
        </div>
      )}
      {startups[0] && (
        <>
          <div>
            <div>
              <div
                className="relative mt-4 rounded-md shadow-sm"
                onClick={() => setIsSearching(!isSearching)}
              >
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                  <Search size={15} className="  text-gray-500" />
                </div>
                <input
                  type="search"
                  name="search-startup"
                  id="search-startup"
                  className="block w-full rounded-md border-0 py-1.5 pl-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                  placeholder="Search Startups"
                  autoComplete="off"
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2.5 pt-1">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => toggleSelected(index)}
                  type="button"
                  className={`flex items-center gap-3 ${category.isActive ? "btn-active" : "btn-primary"}`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid h-80 w-full grid-cols-2">
            <div className="mt-3 flex flex-col  gap-20 p-4">
              <h1 className="text-xl">
                {Array.isArray(selectedStartup) ? (
                  <>{relatedStartups.length} Total Startups</>
                ) : (
                  <>{selectedStartup?.name}</>
                )}
              </h1>
              <div className=" mx-auto flex w-full gap-2 ">
                <div className="text-md flex flex-1 px-3 text-center">
                  {statKeys.map((stat, index) => (
                    <div key={index} className="flex flex-1 flex-col">
                      {Array.isArray(selectedStartup) ? (
                        <>
                          <span className="text-3xl">{stats ? stats[stat] : 0}</span>
                          <span>average</span>{" "}
                        </>
                      ) : (
                        <span className="text-3xl">
                          {selectedStartup ? selectedStartup[stat] : 0}
                        </span>
                      )}
                      <span>{stat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center p-4">
              <LChart likes={likes} views={views} bookmarks={bookmarks} />
            </div>
          </div>

          {/*  h-[30%] */}
          <div className="mx-auto flex h-[30%]  items-start justify-center ">
            {/* table */}
            <div className="w-full overflow-x-auto">
              <table className="table table-zebra">
                {/* head */}
                <thead>
                  <tr>
                    <th>ID</th>
                    <th className="w-auto">Startup Name</th>
                    <th className="w-auto">Views</th>
                    <th className="w-auto">Likes</th>
                    <th className="w-auto">Bookmarks</th>
                  </tr>
                </thead>
                <tbody>
                  {relatedStartups.map((startup, index) => (
                    <tr key={index}>
                      <th>{startup.id}</th>
                      <td>{startup.name}</td>
                      <td>{startup.views}</td>
                      <td>{startup.likes}</td>
                      <td>{startup.bookmarks}</td>
                    </tr>
                  ))}
                  {Array.from({ length: 5 - relatedStartups.length }).map((_, index) => (
                    <tr key={index}>
                      <td>
                        <div className="flex h-6  "></div>
                      </td>
                      <td>
                        <div className="flex h-6 "></div>
                      </td>
                      <td>
                        <div className="flex h-6 "></div>
                      </td>
                      <td>
                        <div className="flex h-6 "></div>
                      </td>
                      <td>
                        <div className="flex h-6"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
