"use client"

import { LandingLayout } from "@/_components/landing/landing-layout";
import { LandingHeader } from "@/_components/landing/header";
import { Footer } from "@/_components/landing/footer";
import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";

export default function ContactPage() {
  const titleT = useTranslations("landing.footer");
  const t = useTranslations("landing.pages.contact");

  return (
    <LandingLayout>
      <LandingHeader />
      <section className="flex w-full flex-col items-center px-6 py-24">
        <div className="max-w-3xl">
          <h1 className="mb-8 text-4xl font-bold tracking-tight">{titleT("companyItems.0")}</h1>

          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>{t("description")}</p>
            <a
              href="mailto:hello@testche.app"
              className="inline-flex items-center gap-2 text-foreground underline underline-offset-4"
            >
              <Mail className="h-4 w-4" />
              {t("email")}
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </LandingLayout>
  );
}
