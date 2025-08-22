"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { createApiClient } from "@/lib/api";
import { AvailableSlot, Court } from "@/types";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

interface AvailableBookListProps {
  slots: AvailableSlot[];
  court: string;
  date: string;
  pricePerHour: number;
  courts: Court[];
  session: Session | null;
  loading?: boolean;
  onBookingSuccess: () => void;
}

export const AvailableBookList: React.FC<AvailableBookListProps> = ({
  slots,
  court,
  date,
  pricePerHour,
  courts,
  session,
  loading = false,
  onBookingSuccess,
}: AvailableBookListProps) => {
  const router = useRouter();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [selectedEndTime, setSelectedEndTime] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const slotsArray = Array.isArray(slots) ? slots : [];
  const availableSlots = slotsArray.filter((slot) => slot.is_available);

  // Helper function to get court display name
  const getCourtDisplayName = () => {
    const foundCourt = courts.find((c) => c.slug === court);
    return foundCourt
      ? `${foundCourt.name} - ${foundCourt.master_court_types.name}`
      : court;
  };

  // this skeleton not show if its still loading
  if (loading) {
    // Show 9 skeleton cards as a placeholder
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(9)].map((_, i) => (
          <Card
            key={i}
            className="bg-card dark:border-zinc-800 dark:bg-zinc-900"
          >
            <CardHeader>
              <Skeleton className="mb-2 h-6 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="mb-2 h-4 w-3/4" />
              <Skeleton className="mb-2 h-4 w-1/2" />
              <Skeleton className="h-8 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (availableSlots.length === 0 && !loading) {
    return (
      <Card className="bg-card text-center dark:border-zinc-800 dark:bg-zinc-900">
        <CardContent className="p-6">
          <span className="text-muted-foreground dark:text-zinc-400">
            No available slots for this date and court.
          </span>
        </CardContent>
      </Card>
    );
  }

  // Calculate total hours and price
  const calculateHours = (startTime: string, endTime: string) => {
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  };

  const calculateTotalPrice = (startTime: string, endTime: string) => {
    const hours = calculateHours(startTime, endTime);
    return hours * pricePerHour;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Get available end times for multi-hour booking
  const getAvailableEndTimes = (startTime: string) => {
    const startIndex = availableSlots.findIndex(
      (slot) => slot.start_time === startTime,
    );
    if (startIndex === -1) return [];

    const endTimes = [];
    for (let i = startIndex; i < availableSlots.length; i++) {
      const slot = availableSlots[i];
      if (!slot.is_available) break;
      endTimes.push(slot.end_time);
    }
    return endTimes;
  };

  const handleBookNow = (slot: AvailableSlot) => {
    if (session === null) {
      toast.info("You need to be logged in to book a slot");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      return;
    }

    setSelectedSlot(slot);
    setSelectedEndTime(slot.end_time);
    setCustomerName(session?.user?.name || "");
    setIsBookingOpen(true);
  };

  const handleBooking = async () => {
    if (!selectedSlot || !selectedEndTime || !customerName.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const api = createApiClient(session || undefined);
      const payload = {
        court_slug: court,
        booking_date: date,
        start_time: selectedSlot.start_time,
        end_time: selectedEndTime,
        name: customerName.trim(),
      };

      await api.post("/bookings", payload);

      toast.success("Booking created successfully!");
      setIsBookingOpen(false);
      onBookingSuccess(); // Refresh available slots

      // Reset form
      setSelectedSlot(null);
      setSelectedEndTime("");
      setCustomerName("");
    } catch (error) {
      console.error("Failed to create booking", error);
      const errorMessage =
        (error as { response?: { data?: { details?: string } } })?.response
          ?.data?.details || "Failed to create booking";
      toast.error(errorMessage);
      const status = (error as { response?: { status?: number } })?.response
        ?.status;
      if (status === 401) {
        toast.error("Session expired. Please log in again.");
        setTimeout(() => {
          signOut({ callbackUrl: "/login" });
        }, 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {availableSlots.map((slot, idx) => (
          <Card
            key={idx}
            className="border-primary/20 bg-card flex h-full flex-col justify-between shadow-md dark:border-zinc-800 dark:bg-zinc-900"
          >
            <CardHeader>
              <CardTitle className="text-lg font-semibold dark:text-white">
                {slot.start_time} - {slot.end_time}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground mb-2 text-sm dark:text-zinc-400">
                Available for booking
              </div>
              <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                {formatPrice(pricePerHour)}/hour
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleBookNow(slot)}
                className="bg-primary hover:bg-primary/90 inline-flex w-full items-center rounded-md px-4 py-2 font-medium text-white shadow transition-colors dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
              >
                Book Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Book Time Slot</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="start-time">Start Time</Label>
              <Input
                id="start-time"
                value={selectedSlot?.start_time || ""}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end-time">End Time</Label>
              <Select
                value={selectedEndTime}
                onValueChange={setSelectedEndTime}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent>
                  {selectedSlot &&
                    getAvailableEndTimes(selectedSlot.start_time).map(
                      (endTime) => (
                        <SelectItem key={endTime} value={endTime}>
                          {endTime}
                        </SelectItem>
                      ),
                    )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customer-name">Customer Name</Label>
              <Input
                id="customer-name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
              />
            </div>
            <div className="grid gap-2">
              <Label>Booking Details</Label>
              <div className="text-muted-foreground space-y-1 text-sm">
                <p>Court: {getCourtDisplayName()}</p>
                <p>Date: {date}</p>
                <p>
                  Duration:{" "}
                  {selectedSlot && selectedEndTime
                    ? `${selectedSlot.start_time} - ${selectedEndTime}`
                    : "N/A"}
                </p>
                {selectedSlot && selectedEndTime && (
                  <>
                    <p>
                      Hours:{" "}
                      {calculateHours(selectedSlot.start_time, selectedEndTime)}{" "}
                      hour(s)
                    </p>
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                      Total:{" "}
                      {formatPrice(
                        calculateTotalPrice(
                          selectedSlot.start_time,
                          selectedEndTime,
                        ),
                      )}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsBookingOpen(false)}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBooking}
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? "Booking..." : "Confirm Booking"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
