import { ImageResponse } from "next/og";
import { getContent } from "@/content";
import { loadOgFonts } from "@/lib/og-fonts";

// Image Open Graph (partages sur les réseaux), générée au build.
export const alt = "Stayphora · Voyez votre location sublimée avant d'investir";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default async function OpengraphImage() {
  const { hero } = getContent();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#FAF8F5",
          color: "#1F1B16",
          fontFamily: "Instrument Serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 52 }}>
            Stayphora<span style={{ color: "#B5785A" }}>.</span>
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#85533B", letterSpacing: 4 }}>
            RENDUS DÉCO PAR IA
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Un mot par span + `columnGap` : pas d'espace parasite en début de ligne. */}
          <div style={{ display: "flex", flexWrap: "wrap", columnGap: 24, fontSize: 96, lineHeight: 1.04, maxWidth: 1000 }}>
            {["Voyez", "votre", "location", "*sublimée*", "avant", "d'investir."].map((word) =>
              word.startsWith("*") ? (
                <span key={word} style={{ fontStyle: "italic", color: "#9A6247" }}>
                  {word.slice(1, -1)}
                </span>
              ) : (
                <span key={word}>{word}</span>
              ),
            )}
          </div>
          <div style={{ display: "flex", marginTop: 36, height: 1, width: 160, background: "#B5785A" }} />
          <div style={{ display: "flex", marginTop: 28, fontSize: 32, color: "#6B645B", maxWidth: 900 }}>
            {hero.subtitle}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: await loadOgFonts() },
  );
}
