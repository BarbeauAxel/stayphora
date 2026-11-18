import Image from "next/image";
import type { Image as ImageType, TourUiContent } from "@/content/types";

/** Écran de chargement : couverture floutée + progression réelle du téléchargement. */
export function TourLoading({
  cover,
  progress,
  ui,
}: {
  cover: ImageType;
  progress: number | null;
  ui: TourUiContent;
}) {
  const percent = progress === null ? null : Math.round(Math.min(1, Math.max(0, progress)) * 100);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <Image src={cover.src} alt="" fill sizes="100vw" className="scale-105 object-cover blur-md" aria-hidden="true" />
      <div className="absolute inset-0 bg-ink/60" />
      <div className="relative w-[min(20rem,80%)] text-center text-cream">
        <p className="font-serif text-2xl sm:text-3xl">{percent === null ? ui.loadingUnknown : ui.loading}</p>
        <div
          role="progressbar"
          aria-label={ui.loading}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent ?? undefined}
          className="mt-6 h-[3px] w-full overflow-hidden rounded-full bg-white/20"
        >
          {percent === null ? (
            <div className="h-full w-1/3 animate-[tour-indeterminate_1.4s_ease-in-out_infinite] rounded-full bg-clay" />
          ) : (
            <div
              className="h-full rounded-full bg-clay transition-[width] duration-300 ease-out"
              style={{ width: `${percent}%` }}
            />
          )}
        </div>
        <p className="mt-3 text-sm text-cream/75 tabular-nums">{percent === null ? "…" : `${percent} %`}</p>
      </div>
    </div>
  );
}
