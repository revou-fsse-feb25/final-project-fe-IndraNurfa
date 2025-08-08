import { Clock, MapPin, Users } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: MapPin,
      title: "Prime Location",
      description:
        "Conveniently located in the heart of the city with easy parking and public transport access.",
    },
    {
      icon: Clock,
      title: "Flexible Hours",
      description:
        "Open 7 days a week from 6 AM to 11 PM to fit your busy schedule.",
    },
    {
      icon: Users,
      title: "Community Events",
      description:
        "Regular tournaments, social events, and leagues to connect with fellow padel enthusiasts.",
    },
  ];

  return (
    <>
      <div className="mb-12 text-center">
        <h2 className="text-foreground mb-4 text-4xl font-bold">
          Why Choose Our Venue?
        </h2>
        <p className="text-muted-foreground mx-auto max-w-3xl text-xl">
          We&apos;re not just another sports facility. We&apos;re a community
          dedicated to growing the sport of padel.
        </p>
      </div>
      <div className="my-16 grid gap-8 px-16 md:grid-cols-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-card rounded-xl border p-6 text-center transition-all duration-300 hover:shadow-lg"
          >
            <div className="bg-primary/10 text-primary mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg">
              <feature.icon className="h-6 w-6" />
            </div>
            <h3 className="text-card-foreground mb-2 text-xl font-semibold">
              {feature.title}
            </h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export { Features };
