import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { BookingDashboard } from "@/types";
import { ChevronDown } from "lucide-react";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface EditBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingDashboard | null;
  session: Session | null;
  onBookingUpdated: () => void;
}

export default function EditBookingModal({
  isOpen,
  onClose,
  booking,
  session,
  onBookingUpdated,
}: EditBookingModalProps) {
  const [editFormData, setEditFormData] = useState({
    booking_date: "",
    start_time: "",
    end_time: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Generate hourly time options (00:00 to 23:00)
  const generateHourlyOptions = () => {
    const options = [];
    for (let i = 0; i < 24; i++) {
      const time = `${i.toString().padStart(2, "0")}:00`;
      options.push({
        value: time,
        label: time,
      });
    }
    return options;
  };

  // Get available end time options based on start time
  const getAvailableEndTimes = (startTime: string) => {
    if (!startTime) return [];

    const startHour = parseInt(startTime.split(":")[0]);
    const options = [];

    // Generate end times from start hour + 1 to 24:00
    for (let i = startHour + 1; i <= 24; i++) {
      const time = i === 24 ? "24:00" : `${i.toString().padStart(2, "0")}:00`;
      options.push({
        value: time,
        label: time,
      });
    }

    return options;
  };

  // Calculate hours between start and end time
  const calculateHours = (startTime: string, endTime: string) => {
    const startHour = parseInt(startTime.split(":")[0]);
    const endHour = endTime === "24:00" ? 24 : parseInt(endTime.split(":")[0]);
    return endHour - startHour;
  };

  // Initialize form data when booking changes
  useEffect(() => {
    if (booking) {
      const bookingDate = new Date(booking.booking_date)
        .toISOString()
        .split("T")[0];

      // Use the same time formatting approach as the table to avoid timezone conversion
      const formatTime = (time: Date | string) => {
        const timeString = typeof time === "string" ? time : time.toISOString();

        // Extract time portion from ISO string (YYYY-MM-DDTHH:MM:SS.sssZ)
        const timeMatch = timeString.match(/T(\d{2}:\d{2})/);
        if (timeMatch) {
          return timeMatch[1]; // Returns HH:MM format directly from backend
        }

        // Fallback: if it's already in time format
        if (typeof time === "string" && time.match(/^\d{2}:\d{2}/)) {
          return time.substring(0, 5); // Return HH:MM
        }

        // Last fallback
        return String(time).substring(0, 5);
      };

      const startTime = formatTime(booking.start_time);
      const endTime = formatTime(booking.end_time);

      // Set the Date object for the calendar
      const dateObj = new Date(booking.booking_date);
      setSelectedDate(dateObj);

      setEditFormData({
        booking_date: bookingDate,
        start_time: startTime,
        end_time: endTime,
      });
    }
  }, [booking]);

  const handleSaveEdit = async () => {
    if (!booking || !session) return;

    // Validate that end time is higher than start time
    const startTime = editFormData.start_time;
    const endTime = editFormData.end_time;

    if (startTime && endTime) {
      const startHour = parseInt(startTime.split(":")[0]);
      const endHour =
        endTime === "24:00" ? 24 : parseInt(endTime.split(":")[0]);

      if (endHour <= startHour) {
        toast.warning("End time must be higher than start time");
        return;
      }
    }

    setIsLoading(true);
    try {
      const api = createApiClient(session);
      await api.patch(`bookings/${booking.uuid}`, editFormData);

      toast.success("Booking updated successfully!");
      onClose();
      onBookingUpdated();
    } catch (error) {
      console.error("Failed to update booking", error);
      const status = (error as { response?: { status?: number } })?.response
        ?.status;
      const errorData = (
        error as {
          response?: { data?: { message?: string; details?: string } };
        }
      )?.response?.data;

      if (status === 401) {
        toast.error("Session expired. Please log in again.");
      } else if (
        errorData?.message === "failed" &&
        errorData?.details === "Court already booked"
      ) {
        toast.error("Court already booked for the selected time slot");
      } else {
        toast.error("Failed to update booking");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartTimeChange = (value: string) => {
    setEditFormData({
      ...editFormData,
      start_time: value,
      end_time: "",
    });
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setCalendarOpen(false);

    if (date) {
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      setEditFormData({
        ...editFormData,
        booking_date: dateStr,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Booking</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label
                htmlFor="booking_date"
                className="mb-2 block text-sm font-medium"
              >
                Booking Date
              </Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="booking_date"
                    className="h-10 w-full justify-between text-left font-normal"
                  >
                    {selectedDate
                      ? selectedDate.toLocaleDateString()
                      : "Choose date"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
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
                        selected={selectedDate}
                        captionLayout="dropdown"
                        onSelect={handleDateSelect}
                        disabled={(d) => !d || d < start || d > end}
                      />
                    );
                  })()}
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="start_time">Start Time</Label>
              <Select
                value={editFormData.start_time}
                onValueChange={handleStartTimeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent>
                  {generateHourlyOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="end_time">End Time</Label>
              <Select
                value={editFormData.end_time}
                onValueChange={(value) =>
                  setEditFormData({ ...editFormData, end_time: value })
                }
                disabled={!editFormData.start_time}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableEndTimes(editFormData.start_time).map(
                    (option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Booking Details Summary */}
          {editFormData.start_time && editFormData.end_time && (
            <div className="bg-muted/20 rounded-lg border p-4">
              <h4 className="mb-3 font-medium">Booking Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Court:</span>
                  <span className="font-medium">{booking?.court?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium">
                    {new Date(editFormData.booking_date).toLocaleDateString(
                      "id-ID",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium">
                    {editFormData.start_time} - {editFormData.end_time}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Hours:</span>
                  <span className="font-medium">
                    {calculateHours(
                      editFormData.start_time,
                      editFormData.end_time,
                    )}{" "}
                    hour
                    {calculateHours(
                      editFormData.start_time,
                      editFormData.end_time,
                    ) > 1
                      ? "s"
                      : ""}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={
                isLoading ||
                !editFormData.booking_date ||
                !editFormData.start_time ||
                !editFormData.end_time
              }
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
