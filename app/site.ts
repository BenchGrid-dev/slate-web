export const siteUrl = new URL("https://slate.benchgrid.dev");
export const isPreview = process.env.VERCEL_ENV === "preview";
export const siteTitle = "Slash & SlateOS | A little less human. A lot more possible.";
export const siteDescription = "Meet Slash, a conversational shell, and SlateOS, an open-source Linux desktop built on NixOS. Work alongside AI agents while staying in control. By BenchGrid.";

export const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://benchgrid.dev/#organization",
      name: "BenchGrid",
      url: "https://benchgrid.dev",
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl.href}#website`,
      url: siteUrl.href,
      name: "Slash & SlateOS",
      description: siteDescription,
      inLanguage: "en",
      publisher: { "@id": "https://benchgrid.dev/#organization" },
    },
    {
      "@type": "WebPage",
      "@id": `${siteUrl.href}#webpage`,
      url: siteUrl.href,
      name: siteTitle,
      description: siteDescription,
      inLanguage: "en",
      isPartOf: { "@id": `${siteUrl.href}#website` },
      about: {
        "@type": "SoftwareSourceCode",
        name: "Slash & SlateOS",
        codeRepository: "https://github.com/BenchGrid-dev/slate",
        description: siteDescription,
        license: "https://github.com/BenchGrid-dev/slate/blob/main/LICENSE",
      },
    },
  ],
};
