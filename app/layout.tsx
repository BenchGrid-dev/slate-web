import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { siteUrl, isPreview, siteTitle as title, siteDescription as description, structuredData } from "./site";
import "@fontsource-variable/dm-sans";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  alternates: { canonical: siteUrl.href },
  robots: isPreview
    ? { index: false, follow: false }
    : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  title,
  description,
  applicationName: "Slash & Slate OS",
  authors: [{ name: "BenchGrid", url: "https://benchgrid.dev" }],
  creator: "BenchGrid",
  publisher: "BenchGrid",
  openGraph: {
    type: "website",
    url: siteUrl.href,
    locale: "en_US",
    siteName: "Slash & Slate OS",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [{ url: "/opengraph-image", alt: "Slash & Slate OS by BenchGrid — A little less human. A lot more possible." }],
  },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth"><body><a className="skip-link" href="#main">Skip to content</a>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} /><Analytics /></body></html>;
}
