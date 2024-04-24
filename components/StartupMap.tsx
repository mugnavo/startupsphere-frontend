"use client";

import { useCallback, useState } from "react";
import type { FillExtrusionLayer, MapLayerMouseEvent } from "react-map-gl";
import Map, { Layer } from "react-map-gl";
import { useInteractiveMap } from "~/lib/InteractiveMapContext";
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

export default function StartupMap() {
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
    (event: MapLayerMouseEvent) => {
      // TODO: confirmation dialog
      if (dashboardSelection.active) {
        const locationName = setSelectedLocation({
          latitude: event.lngLat.lat,
          longitude: event.lngLat.lng,
          name: "TODO: Get name from reverse geocoding API",
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
        <Geocoder
          position="top-right"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN!}
          onLoading={() => {}}
          onResults={() => {}}
          onResult={() => {}}
          onError={() => {}}
        />

        <Layer {...building3dLayer} />
      </Map>
    </div>
  );
}
