import type { Metadata } from "next";
import { getContent } from "@/content";
import { LegalDocument } from "@/components/sections/LegalDocument";

const page = getContent().legal.privacy;

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: "/confidentialite" },
};

export default function ConfidentialitePage() {
  return <LegalDocument page={page} />;
}
