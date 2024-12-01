"use client";

import { Bookmark, ChevronLeft, Globe, Image, MapPin, ThumbsUp } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useMap } from "react-map-gl";
import { useEcosystem, useInteractiveMap, useSession } from "~/context/hooks";
import {
  bookmarkControllerCreate,
  bookmarkControllerFindOneByUserIdandStartupId,
  bookmarkControllerStartupRemove,
  likeControllerCreate,
  likeControllerFindOneByUserIdandStartupId,
  likeControllerStartupRemove,
  startupsControllerFindAll,
  startupsControllerFindOne,
  startupsControllerUpdate,
  viewControllerCreate,
} from "~/lib/api";
import { Startup } from "~/lib/schemas";
import { LocationData } from "~/lib/types";
import { withAuth } from "~/lib/utils";

export default function StartupDetails() {
  const { id: startupId } = useParams();
  const { user } = useSession();
  const userId = user ? user.id : null;
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewed, setViewed] = useState(false);
  const router = useRouter();
  const { mainMap } = useMap();

  const { startups, setStartups, profilePictures } = useEcosystem();
  const startupDetails = useMemo(
    () => startups.find((s) => s.id === Number(startupId)),
    [startupId, startups]
  );

  const [ownedStartups, setOwnedStartups] = useState<Startup[]>([]);
  const [doesUserOwnStartup, setDoesUserOwnStartup] = useState(false);

  const [startupLocationData, setStartupLocationData] = useState<LocationData | undefined>();

  const { dashboardSelection, setDashboardSelection, selectedLocation, setSelectedLocation } =
    useInteractiveMap();
  const [previewingMap, setPreviewingMap] = useState(false);

  async function fetchOwnedStartups() {
    if (!localStorage.getItem("jwt")) return;
    const { data } = await startupsControllerFindAll(withAuth);
    setOwnedStartups(data);
  }

  const totalMoneyRaised = startupDetails?.fundingRounds
    .filter((fundingRound) => !fundingRound.isDeleted)
    .reduce((total, fundingRound) => {
      return total + (fundingRound.moneyRaised || 0);
    }, 0);

  async function updateLocation(newLocation: LocationData) {
    await startupsControllerUpdate(
      Number(startupDetails?.id),
      {
        locationLat: newLocation.latitude,
        locationLng: newLocation.longitude,
        locationName: newLocation.name,
      } as Startup,
      withAuth
    );

    fetchStartupbyID();
  }

  useEffect(() => {
    if (!dashboardSelection.active && previewingMap) {
      if (selectedLocation) {
        setStartupLocationData(selectedLocation);
        setSelectedLocation(undefined);

        // update
        updateLocation(selectedLocation);
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

  useEffect(() => {
    console.log(ownedStartups);

    // find if user owns startup
    if (ownedStartups.length > 0) {
      const ownedStartup = ownedStartups.some((s) => s.id === Number(startupId));
      if (ownedStartup) {
        console.log("trueeee");
        setDoesUserOwnStartup(true);
      }
    }
  }, [ownedStartups, startupId]);

  function createView() {
    setViewed(true);

    viewControllerCreate(
      {
        user_id: userId,
        startup: { id: parseInt(startupId as string) },
      },
      withAuth
    );
  }

  useEffect(() => {
    if (startupDetails?.locationLat && startupDetails?.locationLng) {
      mainMap?.flyTo({
        center: { lat: startupDetails.locationLat, lng: startupDetails.locationLng },
      });
    }
  }, [startupDetails, mainMap]);

  async function fetchStartupbyID() {
    try {
      const { data } = await startupsControllerFindOne(String(startupId), withAuth);
      if (data) {
        const startupIndex = startups.findIndex((s) => s.id === data.id);
        if (startupIndex !== -1) {
          const updatedStartups = [...startups];
          updatedStartups[startupIndex] = data;
          setStartups(updatedStartups);
        }
      }
    } catch (error) {
      console.error("Error fetching startup details:", error);
    }
  }

  async function fetchLikeStatus() {
    try {
      const { data } = await likeControllerFindOneByUserIdandStartupId(
        userId ?? 0,
        Number(startupId),
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
      const { data } = await bookmarkControllerFindOneByUserIdandStartupId(
        userId ?? 0,
        Number(startupId),
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
    fetchOwnedStartups();
  }, []);

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
          { user: { id: userId }, startup: { id: Number(startupId) } },
          withAuth
        );
        console.log("Bookmarked!");
      } else {
        await bookmarkControllerStartupRemove(userId, Number(startupId), withAuth);
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
          { user: { id: userId }, startup: { id: Number(startupId) } },
          withAuth
        );
        console.log("Liked!");
      } else {
        await likeControllerStartupRemove(userId, Number(startupId), withAuth);
        console.log("Disliked!");
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  }

  const formattedDate = startupDetails?.foundedDate
    ? new Date(startupDetails.foundedDate).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <div
      className={
        "absolute left-20 top-0 z-10 h-screen w-[32rem] overflow-y-auto bg-white p-6" +
        (dashboardSelection.active ? " hidden" : " block")
      }
      style={{ padding: 0, margin: 0 }}
    >
      <div className="flex flex-grow items-center justify-center">
        <div className="absolute left-0 top-0 p-2">
          <ChevronLeft size={24} className="cursor-pointer" onClick={() => router.push("/")} />
        </div>
        <div className="flex h-64 w-full items-center justify-center bg-gray-200">
          {profilePictures[`startup_${startupDetails?.id}`] ? (
            <img
              src={profilePictures[`startup_${startupDetails?.id}`]}
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
          {userId && (
            <ThumbsUp
              size={24}
              onClick={handleLike}
              fill={liked ? "gold" : "none"}
              className={`transform cursor-pointer transition-transform ${liked ? "rotate-12 scale-125" : "rotate-0"}`}
            />
          )}
        </div>
        {startupDetails?.locationName ? (
          <div className="flex items-center px-6 py-1">
            <MapPin size={24} />
            <span className="ml-2 text-sm">{startupDetails?.locationName}</span>
          </div>
        ) : null}
        {startupDetails?.website ? (
          <div className="flex items-center px-6 py-2">
            <Globe size={16} />
            <a
              href={startupDetails?.website}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-sm text-blue-500 underline hover:text-blue-700"
            >
              {startupDetails?.website}
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

        {doesUserOwnStartup ? (
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
        ) : null}

        <hr className="border-gray-200" />
      </div>
      <div className="flex-grow overflow-y-auto px-6 py-2">
        <div className="mb-1 font-bold">{formattedDate}</div>
        <div className="mb-4 text-sm text-gray-300">Established</div>
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
          <div className="mb-4">
            <p className="font-bold">Contact Info:</p>
            <a
              href={`mailto:${startupDetails?.contactEmail}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-m text-blue-500 underline hover:text-blue-700"
            >
              {startupDetails?.contactEmail}
            </a>
          </div>

          <hr className="mb-2 border-gray-200" />

          {userId ? (
            <>
              <div className="text-gray-600">
                <div className="mb-4 flex">
                  <p className="mr-2 font-bold">Funds Raised:</p>
                  {startupDetails?.fundingRounds?.length ? (
                    <span>
                      {startupDetails?.fundingRounds[0].moneyRaisedCurrency}{" "}
                      {totalMoneyRaised?.toLocaleString()}
                    </span>
                  ) : (
                    <span>None</span>
                  )}
                </div>

                <div className="mb-4 flex">
                  <p className="mr-2 font-bold">Funding Rounds:</p>
                  <span>
                    {startupDetails?.fundingRounds.filter((round) => !round.isDeleted).length}
                  </span>
                </div>

                <div className="mb-4 flex">
                  <p className="mr-2 font-bold">Total Investors:</p>
                  <span>
                    {
                      startupDetails?.fundingRounds
                        .flatMap((round) => round.capTableInvestors)
                        .filter(
                          (investorDetail) =>
                            !investorDetail.isDeleted && !investorDetail.investorRemoved
                        )
                        .map((investorDetail) => investorDetail.investor.id) // To get unique investor IDs
                        .filter((value, index, self) => self.indexOf(value) === index).length
                    }
                  </span>
                </div>

                <div className="mb-4 flex">
                  <p className="mr-2 font-bold">Team Size:</p>
                  <span>{startupDetails?.numberOfEmployees || "Not specified"}</span>
                </div>
              </div>

              <hr className="mb-2 border-gray-200" />
            </>
          ) : null}

          <div className="flex justify-center py-4">
            <div className="flex flex-col items-center">
              <span className="text-lg font-semibold text-blue-500">{startupDetails?.likes}</span>
              <span className="text-sm">Likes</span>
            </div>
            <div className="ml-6 flex flex-col items-center">
              <span className="text-lg font-semibold text-blue-500">
                {startupDetails?.bookmarks}
              </span>
              <span className="text-sm">Bookmarks</span>
            </div>
            <div className="ml-6 flex flex-col items-center">
              <span className="text-lg font-semibold text-blue-500">{startupDetails?.views}</span>
              <span className="text-sm">Views</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
