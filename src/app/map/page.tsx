import { BusMapContainer } from "./busMapContainer";
import { BusRouteInfoForm } from "./busRouteInfoForm";

export default async function Map() {
  return (
    <div className="w-full flex flex-col gap-5 grow justify-items-start">
      <BusRouteInfoForm />
      <div className="h-full min-h-96 w-full">
        <BusMapContainer />
      </div>
    </div>
  );
}
