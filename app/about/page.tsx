"use client"

import { LandingLayout } from "@/components/landing/landing-layout";
import { LandingHeader } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { useTranslations } from "next-intl";

export default function AboutPage() {
  const titleT = useTranslations("landing.footer");
  const t = useTranslations("landing.pages.about");

  return (
    <LandingLayout>
      <LandingHeader />
      <section className="flex w-full flex-col items-center px-6 py-24">
        <div className="max-w-3xl">
          <h1 className="mb-8 text-4xl font-bold tracking-tight">{titleT("productItems.2")}</h1>

          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>{t("p1")}</p>
            <p>{t("p2")}</p>
            <p>{t("p3")}</p>
          </div>
        </div>
      </section>
      <Footer />
    </LandingLayout>
  );
}
