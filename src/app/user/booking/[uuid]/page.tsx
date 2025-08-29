"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { HeaderBookingDetail } from "@/components/user/booking/details/header";
import { SiteHeader } from "@/components/user/site-header";
import { createApiClient } from "@/lib/api";
import { BookingDetail } from "@/types";
import { CalendarDays, Clock, CreditCard, Hash, MapPin } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function BookingDetailPage() {
  const { uuid } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookingDetail = async () => {
      if (!session || !uuid) return;

      setLoading(true);
      try {
        const api = createApiClient(session);
        const response = await api.get(`bookings/${uuid}`);
        setBooking(response.data.data);
      } catch (error) {
        console.error("Failed to fetch booking detail", error);
        const status = (error as { response?: { status?: number } })?.response
          ?.status;

        if (status === 401) {
          toast.error("Session expired. Please log in again.");
          const currentUrl = window.location.href;
          router.push(`/login?callbackUrl=${encodeURIComponent(currentUrl)}`);
        } else if (status === 404) {
          setError("Booking not found");
        } else {
          setError("Failed to load booking details");
        }
      } finally {
        setLoading(false);
      }
    };

    if (session && uuid) {
      fetchBookingDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id, session?.accessToken, uuid]);

  const getStatusBadge = (status: string) => {
    const statusColors = {
      CONFIRMED: "bg-green-100 text-green-800 border-green-200",
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      CANCELED: "bg-red-100 text-red-800 border-red-200",
    };
    return (
      <Badge
        variant="outline"
        className={
          statusColors[status as keyof typeof statusColors] ||
          "border-gray-200 bg-gray-100 text-gray-800"
        }
      >
        {status}
      </Badge>
    );
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (time: Date | string) => {
    // Convert to string to extract raw time without timezone conversion
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

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  if (loading) {
    return (
      <>
        <SiteHeader title="Booking Details" />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Skeleton className="mb-4 h-6 w-64" />
            <Skeleton className="h-8 w-96" />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  if (error || !booking) {
    return (
      <>
        <SiteHeader title="Booking Details" />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold">Error</h1>
            <p className="text-gray-600">{error || "Booking not found"}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <HeaderBookingDetail uuid={booking.uuid} />
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Booking Details</h1>
              <p className="mt-2 text-gray-600">
                View your booking information and status
              </p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(booking.status)}
            </div>
          </div>
        </div>

        {/* Booking Information Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* General Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                General Information
              </CardTitle>
              <CardDescription>
                Basic booking details and identification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Booking ID
                </span>
                <span className="font-mono text-sm">{booking.uuid}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Status
                </span>
                {getStatusBadge(booking.status)}
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Name</span>
                <span className="text-sm">{booking.details.name}</span>
              </div>
              <Separator />
              {booking.cancel_reason && (
                <>
                  <Separator />
                  <div className="flex items-start justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Cancel Reason
                    </span>
                    <span className="text-sm text-red-600">
                      {booking.cancel_reason}
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Court & Schedule Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Court & Schedule
              </CardTitle>
              <CardDescription>
                Court details and booking schedule
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Court</span>
                <span className="font-medium">{booking.court.name}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm font-medium text-gray-600">
                  <CalendarDays className="h-4 w-4" />
                  Date
                </span>
                <span className="font-medium">
                  {formatDate(booking.booking_date)}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm font-medium text-gray-600">
                  <Clock className="h-4 w-4" />
                  Time
                </span>
                <span className="font-medium">
                  {formatTime(booking.start_time)} -{" "}
                  {formatTime(booking.end_time)}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Duration
                </span>
                <span className="font-medium">
                  {booking.details.total_hour} hour
                  {booking.details.total_hour > 1 ? "s" : ""}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
              <CardDescription>
                Booking cost and payment details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Total Hours
                </span>
                <span className="font-medium">
                  {booking.details.total_hour} hour
                  {booking.details.total_hour > 1 ? "s" : ""}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Total Price
                </span>
                <span className="text-primary text-lg font-bold">
                  {formatPrice(booking.details.total_price)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
