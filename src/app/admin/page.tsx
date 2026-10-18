import { getStaffRole } from "@/lib/staff-auth";
import { StaffLoginForm } from "@/components/StaffLoginForm";
import { AdminOrders } from "@/components/AdminOrders";

export default async function AdminPage() {
  const role = await getStaffRole();

  if (role !== "admin") {
    return <StaffLoginForm role="admin" title="Panel de administración" />;
  }

  return <AdminOrders />;
}