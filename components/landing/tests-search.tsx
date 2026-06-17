"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface SearchResult {
  id: string;
  title: string;
  timeLimitMinutes: number;
  code: string;
}

export function TestsSearch() {
  const t = useTranslations("landing.testsSearch");
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  function doSearch(q: string) {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);

    if (q.length < 2) {
      if (results.length) setResults([]);
      if (searched) setSearched(false);
      return;
    }

    setSearching(true);
    timeoutRef.current = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/tests/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults(data.results ?? []);
        setSearched(true);
      } catch {
        setResults([]);
        setSearched(true);
      } finally {
        setSearching(false);
      }
    }, 300);
  }

  function handleChange(value: string) {
    setQuery(value);
    doSearch(value);
  }

  return (
    <section id="search" className="border-b py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("heading")}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {t("description")}
          </p>
        </div>

        <div className="relative mx-auto max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={t("placeholder")}
            className="h-12 pl-11 pr-11 text-base"
          />
          {searching && (
            <Loader2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}
        </div>

        {searched && query.length >= 2 && (
          <div className="mt-8 space-y-3">
            {results.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">
                {t("noResults", { query })}
              </p>
            ) : (
              results.map((test) => (
                <Card key={test.id} className="transition-colors hover:border-accent-brand">
                  <CardContent className="flex items-center justify-between py-4">
                    <div>
                      <h3 className="font-semibold">{test.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t("code")}: {test.code} &middot; {test.timeLimitMinutes} {t("min")}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => router.push(`/student/join?code=${test.code}`)}
                    >
                      {t("joinTest")}
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}
