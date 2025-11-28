// frontend/src/sanityClient.ts
import { createClient } from "@sanity/client";
import {
  createImageUrlBuilder,
} from "@sanity/image-url";

const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  apiVersion: "2025-11-27",
  useCdn: false, // must be false for write operations
  token: import.meta.env.VITE_SANITY_WRITE_TOKEN,
});

const builder = createImageUrlBuilder(sanityClient);

export const urlFor = (source: any) => builder.image(source);

export default sanityClient;
