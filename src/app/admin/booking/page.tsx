"use client";

import AdminTableWithPagination from "@/components/admin/booking/admin-table-with-pagination";
import { SiteHeader } from "@/components/admin/site-header";
import { createApiClient } from "@/lib/api";
import { BookingDashboard } from "@/types";
import { signOut, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

function AdminBookingContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingDashboard[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();

  const currentPage = parseInt(searchParams.get("page") || "1");

  const fetchBookings = useCallback(
    async (page: number = 1) => {
      if (!session) return;

      try {
        setLoading(true);
        const client = createApiClient(session);
        const response = await client.get("/bookings/admin", {
          params: { page },
        });

        const bookingsWithDates = response.data.data.map(
          (booking: BookingDashboard) => ({
            ...booking,
            booking_date: new Date(booking.booking_date),
            start_time: new Date(booking.start_time),
            end_time: new Date(booking.end_time),
          }),
        );

        setBookings(bookingsWithDates);
        setHasNextPage(response.data.data.length >= 10);
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
        setLoading(false);
      }
    },
    [session],
  );

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/admin/booking?${params.toString()}`);
  };

  const handleBookingUpdated = () => {
    fetchBookings(currentPage);
  };

  useEffect(() => {
    fetchBookings(currentPage);
  }, [fetchBookings, currentPage]);

  return (
    <div className="bg-background min-h-screen">
      <SiteHeader title="Booking Management" />
      <main className="container mx-auto px-4 lg:px-6">
        <div className="py-10">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Booking Management</h1>
            <p className="mt-2 text-gray-600">
              Manage and review all court bookings. Confirm or cancel pending
              bookings.
            </p>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <p className="text-gray-500">Loading bookings...</p>
            </div>
          ) : (
            <AdminTableWithPagination
              bookings={bookings}
              currentPage={currentPage}
              hasNextPage={hasNextPage}
              onPageChange={handlePageChange}
              session={session}
              onBookingUpdated={handleBookingUpdated}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default function AdminBookingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminBookingContent />
    </Suspense>
  );
}
