import {
  Box,
  Building2,
  Check,
  Clock,
  DoorOpen,
  Eye,
  Footprints,
  Globe,
  House,
  KeyRound,
  MapPin,
  MessageCircle,
  MonitorSmartphone,
  Printer,
  QrCode,
  Share2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Sun,
  Upload,
  X,
  type LucideProps,
} from "lucide-react";
import type { IconName } from "@/content/types";

const icons = {
  smartphone: Smartphone,
  upload: Upload,
  box: Box,
  share: Share2,
  clock: Clock,
  devices: MonitorSmartphone,
  qr: QrCode,
  shield: ShieldCheck,
  home: House,
  building: Building2,
  key: KeyRound,
  star: Star,
  globe: Globe,
  message: MessageCircle,
  map: MapPin,
  printer: Printer,
  sun: Sun,
  footprints: Footprints,
  door: DoorOpen,
  eye: Eye,
  sparkles: Sparkles,
  check: Check,
  x: X,
} satisfies Record<IconName, unknown>;

/** Icône Lucide à trait fin, choisie par son nom dans `/content`. */
export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Component = icons[name];
  return <Component strokeWidth={1.25} aria-hidden="true" {...props} />;
}
