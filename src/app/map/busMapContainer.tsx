"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { GetBusRouteDataResponse } from "./api/types";
import { BusMap } from "./busMap";

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

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ["bus-route-data", { searchType, searchFor, radius }],
    queryFn: () => queryFn(searchType, searchFor, radius),
    staleTime: Infinity, // cache results for this session
  });

  return (
    <>
      <div className="w-full h-2">
        {isLoading && (
          <progress className="progress progress-primary w-full"></progress>
        )}
      </div>
      <BusMap
        lineData={isSuccess ? data.lineData : []}
        lat={isSuccess ? data.lat : 0}
        lng={isSuccess ? data.lng : 0}
        radius={parseInt(radius ?? "500")}
      />
    </>
  );
}
