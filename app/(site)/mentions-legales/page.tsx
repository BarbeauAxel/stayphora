import type { Metadata } from "next";
import { getContent } from "@/content";
import { LegalDocument } from "@/components/sections/LegalDocument";

const page = getContent().legal.mentions;

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegalesPage() {
  return <LegalDocument page={page} />;
}
