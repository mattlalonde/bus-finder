"use client";

import {
  APIProvider,
  Map,
  MapCameraChangedEvent,
  MapCameraProps,
  MapMouseEvent,
  Marker,
} from "@vis.gl/react-google-maps";
import { DeckGLOverlay } from "./deckGLOverlay";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ColumnLayer, PathLayer, ScatterplotLayer } from "@deck.gl/layers";
import type { PickingInfo } from "@deck.gl/core";
import {
  LineData,
  LineDataItem,
  LineStop,
  isLineDataItem,
  isLineStop,
} from "@/models/LineMap";
import { LatLngPair } from "@/models/LatLngPair";

export interface BusMapProps {
  lineData: LineData;
  lat: number;
  lng: number;
  radius: number;
  onSelectLocation?: ({ lat, lng }: LatLngPair) => void;
}

const INITIAL_CAMERA = {
  center: { lat: 51.517867, lng: -0.086384 },
  zoom: 15,
};

export function BusMap({
  lineData,
  lat,
  lng,
  radius,
  onSelectLocation,
}: BusMapProps) {
  const [mapIsReady, setMapIsReady] = useState(false);
  const handleTilesLoaded = useCallback(() => setMapIsReady(true), []);

  const [cameraProps, setCameraProps] =
    useState<MapCameraProps>(INITIAL_CAMERA);
  const handleCameraChange = useCallback(
    (ev: MapCameraChangedEvent) => setCameraProps(ev.detail),
    []
  );

  const [lineWidth, setLineWidth] = useState(10);

  const lineLayers = useMemo(() => {
    return [
      new PathLayer<LineDataItem>({
        id: `path-layer`,
        data: lineData,
        getPath: (d) => d.path,
        getColor: (d) => [d.colour.red, d.colour.green, d.colour.blue],
        getWidth: lineWidth,
        pickable: true,
      }),
      ...lineData.map((d) => {
        return new ColumnLayer<LineStop>({
          id: `column-layer-${d.lineId}-${d.branchId}`,
          data: d.stops,
          getFillColor: [d.colour.red, d.colour.green, d.colour.blue],
          getPosition: (p) => [p.longitude, p.latitude],
          pickable: true,
          radius: 7,
          getElevation: 10,
          extruded: true,
        });
      }),
    ];
  }, [lineData, lineWidth]);

  const radiusLayer = useMemo(() => {
    return new ScatterplotLayer<{ lat: number; lng: number }>({
      id: "radius-layer",
      data: [{ lat, lng }],
      getPosition: (p) => [p.lng, p.lat],
      getRadius: radius,
      getLineColor: [0, 0, 0, 150],
      getFillColor: [0, 0, 0, 30],
      stroked: true,
    });
  }, [lat, lng, radius]);

  /* update camera with new lat/lng props */
  useEffect(() => {
    setCameraProps((prev) => ({
      ...prev,
      center: { lat, lng },
    }));
  }, [lat, lng]);

  /* update line width with zoom */
  useEffect(() => {
    let newLineWidth = 10;
    if (cameraProps.zoom < 15 && cameraProps.zoom > 13) {
      newLineWidth = cameraProps.zoom * 2;
    } else if (cameraProps.zoom <= 13) {
      newLineWidth = cameraProps.zoom * 4;
    }

    setLineWidth(newLineWidth);
  }, [cameraProps.zoom]);

  const onClick = (e: MapMouseEvent) => {
    if (e.detail.latLng && onSelectLocation) {
      setCameraProps((prev) => ({
        ...prev,
        center: {
          lat: e.detail.latLng?.lat ?? prev.center.lat,
          lng: e.detail.latLng?.lng ?? prev.center.lng,
        },
      }));
      onSelectLocation({ lat: e.detail.latLng.lat, lng: e.detail.latLng.lng });
    }
  };

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
      <Map
        {...cameraProps}
        mapId="bus-routes-map"
        onTilesLoaded={handleTilesLoaded}
        onCameraChanged={handleCameraChange}
        onClick={onClick}
      >
        <Marker position={{ lat, lng }} />
        {mapIsReady && (
          <DeckGLOverlay
            layers={[...lineLayers, radiusLayer]}
            initialViewState={{
              latitude: lat,
              longitude: lng,
              zoom: 15,
            }}
            getTooltip={({ object }: PickingInfo<LineDataItem | LineStop>) => {
              if (isLineDataItem(object)) {
                return `${object.lineName} - ${object.direction}`;
              } else if (isLineStop(object)) {
                return `Stop: ${object.name}`;
              }
              return null;
            }}
          />
        )}
      </Map>
    </APIProvider>
  );
}
