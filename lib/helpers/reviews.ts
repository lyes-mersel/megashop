import { ReviewFromDB, ReviewFromAPI } from "@/lib/types/review.types";

export function getReviewSelect() {
  return {
    id: true,
    note: true,
    text: true,
    date: true,
    user: {
      select: {
        id: true,
        nom: true,
        prenom: true,
        role: true,
        imagePublicId: true,
      },
    },
    reponsesEvaluation: {
      select: {
        id: true,
        text: true,
        date: true,
        user: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            role: true,
            imagePublicId: true,
          },
        },
      },
    },
  };
}

export function formatReviewData(review: ReviewFromDB): ReviewFromAPI {
  const { id, note, text, date, user, reponsesEvaluation } = review;

  return {
    id,
    note: note.toNumber(),
    text,
    date,
    user,
    reponses: reponsesEvaluation,
  };
}
