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
        id: true,
        vendeur: {
          select: {
            id: true,
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
    nom,
    prenom,
    tel,
    imagePublicId,
    emailVerifie,
    dateCreation,
    role,
    adresse,
    client,
  } = user;

  const baseData = {
    id,
    email,
    nom,
    prenom,
    tel,
    imagePublicId,
    emailVerifie,
    dateCreation,
    role,
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
