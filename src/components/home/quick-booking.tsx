"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createApiClient } from "@/lib/api";
import { Court } from "@/types";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const QuickBookingHome = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [courts, setCourts] = useState<Court[]>([]);
  const [selectedCourt, setSelectedCourt] = useState<string>("any");
  const router = useRouter();

  const fetchCourts = useCallback(async () => {
    try {
      const api = createApiClient();
      const res = await api.get("/courts");
      setCourts(res.data.data);
    } catch (err) {
      console.error("Failed to fetch courts", err);
    }
  }, []);

  const handleSearchCourts = () => {
    const params = new URLSearchParams();
    const dateStr = date
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
      : undefined;

    if (!date || selectedCourt === "any") {
      toast.warning("Please select both date and court");
      return;
    }

    if (dateStr) {
      params.set("date", dateStr);
    }

    if (selectedCourt && selectedCourt !== "any") {
      params.set("court", selectedCourt);
    }

    router.push(`/book?${params.toString()}`);
  };

  useEffect(() => {
    fetchCourts();
  }, [fetchCourts]);

  return (
    <section
      aria-labelledby="quick-booking"
      className="container mx-auto mt-16 max-w-5xl md:mt-24 md:max-w-6xl lg:px-16"
      id="book"
    >
      <Card className="from-card to-muted/30 border-2 bg-gradient-to-br shadow-xl">
        <CardHeader className="gap-3 pb-6 text-center md:text-left">
          <div className="flex items-center justify-center gap-3 md:justify-start">
            <div className="bg-primary/10 text-primary rounded-lg p-2">
              <CalendarDays className="h-5 w-5" />
            </div>
            <CardTitle id="quick-booking" className="text-2xl md:text-3xl">
              Quick booking
            </CardTitle>
          </div>
          <CardDescription className="text-base md:text-lg">
            Pick a date and court to see live availability and secure your spot
            instantly.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {/* Date Picker */}
            <div className="col-span-1 sm:col-span-2 md:col-span-1">
              <Label htmlFor="date" className="mb-2 block text-sm font-medium">
                Select Date
              </Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date"
                    className="h-12 w-full justify-between border-2 px-4 text-left text-base font-normal"
                  >
                    {date ? date.toLocaleDateString() : "Choose date"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[min(20rem,90vw)] overflow-hidden p-0"
                  align="start"
                >
                  {(() => {
                    const start = new Date();
                    start.setDate(start.getDate() + 1);
                    start.setHours(0, 0, 0, 0);
                    const end = new Date(start);
                    end.setMonth(end.getMonth() + 1);
                    end.setHours(23, 59, 59, 999);

                    return (
                      <Calendar
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        onSelect={(d) => {
                          setDate(d);
                          setOpen(false);
                        }}
                        disabled={(d) => !d || d < start || d > end}
                      />
                    );
                  })()}
                </PopoverContent>
              </Popover>
            </div>

            {/* Court Selector */}
            <div className="col-span-1 sm:col-span-1 md:col-span-1">
              <Label className="mb-2 block text-sm font-medium">
                Choose Court
              </Label>
              <Select
                value={selectedCourt}
                onValueChange={(value) => setSelectedCourt(value)}
              >
                <SelectTrigger className="h-12 w-full border-2 px-4 text-base">
                  <SelectValue placeholder="Any court" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any available court</SelectItem>
                  {courts.map((court) => (
                    <SelectItem key={court.id} value={court.slug}>
                      {court.name} - {court.master_court_types.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search Button */}
            <div className="flex items-end sm:col-span-2 md:col-span-1 lg:col-span-1">
              <Button
                className="h-12 w-full px-6 text-base font-semibold"
                onClick={handleSearchCourts}
              >
                Search Courts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="justify-center pt-4 md:justify-start">
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <ShieldCheck className="h-4 w-4 text-green-600" />
            <span>
              No account needed to search. Instant confirmation on booking.
            </span>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
};

export { QuickBookingHome };
