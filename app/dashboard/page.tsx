"use client";
import { MoveLeft, MoveRight, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { deleteStartup, getAllStartups } from "~/lib/actions/startups";
import { type Startup } from "~/lib/schema";

export default function DashboardIndex() {
  const [startups, setStartups] = useState<Startup[]>([]);

  async function fetchStartups() {
    const startups = await getAllStartups();
    setStartups(startups);
  }

  useEffect(() => {
    fetchStartups();
  }, []);

  return (
    <div className="flex h-full w-full flex-col justify-center">
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
              <th></th>
              <th className="w-auto">Startup Name</th>
              <th className="w-auto">Location</th>
              <th className="w-auto">Industry</th>
              <th className="w-20">Action</th>
            </tr>
          </thead>
          <tbody>
            {startups.map((startup, index) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>{startup.name}</td>
                <td>{startup.location}</td>
                <td>{startup.industry}</td>
                <td className="flex gap-1">
                  <Link
                    className="btn btn-warning btn-sm"
                    href={`dashboard/edit?id=${startup.id}`}
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-error btn-sm"
                    onClick={async () => {
                      await deleteStartup(startup.id);
                      fetchStartups();
                    }}
                  >
                    Delete
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
          <Link
            href={"dashboard/create"}
            prefetch
            className="btn bg-red-800 font-bold text-white"
          >
            Add Startup
          </Link>
        </div>
      </div>
    </div>
  );
}
