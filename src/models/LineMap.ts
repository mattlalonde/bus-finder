import { RgbColor } from "polished/lib/types/color";

export type LineStop = {
  type: "line-stop";
  name: string;
  latitude: number;
  longitude: number;
};

export function isLineStop(value: any): value is LineStop {
  return value?.type && value.type === "line-stop";
}

export type LineDataItem = {
  type: "line-data-item";
  lineId: string;
  lineName: string;
  branchId: number;
  direction: string;
  colour: RgbColor;
  path: [longitude: number, latitude: number][];
  stops: LineStop[];
};

export function isLineDataItem(value: any): value is LineDataItem {
  return value?.type && value.type === "line-data-item";
}

export type LineData = LineDataItem[];
