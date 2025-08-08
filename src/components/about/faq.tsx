import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "../ui/badge";

const items = [
  {
    title: "Do I need to bring my own equipment?",
    content:
      "No worries! We provide high-quality padel rackets and balls for all skill levels. You can also rent or purchase premium equipment from our pro shop.",
  },
  {
    title: "What skill levels do you accommodate?",
    content:
      "From complete beginners to professional players! We offer lessons, group classes, and have courts suitable for all skill levels with certified instructors.",
  },
  {
    title: "How do I book a court?",
    content:
      "Easy! Book online through our website, call us directly, or use our mobile app. We recommend booking in advance, especially for peak hours and weekends.",
  },
  {
    title: "Do you offer coaching and lessons?",
    content:
      "Absolutely! We have certified padel coaches offering private lessons, group classes, and intensive training programs for players of all levels.",
  },
];

export function FaqAccordion() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-16 text-center">
        <Badge variant="outline" className="mb-4 px-4 py-2">
          Got Questions?
        </Badge>
        <h2 className="text-foreground mb-4 text-4xl font-bold md:text-5xl">
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground text-xl">
          Everything you need to know about our padel courts and services
        </p>
      </div>
      <Accordion type="single" collapsible className="w-full space-y-4">
        {items.map(({ title, content }, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            //   className="bg-card rounded-lg border px-6 transition-shadow hover:shadow-md"
          >
            <AccordionTrigger className="text-card-foreground py-6 text-left text-xl font-semibold hover:no-underline">
              {title}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
              {content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
