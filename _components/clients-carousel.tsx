"use client";

import Image from "next/image";
import AutoScroll from "embla-carousel-auto-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/_components/ui/carousel";

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const clients = [
  { name: "Acme Corp", logo: "/clients/acme.svg" },
  { name: "Globex", logo: "/clients/globex.svg" },
  { name: "Initech", logo: "/clients/initech.svg" },
  { name: "Umbrella", logo: "/clients/umbrella.svg" },
  { name: "Hooli", logo: "/clients/hooli.svg" },
  { name: "Soylent", logo: "/clients/soylent.svg" },
  { name: "Vehement", logo: "/clients/vehement.svg" },
  { name: "Stark Industries", logo: "/clients/stark.svg" },
];

export function ClientsCarousel() {
  return (
    <Carousel
      opts={{ loop: true, align: "start" }}
      plugins={[
        AutoScroll({
          playOnInit: true,
          speed: 0.8,
          stopOnInteraction: false,
          stopOnMouseEnter: true,
          stopOnFocusIn: true,
        }),
      ]}
      className="w-full"
    >
      <CarouselContent className="-ml-4">
        {[...clients, ...clients].map((client, index) => (
          <CarouselItem
            key={`${client.name}-${index}`}
            className="basis-1/2 pl-4 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
          >
            <div className="flex h-16 items-center justify-center gap-2 rounded-lg border border-border/50 bg-background/60 px-4">
              {client.logo ? (
                <Image
                  src={client.logo}
                  alt={client.name}
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                  {getInitials(client.name)}
                </div>
              )}
              <span className="text-sm text-muted-foreground">{client.name}</span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
