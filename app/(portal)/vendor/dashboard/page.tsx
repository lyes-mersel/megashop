"use client";

import { useEffect } from "react";
import { BarChart2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { montserrat } from "@/styles/fonts";

// Import components
import {
  WelcomeCard,
  DashboardStats,
  ProductRatings,
  SalesChart,
  LoadingState,
  ErrorState,
} from "@/components/portal/vendor/dashboard";

// Import custom hook
import { useVendorDashboard } from "@/hooks/useVendorDashboard";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data: stats, loading, error, refetch } = useVendorDashboard();

  // Animation d'entrée des cartes statistiques
  useEffect(() => {
    if (!loading && stats) {
      const cards = document.querySelectorAll(".data-card");
      cards.forEach((card, index) => {
        card.animate(
          [
            { transform: "translateY(50px)", opacity: 0 },
            { transform: "translateY(0)", opacity: 1 },
          ],
          {
            duration: 600,
            delay: index * 100,
            easing: "ease-out",
            fill: "forwards",
          }
        );
      });
    }
  }, [loading, stats]);

  // Animation d'entrée pour le texte et l'image dans la carte colorée
  useEffect(() => {
    if (!loading && stats) {
      const welcomeText = document.querySelector(".welcome-text");
      const nameText = document.querySelector(".name-text");
      const greetingText = document.querySelector(".greeting-text");
      const welcomeImage = document.querySelector(".welcome-image");

      if (welcomeText) {
        welcomeText.animate(
          [
            { opacity: 0, transform: "translateY(20px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          {
            duration: 600,
            easing: "ease-out",
            fill: "forwards",
          }
        );
      }

      if (nameText) {
        nameText.animate(
          [
            { opacity: 0, transform: "translateY(20px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          {
            duration: 600,
            delay: 200,
            easing: "ease-out",
            fill: "forwards",
          }
        );
      }

      if (greetingText) {
        greetingText.animate(
          [
            { opacity: 0, transform: "translateY(20px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          {
            duration: 600,
            delay: 400,
            easing: "ease-out",
            fill: "forwards",
          }
        );
      }

      if (welcomeImage) {
        welcomeImage.animate(
          [
            { opacity: 0, transform: "translateX(20px)" },
            { opacity: 1, transform: "translateX(0)" },
          ],
          {
            duration: 600,
            delay: 600,
            easing: "ease-out",
            fill: "forwards",
          }
        );
      }
    }
  }, [loading, stats]);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  if (!stats) {
    return <ErrorState error="Aucune donnée disponible" onRetry={refetch} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-6 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <BarChart2 className="h-6 w-6 sm:h-8 sm:w-8 text-black animate-pulse" />
            <h1
              className={`text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight ${montserrat.className}`}
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Tableau de bord
            </h1>
          </div>
          <p className="mt-1 sm:mt-2 text-base sm:text-lg text-gray-600">
            Aperçu des performances de votre boutique
          </p>
        </div>

        {/* Section colorée (Bienvenue) et cartes statistiques à droite */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-10">
          <WelcomeCard
            firstName={session?.user?.prenom || "Prenom"}
            lastName={session?.user?.nom || "Nom"}
          />
          <DashboardStats stats={stats} />
        </div>

        {/* Product Ratings */}
        <ProductRatings stats={stats} />

        {/* Sales Chart */}
        <SalesChart stats={stats} />
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.2);
          }
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
}
