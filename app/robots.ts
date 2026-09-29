import type { MetadataRoute } from "next";
import { siteUrl, isPreview } from "./site";

export default function robots(): MetadataRoute.Robots {
  return isPreview
    ? { rules: { userAgent: "*", disallow: "/" } }
    : { rules: { userAgent: "*", allow: "/" }, sitemap: new URL("/sitemap.xml", siteUrl).href };
}
