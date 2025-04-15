import SidebarLayout from "@/components/layout/portal/Sidebar";
import { NavItem } from "@/lib/types/ui/portalSideBar.types";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Seller user information
  const sellerInfo = {
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
      href: "/seller/dashboard",
      iconName: "BarChart2",
    },
    { name: "Boutique", href: "/seller/shop", iconName: "ShoppingBag" },
    { name: "Ventes", href: "/seller/sells", iconName: "DollarSign" },
    { name: "Commandes", href: "/seller/orders", iconName: "Package" },
    { name: "Notifications", href: "/seller/notifications", iconName: "Bell" },
    { name: "Paramètres", href: "/seller/settings", iconName: "Settings" },
  ];

  return (
    <SidebarLayout navItems={navItems} userInfo={sellerInfo}>
      {children}
    </SidebarLayout>
  );
}
