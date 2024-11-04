"use client";

import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { DeckGLOverlay } from "./deckGLOverlay";
import { useCallback, useMemo, useState } from "react";
import { ColumnLayer, PathLayer } from "@deck.gl/layers";
import type { PickingInfo } from "@deck.gl/core";
import {
  LineData,
  LineDataItem,
  LineStop,
  isLineDataItem,
  isLineStop,
} from "@/models/LineMap";

export interface BusMapProps {
  lineData: LineData;
  lat: number;
  lng: number;
}

export function BusMap({ lineData, lat, lng }: BusMapProps) {
  const [mapIsReady, setMapIsReady] = useState(false);
  const handleTilesLoaded = useCallback(() => setMapIsReady(true), []);

  const lineLayers = useMemo(() => {
    return [
      new PathLayer<LineDataItem>({
        id: `path-layer`,
        data: lineData,
        getPath: (d) => d.path,
        getColor: (d) => [d.colour.red, d.colour.green, d.colour.blue],
        getWidth: 10,
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
  }, [lineData]);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
      <Map
        defaultCenter={{ lat, lng }}
        defaultZoom={15}
        onTilesLoaded={handleTilesLoaded}
      >
        <Marker position={{ lat, lng }} />
        {mapIsReady && (
          <DeckGLOverlay
            layers={lineLayers}
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
