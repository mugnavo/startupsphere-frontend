"use client";

import { Album, ScanEye, Search, ThumbsUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const [selectedStartup, setSelectedStartup] = useState<Startup>();
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
  const backgroundColors = ["before:bg-[#dc2626]", "before:bg-[#fb923c]", "before:bg-[#fde047]"];
  const icons = [<ScanEye size={40} />, <ThumbsUp size={40} color="white" />, <Album size={40} />];
  const modalRef = useRef<HTMLDivElement>(null);

  const [likes, setLikes] = useState<Like[]>([]);
  const [views, setViews] = useState<View[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  //fetches all startup's like, view, bookmark counts only
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
    if (startups) handleFilters();
  }, [startups]);

  useEffect(() => {
    setSearchResults(
      startups.filter((startup) => startup.name.toLowerCase().includes(searchValue.toLowerCase()))
    );
  }, [searchValue]);

  // if a startup is selected, filters are off
  useEffect(() => {
    if (selectedStartup) {
      let updatedItems = [...categories];
      updatedItems[0] = { ...updatedItems[0], isActive: false };
      setCategories(updatedItems);

      // set related startups based on the category of the selected startup
      setRelatedStartups(
        startups.filter(
          (startup) =>
            startup != selectedStartup &&
            startup.categories.some((category) => selectedStartup?.categories.includes(category))
        )
      );
    }
  }, [selectedStartup]);

  //handle the Related Startups based on the selected filters
  function handleFilters(
    statOne?: keyof StartupStats,
    statTwo?: keyof StartupStats,
    statThree?: keyof StartupStats
  ) {
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

    // if there's a filter, assign the selected startup etc and make length of relatedSS to 6 because the 1 is made as selectedSS
    if (statOne) setSelectedStartup(stat_arr[0]?.startup);
    setRelatedStartups(
      stat_arr.map((stat) => stat.startup).slice(statOne ? 1 : 0, statOne ? 6 : 5)
    );
    console.log(stat_arr, "relatedSS");
  }

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

  //search filters
  function toggleSelected(index: number) {
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
      setSelectedStartup(undefined); //removes selected startup, if any
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
  }

  //For the search suggestion modal: Close the modal if clicked outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsSearching(false);
      }
    };

    if (isSearching) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isSearching]);

  const beforeContent = ["ave. views", "ave. likes", "ave. bookmarks"];
  const afterContent = ["total views", "total likes", "total bookmarks"];
  return (
    <div className=" relative mx-auto flex h-auto w-3/5 flex-col gap-4 ">
      <>
        <div className="relative mt-4 flex justify-start gap-3">
          <div className="pointer-events-none absolute  inset-y-0 left-0 flex items-center pl-2">
            <Search size={15} className="  text-gray-500" />
          </div>
          <input
            type="search"
            name="search-startup"
            id="search-startup"
            className="block h-auto w-auto flex-1 rounded-md border-0 py-1.5 pl-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
            placeholder="Search Startups"
            autoComplete="off"
            value={searchValue}
            onClick={() => setIsSearching(true)}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
          />

          {/* search filters */}
          <div className="flex gap-3 overflow-x-auto  pb-1">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => toggleSelected(index)}
                type="button"
                className={`flex items-center gap-3 shadow-md  ${category.isActive ? "btn-active bg-red-800 text-white" : "btn-primary hover:bg-gray-200"}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid h-[18rem] w-full grid-cols-4 gap-2 ">
          <div className="shadow-custom flex w-max flex-col gap-3 bg-orange-400 p-4">
            <h1 className="text-sm">
              {selectedStartup && selectedStartup.name ? (
                <>{selectedStartup.name}</>
              ) : (
                <>{startups.length} Total Startups</>
              )}
            </h1>
            <div className="  flex h-full w-full gap-2 ">
              <div className="text-md flex flex-1 flex-col gap-1 text-center">
                {(
                  (selectedStartup && ["views", "likes", "bookmarks"]) || [views, likes, bookmarks]
                ).map((stat, index) => (
                  <div
                    key={index}
                    className={` relative flex w-[10rem] flex-1 items-center justify-end gap-3 rounded bg-orange-300 px-3 text-center    before:absolute before:bottom-0 before:left-0 before:top-0 before:w-2 before:rounded-s before:bg-red-800 `}
                  >
                    <span className={`   text-3xl`}>
                      {(selectedStartup && selectedStartup[stat as keyof Startup]) ||
                        parseFloat((stat.length / startups.length).toFixed(1)) ||
                        0}
                    </span>
                    <span className="absolute bottom-2 left-0 right-1/3  text-[10px] leading-[0.7rem] text-gray-800">
                      {selectedStartup ? afterContent[index] : beforeContent[index]}
                    </span>
                    <span className="rounded-full bg-orange-800 p-2 text-white">
                      {icons[index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="shadow-custom col-span-3 flex flex-col border bg-white p-4  text-xs text-gray-500">
            Likes / Views / Bookmarks Analytics
            <LChart likes={likes} views={views} bookmarks={bookmarks} />
          </div>
        </div>

        {/* table */}
        <div className=" shadow-custom flex flex-col items-start justify-center bg-white ">
          <span className=" w-full px-3 text-end text-xs italic text-gray-500">
            Top 5 Startups with high ratings
          </span>
          <div className="w-full overflow-x-auto">
            <table className="table ">
              {/* head */}
              <thead className="bg-warning">
                <tr>
                  <th className="font-bold">ID</th>
                  <th className="w-auto">Startup Name</th>
                  <th className="w-auto">Views</th>
                  <th className="w-auto">Likes</th>
                  <th className="w-auto">Bookmarks</th>
                </tr>
              </thead>
              <tbody className="font-normal">
                {relatedStartups.map((startup, index) => (
                  <tr key={index} className="hover:bg-yellow-100">
                    <th>{startup.id}</th>
                    <td>{startup.name}</td>
                    <td>{startup.views}</td>
                    <td>{startup.likes}</td>
                    <td>{startup.bookmarks}</td>
                  </tr>
                ))}

                {/* to fill empty spaces if table data is short  */}
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

      {/* for the search */}
      {isSearching && (
        <div
          ref={modalRef}
          className="absolute left-1/2 top-14 z-10 flex h-48 w-full -translate-x-1/2 transform flex-col gap-2 overflow-auto rounded bg-white p-2  shadow"
        >
          {searchValue ? (
            searchResults.length ? (
              searchResults.map((startup, index) => (
                <div
                  key={index}
                  className="rounded p-2 hover:bg-slate-100"
                  onClick={() => {
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
                onClick={() => {
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
    </div>
  );
}
