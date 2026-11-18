import { ImageResponse } from "next/og";
import { loadOgFonts } from "@/lib/og-fonts";

// Icône iOS (écran d'accueil). Générée au build.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default async function AppleIcon() {
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
          color: "#B5785A",
          fontFamily: "Instrument Serif",
          fontSize: 150,
          lineHeight: 1,
          paddingBottom: 10,
        }}
      >
        S
      </div>
    ),
    { ...size, fonts: await loadOgFonts() },
  );
}
