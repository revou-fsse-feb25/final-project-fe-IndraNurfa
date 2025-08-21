"use client";

import { SiteHeader } from "@/components/user/site-header";
import { createApiClient } from "@/lib/api";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function UserBookingContent() {
  const title = "Booking User";
  const { data: session } = useSession();

  const searchParams = useSearchParams();
  const page = searchParams.get("page") || 1;

  if (!session) return;

  async function callApi() {
    const data = await createApiClient(session || undefined).get(
      "bookings/user",
      { params: { page } },
    );
    console.log("API result", data);
    console.log("session", session);
  }

  return (
    <>
      <SiteHeader title={title} />
      <h1>{title}</h1>
      <button onClick={callApi}>Call API</button>
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
