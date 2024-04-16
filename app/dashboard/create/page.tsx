"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createStartup } from "~/lib/actions/startups";

export default function SearchContent() {
  const router = useRouter();

  return (
    <div className="flex h-full w-full justify-center">
      <form
        action={async (formData: FormData) => {
          const name = formData.get("name") as string;
          const industry = formData.get("industry") as string;
          const location = formData.get("location") as string;

          await createStartup({ name, industry, location });
          router.replace("/dashboard");
        }}
        className="z-10 ml-20 mt-20 w-3/5 bg-white p-6"
      >
        <div className="flex items-center justify-between">
          <span className="text-3xl">Add Startup</span>
        </div>

        <div className="my-2 grid grid-cols-2 gap-2">
          <input
            type="text"
            name="name"
            required
            className="block rounded-md border-0 p-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
            placeholder="Name (required)"
          />
          <input
            type="text"
            name="industry"
            required
            className="block  rounded-md border-0 p-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
            placeholder="Industry (required)"
          />
        </div>
        <input
          type="text"
          name="location"
          className="col-span-2 block w-full rounded-md border-0 p-4  text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
          placeholder="Location"
        />
        <div className="m-auto mt-3 flex justify-between px-6">
          <Link href={"/dashboard"} className="flex items-center">
            <span className="underline">Cancel</span>
          </Link>
          <button type="submit" className="btn bg-red-800 font-bold text-white">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
