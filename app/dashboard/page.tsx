"use client";

import axios from "axios";
import { Album, ScanEye, Search, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import LChart from "~/components/ui/line-chart";
import PChart from "~/components/ui/pie-chart";
import { useSession } from "~/context/hooks";
import {
  bookmarkControllerGetAll,
  investorsControllerFindAllCreatedUser,
  likeControllerGetAll,
  startupsControllerFindAll,
  viewControllerGetAll,
} from "~/lib/api";
import { Bookmark, Investor, Like, Startup, View } from "~/lib/schemas";
import { placeholderImageUrl, withAuth } from "~/lib/utils";

type StartupStats = {
  views: number;
  likes: number;
  bookmarks: number;
};

type Filter = {
  name: string;
  isActive: boolean;
};

const filtersPills = [
  { name: "All", isActive: true },
  { name: "Likes", isActive: false },
  { name: "Bookmarks", isActive: false },
  { name: "Views", isActive: false },
];

const size = 23;
const icons = [
  <ScanEye key="ScanEye" size={size} />,
  <ThumbsUp key="ThumbsUp" size={size} />,
  <Album key="Albums" size={size} />,
];

export default function OwnedStartups() {
  const router = useRouter();
  const { user } = useSession();
  const isInvestor = user && user?.role.toLowerCase() == "investor";
  const [loading, setLoading] = useState(true);
  const [startups, setStartups] = useState<Startup[] | null>();
  const [selectedStartup, setSelectedStartup] = useState<Startup>();
  const [relatedStartups, setRelatedStartups] = useState<Startup[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Startup[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [stats, setStats] = useState<StartupStats>();
  const [filters, setFilters] = useState<Filter[]>(filtersPills);
  const backgroundColors = ["before:bg-[#dc2626]", "before:bg-[#fb923c]", "before:bg-[#fde047]"];
  const [investor, setInvestor] = useState<Investor | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [pfp, setPfp] = useState<any>(null);

  const [likes, setLikes] = useState<Like[]>([]);
  const [views, setViews] = useState<View[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  //fetches all startup's like, view, bookmark counts only
  async function fetchChartData() {
    try {
      const likesPromise = likeControllerGetAll(withAuth);
      const viewsPromise = viewControllerGetAll(withAuth);
      const bookmarksPromise = bookmarkControllerGetAll(withAuth);

      const [likesRes, viewsRes, bookmarksRes] = await Promise.all([
        likesPromise,
        viewsPromise,
        bookmarksPromise,
      ]);

      if (startups && startups.length > 0) {
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
      setLoading(false);
    } catch (e) {
      console.log("Error getting analytics", e);
    }
  }

  async function fetchOwnedStartups() {
    try {
      if (!user) return;
      const { data } = await startupsControllerFindAll(withAuth);
      setStartups(data);
      setLoading(false);
    } catch (e) {
      console.log("Error getting ownedstartups", e);
    }
  }

  async function fetchOwnedInvestor() {
    try {
      if (!user) return;
      const { data } = await investorsControllerFindAllCreatedUser(withAuth);
      const investor = data[0];
      setInvestor(investor);
      setLoading(false);
    } catch (e) {
      console.log("Error getting ownedinvestor", e);
    }
  }

  async function fetchPfp() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile-picture/${user?.id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          responseType: "blob",
        }
      );
      if (response.data?.size) {
        setPfp(URL.createObjectURL(response.data));
      }
      setLoading(false);
    } catch (e) {
      console.log("Error while fetching user pfp: ", e);
      setPfp("sample");
    }
  }

  // async function fetchStartups() {
  //   startupsControllerFindAllStartups()
  //     .then((result) => setStartups(result.data))
  //     .catch((error) => console.error("Error fetching startups:", error))
  //     .finally(() => setLoading(false));
  // }

  useEffect(() => {
    fetchOwnedStartups();
    fetchOwnedInvestor();
  }, [user]);

  useEffect(() => {
    if (investor) {
      fetchPfp();
    }
  }, [investor]);

  useEffect(() => {
    if (startups) {
      fetchChartData();
      handleFilters("bookmarks", "likes", "views");
    }
  }, [startups]);

  useEffect(() => {
    if (startups) {
      setSearchResults(
        startups.filter((startup) =>
          startup.companyName.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    }
  }, [searchValue]);

  // if a startup is selected, filters are off
  useEffect(() => {
    if (selectedStartup) {
      if (isSearching) {
        setFilters(filters.map((filter) => ({ ...filter, isActive: false })));
        // set related startups based on the category of the selected startup

        setSearchValue("");
        setIsSearching(false);
      }

      if (startups) {
        setRelatedStartups(
          startups.filter(
            (startup) => startup != selectedStartup && startup.industry == selectedStartup.industry
          )
        );
      }
    }
  }, [selectedStartup]);

  //handle the Related Startups based on the selected filters
  function handleFilters(
    statOne?: keyof StartupStats,
    statTwo?: keyof StartupStats,
    statThree?: keyof StartupStats
  ) {
    if (startups) {
      const stat_arr = startups.map((startup) => {
        const value =
          (statOne ? startup[statOne] : 0) +
          (statTwo ? startup[statTwo] : 0) +
          (statThree ? startup[statThree] : 0);
        return {
          startup: startup,
          value: value,
        };
      });
      // console.log(stat_arr, statOne, statTwo, statThree);
      stat_arr.sort((a, b) => a.value - b.value).reverse();

      // if there's a filter, assign the selected startup etc and make length of relatedSS to 6 because the 1 is made as selectedSS
      // if (statOne) setSelectedStartup(stat_arr[0]?.startup);
      if (filters.some((filter) => filter.isActive && filter.name != "All"))
        setSelectedStartup(stat_arr[0]?.startup);

      setRelatedStartups(stat_arr.map((stat) => stat.startup));
      // setRelatedStartups(
      //   stat_arr.map((stat) => stat.startup).slice(statOne ? 1 : 0, statOne ? 6 : 5)
      // );
    }
  }

  useEffect(() => {
    const activeCategories = filters.filter((category) => category.isActive);
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
          handleFilters("likes", "bookmarks", "views");
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
      case 3:
        {
          handleFilters("likes", "bookmarks", "views");
        }
        break;
    }
  }, [filters]);

  //search filters
  function toggleSelected(index: number) {
    let updatedItems = [...filters];

    if (updatedItems[index].name == "All" && !updatedItems[index].isActive) {
      updatedItems.forEach((filter) => (filter.isActive = false));
      updatedItems[index].isActive = true;
      setSelectedStartup(undefined);
    }

    if (updatedItems[index].name != "All") {
      let itemToMove = updatedItems.splice(index, 1)[0];
      const indexToInsert =
        updatedItems.filter((filter) => filter.isActive && filter.name != "All").length + 1;
      if (indexToInsert === 1 && itemToMove.isActive) {
        updatedItems[0].isActive = true;
        setSelectedStartup(undefined);
      } else {
        updatedItems[0].isActive = false;
      }
      updatedItems.splice(indexToInsert, 0, { ...itemToMove, isActive: !itemToMove.isActive });
    }

    setFilters(updatedItems);
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

  const allStartupData = ["avg. views", "avg. likes", "avg. bookmarks"];
  const startupData = ["total views", "total likes", "total bookmarks"];
  return (
    user &&
    <div className="relative z-50 mx-auto flex h-auto w-[70%] flex-col gap-4">
      {!loading && !isInvestor ? (
        <div className="relative mt-4 flex justify-start gap-3">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
            <Search size={15} className="text-gray-500" />
          </div>
          <input
            type="search"
            name="search-startup"
            id="search-startup"
            className="block h-auto w-auto flex-1 rounded-md border-0 py-1.5 pl-7 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
            placeholder="Search Startups"
            autoComplete="off"
            value={searchValue}
            onClick={() => setIsSearching(true)}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
          />

          {/* search filters */}
          <div className="flex gap-3 overflow-x-auto pb-1">
            {filters.map((category, index) => (
              <button
                key={index}
                onClick={() => toggleSelected(index)}
                type="button"
                className={`flex items-center gap-3 shadow-md ${category.isActive ? "btn-active bg-[#004A98] text-white" : "btn-primary hover:bg-gray-200"}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-14 p-6">
          {isInvestor ? (
            <h1 className="text-2xl font-bold text-[#004A98]">Investor Profile</h1>
          ) : (
            <div className="flex h-6 w-full items-center">
              <div className="h-2 w-2/3 animate-pulse rounded-lg bg-base-300" />
            </div>
          )}
        </div>
      )}
      <div className="grid h-[18rem] w-full grid-cols-[400px,auto] gap-3">
        {isInvestor && (
          <div className="relative flex flex-col border shadow-custom">
            <div className="flex h-full w-full flex-col items-center justify-center">
              {loading || !pfp ? (
                <span className="loading loading-spinner loading-lg"></span>
              ) : (
                <div>
                  {/* <h2 className="p-2 text-xs font-light">Investor Profile</h2> */}
                  <div className="flex h-auto flex-col items-center justify-center gap-2 p-[2rem]">
                    <img
                      src={pfp == "sample" ? placeholderImageUrl : pfp}
                      className="h-44 w-44 rounded-full"
                    />
                    <p className="font-mono text-2xl">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p>{user?.role} </p>
                    {/* <p>{user?.email} </p>
                    <p>{user?.locationName ? user?.locationName : "No location has been set."} </p> */}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="relative flex flex-col items-center justify-center border shadow-custom">
          {loading ? (
            <div className="flex h-12 w-full items-center p-5">
              <div className="h-2 w-2/3 animate-pulse rounded-lg bg-base-300" />
            </div>
          ) : (
            <h1 className="min-h-12 self-start p-4 pb-3 pl-8 text-xl font-bold text-[#004A98]">
              {!isInvestor ? (
                selectedStartup ? (
                  <>{selectedStartup.companyName}</>
                ) : (
                  <>{startups ? startups.length : 0} Total Startups</>
                )
              ) : (
                "Analytics"
              )}
            </h1>
          )}

          <div className="text-md flex h-full w-[95%] justify-between">
            {(
              (selectedStartup && ["views", "likes", "bookmarks"]) || [
                startups?.reduce((a: number, b) => a + (b.views || 0), 0),
                startups?.reduce((a: number, b) => a + (b.likes || 0), 0),
                startups?.reduce((a: number, b) => a + (b.bookmarks || 0), 0),
              ]
            ).map((stat, index) => (
              <div
                key={index}
                className={`ml-3 flex h-fit w-[30%] flex-col items-center justify-center rounded pb-3`}
              >
                {!loading ? (
                  <>
                    <span className="text-[10px] leading-[0.7rem] text-gray-400">
                      {selectedStartup || isInvestor ? startupData[index] : allStartupData[index]}
                    </span>
                    <span className={`flex gap-2 text-2xl`}>
                      {investor
                        ? investor[stat as keyof StartupStats] || 0
                        : selectedStartup
                          ? selectedStartup[stat as keyof StartupStats]
                          : (startups &&
                              startups.length > 0 &&
                              parseFloat(
                                ((typeof stat === "number" ? stat : 0) / startups.length).toFixed(
                                  1
                                )
                              )) ||
                            0}
                      <span className="pt-1 text-[#004A98]">{icons[index]}</span>
                    </span>
                  </>
                ) : (
                  <div className="flex h-6 w-full items-center">
                    <div className="h-2 w-2/3 animate-pulse rounded-lg bg-base-300" />
                  </div>
                )}
                {/* <div className="relative right-[-3rem] h-full rounded-full bg-orange-800 p-6"></div> */}
              </div>
            ))}
          </div>
          {loading ? (
            <span className="loading loading-spinner loading-lg absolute bottom-20"></span>
          ) : (
            <PChart
              // startups.filter((startup) => startup.managerId == user?.id)
              startups={selectedStartup ? [selectedStartup] : relatedStartups}
              // filters={
              //   selectedStartup
              //     ? null
              //     : filters.filter((filter) => filter.isActive && filter.name != "All")
              // }
              investor={investor}
            />
          )}
        </div>

        {!isInvestor && (
          <div className="flex flex-col border bg-white p-4 text-xs text-gray-500 shadow-custom">
            {loading ? (
              <div className="flex h-full w-full items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <>
                Likes / Views / Bookmarks Analytics
                <LChart likes={likes} views={views} bookmarks={bookmarks} />
              </>
            )}
          </div>
        )}
      </div>

      {/* table */}
      {!loading && !isInvestor && (
        <div
          className={`mt-5 flex flex-col items-start ${loading ? "items-end" : "justify-center"} bg-white shadow-custom`}
        >
          {loading ? (
            <span className="m-1 h-2 w-[25%] animate-pulse rounded-lg bg-base-300" />
          ) : (
            <span className="w-full px-3 text-end text-md italic text-gray-500">
              {filters.every((filter) => filter.isActive === false) ? (
                relatedStartups.length > 0 ? (
                  "Similar startups"
                ) : (
                  <span className="text-red-600 font-extrabold">No similar startups found.</span>
                )
              ) : (
                "Top 5 Startups with high ratings"
              )}
            </span>
          )}
          <div className="w-full overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead className="bg-[#004A98]">
                <tr className="text-white">
                  <th className="w-[30%]">Startup Name</th>
                  <th className="w-[30%]">Industry</th>
                  <th className="w-auto">Views</th>
                  <th className="w-auto">Likes</th>
                  <th className="w-auto">Bookmarks</th>
                </tr>
              </thead>
              <tbody className="font-normal">
                {!startups &&
                  Array.from({ length: 1 }).map((_, i) => (
                    <tr key={i}>
                      <td>
                        <div className="flex h-6 w-full items-center">
                          <div className="h-2 w-2/3 animate-pulse rounded-lg bg-base-300" />
                        </div>
                      </td>
                      <td>
                        <div className="flex h-6 w-full items-center">
                          <div className="h-2 w-2/3 animate-pulse rounded-lg bg-base-300" />
                        </div>
                      </td>
                      <td>
                        <div className="flex h-6 w-full items-center">
                          <div className="h-2 w-2/3 animate-pulse rounded-lg bg-base-300" />
                        </div>
                      </td>
                      <td>
                        <div className="flex h-6 w-full items-center">
                          <div className="h-2 w-2/3 animate-pulse rounded-lg bg-base-300" />
                        </div>
                      </td>
                      <td>
                        <div className="flex h-6 w-full items-center">
                          <div className="h-2 w-2/3 animate-pulse rounded-lg bg-base-300" />
                        </div>
                      </td>
                    </tr>
                  ))}
                {relatedStartups.slice(0, 5).map((startup, index) => (
                  <tr
                    key={index}
                    className="cursor-pointer hover:bg-slate-100 hover:font-bold"
                    onClick={() => router.push(`/startup/${startup?.id}`)}
                  >
                    <td>{startup.companyName}</td>
                    <td>{startup.industry}</td>
                    <td>{startup.views}</td>
                    <td>{startup.likes}</td>
                    <td>{startup.bookmarks}</td>
                  </tr>
                ))}

                {/* to fill empty spaces if table data is short  */}
                {startups && startups.length > 0 && relatedStartups.length > 0
                  ? Array.from({ length: 5 - relatedStartups.length }).map((_, index) => (
                      <tr key={index}>
                        <td>
                          <div className="flex h-6"></div>
                        </td>
                        <td>
                          <div className="flex h-6"></div>
                        </td>
                        <td>
                          <div className="flex h-6"></div>
                        </td>
                        <td>
                          <div className="flex h-6"></div>
                        </td>
                        <td>
                          <div className="flex h-6"></div>
                        </td>
                      </tr>
                    ))
                  : startups && (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                          No records found.
                        </td>
                      </tr>
                    )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SEARCH SUGGESTION BOX */}
      {isSearching && startups && (
        <div
          ref={modalRef}
          className="absolute left-1/2 top-14 z-10 flex h-48 w-full -translate-x-1/2 transform flex-col gap-2 overflow-auto rounded bg-white p-2 shadow"
        >
          {searchValue ? (
            searchResults.length ? (
              searchResults.map((startup, index) => (
                <div
                  key={index}
                  className="rounded p-2 hover:bg-slate-100"
                  onClick={() => {
                    setSelectedStartup(startup);
                  }}
                >
                  {startup.companyName}
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
                }}
              >
                {startup.companyName}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
