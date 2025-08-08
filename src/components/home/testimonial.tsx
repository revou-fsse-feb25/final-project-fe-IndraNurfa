import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Star } from "lucide-react";

const Testimonial = () => {
  return (
    <div className="container mx-auto px-2 lg:px-32">
      <section className="mx-auto mt-20 max-w-5xl text-center md:mt-28">
        <div className="mb-6">
          <h1 className="from-foreground via-primary to-primary/80 mb-4 bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            What Our Players Say
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg md:text-xl">
            Join thousands of satisfied players who have made RallyPadel their
            home court
          </p>
        </div>
      </section>
      <section className="py-20">
        <div className="container">
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 items-stretch gap-x-0 gap-y-4 lg:grid-cols-3 lg:gap-4">
              <img
                src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0"
                alt="Happy padel player at RallyPadel Arena"
                className="h-72 w-full rounded-xl border-2 object-cover shadow-lg lg:h-auto"
              />
              <Card className="col-span-2 flex items-center justify-center border-2 p-8 shadow-lg">
                <div className="flex flex-col gap-6">
                  <q className="text-foreground text-xl leading-relaxed font-medium lg:text-3xl">
                    RallyPadel Arena has completely transformed my padel
                    experience! The courts are pristine, the booking system is
                    seamless, and the community here is fantastic. I&apos;ve
                    improved my game significantly since joining.
                  </q>
                  <div className="flex flex-col items-start">
                    <p className="text-lg font-semibold">Maria Rodriguez</p>
                    <p className="text-muted-foreground">
                      Professional Padel Coach & Tournament Player
                    </p>
                    <div className="mt-2 flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                      <span className="text-muted-foreground ml-2 text-sm">
                        5.0/5
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <Card className="border-2 transition-shadow hover:shadow-lg">
                <CardContent className="text-foreground/80 px-6 pt-6 leading-7">
                  <q>
                    The best padel facility in Jakarta! Modern courts, excellent
                    lighting, and the staff is incredibly professional. Booking
                    online is so convenient.
                  </q>
                </CardContent>
                <CardFooter>
                  <div className="flex gap-4 leading-5">
                    <Avatar className="ring-primary/20 size-10 rounded-full ring-2">
                      <AvatarImage
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                        alt="David Chen"
                      />
                    </Avatar>
                    <div className="text-sm">
                      <p className="font-semibold">David Chen</p>
                      <p className="text-muted-foreground">
                        Weekend Warrior • 2 years member
                      </p>
                      <div className="mt-1 flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-3 w-3 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardFooter>
              </Card>

              <Card className="border-2 transition-shadow hover:shadow-lg">
                <CardContent className="text-foreground/80 px-6 pt-6 leading-7">
                  <q>
                    &quot;Amazing venue with top-quality courts. The coaching
                    here helped me reach the next level. Highly recommend for
                    players of all skill levels!&quot;
                  </q>
                </CardContent>
                <CardFooter>
                  <div className="flex gap-4 leading-5">
                    <Avatar className="ring-primary/20 size-10 rounded-full ring-2">
                      <AvatarImage
                        src="https://images.unsplash.com/photo-1494790108755-2616b332446c?w=150&h=150&fit=crop&crop=face"
                        alt="Sarah Kim"
                      />
                    </Avatar>
                    <div className="text-sm">
                      <p className="font-semibold">Sarah Kim</p>
                      <p className="text-muted-foreground">
                        Tournament Player • 3 years member
                      </p>
                      <div className="mt-1 flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-3 w-3 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardFooter>
              </Card>

              <Card className="border-2 transition-shadow hover:shadow-lg">
                <CardContent className="text-foreground/80 px-6 pt-6 leading-7">
                  <q>
                    Perfect location, perfect courts, perfect service! The
                    community events and tournaments make this place special.
                    Couldn&apos;t ask for more!
                  </q>
                </CardContent>
                <CardFooter>
                  <div className="flex gap-4 leading-5">
                    <Avatar className="ring-primary/20 size-10 rounded-full ring-2">
                      <AvatarImage
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                        alt="Alex Martinez"
                      />
                    </Avatar>
                    <div className="text-sm">
                      <p className="font-semibold">Alex Martinez</p>
                      <p className="text-muted-foreground">
                        Business Executive • 1 year member
                      </p>
                      <div className="mt-1 flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-3 w-3 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export { Testimonial };
