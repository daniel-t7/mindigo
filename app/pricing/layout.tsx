import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("landing.pages.pricing");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
