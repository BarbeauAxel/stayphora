import { Hero } from "@/components/sections/Hero";
import { Reassurance } from "@/components/sections/Reassurance";
import { DemoSection } from "@/components/sections/DemoSection";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Benefits } from "@/components/sections/Benefits";
import { Share } from "@/components/sections/Share";
import { Audiences } from "@/components/sections/Audiences";
import { Projects } from "@/components/sections/Projects";
import { Pricing } from "@/components/sections/Pricing";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { QuoteSection } from "@/components/sections/QuoteSection";
import { JsonLd } from "@/components/ui/JsonLd";
import { homeStructuredData } from "@/lib/structured-data";

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeStructuredData()} />
      <Hero />
      <Reassurance />
      <DemoSection />
      <HowItWorks />
      <Benefits />
      <Share />
      <Audiences />
      <Projects />
      <Pricing />
      <Testimonials />
      <Faq />
      <QuoteSection />
    </>
  );
}
