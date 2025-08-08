import { CallToActionAbout } from "@/components/about/call-to-action";
import { FaqAccordion } from "@/components/about/faq";
import { Features } from "@/components/about/features";
import { Hero } from "@/components/about/hero";
import { Stats } from "@/components/about/stats";

const hero = {
  heading: "Premium Padel Experience",
  description:
    "Discover the ultimate padel destination where passion meets precision. Our state-of-the-art courts, expert coaching, and vibrant community create the perfect environment for players of all levels to elevate their game and enjoy the fastest-growing racquet sport in the world.",
  img: {
    src: "https://plus.unsplash.com/premium_photo-1708692920701-19a470ecd667?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Professional Padel Courts at our Premium Venue",
  },
};

export default function AboutPage() {
  return (
    <div className="bg-background container mx-auto min-h-screen max-w-6xl">
      <Hero
        heading={hero.heading}
        description={hero.description}
        image={hero.img}
      />

      {/* Stats Section */}
      <section className="bg-background py-16">
        <div className="container">
          <Stats />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container">
          <Features />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-background py-20">
        <div className="container mx-auto px-16">
          <FaqAccordion />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-background py-20">
        <CallToActionAbout />
      </section>
    </div>
  );
}
