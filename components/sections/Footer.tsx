import Link from "next/link";
import { Mail } from "lucide-react";
import { getContent } from "@/content";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { InstagramIcon, LinkedinIcon } from "@/components/ui/SocialIcons";

export function Footer() {
  const { site } = getContent();
  const year = new Date().getFullYear();

  const linkClass = "text-cream/75 transition-colors duration-300 hover:text-cream";

  return (
    <footer className="bg-ink text-cream">
      <Container size="wide" className="pt-20 pb-10 sm:pt-24">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo variant="light" className="text-4xl" />
            <p className="mt-6 max-w-md leading-relaxed text-cream/70">{site.footerBlurb}</p>
          </div>

          <nav aria-labelledby="footer-nav" className="lg:col-span-3 lg:col-start-7">
            <h2 id="footer-nav" className="label-eyebrow text-clay">
              {site.footerNavTitle}
            </h2>
            <ul className="mt-6 space-y-3">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="label-eyebrow text-clay">{site.footerContactTitle}</h2>
            <ul className="mt-6 space-y-3">
              <li>
                <a href={`mailto:${site.email}`} className={`inline-flex items-center gap-3 ${linkClass}`}>
                  <Mail className="size-4.5" strokeWidth={1.25} aria-hidden="true" />
                  {site.email}
                </a>
              </li>
              <li>
                <a href={site.socials.instagram} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-3 ${linkClass}`}>
                  <InstagramIcon className="size-4.5" />
                  Instagram
                </a>
              </li>
              <li>
                <a href={site.socials.linkedin} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-3 ${linkClass}`}>
                  <LinkedinIcon className="size-4.5" />
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-cream/15 pt-8 text-sm text-cream/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.copyright}
          </p>
          <ul className="flex gap-6">
            {site.legalLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors duration-300 hover:text-cream">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
