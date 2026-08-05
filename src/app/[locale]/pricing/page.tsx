import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/layout";
import { Check, Shield, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricing" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "pricing" });

  const tiers = [
    {
      key: "free",
      title: t("free_title"),
      price: t("free_price"),
      period: t("free_period"),
      description: t("free_desc"),
      features: [
        t("free_feature_1"),
        t("free_feature_2"),
        t("free_feature_3"),
        t("free_feature_4"),
      ],
      cta: t("free_cta"),
      href: "/submit",
      variant: "outline" as const,
      popular: false,
      isMailto: false,
    },
    {
      key: "vendor",
      title: t("vendor_title"),
      price: t("vendor_price"),
      period: t("vendor_period"),
      description: t("vendor_desc"),
      features: [
        t("vendor_feature_1"),
        t("vendor_feature_2"),
        t("vendor_feature_3"),
        t("vendor_feature_4"),
      ],
      cta: t("vendor_cta"),
      href: "/contact?subject=vendor-portal",
      variant: "primary" as const,
      popular: true,
      isMailto: false,
    },
    {
      key: "enterprise",
      title: t("enterprise_title"),
      price: t("enterprise_price"),
      period: t("enterprise_period"),
      description: t("enterprise_desc"),
      features: [
        t("enterprise_feature_1"),
        t("enterprise_feature_2"),
        t("enterprise_feature_3"),
        t("enterprise_feature_4"),
      ],
      cta: t("enterprise_cta"),
      href: "mailto:hello@alparai.com?subject=Enterprise%20API%20Inquiry",
      variant: "outline" as const,
      popular: false,
      isMailto: true,
    },
  ];

  return (
    <Container size="narrow" className="py-16">
      <div className="mb-12 text-center">
        <span className="bg-brand-500/10 text-brand-400 inline-block rounded-full px-3 py-1 text-xs font-semibold">
          {t("badge")}
        </span>
        <h1 className="text-fg-primary mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
          {t("headline")}
        </h1>
        <p className="text-fg-muted mx-auto mt-4 max-w-2xl text-base leading-relaxed">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {tiers.map((tier) => (
          <Card
            key={tier.key}
            className={`relative flex flex-col justify-between transition-all ${
              tier.popular
                ? "border-brand-500 bg-brand-500/5 shadow-brand-500/10 shadow-lg"
                : "border-border-subtle bg-bg-surface hover:border-border"
            }`}
          >
            {tier.popular && (
              <span className="bg-brand-500 absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-[11px] font-bold tracking-wider text-white uppercase">
                POPULAR
              </span>
            )}
            <CardContent className="flex flex-1 flex-col p-6">
              <div className="mb-6">
                <h3 className="text-fg-primary text-xl font-bold">{tier.title}</h3>
                <p className="text-fg-muted mt-2 min-h-[36px] text-xs leading-relaxed">
                  {tier.description}
                </p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-fg-primary text-4xl font-extrabold">{tier.price}</span>
                  <span className="text-fg-muted text-xs font-medium">{tier.period}</span>
                </div>
              </div>

              <ul className="mb-8 flex-1 space-y-3 text-xs">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="text-fg-secondary flex items-start gap-2">
                    <Check className="text-brand-400 mt-0.5 h-4 w-4 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {tier.isMailto ? (
                <a href={tier.href} className="w-full">
                  <Button
                    variant={tier.variant}
                    className="flex w-full items-center justify-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    <span>{tier.cta}</span>
                  </Button>
                </a>
              ) : (
                <Link href={tier.href} className="w-full">
                  <Button variant={tier.variant} className="w-full justify-center">
                    {tier.cta}
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="border-border-subtle bg-bg-secondary/40 text-fg-muted mt-12 rounded-xl border p-4 text-center text-xs">
        <Shield className="text-brand-400 mx-auto mb-2 h-5 w-5" />
        <p>{t("neutrality_notice")}</p>
      </div>
    </Container>
  );
}
