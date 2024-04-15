"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchContent() {
  const router = useRouter();
  const [startups, setStartups] = useState([
    { id: 1, name: "Cars Republic", location: "Cebu", rating: 4.0 },
    { id: 2, name: "People World", location: "Cebu", rating: 4.0 },
    { id: 3, name: "Finance Ltd", location: "Cebu", rating: 4.0 },
    { id: 4, name: "Crypto Assets", location: "Cebu", rating: 4.0 },
    { id: 5, name: "Goats Time", location: "Cebu", rating: 4.0 },
    // { id: 6, name: "Stocks Shmucks", location: "Cebu", rating: 4.0 },
  ]);

  const handleAddStartup = () => {};
  return (
    <div className="flex h-full w-full justify-center">
      <div className="z-10 ml-20 mt-20 w-3/5 bg-white p-6">
        <div className="flex items-center justify-between">
          <span className="text-3xl">Add Startup</span>
        </div>

        <div className="my-2 grid grid-cols-2 gap-2 ">
          <input
            type="text"
            name="city"
            id="city"
            className="block rounded-md border-0 p-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
            placeholder="City (required)"
          />
          <input
            type="text"
            name="name"
            id="name"
            className="block  rounded-md border-0 p-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
            placeholder="Startup Name (required)"
          />
        </div>
        <input
          type="text"
          name="name"
          id="name"
          className="col-span-2 block h-52 w-full rounded-md border-0 p-4  text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
          placeholder="Startup Description (required)"
        />
        <div className="m-auto mt-3 flex justify-between px-6">
          <Link href={"/dashboard"} prefetch className="flex items-center">
            <span className="underline">Cancel</span>
          </Link>{" "}
          <Link href={"/submit"} prefetch className="btn bg-red-800 font-bold text-white">
            Submit
          </Link>{" "}
        </div>
      </div>
    </div>
  );
}
