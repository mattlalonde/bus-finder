import { LineResponse } from "@/models/Line";
import { LineData, LineDataItem } from "@/models/LineMap";
import { PlaceResponse } from "@/models/Place";
import { parseToRgb } from "polished";
import { GetBusRouteDataResponse } from "./types";

export async function getBusRouteData(
  lat: number,
  lng: number,
  distance: number = 500
): Promise<GetBusRouteDataResponse> {
  const placeData = await getPlaceData(lat, lng, distance);
  const lineIds = Array.from(
    new Set(placeData.places.flatMap((p) => p.lines.map((l) => l.id)))
  );

  // TODO: refactor so calls to getLineData can be cached
  const lineResponses = await Promise.all(lineIds.map((id) => getLineData(id)));
  const lineCount = lineResponses.length;
  const hueGap = 360 / lineCount;

  const lineData: LineData = lineResponses.flatMap((lr, idx): LineData => {
    return lr.stopPointSequences.map((sps) => {
      const h = idx * hueGap;
      const s = 80;
      const l = sps.direction === "inbound" ? 40 : 70;
      const rgb = parseToRgb(`hsl(${h}, ${s}%, ${l}%)`);

      const result: LineDataItem = {
        type: "line-data-item",
        lineId: sps.lineId,
        lineName: sps.lineName,
        branchId: sps.branchId,
        direction: sps.direction,
        colour: rgb,
        path: sps.stopPoint.map((p) => [p.lon, p.lat]),
        stops: sps.stopPoint.map((p) => ({
          type: "line-stop",
          name: p.name,
          latitude: p.lat,
          longitude: p.lon,
        })),
      };
      return result;
    });
  });

  return { lineData, lat, lng };
}

async function getPlaceData(lat: number, lng: number, distance: number = 500) {
  const requestUrl = `https://api.tfl.gov.uk/Place?radius=${distance}&type=NaptanPublicBusCoachTram&activeOnly=true&lat=${lat}&lon=${lng}`;

  const res = await fetch(requestUrl);
  if (!res.ok) {
    throw new Error("Failed to fetch place data");
  }

  return res.json() as Promise<PlaceResponse>;
}

async function getLineData(id: string, direction: string = "all") {
  const requestUrl = `https://api.tfl.gov.uk/Line/${id}/Route/Sequence/${direction}`;

  const res = await fetch(requestUrl);
  if (!res.ok) {
    throw new Error("Failed to fetch place data");
  }

  return res.json() as Promise<LineResponse>;
}
