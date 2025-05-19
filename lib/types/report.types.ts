import { Prisma } from "@prisma/client";
import { getReportSelect } from "@/lib/helpers/reports";

export type ReportFromDB = Prisma.SignalementGetPayload<{
  select: ReturnType<typeof getReportSelect>;
}>;

export type ReportFromAPI = {
  id: string;
  objet: string | null;
  text: string | null;
  statut: string;
  date: Date;
  client: {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    imagePublicId: string | null;
    role: string;
  } | null;
  produit: { id: string; nom: string } | null;
};
