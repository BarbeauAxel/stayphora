import { Hero } from "@/components/sections/Hero";
import { Reassurance } from "@/components/sections/Reassurance";
import { Projects } from "@/components/sections/Projects";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Styles } from "@/components/sections/Styles";
import { Audiences } from "@/components/sections/Audiences";
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
      <Projects />
      <HowItWorks />
      <Styles />
      <Audiences />
      <Pricing />
      <Testimonials />
      <Faq />
      <QuoteSection />
    </>
  );
}
