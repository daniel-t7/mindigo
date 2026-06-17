import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("landing.pages.about");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
