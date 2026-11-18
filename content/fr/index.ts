import type { Content } from "../types";
import { site } from "./site";
import { hero, reassurance, howItWorks, audiences, notFound } from "./home";
import { projects } from "./projects";
import { styles } from "./styles";
import { pricing } from "./pricing";
import { testimonials } from "./testimonials";
import { faq } from "./faq";
import { form } from "./form";
import { legal } from "./legal";

export const fr: Content = {
  locale: "fr",
  site,
  hero,
  reassurance,
  projects,
  howItWorks,
  styles,
  audiences,
  pricing,
  testimonials,
  faq,
  form,
  legal,
  notFound,
};
