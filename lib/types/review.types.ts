import { getReviewReplySelect, getReviewSelect } from "@/lib/helpers/reviews";
import { Prisma, UserRole } from "@prisma/client";

export type ReviewFromDB = Prisma.EvaluationGetPayload<{
  select: ReturnType<typeof getReviewSelect>;
}>;

export type ReviewFromAPI = {
  id: string;
  note: number;
  text: string | null;
  date: Date;
  produitId: string;
  user: {
    id: string;
    nom: string;
    prenom: string;
    imagePublicId: string | null;
    role: UserRole;
  };
  reponses: ReviewReplyFromAPI[];
};

export type ReviewReplyFromDB = Prisma.ReponseEvaluationGetPayload<{
  select: ReturnType<typeof getReviewReplySelect>;
}>;

export type ReviewReplyFromAPI = {
  id: string;
  text: string;
  date: Date;
  user: {
    id: string;
    nom: string;
    prenom: string;
    imagePublicId: string | null;
    role: UserRole;
  };
};
