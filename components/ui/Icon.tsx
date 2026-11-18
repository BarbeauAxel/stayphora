import {
  Building2,
  Camera,
  Clock,
  Download,
  House,
  KeyRound,
  Palette,
  Paintbrush,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  type LucideProps,
} from "lucide-react";
import type { IconName } from "@/content";

const icons = {
  camera: Camera,
  palette: Palette,
  sparkles: Sparkles,
  download: Download,
  home: House,
  building: Building2,
  key: KeyRound,
  clock: Clock,
  brush: Paintbrush,
  refresh: RefreshCw,
  shield: ShieldCheck,
} satisfies Record<IconName, unknown>;

/** Icône Lucide à trait fin, choisie par son nom dans `/content`. */
export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Component = icons[name];
  return <Component strokeWidth={1.25} aria-hidden="true" {...props} />;
}
