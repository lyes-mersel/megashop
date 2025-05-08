import { CommandeStatut } from "@prisma/client";

// Fonction pour déterminer la couleur du statut
export const getStatusColor = (statut: string): string => {
  switch (statut) {
    case CommandeStatut.EN_ATTENTE:
      return "text-amber-600 bg-amber-100";
    case CommandeStatut.EXPEDIEE:
      return "text-blue-600 bg-blue-100";
    case CommandeStatut.LIVREE:
      return "text-green-600 bg-green-100";
    case CommandeStatut.ANNULEE:
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

// Fonction pour obtenir le libellé en français du statut
export const getStatusLabel = (statut: string): string => {
  switch (statut) {
    case CommandeStatut.EN_ATTENTE:
      return "En attente";
    case CommandeStatut.EXPEDIEE:
      return "Expédiée";
    case CommandeStatut.LIVREE:
      return "Livrée";
    case CommandeStatut.ANNULEE:
      return "Annulée";
    default:
      return statut;
  }
};
