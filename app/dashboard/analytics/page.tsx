"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import LChart from "~/components/ui/line-chart";
import { startupControllerGetAll } from "~/lib/api";
import { Startup } from "~/lib/schemas";

export default function DashboardAnalytics() {
  const [highlightName, setHighlightName] = useState("Total Startups");
  const [startups, setStartups] = useState<Startup[]>([]);

  async function fetchStartups() {
    const result = await startupControllerGetAll();
    if (result.data) {
      console.log(new Date(result.data[0].foundedDate).toDateString());
      setStartups(result.data);
    }
  }

  useEffect(() => {
    fetchStartups();
  }, []);

  const ave_views =
    startups.reduce((accumulator, currentValue) => accumulator + currentValue.views, 0) /
    startups.length;

  const ave_likes = startups.reduce(
    (accumulator, currentValue) => accumulator + currentValue.likes,
    0
  );

  const ave_favorites =
    startups.reduce(
      (accumulator, currentValue) => accumulator + currentValue.bookmarks,
      0
    ) / startups.length;

  const [categories, setCategories] = useState([
    { id: 1, name: "All", isActive: true },
    { id: 2, name: "Likes", isActive: false },
    { id: 3, name: "Favorites", isActive: false },
    { id: 4, name: "Views", isActive: false },
    // { id: 5, name: "City", isActive: false },
    // { id: 6, name: "Barangay", isActive: false },
    // { id: 7, name: "Population", isActive: false },
  ]);

  const toggleSelected = (index: number) => {
    let updatedItems = [...categories];
    let itemToMove = updatedItems.splice(index, 1)[0]; // Remove item at index and store it
    updatedItems[0] = { ...updatedItems[0], isActive: false };
    const activeCategories = categories.filter((category) => category.isActive);
    const indexToInsert =
      categories.indexOf(activeCategories[activeCategories.length - 1]) +
      (itemToMove.isActive ? 0 : 1);

    if (itemToMove.name.toLowerCase() == "all") {
      updatedItems = updatedItems.map((item) => ({
        ...item,
        isActive: false,
      }));
      updatedItems.unshift({ ...itemToMove, isActive: true });
    } //toggle selection & move it after all selected categories, if any
    else {
      updatedItems.splice(indexToInsert, 0, {
        ...itemToMove,
        isActive: !itemToMove.isActive,
      });
      if (itemToMove.isActive && activeCategories.length == 1)
        updatedItems[0] = { ...updatedItems[0], isActive: true }; //if all categories deselcted, all is selected
    }
    setCategories(updatedItems);
  };

  return (
    <div className=" mx-auto h-auto w-3/5">
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
            <div className="mt-3 flex flex-col   gap-14 p-4">
              <h1 className="text-xl">
                {startups.length} {highlightName}
              </h1>
              <div className=" mx-auto flex gap-14 ">
                <span className="text-md flex flex-col text-center">
                  <span className="text-3xl">{ave_views}</span>
                  average<br></br>views
                </span>
                <div className=" text-md flex   flex-col text-center">
                  <span className="text-3xl">{ave_likes}</span>
                  average<br></br>likes
                </div>
                <span className="text-md  flex flex-col text-center">
                  <span className="text-3xl">{ave_favorites}</span>
                  average<br></br>favorites
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center bg-slate-100 p-4">
              <LChart />
            </div>
          </div>

          {/*  h-[30%] */}
          <div className="mx-auto mt-5 flex h-[30%]  items-start justify-center ">
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
                  {startups.map((startup, index) => (
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
