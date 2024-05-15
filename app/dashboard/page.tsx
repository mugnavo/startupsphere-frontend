"use client";

import { BookText, MoveLeft, MoveRight, Search, SquarePen, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import StartupDetailsModal from "~/components/modals/startup-details";
import { startupControllerDelete, startupControllerGetAll } from "~/lib/api";
import { Startup } from "~/lib/schemas";

export default function DashboardComponent() {
  const router = useRouter();
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

  function openModal() {
    const modal = document.getElementById("startup_details_modal");
    if (modal instanceof HTMLDialogElement) {
      modal.showModal();
    }
  }

  return (
    <div className="flex h-full w-full flex-col justify-center">
      <StartupDetailsModal
        editable={editing}
        startup={selectedStartup !== undefined ? startups[selectedStartup] : undefined}
      />
      <div className="text-3xl">Welcome</div>
      <div className="relative mt-2 rounded-md shadow-sm">
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

      {/* table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          {/* head */}
          <thead>
            <tr>
              <th>ID</th>
              <th className="w-auto">Startup Name</th>
              <th className="w-auto">Location</th>
              <th className="w-20">Action</th>
            </tr>
          </thead>
          <tbody>
            {startups.map((startup, index) => (
              <tr key={index}>
                <th>{startup.id}</th>
                <td>{startup.name}</td>
                <td>{startup.locationName}</td>
                <td className="flex gap-1">
                  <button
                    title="View more details"
                    onClick={() => openViewStartup(index)}
                    className="btn btn-square btn-ghost btn-sm"
                  >
                    <BookText />
                  </button>
                  <button
                    title="Edit"
                    onClick={() => openEditStartup(index)}
                    className="btn btn-square btn-ghost btn-sm text-warning"
                  >
                    <SquarePen />
                  </button>
                  <button
                    title="Delete"
                    className="btn btn-square btn-ghost btn-sm text-error"
                    onClick={async () => {
                      await startupControllerDelete(startup.id);
                      router.refresh();
                    }}
                  >
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="m-auto mt-3 flex w-4/5 justify-between">
          <div className="flex gap-6">
            <MoveLeft />
            <MoveRight />
          </div>
          <button
            onClick={openCreateStartup}
            className="btn bg-red-800 font-bold text-white"
          >
            Add Startup
          </button>
        </div>
      </div>
    </div>
  );
}
