"use client";

import { useSession } from "next-auth/react";
import { NavItem } from "@/lib/types/ui/portalSideBar.types";
import { getImageUrlFromPublicId } from "@/lib/utils";

// Components
import SidebarLayout from "@/components/layout/portal/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get session data: session !== null bcz we are in a protected route
  const { data: session } = useSession();
  const user = session?.user;

  // Vendor user information
  const vendorInfo = {
    name: `${user?.prenom} ${user?.nom}`,
    email: user?.email as string,
    photoUrl: user?.imagePublicId
      ? getImageUrlFromPublicId(user?.imagePublicId)
      : null,
    role: "Vendeur" as const,
    badgeColor: "bg-green-100 text-green-800",
  };

  // Navigation items
  const navItems: NavItem[] = [
    {
      name: "Tableau de bord",
      href: "/vendor/dashboard",
      iconName: "BarChart2",
    },
    { name: "Boutique", href: "/vendor/store", iconName: "ShoppingBag" },
    { name: "Ventes", href: "/vendor/sells", iconName: "DollarSign" },
    { name: "Commandes", href: "/vendor/orders", iconName: "Package" },
    { name: "Notifications", href: "/vendor/notifications", iconName: "Bell" },
    { name: "Paramètres", href: "/vendor/settings", iconName: "Settings" },
  ];

  return (
    <SidebarLayout navItems={navItems} userInfo={vendorInfo}>
      {children}
    </SidebarLayout>
  );
}
