"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface LogoutButtonProps {
  isCollapsed: boolean;
  isMobile: boolean;
}

export default function LogoutButton({
  isCollapsed,
  isMobile,
}: LogoutButtonProps) {
  const router = useRouter();

  return (
    <div className="p-4 border-t border-gray-200">
      <button
        className={`flex items-center ${
          isMobile
            ? "px-6 py-4 gap-3"
            : `${isCollapsed ? "justify-center px-2" : "gap-4 px-6"} py-3`
        } w-full text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 rounded-lg`}
        onClick={async (e) => {
          e.stopPropagation();
          // Logout logic
          try {
            await signOut({ redirect: false });
            toast("Déconnexion réussie");
            router.push("/");
            router.refresh();
          } catch (error) {
            console.error("Logout failed:", error);
            toast("Erreur lors de la déconnexion");
          }
        }}
      >
        <LogOut className={`${isMobile ? "h-6 w-6" : "h-5 w-5"}`} />
        {(!isCollapsed || isMobile) && <span>Déconnexion</span>}
      </button>
    </div>
  );
}
