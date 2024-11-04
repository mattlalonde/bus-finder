import { Mode } from "./Mode";

export type PlaceResponse = {
    centrePoint: number[];
    places: Place[];
}

type Line = {
    id: string;
    name: string;
    routeType: string;
    status: string;
    type: string;
    uri: string;
}

type Place = {
    id: string;
    naptanId: string;
    indicator: string;
    commonName: string;

    lines: Line[];
    modes: Mode[];
}

