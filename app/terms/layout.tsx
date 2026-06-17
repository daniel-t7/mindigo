import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("landing.pages.terms");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
