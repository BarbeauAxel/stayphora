import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Polices TTF pour next/og (satori ne lit pas le woff2).
 * Lues depuis /assets/fonts au BUILD uniquement : les images générées
 * (favicon, Open Graph) sont statiques.
 */
export async function loadOgFonts() {
  const dir = join(process.cwd(), "assets", "fonts");
  const [regular, italic] = await Promise.all([
    readFile(join(dir, "InstrumentSerif-Regular.ttf")),
    readFile(join(dir, "InstrumentSerif-Italic.ttf")),
  ]);
  return [
    { name: "Instrument Serif", data: regular, style: "normal" as const, weight: 400 as const },
    { name: "Instrument Serif", data: italic, style: "italic" as const, weight: 400 as const },
  ];
}
