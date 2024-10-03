"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "~/context/hooks";
import { startupControllerFindAllByManagerId } from "~/lib/api";
import { Startup } from "~/lib/schemas";
import { withAuth } from "~/lib/utils";

export default function OwnedStartups() {
  const router = useRouter();
  const [startups, setStartups] = useState<Startup[]>([]);
  const { user } = useSession();

  async function fetchOwnedStartups() {
    if (!user) return;
    const { data } = await startupControllerFindAllByManagerId(user.id, withAuth);
    setStartups(data);
  }

  useEffect(() => {
    fetchOwnedStartups();
  }, [user]);

  return (
    <div className="absolute left-20 top-0 z-10 flex h-screen w-[22rem] flex-col bg-white p-6">
      {/* the gradient div */}
      <div className="absolute inset-0 z-[-10] h-[8rem] bg-gradient-to-b from-yellow-600 to-transparent opacity-80" />
      <div className="mb-4 flex items-center justify-between">
        <span className="text-lg font-semibold">Owned Startups</span>
        <X size={20} onClick={() => router.replace("/")} className="cursor-pointer" />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="mt-2">
          {startups.length === 0 ? (
            <div className="mt-5 flex flex-col items-center">
              <p className="text-gray-500">No owned startups</p>
            </div>
          ) : (
            startups.map((startup) => (
              <div
                key={startup.id}
                className="mb-1 flex cursor-pointer items-center justify-between rounded-md p-2 shadow-none hover:bg-gray-100"
                onClick={() => router.push(`/startup/${startup?.id}`)}
              >
                <div className="flex w-full items-center">
                  <div className="mr-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-md bg-gray-100">
                    <img
                      src={startup?.logoUrl}
                      alt={startup?.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col">
                      <div className="text-sm font-semibold">{startup?.name}</div>
                      <div className="text-xs text-gray-500">{startup?.locationName}</div>
                      <div className="mt-1 flex flex-wrap">
                        {startup?.categories.slice(0, 3).map((category, index) => (
                          <span
                            key={index}
                            className="mb-1 mr-2 rounded-full bg-gray-200 px-2 py-1 text-xs"
                          >
                            {category}
                          </span>
                        ))}
                        {startup?.categories.length && startup.categories.length > 3 && (
                          <span className="mb-1 mr-2 rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-500">
                            ...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
