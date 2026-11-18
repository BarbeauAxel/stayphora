import { ImageResponse } from "next/og";
import { loadOgFonts } from "@/lib/og-fonts";

// Favicon : « S » en Instrument Serif, couleur argile sur fond crème. Généré au build.
export const size = { width: 64, height: 64 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default async function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAF8F5",
          borderRadius: 14,
          color: "#B5785A",
          fontFamily: "Instrument Serif",
          fontSize: 56,
          lineHeight: 1,
          paddingBottom: 4,
        }}
      >
        S
      </div>
    ),
    { ...size, fonts: await loadOgFonts() },
  );
}
