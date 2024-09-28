"use client";

import {
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  Expand,
  MoveLeft,
  MoveRight,
  Search,
  SquarePen,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import StartupDetailsModal from "~/components/modals/startup-details";
import { startupControllerDelete, startupControllerGetAll } from "~/lib/api";
import { Startup } from "~/lib/schemas";
import { withAuth } from "~/lib/utils";

export default function DashboardComponent() {
  const router = useRouter();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = Math.ceil(startups.length / 10); // Number of records per page
  const [searchValue, setSearchValue] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<"name" | "location" | "categories">("name");

  async function fetchStartups() {
    const result = await startupControllerGetAll();
    if (result.data) {
      setStartups(result.data);
    }
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    fetchStartups();
  }, []);

  // modal controls
  const [selectedStartup, setSelectedStartup] = useState<number>();
  const [editing, setEditing] = useState<boolean>(false);

  function openCreateStartup() {
    setSelectedStartup(undefined);
    setEditing(true);
    openModal();
  }

  function openEditStartup(index: number) {
    setSelectedStartup(index);
    setEditing(true);
    openModal();
  }

  function openViewStartup(index: number) {
    setSelectedStartup(index);
    setEditing(false);
    openModal();
  }

  function onDeleteStartup(startupId: number) {
    startupControllerDelete(startupId, withAuth);
    fetchStartups();
  }

  function openModal() {
    const modal = document.getElementById("startup_details_modal");
    if (modal instanceof HTMLDialogElement) {
      modal.showModal();
    }
  }

  function nextPage() {
    if (currentPage < pageSize) {
      setCurrentPage(currentPage + 1);
    }
  }

  function prevPage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function toggleSortOrder(column: "name" | "location" | "categories") {
    if (sortColumn === column) {
      setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  }

  //sort  by name*|| location || category, did not change this code (then filter by name, then paginate)
  const filteredStartups = startups
    .sort((a, b) => {
      if (sortColumn === "name") {
        return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      } else if (sortColumn === "location") {
        return sortOrder === "asc"
          ? a.locationName.localeCompare(b.locationName)
          : b.locationName.localeCompare(a.locationName);
      } else {
        return sortOrder === "asc"
          ? a.categories.join(", ").localeCompare(b.categories.join(", "))
          : b.categories.join(", ").localeCompare(a.categories.join(", "));
      }
    })
    .filter((startup) => startup.name.toLowerCase().includes(searchValue.toLowerCase()))
    .slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <div className="mx-auto flex h-full w-[70%] flex-col py-8">
      <StartupDetailsModal
        editable={editing}
        startup={selectedStartup !== undefined ? startups[selectedStartup] : undefined}
      />
      <div className="text-3xl">Welcome</div>
      <div className="relative mt-2 rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
          <Search size={15} className="text-gray-500" />
        </div>
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          type="search"
          name="search-startup"
          id="search-startup"
          className="block w-full rounded-md border-0 py-1.5 pl-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
          placeholder="Search Startups"
        />
      </div>

      {/* table */}
      <div className="overflow-x-auto">
        <table className="table table-sm">
          {/* head */}
          <thead className="bg-warning">
            <tr>
              {/* <th>ID</th> */}
              <th className="flex w-64 cursor-pointer" onClick={() => toggleSortOrder("name")}>
                Startup Name
                {sortColumn === "name" ? (
                  sortOrder === "asc" ? (
                    <ChevronUp strokeWidth={3} size={16} className="ml-1 inline" />
                  ) : (
                    <ChevronDown strokeWidth={3} size={16} className="ml-1 inline" />
                  )
                ) : (
                  <ChevronsUpDown size={16} className="ml-1 inline" strokeWidth={1.5} />
                )}
              </th>
              <th className="w-auto cursor-pointer" onClick={() => toggleSortOrder("location")}>
                Location
                {sortColumn === "location" ? (
                  sortOrder === "asc" ? (
                    <ChevronUp strokeWidth={3} size={16} className="ml-1 inline" />
                  ) : (
                    <ChevronDown strokeWidth={3} size={16} className="ml-1 inline" />
                  )
                ) : (
                  <ChevronsUpDown size={16} className="ml-1 inline" strokeWidth={1.5} />
                )}
              </th>
              <th className="w-auto cursor-pointer" onClick={() => toggleSortOrder("categories")}>
                Categories
                {sortColumn === "categories" ? (
                  sortOrder === "asc" ? (
                    <ChevronUp strokeWidth={3} size={16} className="ml-1 inline" />
                  ) : (
                    <ChevronDown strokeWidth={3} size={16} className="ml-1 inline" />
                  )
                ) : (
                  <ChevronsUpDown size={16} className="ml-1 inline" strokeWidth={1.5} />
                )}
              </th>
              <th className="w-20">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 10 }).map((_, i) => (
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
                </tr>
              ))}
            {filteredStartups.map((startup, index) => (
              <tr key={index}>
                {/* <th>{startup.id}</th> */}
                <td>{startup.name}</td>
                <td className="max-w-xs truncate">{startup.locationName}</td>
                <td className="max-w-xs truncate">{startup.categories.join(", ")}</td>
                <td className="flex gap-1.5">
                  <button
                    title="View more details"
                    onClick={() => openViewStartup(index)}
                    className="btn btn-square btn-ghost btn-xs hover:scale-110 hover:bg-transparent"
                  >
                    <Expand />
                  </button>
                  <button
                    title="Edit"
                    onClick={() => openEditStartup(index)}
                    className="btn btn-square btn-ghost btn-xs text-warning hover:scale-110 hover:bg-transparent"
                  >
                    <SquarePen />
                  </button>
                  <button
                    title="Delete"
                    className="btn btn-square btn-ghost btn-xs text-error hover:scale-110 hover:bg-transparent"
                    onClick={() => onDeleteStartup(startup.id)}
                  >
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
            {!loading &&
              Array.from({ length: 10 - filteredStartups.length }).map((_, i) => (
                <tr key={i}>
                  <td>
                    <div className="flex h-6 w-full items-center"></div>
                  </td>
                  <td>
                    <div className="flex h-6 w-full items-center"></div>
                  </td>
                  <td>
                    <div className="flex h-6 w-full items-center"></div>
                  </td>
                  <td>
                    <div className="flex h-6 w-full items-center"></div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="m-auto mt-3 flex w-full justify-between">
          <div className="ml-3 flex items-center gap-6 italic">
            {startups.length ? (
              <>
                {currentPage !== 1 && (
                  <button onClick={prevPage}>
                    <MoveLeft />
                  </button>
                )}
                {currentPage} / {pageSize}
                {currentPage !== pageSize && (
                  <button onClick={nextPage}>
                    <MoveRight />
                  </button>
                )}
              </>
            ) : (
              <>{""}</>
            )}
            &nbsp; - &nbsp; {startups.length} total
          </div>
          <button onClick={openCreateStartup} className="btn bg-yellow-600 font-bold text-white">
            Add Startup
          </button>
        </div>
      </div>
    </div>
  );
}
