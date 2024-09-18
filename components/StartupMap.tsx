"use client";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { GeocodingCore } from "@mapbox/search-js-core";
import { ChevronLeft } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { MapLayerMouseEvent } from "react-map-gl";
import Map, { Marker, useMap } from "react-map-gl";

import { useInteractiveMap } from "~/context/hooks";
import { startupControllerGetAll } from "~/lib/api";
import { Startup } from "~/lib/schemas";
import CustomPin from "./map/CustomPin";
import Geocoder from "./map/Geocoder";

const geocode = new GeocodingCore({ accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN! });

export default function StartupMap() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const router = useRouter();
  const [viewState, setViewState] = useState({
    longitude: 123.89811168536812,
    latitude: 10.296462810801557,
    zoom: 16.822704814280264,
    pitch: 77.50180300523273,
    bearing: -13.596730550512234,
  });

  async function fetchStartups() {
    const { data } = await startupControllerGetAll();
    if (data) {
      setStartups(data);
    }
  }
  useEffect(() => {
    fetchStartups();
  }, []);

  const { dashboardSelection, setDashboardSelection, selectedLocation, setSelectedLocation } =
    useInteractiveMap();

  const onClick = useCallback(
    async (event: MapLayerMouseEvent) => {
      // TODO: confirmation dialog
      if (dashboardSelection.active && dashboardSelection.edit) {
        const geoResponse = await geocode.reverse({
          lng: event.lngLat.lng,
          lat: event.lngLat.lat,
        });
        setSelectedLocation({
          latitude: event.lngLat.lat,
          longitude: event.lngLat.lng,
          name: geoResponse.features[0].properties.full_address,
        });
      }
    },
    [dashboardSelection.active, dashboardSelection.edit, setSelectedLocation]
  );

  const { mainMap } = useMap();

  function cancelPreview() {
    setSelectedLocation(undefined);
    setDashboardSelection({ active: false, edit: false });
  }

  function confirmPreview() {
    setDashboardSelection({ active: false, edit: false });
  }

  useEffect(() => {
    if (dashboardSelection.previewLocation) {
      mainMap?.flyTo({
        center: {
          lng: dashboardSelection.previewLocation.longitude,
          lat: dashboardSelection.previewLocation.latitude,
        },
      });
    }
  }, [dashboardSelection.previewLocation, mainMap]);

  useEffect(() => {
    if (!mainMap) return;

    mainMap.on("style.load", () => {
      // hide labels
      mainMap.setConfigProperty("basemap", "showPlaceLabels", false);
      mainMap.setConfigProperty("basemap", "showTransitLabels", false);
      mainMap.setConfigProperty("basemap", "showPointOfInterestLabels", false);

      // theme
      mainMap.setConfigProperty("basemap", "theme", "default");
      mainMap.setConfigProperty("basemap", "lightPreset", "day");
    });
  }, [mainMap]);

  return (
    <div className="relative h-screen overflow-hidden">
      {dashboardSelection.active && (
        <>
          <div className="absolute left-0 right-0 top-12 z-50 mx-auto w-fit">
            <div className="flex items-center justify-between gap-12 rounded-2xl bg-base-100 py-3 pl-4 pr-20 text-sm shadow-md">
              <button onClick={cancelPreview}>
                <ChevronLeft />
              </button>{" "}
              <span>
                {dashboardSelection.edit ? "Editing " : "Viewing "}
                <span className="font-semibold">{dashboardSelection.startupName}</span>
              </span>
            </div>
          </div>

          {(!dashboardSelection.edit || selectedLocation) && (
            <div className="absolute bottom-8 left-0 right-0 z-50 mx-auto w-fit">
              <div className="flex items-center justify-between gap-8 rounded-2xl bg-base-100 py-2 pl-4 pr-2 text-sm shadow-md">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 text-[10px] font-bold">
                    {dashboardSelection.edit ? "Selected" : "Viewing"} location:{" "}
                    <div className="relative">
                      <div className="absolute h-2 w-2 animate-ping rounded-full bg-info" />
                      <div className="h-2 w-2 rounded-full bg-info" />
                    </div>
                  </div>
                  <div className="max-w-72 text-xs">
                    {dashboardSelection.previewLocation?.name || selectedLocation?.name}
                  </div>
                </div>
                <div className="flex gap-1">
                  {dashboardSelection.edit && (
                    <button onClick={confirmPreview} className="btn btn-info">
                      Confirm
                    </button>
                  )}

                  <button onClick={cancelPreview} className="btn btn-ghost">
                    {dashboardSelection.edit ? "Cancel" : "Back"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <Map
        id="mainMap"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100%", height: "100%" }}
        onClick={onClick}
        mapStyle="mapbox://styles/mapbox/standard"
        projection={{ name: "globe" }}
      >
        {dashboardSelection.active && (
          <Geocoder
            position="bottom-right"
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN!}
            onLoading={() => {}}
            onResults={() => {}}
            onResult={() => {}}
            onError={() => {}}
          />
        )}
        {(selectedLocation || dashboardSelection.previewLocation) && (
          <Marker
            longitude={
              selectedLocation?.longitude ||
              (dashboardSelection.previewLocation?.longitude as number)
            }
            latitude={
              selectedLocation?.latitude || (dashboardSelection.previewLocation?.latitude as number)
            }
            offset={[0, -20]}
          ></Marker>
        )}
        {startups.map((startup) => (
          <Marker
            key={startup.id}
            longitude={startup.locationLng ?? 0}
            latitude={startup.locationLat ?? 0}
            offset={[0, -20]}
          >
            <div
              className="group relative flex w-32 justify-center text-lg text-red-500"
              onClick={() => {
                router.replace(`/details/${startup.id}`);
              }}
            >
              <CustomPin
                className="h-8 w-8"
                startupimage={startup.logoUrl}
                categories={startup.categories}
                startupname={startup.name}
              />
              <div className="absolute -bottom-6 text-center text-sm font-semibold">
                {startup.name}
              </div>

              {/* <div className="absolute bottom-8 z-50 hidden h-auto w-56 flex-col rounded-md bg-slate-50 shadow group-hover:z-50 group-hover:flex">
                <div className="flex h-32 w-full flex-col bg-yellow-400">
                  * eslint-disable-next-line @next/next/no-img-element 
                  <img
                    className="h-[122px] rounded-md object-cover"
                    src={startup.logoUrl || ""}
                    alt="logo"
                  ></img>

                  <h1 className="absolute bottom-10 m-3 text-xl font-bold text-white [text-shadow:_1px_1px_10px_rgb(0_0_0_/_70%)]">
                    {startup.name}
                  </h1>
                </div>
                <p className="m-3 line-clamp-2 h-auto w-auto overflow-hidden text-sm text-black">
                  {startup.description}
                </p>
              </div> */}
            </div>
          </Marker>
        ))}
      </Map>
    </div>
  );
}
