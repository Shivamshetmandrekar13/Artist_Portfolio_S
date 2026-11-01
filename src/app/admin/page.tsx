import type { Metadata } from "next";
import AdminClient from "./AdminClient";

export const metadata: Metadata = {
  title: "Admin — Manage Gallery",
  description: "Admin panel to manage paintings.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminClient />;
}
