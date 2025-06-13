import { SignalementStatut } from "@prisma/client";

// Function to determine the status color
export const getStatusColor = (statut: string): string => {
  switch (statut) {
    case SignalementStatut.EN_ATTENTE:
      return "text-amber-600 bg-amber-100";
    case SignalementStatut.TRAITE:
      return "text-green-600 bg-green-100";
    case SignalementStatut.REJETE:
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

// Function to get the French label for the status
export const getStatusLabel = (statut: string): string => {
  switch (statut) {
    case SignalementStatut.EN_ATTENTE:
      return "En attente";
    case SignalementStatut.TRAITE:
      return "Traité";
    case SignalementStatut.REJETE:
      return "Rejeté";
    default:
      return statut;
  }
}; 