import type { MetadataRoute } from "next";
import { siteUrl, isPreview } from "./site";

export default function sitemap(): MetadataRoute.Sitemap {
  return isPreview ? [] : [{ url: siteUrl.href }];
}
