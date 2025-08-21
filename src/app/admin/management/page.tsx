import { SiteHeader } from "@/components/admin/site-header";

export default function AdminBookingPage() {
  const title = "Service Management";
  return (
    <>
      <SiteHeader title={title} />
      <h1>{title}</h1>
    </>
  );
}
