import { ReportFromDB, ReportFromAPI } from "@/lib/types/report.types";

export function getReportSelect() {
  return {
    id: true,
    objet: true,
    text: true,
    statut: true,
    date: true,
    client: {
      select: {
        user: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            imagePublicId: true,
            role: true,
          },
        },
      },
    },
    produit: {
      select: { id: true, nom: true },
    },
  };
}

export function formatReportData(report: ReportFromDB): ReportFromAPI {
  return {
    id: report.id,
    objet: report.objet ?? null,
    text: report.text ?? null,
    statut: report.statut as string,
    date: report.date!,
    client: report.client
      ? {
          id: report.client.user.id,
          nom: report.client.user.nom,
          prenom: report.client.user.prenom,
          email: report.client.user.email,
          imagePublicId: report.client.user.imagePublicId,
          role: report.client.user.role,
        }
      : null,
    produit: report.produit
      ? { id: report.produit.id, nom: report.produit.nom }
      : null,
  };
}
