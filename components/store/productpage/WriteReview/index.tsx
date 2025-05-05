"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";

export default function ReviewCard({ productId }: { productId: string }) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Submitting review:", {
        productId: productId,
        rating,
        review,
      });

      const bodyData: Record<string, unknown> = {
        productId,
        note: rating,
      };
      if (review !== "") {
        bodyData.text = review;
      }

      const response = await fetch(`/api/reviews?productId=${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        const json = await response.json();
        console.log("error", json);
        throw new Error("Erreur lors de l'envoi");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/product/${productId}`);
      }, 2000);
    } catch (error) {
      console.error("Review submission error:", error);
      setError("Échec de l'envoi de l'avis. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center animate-fade-in">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            Votre avis a été soumis avec succès.
          </p>
          <div className="animate-pulse text-sm text-blue-500">
            Redirection vers le produit en cours...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-black p-6 text-center">
          <h2 className="text-2xl font-bold text-white">Partagez votre avis</h2>
          <p className="text-gray-300 mt-1">
            Comment evaluerez-vous ce produit ?
          </p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-8 text-center">
              <div className="flex justify-center space-x-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform duration-100 hover:scale-110"
                  >
                    <StarIcon
                      className={`h-12 w-12 ${
                        (hoverRating || rating) >= star
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                {rating
                  ? `Vous avez choisis ${rating} étoile${rating > 1 ? "s" : ""}`
                  : "Choisissez une note"}
              </p>
            </div>

            <div className="mb-8">
              <label
                htmlFor="review"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Votre commentaire
              </label>
              <textarea
                id="review"
                name="review"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Écrivez votre commentaire ici..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className={`w-full py-3 px-4 rounded-xl font-medium text-white transition-all duration-200 ${
                isSubmitting
                  ? "bg-gray-700"
                  : rating === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800 shadow-md hover:shadow-lg"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Soumettre un avis"
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-600 hover:text-black font-medium"
        >
          ← Revenir à la page produit
        </button>
      </div>
    </div>
  );
}
