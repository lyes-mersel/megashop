"use client";

import Link from "next/link";
import Image from "next/image";
import { Bell, Menu, X } from "lucide-react";

interface MobileHeaderProps {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

export default function MobileHeader({
  isMobileMenuOpen,
  toggleMobileMenu,
}: MobileHeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white z-50 border-b border-gray-200 flex items-center justify-between px-4 shadow-sm">
      <div className="flex items-center">
        <Link href="/">
          <Image
            src="/manifest/favicon.svg"
            alt="Logo de l'application"
            width={50}
            height={50}
            className="object-contain"
            priority
          />
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification badge */}
        <Link href="/admin/notifications" className="relative">
          <Bell className="h-6 w-6 text-gray-700" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
            3
          </span>
        </Link>

        {/* Hamburger button */}
        <button
          className="p-1 rounded-md hover:bg-gray-100"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-700" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700" />
          )}
        </button>
      </div>
    </div>
  );
}
