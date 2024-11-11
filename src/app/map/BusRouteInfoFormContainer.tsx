"use client";

import { useSearchParams } from "next/navigation";
import { BusRouteInfoForm, BusRouteInfoFormValues } from "./busRouteInfoForm";

export function BusRouteInfoFormContainer() {
  const searchParams = useSearchParams();

  const onSubmit = (values: BusRouteInfoFormValues) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("searchType", values.searchType);
    params.set("searchFor", values.searchFor);
    params.set("range", values.range.toString());

    window.history.pushState(null, "", `?${params.toString()}`);
  };

  return (
    <BusRouteInfoForm
      onSubmit={onSubmit}
      defaultValues={{
        range: searchParams.get("range")
          ? parseInt(searchParams.get("range") as string)
          : undefined,
        searchFor: searchParams.get("searchFor") ?? undefined,
        searchType: searchParams.get("searchType") ?? undefined,
      }}
    />
  );
}
