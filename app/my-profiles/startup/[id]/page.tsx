"use client";

import axios from "axios";
import { Bookmark, ChevronLeft, Globe, Image, MapPin, ThumbsUp } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMap } from "react-map-gl";
import { useInteractiveMap, useSession } from "~/context/hooks";
import { startupsControllerFindOne, startupsControllerUpdate } from "~/lib/api";
import { Startup } from "~/lib/schemas";
import { LocationData } from "~/lib/types";
import { withAuth } from "~/lib/utils";

export default function StartupDetails() {
  const { id: startupId } = useParams();
  const { user } = useSession();
  const userId = user ? user.id : null;
  const [startupDetails, setStartupDetails] = useState<Startup | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { mainMap } = useMap();

  const [startupLocationData, setStartupLocationData] = useState<LocationData | undefined>();

  const { dashboardSelection, setDashboardSelection, selectedLocation, setSelectedLocation } =
    useInteractiveMap();
  const [previewingMap, setPreviewingMap] = useState(false);

  const [pfp, setPfp] = useState<any>(null);

  async function fetchPfp() {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile-picture/startup/${startupDetails?.id}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        responseType: "blob",
      }
    );
    setPfp(URL.createObjectURL(response.data));
  }
  useEffect(() => {
    if (startupDetails) {
      fetchPfp();
    }
  }, [startupDetails]);

  useEffect(() => {
    if (!dashboardSelection.active && previewingMap) {
      if (selectedLocation) {
        setStartupLocationData(selectedLocation);
        setSelectedLocation(undefined);

        // update
        startupsControllerUpdate(
          Number(startupDetails?.id),
          {
            locationLat: selectedLocation.latitude,
            locationLng: selectedLocation.longitude,
            locationName: selectedLocation.name,
          } as Startup,
          withAuth
        ).then(() => window.location.reload());
      }

      setPreviewingMap(false);
    }
  }, [dashboardSelection, previewingMap, selectedLocation, setSelectedLocation]);

  function previewMap(edit = false) {
    setPreviewingMap(true);

    setDashboardSelection({
      active: true,
      entityName: startupDetails?.companyName,
      edit: edit,
      previewLocation: edit ? undefined : startupLocationData,
    });
  }

  async function fetchStartupbyID() {
    try {
      const { data } = await startupsControllerFindOne(String(startupId), withAuth);
      if (data) {
        if (data.locationLat && data.locationLng) {
          mainMap?.flyTo({ center: { lat: data.locationLat, lng: data.locationLng } });
        }
        setStartupDetails(data);
        setStartupLocationData({
          latitude: data.locationLat,
          longitude: data.locationLng,
          name: data.locationName,
        });
      }
    } catch (error) {
      console.error("Error fetching startup details:", error);
    }
  }

  useEffect(() => {
    fetchStartupbyID();
  }, []);

  return (
    <div
      className={
        "absolute left-20 top-0 z-10 h-screen w-[22rem] overflow-y-auto bg-white p-6" +
        (dashboardSelection.active ? " hidden" : " block")
      }
      style={{ padding: 0, margin: 0 }}
    >
      <div className="flex flex-grow items-center justify-center">
        <div className="absolute left-0 top-0 p-2">
          <ChevronLeft size={24} className="cursor-pointer" onClick={() => router.back()} />
        </div>
        <div className="flex h-64 w-full items-center justify-center bg-gray-200">
          {pfp ? (
            <img
              src={pfp}
              alt={startupDetails?.companyName}
              className="h-full max-h-64 w-auto max-w-full object-contain"
            />
          ) : (
            <Image size={128} color="#6B7280" />
          )}
        </div>
      </div>
      <div className="border-t border-gray-200 py-4">
        <div className="flex items-center justify-between px-6">
          <span className="text-lg font-bold">{startupDetails?.companyName}</span>
        </div>
        {startupDetails?.locationName ? (
          <div className="flex items-center px-6 py-1">
            <MapPin size={24} />
            <span className="ml-2 text-sm">{startupDetails?.locationName}</span>
          </div>
        ) : null}

        <div className="mx-4 mb-3 mt-1 flex items-center gap-2">
          {startupDetails?.locationLat && startupDetails?.locationLng ? (
            <button
              className="btn btn-primary btn-sm text-xs"
              type="button"
              onClick={() => previewMap()}
            >
              Preview
            </button>
          ) : null}

          <button
            className="btn btn-secondary btn-sm text-xs"
            type="button"
            onClick={() => previewMap(true)}
          >
            Update Location
          </button>
        </div>

        <hr className="border-gray-200" />
      </div>
      <div className="flex-grow overflow-y-auto px-6 py-2">
        <div className="mb-4 text-gray-600">{startupDetails?.companyDescription}</div>
        <hr className="mb-4 border-gray-200" />
        <div className="text-gray-600">
          <div className="mb-2">
            <p className="font-bold">Categories:</p>
            <div className="flex flex-row flex-wrap">
              <span className="mb-1 mr-2 rounded-full bg-gray-200 px-2 py-1 text-sm">
                {startupDetails?.industry}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
