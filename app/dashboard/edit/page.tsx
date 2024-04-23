"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getStartUpbyID, updateStartup } from "~/lib/actions/startups";
import { type Startup } from "~/lib/schema";

export default function EditStartUp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [startups, setStartup] = useState<Startup | null>(null);

  async function fetchStartUpByID() {
    const startup = await getStartUpbyID(id!);
    setStartup(startup!);
  }

  useEffect(() => {
    fetchStartUpByID();
  }, []);

  return (
    <form
      action={async (formData: FormData) => {
        const name = formData.get("name") as string;
        const industry = formData.get("industry") as string;
        const location = formData.get("location") as string;

        await updateStartup(id!, { name, industry, location });
        router.replace("/dashboard");
      }}
      className="flex h-full w-full flex-col justify-center py-6"
    >
      <div className="flex items-center justify-between">
        <span className="text-3xl">Edit Startup</span>
      </div>

      <div className="my-2 grid grid-cols-2 gap-2">
        <input
          type="text"
          name="name"
          required
          className="block rounded-md border-0 p-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
          placeholder="Name (required)"
          defaultValue={startups?.name}
        />

        <input
          type="text"
          name="industry"
          required
          className="block  rounded-md border-0 p-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
          placeholder="Industry (required)"
          defaultValue={startups?.industry}
        />
      </div>
      <input
        type="text"
        name="location"
        className="col-span-2 block w-full rounded-md border-0 p-4  text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
        placeholder="Location"
        defaultValue={startups?.location}
      />
      <div className="m-auto mt-3 flex justify-between px-6">
        <Link href={"/dashboard"} className="flex items-center">
          <span className="underline">Cancel</span>
        </Link>
        <button type="submit" className="btn bg-red-800 font-bold text-white">
          Edit
        </button>
      </div>
    </form>
  );
}
