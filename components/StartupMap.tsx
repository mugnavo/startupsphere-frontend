"use client";

import { GeocodingCore } from "@mapbox/search-js-core";
import { useCallback, useEffect, useState } from "react";
import type { FillExtrusionLayer, MapLayerMouseEvent } from "react-map-gl";
import Map, { Layer, Marker } from "react-map-gl";

import { useInteractiveMap } from "~/lib/InteractiveMapContext";
import Geocoder from "./map/Geocoder";

import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { getAllStartups } from "~/lib/actions/startups";
import { Startup } from "~/lib/schema";

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
  useEffect(() => {
    getAllStartups().then(setStartups);
  }, []);

  const [viewState, setViewState] = useState({
    longitude: 123.89811168536812,
    latitude: 10.296462810801557,
    zoom: 16.822704814280264,
    pitch: 77.50180300523273,
    bearing: -13.596730550512234,
  });

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
    [dashboardSelection, setDashboardSelection]
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
            longitude={startup.coordinates?.longitude ?? 0}
            latitude={startup.coordinates?.latitude ?? 0}
            popup={new mapboxgl.Popup().setText(startup.name)}
          >
            <div className="text-red-500">📍 {startup.name} </div>
          </Marker>
        ))}
        <Layer {...building3dLayer} />
      </Map>
    </div>
  );
}
