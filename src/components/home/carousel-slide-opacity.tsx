"use client";

import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";

export default function CarouselSlideOpacity() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const images = [
    {
      src: "https://plus.unsplash.com/premium_photo-1708692919998-e3dc853ef8a8?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Padel court at RallyPadel Arena",
    },
    {
      src: "https://images.unsplash.com/photo-1613870930431-a09c7139eb33?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Players enjoying a padel match",
    },
    {
      src: "https://images.unsplash.com/photo-1651140753772-c12fdcd7077d?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Players enjoying a padel match",
    },
    {
      src: "https://images.unsplash.com/photo-1709587824674-78db9795ecf7?q=80&w=3262&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Indoor padel facility",
    },
  ];
  React.useEffect(() => {
    if (!api) {
      return;
    }
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);
  return (
    <div className="relative z-10 container mx-auto items-center justify-center px-4 sm:px-6 md:px-10 lg:max-w-6xl lg:px-16">
      <Carousel
        setApi={setApi}
        className="mx-2 w-full max-w-full md:max-w-4xl"
        opts={{ loop: true }}
        plugins={[
          Autoplay({
            delay: 100000,
          }),
        ]}
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem
              key={index}
              className="basis-full sm:basis-4/5 md:basis-3/5"
            >
              <Card
                className={cn(
                  "overflow-hidden border-0 bg-transparent p-0 shadow-none transition-all duration-500",
                  {
                    "opacity-30": index !== current - 1,
                  },
                )}
              >
                <CardContent className="flex aspect-video items-center justify-center overflow-hidden rounded-xl p-0">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="h-full w-full object-cover"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 -translate-y-1/2 sm:-left-12" />
        <CarouselNext className="right-2 -translate-y-1/2 sm:-right-12" />
      </Carousel>
    </div>
  );
}
