import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CircleCheck } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "ALPHA",
    price: 300000,
    description:
      "Enjoy our outdoor padel courts with natural lighting and fresh air experience.",
    features: [
      "Outdoor padel court access",
      "Natural lighting",
      "Fresh air environment",
      "Standard equipment included",
      "Court maintenance included",
      "Free parking available",
    ],
    buttonText: "Book Outdoor Court",
  },
  {
    name: "BETA",
    price: 500000,
    isRecommended: true,
    description:
      "Premium indoor padel courts with climate control and professional lighting.",
    features: [
      "Indoor padel court access",
      "Climate controlled environment",
      "Professional LED lighting",
      "Premium equipment included",
      "Locker room access",
      "Refreshment area access",
      "Priority booking system",
    ],
    buttonText: "Book Premium Indoor Court",
    isPopular: true,
  },
];

const Pricing = () => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };
  return (
    <div className="container mx-auto flex min-h-screen flex-col px-6 pt-10">
      <h1 className="text-center text-5xl font-bold tracking-tight">Pricing</h1>
      <div className="mx-auto mt-12 grid max-w-screen-lg grid-cols-1 gap-8 lg:grid-cols-2">
        {plans.map((plan) => (
          <div key={plan.name} className="flex flex-col rounded-lg border p-6">
            <h3 className="text-lg font-medium">{plan.name}</h3>
            <p className="mt-2 text-4xl font-bold">{formatPrice(plan.price)}</p>
            <p className="text-muted-foreground mt-4 font-medium">
              {plan.description}
            </p>
            <Separator className="my-4" />
            <ul className="flex-grow space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <CircleCheck className="mt-1 h-4 w-4 text-green-600" />{" "}
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              variant={plan.isPopular ? "default" : "outline"}
              size="lg"
              className="mt-6 w-full"
              asChild
            >
              <Link href="/#book">{plan.buttonText}</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
