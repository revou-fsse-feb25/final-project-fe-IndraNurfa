import { ArrowRight, MapPin } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="mx-auto mt-16 max-w-5xl text-center md:mt-20">
      <div className="mb-6 flex items-center justify-center gap-3">
        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary border-primary/20 px-4 py-2 text-sm font-medium"
        >
          ⚡ Lobby Padel Arena
        </Badge>
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4" />
          <span>Jakarta • 6 Premium Courts</span>
        </div>
      </div>

      <h1 className="from-foreground via-primary to-primary/80 mb-6 bg-gradient-to-r bg-clip-text text-5xl leading-tight font-bold text-transparent md:text-7xl">
        Play your best game today
      </h1>

      <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-balance md:text-xl">
        Book a court in seconds with real‑time availability and instant
        confirmation. Experience premium padel at Jakarta&apos;s finest venue.
      </p>

      <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
        <Link href="#book">
          <Button size="lg" className="px-8 py-3 text-base">
            Book Your Court
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <Button variant="outline" size="lg" className="px-8 py-3 text-base">
          View Facilities
        </Button>
      </div>
    </section>
  );
};

export { Hero };
