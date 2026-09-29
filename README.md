# Slate website

A Next.js App Router landing page for Slate by BenchGrid.

## Development

```sh
npm install
npm run dev
```

Open http://127.0.0.1:3000. Run `npm run build` for a production build and `npm run typecheck` for TypeScript validation.

The interactive desktop is a concept demonstration, not a live connection to the OS. Product copy follows the source repository's pre-alpha status. Links point to https://github.com/BenchGrid-dev/slate. The Slate logo mark and both wordmark styles follow the BenchGrid Figma design. The inline BenchGrid wordmark links to https://benchgrid.dev.

Fonts are self-hosted through Fontsource. The meadow image is a locally served image generated with the built-in imagegen tool. See `ASSETS.md` for the generation prompt.

## SEO

The canonical production origin is `https://slate.benchgrid.dev`, defined in `app/site.ts`. The site includes Open Graph and Twitter metadata, a locally generated 1200×630 sharing image, JSON-LD, `/robots.txt`, and `/sitemap.xml`. Vercel preview builds (`VERCEL_ENV=preview`) are marked noindex and excluded from the sitemap.

After deploying the production site, verify domain ownership in Google Search Console and submit `https://slate.benchgrid.dev/sitemap.xml`.
