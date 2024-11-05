"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSearchParams } from "next/navigation";

export type BusRouteInfoFormProps = {
  onSubmit: () => void;
};

const schema = yup
  .object({
    searchType: yup.string().required(),
    searchFor: yup.string().required("Search For is a required field"),
    range: yup.number().positive().min(200).max(1500).integer().required(),
  })
  .required();

interface FormValues extends yup.InferType<typeof schema> {}

export function BusRouteInfoForm() {
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      range: searchParams.get("range")
        ? parseInt(searchParams.get("range") as string)
        : 500,
      searchType: searchParams.get("searchType") ?? "postcode",
      searchFor: searchParams.get("searchFor") ?? "",
    },
  });

  const onSubmit = (values: FormValues) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("searchType", values.searchType);
    params.set("searchFor", values.searchFor);
    params.set("range", values.range.toString());

    window.history.pushState(null, "", `?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="searchFor">Search For:</label>
          <label htmlFor="searchType" className="sr-only">
            Search type
          </label>
          <div className="flex flex-row gap-2">
            <input
              {...register("searchFor")}
              placeholder="Search..."
              className="input flex-grow"
            />
            <select
              {...register("searchType")}
              className="select select-bordered"
            >
              <option value="postcode">Postcode</option>
              <option value="latlng">Lat/Lng</option>
            </select>
          </div>
          {watch("searchType") === "latlng" && (
            <p className="text-sm text-gray-300">
              Enter values separated by a comma eg 'latitude,longitude'
            </p>
          )}
          {errors.searchFor && (
            <p className="text-error">{errors.searchFor.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <label htmlFor="radius">Radius:</label>
            <strong>
              <output htmlFor="radius">{`${watch("range")}m`}</output>
            </strong>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs">200m</span>
            <input
              {...register("range")}
              type="range"
              min="200"
              max="1500"
              step={50}
              className="range range-sm flex-grow"
            />

            <span className="text-xs">1500m</span>
          </div>
        </div>

        <button className="btn btn-primary">Search</button>
      </div>
    </form>
  );
}
