import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

const CallToActionHome = () => {
  return (
    <section className="mx-auto mt-20 max-w-5xl md:mt-32">
      <Card className="from-primary/5 via-card to-primary/5 border-2 bg-gradient-to-br shadow-xl">
        <CardContent className="p-12 text-center">
          <div className="mb-8">
            <div className="bg-primary/10 text-primary mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full">
              <Zap className="h-8 w-8" />
            </div>
            <h3 className="mb-4 text-3xl font-bold text-balance md:text-4xl">
              Ready to play?
            </h3>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed">
              Reserve your padel court now and get instant confirmation. Bring
              your partner and experience the ultimate padel adventure at
              Jakarta&apos;s premier venue!
            </p>
          </div>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="px-8 py-3 text-base">
              <Link href="/book">
                Start Booking Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3 text-base">
              Contact Our Team
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export { CallToActionHome };
