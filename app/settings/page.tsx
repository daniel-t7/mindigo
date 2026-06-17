"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useUser } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

function getLocaleFromCookie(): string {
  const match = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]*)/);
  return match ? match[1] : "en";
}

const LOCALES = [
  { value: "en", label: "English" },
  { value: "bg", label: "Български" },
];

export default function SettingsPage() {
  const t = useTranslations("appHeader");
  const { isLoaded, user } = useUser();

  if (!isLoaded) return null;
  if (!user) return null;

  const currentLocale = getLocaleFromCookie();

  function handleLocaleChange(value: string) {
    document.cookie = `NEXT_LOCALE=${value}; path=/; max-age=31536000; SameSite=Lax`;
    window.location.reload();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/teacher/dashboard">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">{t("settings")}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("settings")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Language / Език</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Choose your preferred language for the interface.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Label htmlFor="language" className="sr-only">Language</Label>
              <Select value={currentLocale} onValueChange={handleLocaleChange}>
                <SelectTrigger id="language" className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LOCALES.map((locale) => (
                    <SelectItem key={locale.value} value={locale.value}>
                      {locale.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="text-xs text-muted-foreground">
            <p>Profile management is available through the user menu.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
