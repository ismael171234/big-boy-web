import { getStaffRole } from "@/lib/staff-auth";
import { StaffLoginForm } from "@/components/StaffLoginForm";
import { KitchenBoard } from "@/components/KitchenBoard";

export default async function CocinaPage() {
  const role = await getStaffRole();

  if (!role) {
    return <StaffLoginForm role="kitchen" title="Panel de cocina" />;
  }

  return <KitchenBoard />;
}