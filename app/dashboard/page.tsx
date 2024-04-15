"use client";
import { MoveLeft, MoveRight, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DashboardIndex() {
  const router = useRouter();
  const [startups, setStartups] = useState([
    { id: 1, name: "Cars Republic", location: "Cebu", rating: 4.0 },
    { id: 2, name: "People World", location: "Cebu", rating: 4.0 },
    { id: 3, name: "Finance Ltd", location: "Cebu", rating: 4.0 },
    { id: 4, name: "Crypto Assets", location: "Cebu", rating: 4.0 },
    { id: 5, name: "Goats Time", location: "Cebu", rating: 4.0 },
    // { id: 6, name: "Stocks Shmucks", location: "Cebu", rating: 4.0 },
  ]);

  return (
    <div className="flex h-full w-full justify-center">
      <div className="z-10 ml-20 mt-7 w-4/5 bg-white p-6">
        <div className="mb-6 mt-10 text-3xl">Welcome, Liden123</div>
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
                <th className="w-10">Ratings</th>
                <th className="w-20">Action</th>
              </tr>
            </thead>
            <tbody>
              {startups.map((startup, index) => (
                <tr key={index}>
                  <th>{startup.id}</th>
                  <td>{startup.name}</td>
                  <td>{startup.location}</td>
                  <td>{startup.rating}</td>
                  <td className="flex gap-1">
                    <button className="btn btn-warning btn-sm">Edit</button>
                    <button className="btn btn-error btn-sm">Delete</button>
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
            </Link>{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
