"use client"

import { LandingLayout } from "@/_components/landing/landing-layout";
import { LandingHeader } from "@/_components/landing/header";
import { Footer } from "@/_components/landing/footer";
import { useTranslations } from "next-intl";

export default function PricingPage() {
  const titleT = useTranslations("landing.footer");
  const t = useTranslations("landing.pages.pricing");

  return (
    <LandingLayout>
      <LandingHeader />
      <section className="flex w-full flex-col items-center px-6 py-24">
        <div className="max-w-3xl">
          <h1 className="mb-8 text-4xl font-bold tracking-tight">{titleT("productItems.1")}</h1>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="border border-dotted rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-2">{t("freeTitle")}</h2>
              <p className="text-3xl font-bold mb-6">{t("freePrice")}</p>
              <ul className="space-y-3 text-muted-foreground text-sm">
                <li>{t("free1")}</li>
                <li>{t("free2")}</li>
                <li>{t("free3")}</li>
                <li>{t("free4")}</li>
              </ul>
            </div>
            <div className="border border-dotted rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-2">{t("proTitle")}</h2>
              <p className="text-3xl font-bold mb-6">{t("proPrice")}</p>
              <ul className="space-y-3 text-muted-foreground text-sm">
                <li>{t("pro1")}</li>
                <li>{t("pro2")}</li>
                <li>{t("pro3")}</li>
                <li>{t("pro4")}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </LandingLayout>
  );
}
