"use client";

import TableUserBooking from "@/components/user/booking/table-with-pagination";
import { SiteHeader } from "@/components/user/site-header";
import { createApiClient } from "@/lib/api";
import { BookingDashboard } from "@/types";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

function UserBookingContent() {
  const title = "My Bookings";
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");

  const [bookings, setBookings] = useState<BookingDashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  const fetchBookings = useCallback(
    async (page: number) => {
      if (!session) return;

      setLoading(true);
      try {
        const api = createApiClient(session);
        const response = await api.get("bookings/user", {
          params: { page },
        });

        setBookings(response.data.data);
        setHasNextPage(response.data.data.length >= 10);
      } catch (error) {
        console.error("Failed to fetch bookings", error);
        const status = (error as { response?: { status?: number } })?.response
          ?.status;
        if (status === 401) {
          setIsUnauthorized(true);
          toast.error("Session expired. Please log in again.");
        } else {
          toast.error("Failed to load bookings");
        }
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [session?.user?.id, session?.accessToken], // Use specific session properties instead of entire session object
  );

  useEffect(() => {
    if (session) {
      fetchBookings(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchBookings, currentPage]); // session is intentionally omitted to prevent infinite loops

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/user/booking?${params.toString()}`);
  };

  if (isUnauthorized) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Access Denied</h1>
          <p className="mb-4 text-gray-600">
            Please log in to view your bookings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SiteHeader title={title} />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="mt-2 text-gray-600">
            Manage and view your court bookings
          </p>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900 dark:border-gray-600 dark:border-t-gray-100"></div>
              <p className="text-gray-900 dark:text-gray-100">
                Loading bookings...
              </p>
            </div>
          </div>
        ) : (
          <TableUserBooking
            bookings={bookings}
            currentPage={currentPage}
            hasNextPage={hasNextPage}
            onPageChange={handlePageChange}
            session={session}
            onBookingUpdated={() => fetchBookings(currentPage)}
          />
        )}
      </div>
    </>
  );
}

export default function UserBooking() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserBookingContent />
    </Suspense>
  );
}
