"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { GetBusRouteDataResponse } from "./api/types";
import { BusMap } from "./busMap";
import { LatLngPair } from "@/models/LatLngPair";

const unknowResponse: GetBusRouteDataResponse = {
  lineData: [],
  lat: 51.517867, // default to center of London
  lng: -0.086384,
};

const queryFn = async (
  searchType?: string | null,
  searchFor?: string | null,
  radius?: string | null
) => {
  if (!searchType || !searchFor) {
    return unknowResponse;
  }

  const request = await fetch(
    `/map/api?searchType=${searchType}&searchFor=${searchFor}&radius=${radius}`
  );
  const json = await request.json();

  return json.data as GetBusRouteDataResponse;
};

export function BusMapContainer() {
  const searchParams = useSearchParams();
  const searchType = searchParams.get("searchType");
  const searchFor = searchParams.get("searchFor");
  const radius = searchParams.get("range");

  const { data, fetchStatus } = useQuery<GetBusRouteDataResponse>({
    queryKey: ["bus-route-data", { searchType, searchFor, radius }],
    queryFn: () => queryFn(searchType, searchFor, radius),
    staleTime: Infinity, // cache results for this session
    placeholderData: (previousData) => previousData,
  });

  const onSelectLocation = ({ lat, lng }: LatLngPair) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("searchType", "latlng");
    params.set("searchFor", `${lat},${lng}`);
    params.set("range", radius?.toString() ?? "500");

    window.history.pushState(null, "", `?${params.toString()}`);
  };

  return (
    <>
      <div className="w-full h-2">
        {fetchStatus === "fetching" && (
          <progress className="progress progress-primary w-full"></progress>
        )}
      </div>
      <BusMap
        lineData={data?.lineData ?? unknowResponse.lineData}
        lat={data?.lat ?? unknowResponse.lat}
        lng={data?.lng ?? unknowResponse.lng}
        radius={parseInt(radius ?? "500")}
        onSelectLocation={onSelectLocation}
      />
    </>
  );
}
