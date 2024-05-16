"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import LChart from "~/components/ui/line-chart";
import { startupControllerGetAll } from "~/lib/api";
import { Startup } from "~/lib/schemas";

type StartupStats = {
  views: number;
  likes: number;
  bookmarks: number;
};
export default function DashboardAnalytics() {
  const statKeys: (keyof StartupStats)[] = ["views", "likes", "bookmarks"];
  const [startups, setStartups] = useState<Startup[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<Startup[]>([]);
  const [selectedStartup, setSelectedStartup] = useState<Startup | Startup[]>([]);
  const [relatedStartups, setRelatedStartups] = useState<Startup[]>([]);
  const [stats, setStats] = useState({
    views: 0,
    likes: 0,
    bookmarks: 0,
  });
  const [categories, setCategories] = useState([
    { id: 1, name: "All", isActive: true },
    { id: 2, name: "Likes", isActive: false },
    { id: 3, name: "Bookmarks", isActive: false },
    { id: 4, name: "Views", isActive: false },
  ]);

  const getAverageStats = (stat: keyof StartupStats): number => {
    return (
      startups.reduce(
        (accumulator, currentValue) => accumulator + currentValue[stat],
        0
      ) / startups.length
    );
  };

  async function fetchStartups() {
    const result = await startupControllerGetAll();
    if (result.data) {
      // limit 5 to display
      setStartups(result.data.slice(0, 5));
      setSelectedStartup(result.data.slice(0, 5));
      setRelatedStartups(result.data.slice(0, 5));

      // TODO: HANDLE EMPTY STARTUPS IDK
      if (startups[0]) {
        setStats({
          views: getAverageStats("views"),
          likes: getAverageStats("likes"),
          bookmarks: getAverageStats("bookmarks"),
        });
      }
    }
  }

  useEffect(() => {
    setSearchResults(
      startups.filter((startup) =>
        startup.name.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }, [searchValue]);

  const handleOneFilter = (stat: keyof StartupStats) => {
    const stat_arr = startups.map((startup) => startup[stat]);
    stat_arr.sort();
    stat_arr.reverse();
    setSelectedStartup(startups.filter((startup) => startup[stat] == stat_arr[0])[0]);
    setRelatedStartups(
      startups.filter((startup) => stat_arr.includes(startup[stat])).slice(1)
    );
  };

  const handleFilters = (statOne?: keyof StartupStats, statTwo?: keyof StartupStats) => {
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
        // console.log("3");
      }

      return {
        name: startup.name,
        value: value,
      };
    });

    stat_arr.sort();
    stat_arr.reverse();

    setSelectedStartup(startups.filter((startup) => startup.name == stat_arr[0].name)[0]);
    setRelatedStartups(
      startups
        .filter((startup) => stat_arr.map((stat) => stat.name).includes(startup.name))
        .reverse()
        .slice(1)
    );
  };

  const handleThreeFilters = () => {
    const stat_arr = startups.map((startup) => ({
      name: startup.name,
      value: startup.likes + startup.views + startup.bookmarks,
    }));

    stat_arr.sort();
    stat_arr.reverse();

    setSelectedStartup(startups.filter((startup) => startup.name == stat_arr[0].name)[0]);
    setRelatedStartups(
      startups
        .filter((startup) => stat_arr.map((stat) => stat.name).includes(startup.name))
        .reverse()
        .slice(1)
    );
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
        }
        break;
      }
      case 2:
        {
          const activeCategoryNames = activeCategories.map((active) =>
            active.name.toLowerCase()
          );
          if (
            activeCategoryNames.includes("likes") &&
            activeCategoryNames.includes("views")
          ) {
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
        handleFilters();
      }
    }
  }, [categories]);

  useEffect(() => {
    fetchStartups();
  }, []);

  useEffect(() => {
    if (!Array.isArray(selectedStartup)) {
      let updatedItems = [...categories];
      updatedItems[0] = { ...updatedItems[0], isActive: false };
      setCategories(updatedItems);
    }
  }, [selectedStartup]);

  const toggleSelected = (index: number) => {
    let updatedItems = [...categories];
    let itemToMove = updatedItems.splice(index, 1)[0]; // Remove item at index and store it
    updatedItems[0] = { ...updatedItems[0], isActive: false };
    let activeCategories = categories.filter((category) => category.isActive);
    const indexToInsert =
      categories.indexOf(activeCategories[activeCategories.length - 1]) +
      (itemToMove.isActive ? 0 : 1);

    if (itemToMove.name.toLowerCase() == "all") {
      updatedItems = updatedItems.map((item) => ({
        ...item,
        isActive: false,
      }));
      updatedItems.unshift({ ...itemToMove, isActive: true });
      setSelectedStartup(startups);
      setRelatedStartups(startups);
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
    if (itemToMove.isActive && activeCategories.length == 1) {
      setSelectedStartup(startups);
      setRelatedStartups(startups);
    }
  };

  return (
    <div className=" relative mx-auto h-auto w-3/5 ">
      {searchValue && (
        <div className="absolute left-1/2 top-16 z-10 flex h-48 w-full -translate-x-1/2 transform flex-col gap-2 overflow-auto rounded bg-white p-2 py-4 shadow">
          {searchResults[0]
            ? searchResults.map((startup, index) => (
                <div
                  key={index}
                  className="rounded p-2 hover:bg-slate-100"
                  onClick={() => {
                    setSelectedStartup(startup);
                    setRelatedStartups(
                      startups.filter((otherStartup) => otherStartup.name != startup.name)
                    );
                    setSearchValue("");
                  }}
                >
                  {startup.name}
                </div>
              ))
            : searchValue && (
                <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-slate-500">
                  No Startup Found
                </p>
              )}
        </div>
      )}
      {startups[0] && (
        <>
          <div>
            <div>
              <div className="relative mt-4 rounded-md shadow-sm">
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
                  key={category.id}
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
                  <>{selectedStartup.length} Total Startups</>
                ) : (
                  <>{selectedStartup.name}</>
                )}
              </h1>
              <div className=" mx-auto flex w-full gap-2 ">
                <div className="text-md flex flex-1 px-3 text-center">
                  {statKeys.map((stat, index) => (
                    <div key={index} className="flex flex-1 flex-col">
                      {Array.isArray(selectedStartup) ? (
                        <>
                          <span className="text-3xl">{stats[stat]}</span>
                          <span>average</span>{" "}
                        </>
                      ) : (
                        <span className="text-3xl">{selectedStartup[stat]}</span>
                      )}
                      <span>{stat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center bg-slate-100 p-4">
              <LChart startups={startups} />
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
                    <th className="w-auto">Location</th>
                    <th className="w-auto">Industry</th>
                  </tr>
                </thead>
                <tbody>
                  {relatedStartups.map((startup, index) => (
                    <tr key={index}>
                      <th>{startup.id}</th>
                      <td>{startup.name}</td>
                      <td>{startup.locationName}</td>
                      <td>{startup.categories}</td>
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
