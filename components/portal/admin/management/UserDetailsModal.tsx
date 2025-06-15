import { UserFromAPI } from "@/lib/types/user.types";
import { getImageUrlFromPublicId, extractDateString } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

interface UserDetailsModalProps {
  user: UserFromAPI | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserDetailsModal({
  user,
  isOpen,
  onClose,
}: UserDetailsModalProps) {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Détails de l&apos;utilisateur</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            {user.imagePublicId ? (
              <Image
                src={getImageUrlFromPublicId(user.imagePublicId)}
                alt={`${user.prenom} ${user.nom}`}
                width={80}
                height={80}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                <span className="text-2xl font-medium">
                  {user.prenom[0]}
                  {user.nom[0]}
                </span>
              </div>
            )}
            <div>
              <h3 className="text-xl font-semibold">
                {user.prenom} {user.nom}
              </h3>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Informations personnelles</h4>
              <div className="space-y-2">
                <p>
                  <span className="text-muted-foreground">Téléphone:</span>{" "}
                  {user.tel || "Non renseigné"}
                </p>
                <p>
                  <span className="text-muted-foreground">Date d&apos;inscription:</span>{" "}
                  {extractDateString(user.dateCreation)}
                </p>
                <p>
                  <span className="text-muted-foreground">Email vérifié:</span>{" "}
                  {user.emailVerifie ? "Oui" : "Non"}
                </p>
              </div>
            </div>

            {user.adresse && (
              <div>
                <h4 className="font-medium mb-2">Adresse</h4>
                <div className="space-y-2">
                  <p>{user.adresse.rue}</p>
                  <p>
                    {user.adresse.codePostal} {user.adresse.ville}
                  </p>
                  <p>{user.adresse.wilaya}</p>
                </div>
              </div>
            )}

            {user.vendeur && (
              <div className="col-span-2">
                <h4 className="font-medium mb-2">Informations vendeur</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p>
                      <span className="text-muted-foreground">Nom de la boutique:</span>{" "}
                      {user.vendeur.nomBoutique}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Description:</span>{" "}
                      {user.vendeur.description || "Non renseignée"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p>
                      <span className="text-muted-foreground">Banque:</span>{" "}
                      {user.vendeur.nomBanque}
                    </p>
                    <p>
                      <span className="text-muted-foreground">RIB:</span>{" "}
                      {user.vendeur.rib}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 