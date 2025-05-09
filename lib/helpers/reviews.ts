import {
  ReviewFromDB,
  ReviewFromAPI,
  ReviewResponseFromDB,
  ReviewResponseFromAPI,
} from "@/lib/types/review.types";

export function getReviewSelect() {
  return {
    id: true,
    note: true,
    text: true,
    date: true,
    produitId: true,
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
  const { id, note, text, date, produitId, user, reponsesEvaluation } = review;

  return {
    id,
    note: note.toNumber(),
    text,
    date,
    produitId,
    user,
    reponses: reponsesEvaluation,
  };
}

export function getReviewResponsesSelect() {
  return {
    id: true,
    text: true,
    date: true,
    user: {
      select: {
        id: true,
        nom: true,
        prenom: true,
        imagePublicId: true,
        role: true,
      },
    },
  };
}

export function formatReviewResponsesData(
  reviewResponse: ReviewResponseFromDB
): ReviewResponseFromAPI {
  return reviewResponse;
}
