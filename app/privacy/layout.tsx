import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("landing.pages.privacy");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
