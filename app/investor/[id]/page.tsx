"use client";

import { ChevronLeft, Globe, Image, MapPin } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMap } from "react-map-gl";
import { useSession } from "~/context/hooks";
import { investorControllerGetOneById } from "~/lib/api";
import { Investor } from "~/lib/schemas";

export default function InvestorDetails() {
  const { id: investorId } = useParams();
  const { user } = useSession();
  const userId = user ? user.id : null;
  const [investorDetails, setInvestorDetails] = useState<Investor | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { mainMap } = useMap();

  async function fetchInvestorbyID() {
    try {
      const { data } = await investorControllerGetOneById(Number(investorId));
      if (data) {
        mainMap?.flyTo({ center: { lat: data.locationLat, lng: data.locationLng } });
        setInvestorDetails(data);
      }
    } catch (error) {
      console.error("Error fetching investor details:", error);
    }
  }

  useEffect(() => {
    fetchInvestorbyID();
  }, []);

  return (
    <div
      className="absolute left-20 top-0 z-10 h-screen w-[22rem] overflow-y-auto bg-white p-6"
      style={{ padding: 0, margin: 0 }}
    >
      <div className="flex flex-grow items-center justify-center">
        <div className="absolute left-0 top-0 p-2">
          <ChevronLeft size={24} className="cursor-pointer" onClick={() => router.back()} />
        </div>
        <div className="flex h-64 w-full items-center justify-center bg-gray-200">
          {investorDetails?.logoUrl ? (
            <img
              src={investorDetails.logoUrl}
              alt={investorDetails.name}
              className="h-full max-h-64 w-auto max-w-full object-contain"
            />
          ) : (
            <Image size={128} color="#6B7280" />
          )}
        </div>
      </div>
      <div className="border-t border-gray-200 py-4">
        <div className="flex items-center justify-between px-6">
          <span className="text-lg font-bold">{investorDetails?.name}</span>
        </div>
        <div className="flex items-center px-6 py-1">
          <MapPin size={24} />
          <span className="ml-2 text-sm">{investorDetails?.locationName}</span>
        </div>
        <div className="flex items-center px-6 py-2">
          <Globe size={16} />
          <a
            href={investorDetails?.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-sm text-blue-500 underline hover:text-blue-700"
          >
            {investorDetails?.websiteUrl}
          </a>
        </div>
        <hr className="border-gray-200" />
      </div>
      <div className="flex-grow overflow-y-auto px-6 py-2">
        <div className="mb-4 text-gray-600">{investorDetails?.description}</div>
        <hr className="mb-4 border-gray-200" />
        <div className="text-gray-600">
          <div className="mb-2">
            <p className="font-bold">Categories:</p>
            <div className="flex flex-row flex-wrap">
              <span className="mb-1 mr-2 rounded-full bg-gray-200 px-2 py-1 text-sm">
                {investorDetails?.type}
              </span>
            </div>
          </div>
          <div className="mb-4">
            <p className="font-bold">Contact Info:</p>
            <a
              href={`mailto:${investorDetails?.contactInfo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-m text-blue-500 underline hover:text-blue-700"
            >
              {investorDetails?.contactInfo}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
