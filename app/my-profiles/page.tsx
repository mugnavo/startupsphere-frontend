// "use client";

// import axios from "axios";
// import { X } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { useSession } from "~/context/hooks";
// import { startupsControllerFindAll } from "~/lib/api";
// import { Startup } from "~/lib/schemas";
// import { withAuth } from "~/lib/utils";

// export default function OwnedStartups() {
//   const router = useRouter();
//   const [startups, setStartups] = useState<Startup[]>([]);
//   const { user } = useSession();

//   async function fetchOwnedStartups() {
//     if (!user) return;
//     const { data } = await startupsControllerFindAll(withAuth);
//     setStartups(data);
//   }

//   const [profilePictures, setProfilePictures] = useState<any>({});

//   async function fetchStartupProfilePictures() {
//     const pictures = {} as any;

//     await Promise.all([
//       ...startups.map(async (startup) => {
//         try {
//           const response = await axios.get(
//             `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile-picture/startup/${startup.id}`,
//             {
//               headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
//               responseType: "blob",
//             }
//           );
//           pictures[`startup_${startup.id}`] = URL.createObjectURL(response.data);
//         } catch (error) {
//           console.error(`Failed to fetch profile picture for startup ID ${startup.id}:`, error);
//         }
//       }),
//     ]);
//     setProfilePictures({ ...profilePictures, ...pictures });
//   }

//   // async function fetchInvestorProfilePictures() {
//   //   const pictures = {} as any;

//   //   await Promise.all([
//   //     ...investors.map(async (investor) => {
//   //       try {
//   //         const response = await axios.get(
//   //           `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile-picture/investor/${investor.id}`,
//   //           {
//   //             headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//   //             responseType: "blob",
//   //           }
//   //         );
//   //         pictures[`investor_${investor.id}`] = URL.createObjectURL(response.data);
//   //       } catch (error) {
//   //         console.error(`Failed to fetch profile picture for investor ID ${investor.id}:`, error);
//   //       }
//   //     }),
//   //   ]);
//   //   setProfilePictures({ ...profilePictures, ...pictures });
//   // }

//   useEffect(() => {
//     if (startups.length > 0) {
//       fetchStartupProfilePictures();
//     }
//   }, [startups]);

//   // useEffect(() => {
//   //   if (investors.length > 0) {
//   //     fetchInvestorProfilePictures();
//   //   }
//   // }, [investors]);

//   useEffect(() => {
//     fetchOwnedStartups();
//   }, [user]);

//   return (
//     <div className="absolute left-20 top-0 z-10 flex h-screen w-[22rem] flex-col bg-white p-6">
//       {/* the gradient div */}
//       <div className="absolute inset-0 z-[-10] h-[8rem] bg-gradient-to-b from-yellow-600 to-transparent opacity-80" />
//       <div className="mb-4 flex items-center justify-between">
//         <span className="text-lg font-semibold">Owned Startups</span>
//         <X size={20} onClick={() => router.replace("/")} className="cursor-pointer" />
//       </div>
//       <div className="flex-1 overflow-y-auto">
//         <div className="mt-2">
//           {startups.length === 0 ? (
//             <div className="mt-5 flex flex-col items-center">
//               <p className="text-gray-500">No owned startups</p>
//             </div>
//           ) : (
//             startups.map((startup) => (
//               <div
//                 key={startup.id}
//                 className="mb-1 flex cursor-pointer items-center justify-between rounded-md p-2 shadow-none hover:bg-gray-100"
//                 onClick={() => router.push(`/startup/${startup?.id}`)}
//               >
//                 <div className="flex w-full items-center">
//                   <div className="mr-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-md bg-gray-100">
//                     <img
//                       src={profilePictures[`startup_${startup?.id}`]}
//                       alt={startup?.companyName}
//                       className="h-full w-full object-cover"
//                     />
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex flex-col">
//                       <div className="text-sm font-semibold">{startup?.companyName}</div>
//                       <div className="text-xs text-gray-500">{startup?.locationName}</div>
//                       <div className="mt-1 flex flex-wrap">
//                         <span className="mb-1 mr-2 rounded-full bg-gray-200 px-2 py-1 text-xs">
//                           {startup?.industry}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import { Album, ScanEye, Search, ThumbsUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import StartupDetailsModal from "~/components/modals/startup-details";
import LChart from "~/components/ui/line-chart";
import PChart from "~/components/ui/pie-chart";
import { useSession } from "~/context/hooks";
import {
  bookmarkControllerGetAll,
  likeControllerGetAll,
  startupsControllerFindAllStartups,
  viewControllerGetAll,
} from "~/lib/api";
import { Bookmark, Like, Startup, View } from "~/lib/schemas";
import { withAuth } from "~/lib/utils";

