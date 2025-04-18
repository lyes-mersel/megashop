"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { montserrat } from "@/styles/fonts";
import MobileHeader from "./MobileHeader";
import ProfileCard from "./ProfileCard";
import NavigationMenu from "./NavigationMenu";
import LogoutButton from "@/components/layout/portal/Sidebar/LogoutButton";
import { NavItem, UserInfo } from "@/lib/types/ui/portalSideBar.types";

interface SidebarLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  userInfo: UserInfo;
}

export default function SidebarLayout({
  children,
  navItems,
  userInfo,
}: SidebarLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect if screen is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on load
    checkIfMobile();

    // Add event listener for size changes
    window.addEventListener("resize", checkIfMobile);

    // Clean up listener
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Handle sidebar click
  interface SidebarClickEvent extends React.MouseEvent<HTMLDivElement> {
    target: HTMLElement;
  }

  const handleSidebarClick = (e: SidebarClickEvent) => {
    // On mobile, don't change collapsed state when clicking on sidebar
    if (!isMobile && !e.target.closest("a") && !e.target.closest("button")) {
      setIsCollapsed(!isCollapsed);
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Mobile header */}
      {isMobile && (
        <MobileHeader
          isMobileMenuOpen={isMobileMenuOpen}
          toggleMobileMenu={toggleMobileMenu}
        />
      )}

      {/* Dark overlay for mobile when menu is open */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={`h-full bg-white flex flex-col shadow-lg z-50 border-r border-gray-200 transition-all duration-300 ${
          isMobile
            ? `fixed right-0 top-0 bottom-0 ${
                isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
              } w-3/4 max-w-xs`
            : `${isCollapsed ? "w-20" : "w-64"} fixed cursor-pointer`
        }`}
        onClick={isMobile ? undefined : handleSidebarClick}
      >
        {/* Sidebar header - visible only on mobile or expanded desktop */}
        {(isMobile || !isCollapsed) && (
          <div
            className={`${
              isMobile ? "h-16" : ""
            } flex items-center justify-between px-4 py-3 border-b border-gray-200`}
          >
            {isMobile ? (
              <h2
                className={`${montserrat.variable} font-montserrat text-lg font-bold`}
              >
                Menu
              </h2>
            ) : (
              <div className="h-12 w-full flex items-center justify-center">
                <Link href="/">
                  <Image
                    src="/manifest/favicon.svg"
                    alt="Logo de l'application"
                    width={50}
                    height={50}
                    className="object-contain hover:opacity-80 transition-opacity"
                    priority
                  />
                </Link>
              </div>
            )}
            {isMobile && (
              <button onClick={toggleMobileMenu}>
                <X className="h-6 w-6 text-gray-700" />
              </button>
            )}
          </div>
        )}

        {/* Logo for collapsed desktop only */}
        {!isMobile && isCollapsed && (
          <div className="flex justify-center items-center py-4 border-b border-gray-200">
            <div className="w-50 h-12 flex items-center justify-center">
              <Link href="/">
                <Image
                  src="/manifest/favicon.svg"
                  alt="Logo de l'application"
                  width={50}
                  height={50}
                  className="object-contain hover:opacity-80 transition-opacity"
                  priority
                />
              </Link>
            </div>
          </div>
        )}

        {/* User Profile Card */}
        <ProfileCard
          userInfo={userInfo}
          isMobile={isMobile}
          isCollapsed={isCollapsed}
          montserratVariable={montserrat.variable}
        />

        {/* Navigation Menu */}
        <NavigationMenu
          navItems={navItems}
          isMobile={isMobile}
          isCollapsed={isCollapsed}
          toggleMobileMenu={toggleMobileMenu}
        />

        {/* Logout button */}
        <LogoutButton isMobile={isMobile} isCollapsed={isCollapsed} />
      </div>

      {/* Main content */}
      <div
        className={`w-full transition-all duration-300 h-screen overflow-auto ${
          isMobile
            ? "pt-16" // Space for mobile header
            : isCollapsed
            ? "ml-20"
            : "ml-64"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
