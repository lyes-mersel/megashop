"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ICON_MAP } from "./IconMapping";
import { NavItem } from "@/lib/types/ui/portalSideBar.types";

interface NavigationMenuProps {
  navItems: NavItem[];
  isMobile: boolean;
  isCollapsed: boolean;
  toggleMobileMenu: () => void;
}

export default function NavigationMenu({
  navItems,
  isMobile,
  isCollapsed,
  toggleMobileMenu,
}: NavigationMenuProps) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 py-4 overflow-y-auto">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = ICON_MAP[item.iconName];
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center ${
              isMobile ? "px-6 py-4" : "gap-4 py-3 px-6"
            } ${
              isActive
                ? "bg-gray-100 text-black font-medium" +
                  (isMobile ? "" : " border-r-4 border-black")
                : "text-gray-700 hover:bg-gray-50"
            } transition-all duration-200`}
            onClick={isMobile ? toggleMobileMenu : undefined}
          >
            <Icon
              className={`${isMobile ? "h-6 w-6 mr-3" : "h-5 w-5"} ${
                isActive ? "text-black" : "text-gray-500"
              }`}
            />
            {(!isCollapsed || isMobile) && <span>{item.name}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
