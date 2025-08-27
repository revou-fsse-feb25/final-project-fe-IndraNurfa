import { Clock, ShieldCheck, Sparkles } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

const FeaturesHomePage = () => {
  return (
    <>
      <section id="how-it-works" className="mx-auto mt-20 max-w-6xl md:mt-28">
        <div className="mb-12 text-center">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            🏆 Why Choose Us
          </Badge>
          <h2 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
            Premium Padel Experience
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Discover what makes Lobby Padel Arena Jakarta&apos;s premier padel
            destination
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="group from-card to-muted/20 h-full border-2 bg-gradient-to-br transition-all duration-300 hover:shadow-xl">
            <CardHeader className="pb-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground rounded-xl p-3 transition-colors">
                  <Sparkles className="size-6" />
                </div>
                <CardTitle className="text-xl">Easy booking</CardTitle>
              </div>
              <CardDescription className="text-base leading-relaxed">
                Book in a few taps with our clean, mobile‑first interface.
                Real-time availability and instant confirmation guaranteed.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group from-card to-muted/20 h-full border-2 bg-gradient-to-br transition-all duration-300 hover:shadow-xl">
            <CardHeader className="pb-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground rounded-xl p-3 transition-colors">
                  <Clock className="size-6" />
                </div>
                <CardTitle className="text-xl">Real‑time slots</CardTitle>
              </div>
              <CardDescription className="text-base leading-relaxed">
                See live court availability updated every minute. Secure your
                preferred time slot instantly with our advanced booking system.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group from-card to-muted/20 h-full border-2 bg-gradient-to-br transition-all duration-300 hover:shadow-xl">
            <CardHeader className="pb-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground rounded-xl p-3 transition-colors">
                  <ShieldCheck className="size-6" />
                </div>
                <CardTitle className="text-xl">Reliable management</CardTitle>
              </div>
              <CardDescription className="text-base leading-relaxed">
                Professional venue management with comprehensive admin tools for
                schedules, user management, and secure payment processing.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    </>
  );
};

export { FeaturesHomePage };
