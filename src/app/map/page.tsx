import { BusMapContainer } from "./busMapContainer";
import { BusRouteInfoFormContainer } from "./BusRouteInfoFormContainer";

export default async function Map() {
  return (
    <div className="w-full flex flex-col gap-5 grow justify-items-start">
      <BusRouteInfoFormContainer />
      <div className="h-full min-h-96 w-full">
        <BusMapContainer />
      </div>
    </div>
  );
}
