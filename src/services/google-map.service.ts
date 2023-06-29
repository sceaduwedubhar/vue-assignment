import { Loader } from "@googlemaps/js-api-loader";

export const loader = new Loader({
  apiKey: import.meta.env.VITE_API_KEY,
  version: "weekly",
  libraries: ["places", "maps", "marker"],
});
