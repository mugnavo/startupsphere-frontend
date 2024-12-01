"use client";

import { Bookmark, ChevronLeft, Globe, Image, MapPin, ThumbsUp } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useMap } from "react-map-gl";
import { useEcosystem, useInteractiveMap, useSession } from "~/context/hooks";
import {
  bookmarkControllerCreate,
  bookmarkControllerFindOneByUserIdandInvestorId,
  bookmarkControllerInvestorRemove,
  investorsControllerFindOne,
  investorsControllerUpdate,
  likeControllerCreate,
  likeControllerFindOneByUserIdandInvestorId,
  likeControllerInvestorRemove,
  viewControllerCreate,
} from "~/lib/api";
import { Investor } from "~/lib/schemas";
import { LocationData } from "~/lib/types";
import { placeholderImageUrl, withAuth } from "~/lib/utils";

export default function InvestorDetails() {
  const { id: investorId } = useParams();
  const { user } = useSession();
  const userId = user ? user.id : null;
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewed, setViewed] = useState(false);
  const router = useRouter();
  const { mainMap } = useMap();

  const { profilePictures, investors, setInvestors } = useEcosystem();
  const investorDetails = useMemo(
    () => investors.find((i) => i.id === Number(investorId)),
    [investors, investorId]
  );

  const [investorLocationData, setInvestorLocationData] = useState<LocationData | undefined>();

  const { dashboardSelection, setDashboardSelection, selectedLocation, setSelectedLocation } =
    useInteractiveMap();
  const [previewingMap, setPreviewingMap] = useState(false);

  useEffect(() => {
    if (!dashboardSelection.active && previewingMap) {
      if (selectedLocation) {
        setInvestorLocationData(selectedLocation);
        setSelectedLocation(undefined);

        updateLocation(selectedLocation);
      }

      setPreviewingMap(false);
    }
  }, [dashboardSelection, previewingMap, selectedLocation, setSelectedLocation]);

  async function updateLocation(newLocation: LocationData) {
    await investorsControllerUpdate(
      Number(investorDetails?.id),
      {
        locationLat: newLocation.latitude,
        locationLng: newLocation.longitude,
        locationName: newLocation.name,
      } as Investor,
      withAuth
    );

    fetchInvestorbyID();
  }

  function previewMap(edit = false) {
    setPreviewingMap(true);

    setDashboardSelection({
      active: true,
      entityName: investorDetails?.firstName + " " + investorDetails?.lastName,
      edit: edit,
      previewLocation: edit ? undefined : investorLocationData,
    });
  }

  function createView() {
    setViewed(true);

    viewControllerCreate(
      {
        user_id: userId,
        investor: { id: parseInt(investorId as string) },
      },
      withAuth
    );
  }

  useEffect(() => {
    if (investorDetails?.locationLat && investorDetails?.locationLng) {
      mainMap?.flyTo({
        center: { lat: investorDetails.locationLat, lng: investorDetails.locationLng },
      });
    }
  }, [investorDetails, mainMap]);

  async function fetchInvestorbyID() {
    try {
      const { data: returnData } = await investorsControllerFindOne(Number(investorId));
      const data = returnData as unknown as Investor;
      if (data) {
        const investorIndex = investors.findIndex((i) => i.id === data.id);
        if (investorIndex !== -1) {
          const updatedInvestors = [...investors];
          updatedInvestors[investorIndex] = data;
          setInvestors(updatedInvestors);
        }
      }
    } catch (error) {
      console.error("Error fetching investor details:", error);
    }
  }

  async function fetchLikeStatus() {
    try {
      const { data } = await likeControllerFindOneByUserIdandInvestorId(
        userId ?? 0,
        Number(investorId),
        withAuth
      );
      if (data) {
        setLiked(true);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching like status:", error);
      setLoading(false);
    }
  }

  async function fetchBookmarkStatus() {
    try {
      const { data } = await bookmarkControllerFindOneByUserIdandInvestorId(
        userId ?? 0,
        Number(investorId),
        withAuth
      );
      if (data) {
        setBookmarked(true);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bookmark status:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!viewed && user !== undefined) {
      createView();
    }
    if (userId) {
      fetchLikeStatus();
      fetchBookmarkStatus();
    }
  }, [userId]);

  async function handleBookmark() {
    if (!userId) {
      console.error("User not authenticated.");
      return;
    }

    console.log("Bookmarked!");
    setBookmarked(!bookmarked);
    try {
      if (!bookmarked) {
        await bookmarkControllerCreate(
          { user: { id: userId }, investor: { id: Number(investorId) } },
          withAuth
        );
        console.log("Bookmarked!");
      } else {
        await bookmarkControllerInvestorRemove(userId, Number(investorId), withAuth);
        console.log("Bookmark removed!");
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  }

  async function handleLike() {
    if (!userId) {
      console.error("User not authenticated.");
      return;
    }

    console.log("Liked!");
    setLiked(!liked);
    try {
      if (!liked) {
        await likeControllerCreate(
          { user: { id: userId }, investor: { id: Number(investorId) } },
          withAuth
        );
        console.log("Liked!");
      } else {
        await likeControllerInvestorRemove(userId, Number(investorId), withAuth);
        console.log("Disliked!");
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  }

  return (
    <div
      className="absolute left-20 top-0 z-10 h-screen w-[32rem] overflow-y-auto bg-white p-6"
      style={{ padding: 0, margin: 0 }}
    >
      <div className="flex flex-grow items-center justify-center">
        <div className="absolute left-0 top-0 p-2">
          <ChevronLeft size={24} className="cursor-pointer" onClick={() => router.push("/")} />
        </div>
        <div className="flex h-64 w-full items-center justify-center bg-gray-200">
          {profilePictures[`investor_${investorDetails?.id}`] ? (
            <img
              src={profilePictures[`investor_${investorDetails?.id}`] || placeholderImageUrl}
              alt={investorDetails?.firstName}
              className="h-full max-h-64 w-auto max-w-full object-contain"
            />
          ) : (
            <Image size={128} color="#6B7280" />
          )}
        </div>
      </div>
      <div className="border-t border-gray-200 py-4">
        <div className="flex items-center justify-between px-6">
          <span className="text-lg font-bold">
            {investorDetails?.firstName} {investorDetails?.lastName}
          </span>
          {userId && (
            <ThumbsUp
              size={24}
              onClick={handleLike}
              fill={liked ? "gold" : "none"}
              className={`transform cursor-pointer transition-transform ${liked ? "rotate-12 scale-125" : "rotate-0"}`}
            />
          )}
        </div>
        {investorDetails?.locationName ? (
          <div className="flex items-center px-6 py-1">
            <MapPin size={24} />
            <span className="ml-2 text-sm">{investorDetails?.locationName}</span>
          </div>
        ) : null}
        {investorDetails?.website ? (
          <div className="flex items-center px-6 py-2">
            <Globe size={16} />
            <a
              href={investorDetails?.website}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-sm text-blue-500 underline hover:text-blue-700"
            >
              {investorDetails?.website}
            </a>
          </div>
        ) : null}

        {userId && (
          <div className="flex justify-center py-1">
            <div className="flex cursor-pointer justify-center py-2" onClick={handleBookmark}>
              <Bookmark
                size={18}
                fill={bookmarked ? "#FFD700" : "none"}
                className={`transform cursor-pointer transition-transform ${bookmarked ? "scale-125" : "scale-100"}`}
              />
              <span className="ml-1 text-sm underline">
                {bookmarked ? "Remove Bookmark" : "Add Bookmark"}
              </span>
            </div>
          </div>
        )}

        {user?.id === investorDetails?.id ? (
          <div className="mx-4 mb-3 mt-1 flex items-center gap-2">
            {investorDetails?.locationLat && investorDetails?.locationLng ? (
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
        ) : null}
        <hr className="border-gray-200" />
      </div>
      <div className="flex-grow overflow-y-auto px-6 py-2">
        <div className="mb-4 text-gray-600">{investorDetails?.biography}</div>
        <hr className="mb-4 border-gray-200" />
        <div className="text-gray-600">
          <div className="mb-2">
            <p className="font-bold">Categories:</p>
            <div className="flex flex-row flex-wrap">
              <span className="mb-1 mr-2 rounded-full bg-gray-200 px-2 py-1 text-sm">Investor</span>
            </div>
          </div>
          <div className="mb-4">
            <p className="font-bold">Contact Info:</p>
            <a
              href={`mailto:${investorDetails?.emailAddress || investorDetails?.contactInformation}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-m text-blue-500 underline hover:text-blue-700"
            >
              {investorDetails?.emailAddress || investorDetails?.contactInformation}
            </a>
          </div>

          <hr className="mb-2 border-gray-200" />

          <div className="text-gray-600">
            {/* <div className="mb-4 flex">
              <p className="mr-2 font-bold">Capital:</p>
              <span>
                {investorDetails?.capital
                  ? new Intl.NumberFormat("en-PH", {
                      style: "currency",
                      currency: "PHP",
                    }).format(investorDetails.capital)
                  : "Not specified"}
              </span>
            </div>

            <div className="mb-4 flex">
              <p className="mr-2 font-bold">Funding Stage:</p>
              <span>{investorDetails?.fundingStage || "Not specified"}</span>
            </div> */}

            {/* <div className="mb-4 flex">
              <p className="mr-2 font-bold">Team Size:</p>
              <span>{investorDetails?. || "Not specified"}</span>
            </div> */}
          </div>

          <hr className="mb-2 border-gray-200" />

          <div className="flex justify-center py-4">
            <div className="flex flex-col items-center">
              <span className="text-lg font-semibold text-blue-500">{investorDetails?.likes}</span>
              <span className="text-sm">Likes</span>
            </div>
            <div className="ml-6 flex flex-col items-center">
              <span className="text-lg font-semibold text-blue-500">
                {investorDetails?.bookmarks}
              </span>
              <span className="text-sm">Bookmarks</span>
            </div>
            <div className="ml-6 flex flex-col items-center">
              <span className="text-lg font-semibold text-blue-500">{investorDetails?.views}</span>
              <span className="text-sm">Views</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
