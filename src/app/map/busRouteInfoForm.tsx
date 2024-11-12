"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { BaseSyntheticEvent } from "react";

export type BusRouteInfoFormProps = {
  defaultValues?: Partial<BusRouteInfoFormValues>;
  onSubmit: (values: BusRouteInfoFormValues) => void;
};

const schema = yup
  .object({
    searchType: yup.string().required().oneOf(["postcode", "latlng"]),
    searchFor: yup.string().required("Search For is a required field"),
    range: yup.number().positive().min(200).max(1500).integer().required(),
  })
  .required();

export interface BusRouteInfoFormValues extends yup.InferType<typeof schema> {}

export function BusRouteInfoForm({
  defaultValues,
  onSubmit,
}: BusRouteInfoFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      range: defaultValues?.range ?? 500,
      searchType: defaultValues?.searchType ?? "postcode",
      searchFor: defaultValues?.searchFor ?? "",
    },
  });

  /* 
    handleSubmit will call this function with a second argument of type BaseSyntheticEvent
    which we don't want to expose to any parent component
  */
  const submit = (values: BusRouteInfoFormValues) => {
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="searchFor">Search For</label>
          <label htmlFor="searchType" className="sr-only">
            Search Type
          </label>
          <div className="flex flex-row gap-2">
            <input
              {...register("searchFor")}
              id="searchFor"
              placeholder="Search..."
              className="input flex-grow"
            />
            <select
              {...register("searchType")}
              id="searchType"
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
            <label htmlFor="range">Radius</label>
            <strong>
              <output htmlFor="radius">{`${watch("range")}m`}</output>
            </strong>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs">200m</span>
            <input
              {...register("range")}
              id="range"
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
