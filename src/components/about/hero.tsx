interface HeroProps {
  badge?: string;
  heading: string;
  description: string;
  buttons?: {
    primary?: {
      text: string;
      url: string;
    };
    secondary?: {
      text: string;
      url: string;
    };
  };
  image: {
    src: string;
    alt: string;
  };
}

const Hero = ({
  heading = "Blocks Built With Shadcn & Tailwind",
  description = "Finely crafted components built with React, Tailwind and Shadcn UI. Developers can copy and paste these blocks directly into their project.",
  image = {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
    alt: "Hero section demo image showing interface components",
  },
}: HeroProps) => {
  return (
    <section className="relative container mx-auto overflow-hidden px-16 py-24 lg:py-32">
      <div className="relative container">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            {/* <Badge
              variant="outline"
              className="mb-6 border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
            >
              ⚡ Premium Padel Venue
              <ArrowUpRight className="ml-2 size-4" />
            </Badge> */}

            <h1 className="from-foreground via-primary to-primary/80 mb-6 bg-gradient-to-r bg-clip-text text-5xl leading-tight font-bold text-transparent md:text-6xl lg:text-7xl">
              {heading}
            </h1>

            <p className="text-muted-foreground mb-8 max-w-2xl text-lg leading-relaxed md:text-xl">
              {description}
            </p>

            {/* <div className="flex w-full flex-col gap-4 sm:flex-row lg:justify-start">
              <Button size="lg" className="w-full px-8 py-3 sm:w-auto">
                Book Your Court
                <ArrowRight className="ml-2 size-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full px-8 py-3 sm:w-auto"
              >
                Take a Tour
              </Button>
            </div> */}
          </div>

          <div className="relative">
            <div className="absolute inset-0 rotate-6 transform rounded-2xl bg-gradient-to-r from-blue-400 to-green-400 opacity-20"></div>
            <img
              src={image.src}
              alt={image.alt}
              className="relative h-[500px] w-full transform rounded-2xl object-cover shadow-2xl transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero };
