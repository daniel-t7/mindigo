"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function Hero() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <section className="relative overflow-hidden border-b px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-6 inline-flex items-center rounded-full border bg-muted/50 px-4 py-1.5 text-xs font-medium text-muted-foreground">
          Built for computer science educators
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Create, share, and grade
          <span className="block text-scooter-500 dark:text-scooter-400">
            online tests effortlessly
          </span>
        </h1>

        <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
          testche lets teachers build custom tests with code blocks, images, and
          point-based grading. Students join with a code — no account needed.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button size="lg" className="w-full sm:w-auto" asChild>
            <Link href={isLoaded && isSignedIn ? "/teacher/create-test" : "/sign-up"}>
              Create a Test
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
            <Link href="/student/join">Take a Test</Link>
          </Button>
        </div>
      </div>

      {/*<div className="mx-auto mt-20 max-w-2xl">*/}
      {/*  <div className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border bg-muted/20">*/}
      {/*    {[*/}
      {/*      { value: "500+", label: "Tests Created" },*/}
      {/*      { value: "10K+", label: "Students Graded" },*/}
      {/*      { value: "98%", label: "Satisfaction" },*/}
      {/*    ].map((stat) => (*/}
      {/*      <div*/}
      {/*        key={stat.label}*/}
      {/*        className="flex flex-col items-center gap-1 bg-background py-6"*/}
      {/*      >*/}
      {/*        <span className="text-2xl font-bold tracking-tight text-scooter-600 dark:text-scooter-400">*/}
      {/*          {stat.value}*/}
      {/*        </span>*/}
      {/*        <span className="text-xs text-muted-foreground">{stat.label}</span>*/}
      {/*      </div>*/}
      {/*    ))}*/}
      {/*  </div>*/}
      {/*</div>*/}
    </section>
  );
}
