"use client";

import { AvailableBookList } from "@/components/book/available-book-list";
import { FindBookingForm } from "@/components/book/find-booking-form";
import { publicApi } from "@/lib/api";
import { AvailableSlot, Court } from "@/types";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";

function BookPageContent() {
  const [available, setAvailable] = useState<AvailableSlot[]>([]);
  const [pricePerHour, setPricePerHour] = useState<number>(0);
  const [courts, setCourts] = useState<Court[]>([]);
  const [searchDate, setSearchDate] = useState<string>("");
  const [searchCourt, setSearchCourt] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const court = searchParams.get("court") || "";
  const date = searchParams.get("date") || "";

  const fetchCourts = async () => {
    try {
      const res = await publicApi.get("/courts");
      setCourts(res.data.data);
    } catch (err) {
      console.error("Failed to fetch courts", err);
    }
  };

  const fetchAvailable = useCallback(
    async (searchDate?: string, searchCourt?: string) => {
      const queryDate = searchDate ?? date;
      const queryCourt = searchCourt ?? court;

      // Prevent duplicate concurrent requests for the same query (court|date)
      const key = `${queryCourt}||${queryDate}`;
      if (inFlightRef.current[key]) return; // already fetching same key

      inFlightRef.current[key] = true;
      setLoading(true);
      try {
        const res = await publicApi.get("/bookings/available", {
          params: { court: queryCourt, date: queryDate },
        });
        setAvailable(res.data.data.available_slots);
        setPricePerHour(res.data.data.price || 0);
      } catch (err) {
        console.error("Failed to fetch available bookings", err);
      } finally {
        setLoading(false);
        // mark finished so future calls for same key are allowed
        inFlightRef.current[key] = false;
      }
    },
    [court, date],
  );

  // track in-flight fetches so duplicate concurrent requests can be ignored
  const inFlightRef = useRef<Record<string, boolean>>({});

  const handleSearch = (newDate?: string, newCourt?: string) => {
    setSearchDate(newDate || "");
    setSearchCourt(newCourt || "");
  };

  useEffect(() => {
    fetchCourts();
  }, []);

  useEffect(() => {
    if (court || date) {
      fetchAvailable();
    }
  }, [court, date, fetchAvailable]);

  return (
    <div className="container mx-auto px-4 pt-2 pb-16 md:pt-16">
      <h1 className="py-8 text-center text-2xl font-bold md:text-3xl">
        Available Bookings
      </h1>
      <FindBookingForm
        initialDate={date}
        initialCourt={court}
        courts={courts}
        loading={loading}
        onSearch={handleSearch}
      />
      <AvailableBookList
        slots={available}
        court={searchCourt || court}
        date={searchDate || date}
        pricePerHour={pricePerHour}
        courts={courts}
        session={session}
        loading={loading}
        onBookingSuccess={() =>
          fetchAvailable(searchDate || date, searchCourt || court)
        }
      />
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookPageContent />
    </Suspense>
  );
}
