import * as React from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Wordmark } from "./wordmark";
import { Github, Twitter, Mail, Shield } from "lucide-react";
import { Container } from "@/components/ui/layout";

const productLinks = [
  { href: "/incidents", key: "incidents" },
  { href: "/leaderboard", key: "leaderboard" },
  { href: "/suggestions", key: "suggestions" },
  { href: "/submit", key: "submit" },
] as const;

const legalLinks = [
  { href: "/legal/privacy", key: "privacy" },
  { href: "/legal/terms", key: "terms" },
  { href: "/legal/takedown", key: "takedown" },
  { href: "/legal/cookies", key: "cookies" },
] as const;

const aboutLinks = [
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
  { href: "/transparency", key: "transparency" },
] as const;

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border-subtle bg-bg-secondary">
      <Container className="py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Wordmark size="sm" showTagline />
            <p className="text-sm text-fg-muted max-w-xs">
              {t("tagline")}
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/anomalyco/opencode"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-fg-muted hover:bg-bg-tertiary hover:text-fg-primary"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com/alparai"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-fg-muted hover:bg-bg-tertiary hover:text-fg-primary"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="mailto:hello@alparai.online"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-fg-muted hover:bg-bg-tertiary hover:text-fg-primary"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-fg-primary">
              {t("sections.product")}
            </h4>
            <ul className="space-y-2">
              {productLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-fg-muted hover:text-brand-400"
                  >
                    {t(`links.${l.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-fg-primary">
              {t("sections.legal")}
            </h4>
            <ul className="space-y-2">
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-fg-muted hover:text-brand-400"
                  >
                    {t(`links.${l.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-fg-primary">
              {t("sections.about")}
            </h4>
            <ul className="space-y-2">
              {aboutLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-fg-muted hover:text-brand-400"
                  >
                    {t(`links.${l.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-border-subtle pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-fg-muted">
            © {year} ALPAR AI. {t("rights")}
          </p>
          <p className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
            <Shield className="h-3 w-3" aria-hidden="true" />
            {t("platformStatus")}
          </p>
        </div>
      </Container>
    </footer>
  );
}
