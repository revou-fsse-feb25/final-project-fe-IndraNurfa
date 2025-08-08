import { Button } from "../ui/button";

const CallToActionAbout = () => {
  return (
    <div className="container text-center">
      <h2 className="mb-6 text-4xl font-bold md:text-5xl">Ready to Play?</h2>
      <p className="mx-auto mb-8 max-w-2xl text-xl">
        Join our community of padel enthusiasts and experience the sport like
        never before.
      </p>
      <div className="flex flex-col justify-center gap-4 sm:flex-row">
        <Button size="lg" variant="secondary" className="px-8 py-3">
          Book Now
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-gray-600 px-8 py-3 hover:bg-white hover:text-blue-600"
        >
          Contact Us
        </Button>
      </div>
    </div>
  );
};

export { CallToActionAbout };
