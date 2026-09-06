// SERVER COMPONENT — tidak ada "use client" di sini.
// Tugasnya satu: memeriksa session di database SEBELUM halaman admin dilayani.
// Semua tampilan interaktif dipindah ke components/admin-shell.tsx (client island).

import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import AdminShell from "@/components/admin-shell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // BUG-BE-001 fix: cookie palsu tidak akan cocok dengan token manapun di DB -> redirect
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return <AdminShell>{children}</AdminShell>;
}
