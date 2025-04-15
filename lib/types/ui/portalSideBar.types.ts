import { IconName } from "@/components/layout/portal/Sidebar/IconMapping";

export type NavItem = {
  name: string;
  href: string;
  iconName: IconName;
};

export type UserInfo = {
  name: string;
  email: string;
  photoUrl: string | null;
  role: "Administrateur" | "Vendeur";
  badgeColor: string;
};
