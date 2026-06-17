"use client"

import { LandingLayout } from "@/components/landing/landing-layout";
import { LandingHeader } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { useTranslations } from "next-intl";

export default function HowItWorksPage() {
  const titleT = useTranslations("landing.footer");
  const t = useTranslations("landing.pages.howItWorks");

  return (
    <LandingLayout>
      <LandingHeader />
      <section className="flex w-full flex-col items-center px-6 py-24">
        <div className="max-w-3xl">
          <h1 className="mb-8 text-4xl font-bold tracking-tight">{titleT("productItems.0")}</h1>

          <div className="space-y-12">
            <div>
              <h2 className="mb-2 text-xl font-semibold">{t("step1Title")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("step1Desc")}</p>
            </div>
            <div>
              <h2 className="mb-2 text-xl font-semibold">{t("step2Title")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("step2Desc")}</p>
            </div>
            <div>
              <h2 className="mb-2 text-xl font-semibold">{t("step3Title")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("step3Desc")}</p>
            </div>
            <div>
              <h2 className="mb-2 text-xl font-semibold">{t("step4Title")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("step4Desc")}</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </LandingLayout>
  );
}
