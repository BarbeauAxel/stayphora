import { Hand } from "lucide-react";

/** Indice animé « glissez pour explorer », affiché au premier chargement. */
export function DragHint({ label }: { label: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
      <div className="flex animate-fade-in flex-col items-center gap-3 rounded-2xl bg-ink/45 px-6 py-5 text-cream backdrop-blur-sm">
        <Hand className="size-8 animate-[tour-drag_2.4s_ease-in-out_infinite]" strokeWidth={1.25} />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
}
