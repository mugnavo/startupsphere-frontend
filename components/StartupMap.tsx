"use client";
import { GeocodingCore } from "@mapbox/search-js-core";
import { useCallback, useEffect, useState } from "react";
import type { FillExtrusionLayer, MapLayerMouseEvent } from "react-map-gl";
import Map, { Layer, Marker } from "react-map-gl";

import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { MapPin } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useInteractiveMap } from "~/context/hooks";
import { startupControllerGetAll } from "~/lib/api";
import { Startup } from "~/lib/schemas";
import Geocoder from "./map/Geocoder";
const building3dLayer: FillExtrusionLayer = {
  // from https://docs.mapbox.com/mapbox-gl-js/example/3d-buildings/
  id: "add-3d-buildings",
  source: "composite",
  "source-layer": "building",
  filter: ["==", "extrude", "true"],
  type: "fill-extrusion",
  minzoom: 15,
  paint: {
    "fill-extrusion-color": "#aaa",

    // Use an 'interpolate' expression to
    // add a smooth transition effect to
    // the buildings as the user zooms in.
    "fill-extrusion-height": [
      "interpolate",
      ["linear"],
      ["zoom"],
      15,
      0,
      15.05,
      ["get", "height"],
    ],
    "fill-extrusion-base": [
      "interpolate",
      ["linear"],
      ["zoom"],
      15,
      0,
      15.05,
      ["get", "min_height"],
    ],
    "fill-extrusion-opacity": 0.6,
  },
};

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

  const {
    dashboardSelection,
    setDashboardSelection,
    selectedLocation,
    setSelectedLocation,
  } = useInteractiveMap();

  const onClick = useCallback(
    async (event: MapLayerMouseEvent) => {
      // TODO: confirmation dialog
      if (dashboardSelection.active) {
        const geoResponse = await geocode.reverse({
          lng: event.lngLat.lng,
          lat: event.lngLat.lat,
        });
        setSelectedLocation({
          latitude: event.lngLat.lat,
          longitude: event.lngLat.lng,
          name: geoResponse.features[0].properties.full_address,
        });
        setDashboardSelection({ ...dashboardSelection, active: false });
      }
    },
    [dashboardSelection, setDashboardSelection, setSelectedLocation]
  );

  return (
    <div className="h-screen overflow-hidden">
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100%", height: "100%" }}
        onClick={onClick}
        mapStyle="mapbox://styles/mapbox/streets-v12"
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
        {startups.map((startup) => (
          <Marker
            key={startup.id}
            longitude={startup.locationLng ?? 0}
            latitude={startup.locationLat ?? 0}
          >
            <div
              className="group relative  text-red-500"
              onClick={() => {
                router.replace(`/details/${startup.id}`);
              }}
            >
              <MapPin size={40} strokeWidth={3} /> {startup.name}
              <div className=" absolute bottom-5 hidden h-auto w-56 flex-col rounded-md  bg-slate-50 group-hover:flex">
                <div className=" flex h-32 w-full flex-col bg-yellow-400">
                  <Image
                    height={500}
                    width={504}
                    objectPosition="top"
                    src={startup.logoUrl || ""}
                    alt="logo"
                  ></Image>

                  <h1 className=" relative bottom-10 m-3 text-xl font-bold text-white">
                    {startup.name[0].toUpperCase()}
                    {startup.name.slice(1, -1)}
                  </h1>
                </div>
                <p className="m-3 line-clamp-2 h-auto w-auto overflow-hidden text-black">
                  {startup.description}
                </p>
              </div>
            </div>
          </Marker>
        ))}
        <Layer {...building3dLayer} />
      </Map>
    </div>
  );
}
