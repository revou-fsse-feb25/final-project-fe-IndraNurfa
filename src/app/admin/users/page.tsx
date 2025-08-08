import { SiteHeader } from "@/components/admin/site-header";

export default function AdminUsersPage() {
  const title = "Users Management";
  return (
    <>
      <SiteHeader title={title} />
      <h1>{title}</h1>
    </>
  );
}
