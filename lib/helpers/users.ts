import { UserFromDB, UserResponse } from "@/lib/types/user.types";

export function getUserSelect() {
  return {
    id: true,
    email: true,
    nom: true,
    prenom: true,
    tel: true,
    imagePublicId: true,
    emailVerifie: true,
    emailEnAttente: true,
    dateCreation: true,
    role: true,
    adresse: true,
    admin: {
      select: {
        userId: true,
      },
    },
    client: {
      select: {
        vendeur: {
          select: {
            nomBoutique: true,
            description: true,
            NomBanque: true,
            rib: true,
          },
        },
      },
    },
  };
}

export function formatUserData(user: UserFromDB): UserResponse {
  const {
    id,
    email,
    role,
    nom,
    prenom,
    tel,
    imagePublicId,
    emailVerifie,
    emailEnAttente,
    dateCreation,
    adresse,
    client,
  } = user;

  const baseData = {
    id,
    email,
    role,
    nom,
    prenom,
    tel,
    imagePublicId,
    emailVerifie,
    emailEnAttente,
    dateCreation,
    adresse,
  };

  if (role === "VENDEUR") {
    return {
      ...baseData,
      vendeur: client?.vendeur
        ? {
            nomBoutique: client.vendeur.nomBoutique,
            description: client.vendeur.description,
            NomBanque: client.vendeur.NomBanque,
            rib: client.vendeur.rib,
          }
        : undefined,
    };
  }

  return baseData;
}
