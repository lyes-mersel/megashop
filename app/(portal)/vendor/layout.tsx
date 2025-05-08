import SidebarLayout from "@/components/layout/portal/Sidebar";
import { NavItem } from "@/lib/types/ui/portalSideBar.types";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Vendor user information
  const vendorInfo = {
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
    photoUrl: null,
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
    { name: "Boutique", href: "/vendor/shop", iconName: "ShoppingBag" },
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
