import { UserFromAPI, ClientStats, VendorStats } from "@/lib/types/user.types";
import { extractDateString, getImageUrlFromPublicId } from "@/lib/utils";
import { MoreHorizontal, MessageSquare } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface UserTableProps {
  users: (UserFromAPI & { stats: ClientStats | VendorStats })[];
  onViewDetails: (user: UserFromAPI) => void;
  onSendMessage: (user: UserFromAPI) => void;
  type: "client" | "vendor";
}

export default function UserTable({
  users = [],
  onViewDetails,
  onSendMessage,
  type,
}: UserTableProps) {
  if (!users || users.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center text-muted-foreground">
        Aucun {type === "client" ? "client" : "vendeur"} trouvé
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Utilisateur
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Date d&apos;inscription
            </th>
            {type === "vendor" && (
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Boutique
              </th>
            )}
            {type === "vendor" && (
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Total ventes
              </th>
            )}
            {type === "client" && (
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Total commandes
              </th>
            )}
            {type === "client" && (
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Total dépenses
              </th>
            )}
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  {user.imagePublicId ? (
                    <Image
                      width={40}
                      height={40}
                      src={getImageUrlFromPublicId(user.imagePublicId)}
                      alt={`${user.prenom} ${user.nom}`}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-lg font-medium">
                        {user.prenom[0]}
                        {user.nom[0]}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium">
                      {user.prenom} {user.nom}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
              </td>
              <td className="p-4">{extractDateString(user.dateCreation)}</td>
              {type === "vendor" && (
                <td className="p-4">{user.vendeur?.nomBoutique}</td>
              )}
              {type === "vendor" && (
                <td className="p-4">
                  {((user.stats as VendorStats)?.totalVentes || 0).toLocaleString()} DZD
                </td>
              )}
              {type === "client" && (
                <td className="p-4">{(user.stats as ClientStats)?.totalCommandes || 0}</td>
              )}
              {type === "client" && (
                <td className="p-4">
                  {((user.stats as ClientStats)?.totalDepenses || 0).toLocaleString()} DZD
                </td>
              )}
              <td className="p-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewDetails(user)}>
                      Voir les détails
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSendMessage(user)}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Envoyer un message
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
