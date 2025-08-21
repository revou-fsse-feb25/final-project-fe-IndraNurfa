"use client";

import { DialogDemo } from "@/components/admin/booking/dialog-booking";
import { SiteHeader } from "@/components/admin/site-header";
import { createApiClient } from "@/lib/api";
import { Booking } from "@/types";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import TableBooking from "./table-with-pagination";

export default function AdminBookingPage() {
  const title = "Booking Page";
  const [booking, setBooking] = useState<Booking[]>([]);
  console.table(booking);
  const { data: session, status } = useSession();
  console.log("session", session);
  console.log("status", status);

  const fetchBooking = async () => {
    try {
      const data = await createApiClient(session || undefined).get(
        "bookings/admin",
        { params: { page: 1 } },
      );
      setBooking(data.data);
      console.table(data.data);
    } catch (err) {
      console.error("Failed to fetch courts", err);
    }
  };
  useEffect(() => {
    fetchBooking();
  });
  return (
    <>
      <SiteHeader title={title} />
      <div className="container mx-auto px-4 lg:px-6">
        <div className="py-10">
          <DialogDemo />
        </div>
        {/* <DataTableDemo /> */}
        <div className="">
          <TableBooking bookings={booking} />
        </div>
      </div>
    </>
  );
}
