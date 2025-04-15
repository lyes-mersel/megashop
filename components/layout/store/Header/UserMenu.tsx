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
        <Button variant="ghost" className="p-1 md:">
          <Image
            priority
            src="/icons/user.svg"
            height={24}
            width={24}
            alt="user"
            className="cursor-pointer max-w-[20px] max-h-[20px] md:max-w-[24px] md:max-h-[24px]"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {session ? (
          <>
            <DropdownMenuItem asChild>
              <Link href="/dashboard">Tableau de bord</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">Paramètres</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              Se déconnecter
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link href="/auth/login">Se connecter</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/auth/register">S&apos;inscrire</Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
