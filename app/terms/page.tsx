"use client"

import { LandingLayout } from "@/_components/landing/landing-layout";
import { LandingHeader } from "@/_components/landing/header";
import { Footer } from "@/_components/landing/footer";
import { useTranslations } from "next-intl";

export default function TermsPage() {
  const titleT = useTranslations("landing.footer");
  const t = useTranslations("landing.pages.terms");

  return (
    <LandingLayout>
      <LandingHeader />
      <section className="flex w-full flex-col items-center px-6 py-24">
        <div className="max-w-3xl">
          <h1 className="mb-8 text-4xl font-bold tracking-tight">{titleT("companyItems.1")}</h1>

          <div className="space-y-8 text-muted-foreground leading-relaxed text-sm">
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">{t("s1Title")}</h2>
              <p>{t("s1Desc")}</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">{t("s2Title")}</h2>
              <p>{t("s2Desc")}</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">{t("s3Title")}</h2>
              <p>{t("s3Desc")}</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">{t("s4Title")}</h2>
              <p>{t("s4Desc")}</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">{t("s5Title")}</h2>
              <p>{t("s5Desc")}</p>
            </section>
          </div>
        </div>
      </section>
      <Footer />
    </LandingLayout>
  );
}
