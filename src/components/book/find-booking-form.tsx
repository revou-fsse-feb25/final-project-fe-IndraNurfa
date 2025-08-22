"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Court } from "@/types";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface FindBookingFormProps {
  initialDate?: string;
  initialCourt?: string;
  loading?: boolean;
  courts: Court[];
  onSearch?: (date?: string, court?: string) => void;
}

export const FindBookingForm = ({
  initialDate,
  initialCourt,
  courts,
  loading = false,
  onSearch,
}: FindBookingFormProps) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(() => {
    if (initialDate) {
      // Parse date string properly to avoid timezone issues
      const [year, month, day] = initialDate.split("-").map(Number);
      return new Date(year, month - 1, day); // month is 0-indexed
    }
    return undefined;
  });
  const [selectedCourt, setSelectedCourt] = useState<string>(
    initialCourt || "any",
  );
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      setSelectedCourt("any");
    } else {
      setSelectedCourt(initialCourt || "any");
    }
  }, [loading, initialCourt]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    const dateStr = date
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
      : undefined;

    if (dateStr) {
      params.set("date", dateStr);
    }
    if (selectedCourt && selectedCourt !== "any") {
      params.set("court", selectedCourt);
    }

    const newUrl = `/book?${params.toString()}`;

    // Call the onSearch callback if provided (for when used within the book page)
    if (onSearch) {
      onSearch(dateStr, selectedCourt !== "any" ? selectedCourt : undefined);
    }

    // If we're already on the book page, replace the current URL
    if (window.location.pathname === "/book") {
      router.replace(newUrl);
    } else {
      router.push(newUrl);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Find a Booking</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Date Picker */}
          <div>
            <Label htmlFor="date">Select Date</Label>
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
          <div>
            <Label htmlFor="court">Choose Court</Label>
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
          <div className="flex items-end">
            <Button
              className="h-12 w-full px-6 text-base font-semibold"
              onClick={handleSearch}
            >
              Search Courts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
