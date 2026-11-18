import { PHOTO_LIMITS } from "./schemas";

/**
 * Compresse une image dans le navigateur avant l'envoi :
 * redimensionnement à `maxDimension` px sur le plus grand côté, puis JPEG.
 * L'orientation EXIF est respectée (`imageOrientation: "from-image"`).
 *
 * Renvoie l'original si la compression ne le rend pas plus léger
 * (photo déjà petite) ou si le navigateur ne sait pas la décoder.
 */
export async function compressImage(file: File): Promise<File> {
  const { maxDimension, jpegQuality } = PHOTO_LIMITS;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return file;
  }

  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }
  // Fond blanc : les zones transparentes des PNG ne deviennent pas noires en JPEG.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", jpegQuality));
  if (!blob) return file;

  // Ne garde l'original que s'il est déjà conforme (dimensions et format) et plus léger.
  if (blob.size >= file.size && scale === 1 && file.type !== "image/png") return file;

  const baseName = file.name.replace(/\.[^.]+$/, "") || "photo";
  return new File([blob], `${baseName}.jpg`, { type: "image/jpeg", lastModified: Date.now() });
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} Mo`;
}
