"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

// UI components
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const UserMenu = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast("Déconnexion réussie");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      toast("Erreur lors de la déconnexion");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-1 md:p-2">
          <Image
            priority
            src="/icons/user.svg"
            height={30}
            width={30}
            alt="user"
            className="cursor-pointer w-auto h-[24px] sm:h-[26px] md:h-[28px] lg:h-[30px]"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {session ? (
          session.user.role === "ADMIN" ? (
            <>
              <DropdownMenuItem asChild>
                <Link href="/admin/dashboard">Portail Admin</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                Se déconnecter
              </DropdownMenuItem>
            </>
          ) : session.user.role === "VENDEUR" ? (
            <>
              <DropdownMenuItem asChild>
                <Link href="/vendor/dashboard">Portail Vendeur</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                Se déconnecter
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem asChild>
                <Link href="/client/settings">Paramètres</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/client/notifications">Notifications</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/client/orders">Commandes</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                Se déconnecter
              </DropdownMenuItem>
            </>
          )
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link href="/auth/register">S&apos;inscrire</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/auth/login">Se connecter</Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
