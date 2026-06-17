"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import { useTranslations } from "next-intl";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
}

const badgeColors = [
  "bg-scooter-500",
  "bg-scooter-600",
  "bg-scooter-700",
  "bg-scooter-500",
  "bg-scooter-600",
  "bg-scooter-700",
  "bg-scooter-500",
  "bg-scooter-600",
];

const ClientsCarousel = ({
  heading,
}: {
  heading?: string;
}) => {
  const t = useTranslations("landing.clients");
  const schools = t.raw("schools") as string[];
  const displayHeading = heading ?? t("heading");

  return (
    <section className="border-b py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-8 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {displayHeading}
        </p>
        <div className="relative mx-auto max-w-5xl">
          <Carousel
            opts={{ loop: true, dragFree: true }}
            plugins={[AutoScroll({ playOnInit: true, speed: 1 })]}
          >
            <CarouselContent className="ml-0">
              {[...schools, ...schools].map((name, i) => (
                <CarouselItem
                  key={`${name}-${i}`}
                  className="flex basis-auto pl-4"
                >
                  <div className="flex h-12 items-center gap-3 rounded-xl border bg-card px-5 shadow-xs">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white ${badgeColors[i % badgeColors.length]}`}
                    >
                      {getInitials(name)}
                    </span>
                    <span className="whitespace-nowrap text-sm font-medium text-muted-foreground">
                      {name}
                    </span>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export { ClientsCarousel };
