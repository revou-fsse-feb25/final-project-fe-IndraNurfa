"use client";

import { SiteHeader } from "@/components/admin/site-header";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { createApiClient } from "@/lib/api";
import { BookingDetail } from "@/types";
import {
  CalendarDays,
  Check,
  Clock,
  CreditCard,
  Hash,
  MapPin,
  X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminBookingDetailPage() {
  const { uuid } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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
          router.push("/login");
        } else if (status === 404) {
          setError("Booking not found");
        } else {
          setError("Failed to load booking details");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetail();
  }, [session, uuid, router]);

  const handleConfirmBooking = async () => {
    if (!booking || !session) return;

    setActionLoading("confirm");
    try {
      const client = createApiClient(session);
      await client.patch(`/bookings/confirm/${booking.uuid}`);

      toast.success("Booking confirmed successfully");
      // Refresh booking data
      const response = await client.get(`bookings/${uuid}`);
      setBooking(response.data.data);
    } catch (error) {
      console.error("Error confirming booking:", error);
      const errorMessage =
        (error as { response?: { data?: { details?: string } } })?.response
          ?.data?.details || "Error confirming booking";
      toast.error(errorMessage);

      const status = (error as { response?: { status?: number } })?.response
        ?.status;

      if (status === 401) {
        toast.error("Session expired. Please login again.");
        setTimeout(() => {
          signOut({ callbackUrl: "/login" });
        }, 2000);
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelBooking = async () => {
    if (!booking || !session) return;

    setActionLoading("cancel");
    try {
      const client = createApiClient(session);
      await client.patch(`/bookings/cancel/${booking.uuid}`);

      toast.success("Booking canceled successfully");
      // Refresh booking data
      const response = await client.get(`bookings/${uuid}`);
      setBooking(response.data.data);
    } catch (error) {
      console.error("Error confirming booking:", error);
      const errorMessage =
        (error as { response?: { data?: { details?: string } } })?.response
          ?.data?.details || "Error confirming booking";
      toast.error(errorMessage);

      const status = (error as { response?: { status?: number } })?.response
        ?.status;

      if (status === 401) {
        toast.error("Session expired. Please login again.");
        setTimeout(() => {
          signOut({ callbackUrl: "/login" });
        }, 2000);
      }
    } finally {
      setActionLoading(null);
    }
  };

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
    return new Date(time).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  if (!session) {
    return (
      <div className="bg-background min-h-screen">
        <SiteHeader title="Booking Details" />
        <main className="container mx-auto p-6">
          <div className="flex h-64 items-center justify-center">
            <p className="text-gray-500">Please login to access admin panel</p>
          </div>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-background min-h-screen">
        <SiteHeader title="Booking Details" />
        <main className="container mx-auto px-4 lg:px-6">
          <div className="py-10">
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
        </main>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="bg-background min-h-screen">
        <SiteHeader title="Booking Details" />
        <main className="container mx-auto px-4 lg:px-6">
          <div className="py-10">
            <div className="text-center">
              <h1 className="mb-4 text-2xl font-bold">Error</h1>
              <p className="text-gray-600">{error || "Booking not found"}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <SiteHeader title="Booking Details" />
      <main className="container mx-auto px-4 lg:px-6">
        <div className="py-10">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/booking">Booking</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{uuid}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Booking Details</h1>
                <p className="mt-2 text-gray-600">
                  Review booking information and manage status
                </p>
              </div>
              <div className="flex items-center gap-4">
                {getStatusBadge(booking.status)}
                {booking.status === "PENDING" && (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleConfirmBooking}
                      disabled={actionLoading === "confirm"}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      {actionLoading === "confirm"
                        ? "Confirming..."
                        : "Confirm"}
                    </Button>
                    <Button
                      onClick={handleCancelBooking}
                      disabled={actionLoading === "cancel"}
                      variant="destructive"
                    >
                      <X className="mr-2 h-4 w-4" />
                      {actionLoading === "cancel" ? "Canceling..." : "Cancel"}
                    </Button>
                  </div>
                )}
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
                  <span className="text-sm font-medium text-gray-600">
                    Name
                  </span>
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
                  <span className="text-sm font-medium text-gray-600">
                    Court
                  </span>
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
      </main>
    </div>
  );
}
