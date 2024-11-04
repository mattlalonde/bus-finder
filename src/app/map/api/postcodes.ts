export async function getLatLngFromPostcode(postcode: string) {
  const postcodeDataRequest = await fetch(
    `https://api.postcodes.io/postcodes/${postcode}`
  );

  if (!postcodeDataRequest.ok) {
    throw new Error("request not ok");
  }

  const { result } = await postcodeDataRequest.json();
  const latitude = result.latitude;
  const longitude = result.longitude;

  return { latitude, longitude };
}
