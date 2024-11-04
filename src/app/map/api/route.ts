import { getBusRouteData } from "./tfl";
import { getLatLngFromPostcode } from "./postcodes";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchType = searchParams.get("searchType");
  const searchFor = searchParams.get("searchFor");
  const radius = parseInt(searchParams.get("radius") ?? "500");

  if (searchType !== "postcode" && searchType !== "latlng") {
    return new Response(
      "Error: incorrect value for search type. It should be one of 'postcode' or 'latlng",
      { status: 400 }
    );
  }

  if (!searchFor) {
    return new Response("Error: must provide value to seearch for", {
      status: 400,
    });
  }

  let latitude: number;
  let longitude: number;

  if (searchType === "postcode") {
    try {
      const postcodeData = await getLatLngFromPostcode(searchFor);
      latitude = postcodeData.latitude;
      longitude = postcodeData.longitude;
    } catch (error) {
      return new Response(`Error: could not get postcode data - ${error}`, {
        status: 400,
      });
    }
  } else {
    const latlngParts = searchFor.split(",");
    latitude = parseFloat(latlngParts[0]);
    longitude = parseFloat(latlngParts[1]);
  }

  try {
    const data = await getBusRouteData(latitude, longitude, radius);
    return Response.json({ data });
  } catch (error) {
    return new Response(`Error: could not get bus route data - ${error}`, {
      status: 400,
    });
  }
}
