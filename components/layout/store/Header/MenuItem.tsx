"use client";

import Link from "next/link";

// UI Components
import {
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

// Utils
import { cn } from "@/lib/utils";

type MenuItemProps = {
  label: string;
  url?: string;
};

export function MenuItem({ label, url }: MenuItemProps) {
  return (
    <NavigationMenuItem>
      <Link href={url ?? "/"} legacyBehavior passHref>
        <NavigationMenuLink
          className={cn([navigationMenuTriggerStyle(), "font-normal text-sm lg:text-base px-3"])}
        >
          {label}
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  );
}
