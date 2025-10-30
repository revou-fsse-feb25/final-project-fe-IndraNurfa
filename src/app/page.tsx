import { CallToActionHome } from "@/components/home/call-to-action";
import CarouselOpacity from "@/components/home/carousel-slide-opacity";
import { FeaturesHomePage } from "@/components/home/features";
import Health from "@/components/home/health";
import { Hero } from "@/components/home/hero";
import { QuickBookingHome } from "@/components/home/quick-booking";
import { Testimonial } from "@/components/home/testimonial";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lobby Padel Arena — Book Padel Courts",
  description:
    "Book courts at Lobby Padel Arena. Real-time availability, transparent pricing, instant confirmation.",
};

export default function Home() {
  return (
    <main className="container mx-auto px-4 pt-10 pb-16 md:pt-16">
      {/* Check Connection */}
      <Health />

      {/* Gallery */}
      <section className="mx-auto max-w-6xl">
        <CarouselOpacity />
      </section>

      {/* Hero */}
      <Hero />

      {/* Quick Booking */}
      <QuickBookingHome />

      {/* Features */}
      <FeaturesHomePage />

      {/* Testimonial */}
      <Testimonial />

      {/* CTA */}
      <CallToActionHome />
    </main>
  );
}
