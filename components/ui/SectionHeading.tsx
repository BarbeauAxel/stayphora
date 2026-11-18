import { cn } from "@/lib/cn";
import { RichText } from "./RichText";
import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  id?: string;
  className?: string;
}

/** Label en petites capitales + grand titre serif (h2) + description. */
export function SectionHeading({ eyebrow, title, description, align = "left", id, className }: SectionHeadingProps) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <p className="label-eyebrow text-clay-deep">{eyebrow}</p>
      <h2 id={id} className="mt-5 font-serif text-[2.6rem] leading-[1.05] tracking-[-0.01em] text-balance sm:text-5xl lg:text-6xl">
        <RichText text={title} />
      </h2>
      {description && (
        <p className={cn("mt-6 text-base leading-relaxed text-stone text-pretty sm:text-lg", align === "center" && "mx-auto max-w-2xl")}>
          {description}
        </p>
      )}
    </Reveal>
  );
}
