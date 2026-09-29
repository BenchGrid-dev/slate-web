import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Slash & Slate OS by BenchGrid — A little less human. A lot more possible.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default async function OpenGraphImage() {
  const [background, mark, serif, italic] = await Promise.all([
    readFile(join(process.cwd(), "public/slate-meadow.jpg")),
    readFile(join(process.cwd(), "public/slate-logo-mark.svg")),
    readFile(join(process.cwd(), "node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff")),
    readFile(join(process.cwd(), "node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff")),
  ]);
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#19352f", backgroundColor: "#eff4ed" }}>
      <img src={`data:image/jpeg;base64,${background.toString("base64")}`} alt="" width={1200} height={630} style={{ position: "absolute", objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,.84), rgba(255,255,255,.48))" }} />
      <div style={{ display: "flex", alignItems: "center", marginBottom: 34, fontSize: 28 }}>
        <img src={`data:image/svg+xml;base64,${mark.toString("base64")}`} alt="" width={20} height={20} style={{ marginRight: 10 }} />
        <span>Slash &amp; Slate OS</span><span style={{ fontSize: 19, marginLeft: 16, color: "#526a60" }}>by BenchGrid</span>
      </div>
      <div style={{ display: "flex", fontFamily: "Instrument Serif", fontSize: 94, lineHeight: 1.06 }}>A little less <span style={{ fontStyle: "italic", color: "#28766b", marginLeft: 17 }}>human.</span></div>
      <div style={{ display: "flex", fontFamily: "Instrument Serif", fontSize: 94, lineHeight: 1.06 }}>A lot more possible.</div>
      <div style={{ display: "flex", marginTop: 34, fontSize: 23, color: "#526a60" }}>An open-source shell and desktop for humans and AI agents.</div>
    </div>,
    { ...size, fonts: [
      { name: "Instrument Serif", data: serif, weight: 400, style: "normal" },
      { name: "Instrument Serif", data: italic, weight: 400, style: "italic" },
    ] },
  );
}
