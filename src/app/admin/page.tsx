"use client";
import { ChartAreaInteractive } from "@/components/admin/chart-area-interactive";
import { DataTable } from "@/components/admin/data-table";
import { SectionCards } from "@/components/admin/section-cards";
import { SiteHeader } from "@/components/admin/site-header";

import data from "./data.json";
import { useSession } from "next-auth/react";

export default function AdminHomePage() {
  const { data: session } = useSession();
  console.log("session", session);

  return (
    <>
      <SiteHeader title={"Dashboard"} />
      {/* Content */}
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
            <DataTable data={data} />
          </div>
        </div>
      </div>
    </>
  );
}
