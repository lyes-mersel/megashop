"use client";

import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  isCollapsed: boolean;
  isMobile: boolean;
}

export default function LogoutButton({
  isCollapsed,
  isMobile,
}: LogoutButtonProps) {
  return (
    <div className="p-4 border-t border-gray-200">
      <button
        className={`flex items-center ${
          isMobile
            ? "px-6 py-4 gap-3"
            : `${isCollapsed ? "justify-center px-2" : "gap-4 px-6"} py-3`
        } w-full text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 rounded-lg`}
        onClick={(e) => {
          e.stopPropagation();
          // TODO: Logout logic
        }}
      >
        <LogOut className={`${isMobile ? "h-6 w-6" : "h-5 w-5"}`} />
        {(!isCollapsed || isMobile) && <span>Déconnexion</span>}
      </button>
    </div>
  );
}
