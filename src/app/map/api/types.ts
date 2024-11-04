import { LineData } from "@/models/LineMap";

export type GetBusRouteDataResponse = {
  lineData: LineData;
  lat: number;
  lng: number;
};
