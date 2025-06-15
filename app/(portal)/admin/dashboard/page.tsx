"use client";

import { useState, useEffect } from "react";
import {
  BarChart2,
  Wallet,
  Boxes,
  Users,
  Package,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { Montserrat } from "next/font/google";

import StatsCard from "@/components/portal/admin/dashboard/StatsCard";
import ProductRatingCard from "@/components/portal/admin/dashboard/ProductRatingCard";
import DashboardChart from "@/components/portal/admin/dashboard/DashboardChart";
import LoadingState from "@/components/portal/admin/dashboard/LoadingState";
import ErrorState from "@/components/portal/admin/dashboard/ErrorState";
import { AdminDashboardStats } from "@/lib/types/dashboard.types";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: "800",
  display: "swap",
});

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<AdminDashboardStats>({
    totalVentes: "0",
    totalProduits: 0,
    utilisateurs: {
      clients: 0,
      vendeurs: 0,
    },
    produitsVendus: 0,
    meilleurProduit: {
      id: "",
      nom: "",
      noteMoyenne: "0",
      totalEvaluations: 0,
    },
    pireProduit: {
      id: "",
      nom: "",
      noteMoyenne: "0",
      totalEvaluations: 0,
    },
    produitPlusRevenu: null,
    produitPlusVendu: null,
    weekData: [],
    monthData: [],
    yearData: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<
    "week" | "month" | "year"
  >("week");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/analytics/admin");
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const data = await response.json();
        setDashboardData(data);
        setLoading(false);
      } catch {
        setError("Erreur de chargement des données du tableau de bord");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState error={error} onRetry={() => window.location.reload()} />
    );
  }

  const chartData =
    selectedPeriod === "week"
      ? dashboardData.weekData
      : selectedPeriod === "month"
      ? dashboardData.monthData
      : dashboardData.yearData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-6 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center gap-3">
          <BarChart2 className="h-6 w-6 sm:h-8 sm:w-8 text-black animate-pulse" />
          <h1
            className={`text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight ${montserrat.className}`}
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Tableau de bord
          </h1>
        </div>

        <div className="mb-8">
          <p
            className={`welcome-message text-base sm:text-lg text-gray-700 ${montserrat.className}`}
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Bienvenue, Admin ! Voici les statistiques de votre boutique.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
          <StatsCard
            icon={Wallet}
            title="Total des ventes"
            value={`${parseInt(
              dashboardData.totalVentes
            ).toLocaleString()} DZD`}
            color="emerald"
          />
          <StatsCard
            icon={Boxes}
            title="Total des produits"
            value={`${dashboardData.totalProduits} produits`}
            color="indigo"
          />
          <StatsCard
            icon={Users}
            title="Utilisateurs"
            value={`${
              dashboardData.utilisateurs.clients +
              dashboardData.utilisateurs.vendeurs
            } utilisateurs`}
            subtitle={`${dashboardData.utilisateurs.clients} clients, ${dashboardData.utilisateurs.vendeurs} vendeurs`}
            color="violet"
          />
          <StatsCard
            icon={Package}
            title="Produits vendus"
            value={`${dashboardData.produitsVendus} articles vendus`}
            color="cyan"
          />
          <StatsCard
            icon={Trophy}
            title="Produit le plus vendu"
            value={dashboardData.produitPlusVendu?.nom || "Aucun produit vendu"}
            subtitle={
              dashboardData.produitPlusVendu
                ? `${dashboardData.produitPlusVendu.quantiteVendue} unités vendues`
                : "Pas encore de ventes enregistrées"
            }
            color="amber"
          />
          <StatsCard
            icon={TrendingUp}
            title="Produit avec plus de revenus"
            value={dashboardData.produitPlusRevenu?.nom || "Aucun revenu"}
            subtitle={
              dashboardData.produitPlusRevenu
                ? `${dashboardData.produitPlusRevenu.totalRevenu.toLocaleString()} DZD de revenus`
                : "Pas encore de revenus enregistrés"
            }
            color="teal"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10">
          <ProductRatingCard
            title="Meilleur note produit"
            productName={dashboardData.meilleurProduit.nom}
            rating={dashboardData.meilleurProduit.noteMoyenne}
            totalEvaluations={dashboardData.meilleurProduit.totalEvaluations}
            color="violet"
          />
          <ProductRatingCard
            title="Pire note produit"
            productName={dashboardData.pireProduit.nom}
            rating={dashboardData.pireProduit.noteMoyenne}
            totalEvaluations={dashboardData.pireProduit.totalEvaluations}
            color="rose"
          />
        </div>

        <DashboardChart 
          data={chartData} 
          period={selectedPeriod} 
          onPeriodChange={setSelectedPeriod}
        />
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .group:hover .animate-bounce {
          animation: bounce 1s infinite ease-in-out;
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-bounce,
          .animate-pulse {
            animation: none;
          }
          .data-card {
            transform: none !important;
          }
        }
        select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7' /%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.5rem center;
          background-size: 1em;
          padding-right: 2rem;
        }
      `}</style>
    </div>
  );
}