type StartupStats = {
  views: number;
  likes: number;
  bookmarks: number;
};

export default function OwnedStartups() {
  const { user } = useSession();
  const statKeys: (keyof StartupStats)[] = ["views", "likes", "bookmarks"];
  const [loading, setLoading] = useState(true);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [selectedStartup, setSelectedStartup] = useState<Startup>();
  const [relatedStartups, setRelatedStartups] = useState<Startup[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<Startup[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [stats, setStats] = useState<StartupStats>();
  const [filters, setFilters] = useState([
    { name: "All", isActive: true },
    { name: "Likes", isActive: false },
    { name: "Bookmarks", isActive: false },
    { name: "Views", isActive: false },
  ]);
  const backgroundColors = ["before:bg-[#dc2626]", "before:bg-[#fb923c]", "before:bg-[#fde047]"];
  const size = 20;
  const icons = [
    <ScanEye key="ScanEye" size={size} />,
    <ThumbsUp key="ThumbsUp" size={size} />,
    <Album key="Albums" size={size} />,
  ];
  const modalRef = useRef<HTMLDivElement>(null);
  const [isShowStartupDetails, setIsShowStartupDetails] = useState(false);

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
      setLikes(likesRes.data.filter((data) => data.user != null));
    }
    if (viewsRes.data) {
      setViews(viewsRes.data.filter((data) => data.user_id != null));
    }
    if (bookmarksRes.data) {
      setBookmarks(bookmarksRes.data.filter((data) => data.user != null));
    }
    setLoading(false);
  }

  async function fetchStartups() {
    startupsControllerFindAllStartups()
      .then((result) => setStartups(result.data))
      .catch((error) => console.error("Error fetching startups:", error))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    setLoading(true);
    fetchChartData();
    fetchStartups();
  }, []);

  useEffect(() => {
    if (startups) handleFilters("bookmarks", "likes", "views");
  }, [startups]);

  useEffect(() => {
    setSearchResults(
      startups.filter((startup) =>
        startup.companyName.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }, [searchValue]);

  // if a startup is selected, filters are off
  useEffect(() => {
    if (selectedStartup) {
      if (isSearching) {
        setFilters(filters.map((filter) => ({ ...filter, isActive: false })));
        // set related startups based on the category of the selected startup
        setRelatedStartups(
          startups.filter(
            (startup) => startup != selectedStartup && startup.industry == selectedStartup.industry
          )
        );

        setSearchValue("");
        setIsSearching(false);
      }
    }
  }, [selectedStartup]);

  //handle the Related Startups based on the selected filters
  function handleFilters(
    statOne?: keyof StartupStats,
    statTwo?: keyof StartupStats,
    statThree?: keyof StartupStats
  ) {
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

  useEffect(() => {
    const modal = document.getElementById("startup_details_modal") as HTMLDialogElement;

    if (modal) {
      // Event listener to handle modal close
      const handleModalClose = () => {
        setIsShowStartupDetails(false);
      };

      if (isShowStartupDetails) {
        modal.show();
        modal.addEventListener("close", handleModalClose); // Add listener for when modal closes
      } else {
        modal.close();
        setSelectedStartup(undefined);
      }

      // Clean up the event listener
      return () => {
        modal.removeEventListener("close", handleModalClose);
      };
    }
  }, [isShowStartupDetails]);

  // const allStartupData = ["ave. views", "ave. likes", "ave. bookmarks"];
  const allStartupData = ["average views", "average likes", "average bookmarks"];
  const startupData = ["total views", "total likes", "total bookmarks"];
  return (
    <div className="relative mx-auto flex h-auto w-3/5 flex-col gap-4">
      <StartupDetailsModal editable={false} startup={selectedStartup} />
      <>
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
                className={`flex items-center gap-3 shadow-md ${category.isActive ? "btn-active bg-yellow-600 text-white" : "btn-primary hover:bg-gray-200"}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid h-[18rem] w-full grid-cols-5 gap-3">
          <div className="relative col-span-2 flex flex-col border shadow-custom">
            <h1 className="p-4 py-2 text-xl font-bold">
              {loading ? (
                <div className="flex h-6 w-full items-center">
                  <div className="h-2 w-2/3 animate-pulse rounded-lg bg-base-300" />
                </div>
              ) : selectedStartup && selectedStartup.companyName ? (
                <>{selectedStartup.companyName}</>
              ) : (
                <>{startups.length} Total Startups</>
              )}
            </h1>
            <div className="text-md flex h-full justify-center pl-4">
              {(
                (selectedStartup && ["views", "likes", "bookmarks"]) || [views, likes, bookmarks]
              ).map((stat, index) => (
                <div
                  key={index}
                  className={`relative ml-3 flex h-fit w-[30%] flex-col rounded pb-3`}
                  // before:absolute before:left-[-0.6rem] before:top-[24%] before:h-[45%] before:w-1 before:rounded-l before:bg-red-600
                  // before:absolute before:bottom-0 before:left-1/2 before:h-1 before:w-1/2 before:translate-x-[-1/2] before:rounded before:bg-blue-600
                  // className={`relative flex h-[25%] w-[30%] items-center justify-center gap-3 overflow-clip rounded bg-warning px-3 text-center before:absolute before:bottom-0 before:left-0 before:top-0 before:w-1 before:rounded-s before:bg-yellow-600`}
                >
                  <span className="text-[9px] leading-[0.7rem] text-gray-400">
                    {selectedStartup ? startupData[index] : allStartupData[index]}
                  </span>
                  <span className={`flex gap-2 text-3xl`}>
                    {loading
                      ? 0
                      : selectedStartup
                        ? selectedStartup[stat as keyof StartupStats]
                        : parseFloat((stat.length / startups.length).toFixed(2)).toFixed(1)}
                    <span className="pt-1 text-gray-400">{icons[index]}</span>
                  </span>
                  {/* <div className="relative right-[-3rem] h-full rounded-full bg-orange-800 p-6"></div> */}
                </div>
              ))}
            </div>
            <PChart
              // startups.filter((startup) => startup.managerId == user?.id)
              startups={relatedStartups}
              filters={filters.filter((filter) => filter.isActive && filter.name != "All")}
            />
          </div>
          <div className="col-span-3 flex flex-col border bg-white p-4 text-xs text-gray-500 shadow-custom">
            Likes / Views / Bookmarks Analytics
            <LChart likes={likes} views={views} bookmarks={bookmarks} />
          </div>
        </div>

        {/* table */}
        <div
          className={`flex flex-col items-start ${loading ? "items-end" : "justify-center"} bg-white shadow-custom`}
        >
          {loading ? (
            <span className="m-1 h-2 w-[25%] animate-pulse rounded-lg bg-base-300" />
          ) : (
            <span className="w-full px-3 text-end text-xs italic text-gray-500">
              {filters.every((filter) => filter.isActive === false) ? (
                relatedStartups.length > 0 ? (
                  "Similar startups"
                ) : (
                  <span className="text-red-600">No similar startups found.</span>
                )
              ) : (
                "Top 5 Startups with high ratings"
              )}
            </span>
          )}
          <div className="w-full overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead className="bg-warning">
                <tr>
                  <th className="w-[30%]">Startup Name</th>
                  <th className="w-[30%]">Industry</th>
                  <th className="w-auto">Views</th>
                  <th className="w-auto">Likes</th>
                  <th className="w-auto">Bookmarks</th>
                </tr>
              </thead>
              <tbody className="font-normal">
                {loading &&
                  Array.from({ length: 5 }).map((_, i) => (
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
                {relatedStartups.slice(0, 6).map((startup, index) => (
                  <tr
                    key={index}
                    className="cursor-pointer hover:bg-slate-100"
                    onClick={() => {
                      setIsShowStartupDetails(true);
                      setSelectedStartup(startup);
                    }}
                  >
                    <td>{startup.companyName}</td>
                    <td>{startup.industry}</td>
                    <td>{startup.views}</td>
                    <td>{startup.likes}</td>
                    <td>{startup.bookmarks}</td>
                  </tr>
                ))}

                {/* to fill empty spaces if table data is short  */}
                {!loading &&
                  Array.from({ length: 5 - relatedStartups.length }).map((_, index) => (
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
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </>

      {/* SEARCH SUGGESTION BOX */}
      {isSearching && (
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
