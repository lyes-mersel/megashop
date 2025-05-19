"use client";

import { useState, useEffect } from "react";
import {
  BarChart2,
  ShoppingBag,
  Users,
  DollarSign,
  Package,
  Star,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Montserrat } from "next/font/google";

// Configuration de la police Montserrat avec display: "swap"
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: "800",
  display: "swap",
});

type DashboardStats = {
  totalVentes: string;
  totalProduits: number;
  utilisateurs: {
    clients: number;
    vendeurs: number;
  };
  produitsVendus: number;
  meilleurProduit: {
    id: string;
    nom: string;
    noteMoyenne: string;
    prix: string;
  };
  pireProduit: {
    id: string;
    nom: string;
    noteMoyenne: string;
    prix: string;
  };
  weekData: {
    day: string;
    sales: number;
    itemsSold: number;
  }[];
  monthData: {
    day: string;
    sales: number;
    itemsSold: number;
  }[];
  yearData: {
    month: string;
    sales: number;
    itemsSold: number;
  }[];
};

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardStats>({
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
      prix: "0",
    },
    pireProduit: {
      id: "",
      nom: "",
      noteMoyenne: "0",
      prix: "0",
    },
    weekData: [],
    monthData: [],
    yearData: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [chartType, setChartType] = useState("line");

  useEffect(() => {
    // Fetch dashboard data when component mounts
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/dashboard/admin");
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

  // Return loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex justify-center items-center">
        <div className="text-center">
          <BarChart2 className="h-12 w-12 text-black animate-pulse mx-auto mb-4" />
          <h2
            className={`text-xl font-bold text-gray-900 ${montserrat.className}`}
          >
            Chargement du tableau de bord...
          </h2>
        </div>
      </div>
    );
  }

  // Return error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex justify-center items-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2
            className={`text-xl font-bold text-gray-900 mb-2 ${montserrat.className}`}
          >
            Erreur de chargement
          </h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Return component if data is loaded
  if (!dashboardData) return null;

  const chartData =
    selectedPeriod === "week"
      ? dashboardData.weekData
      : selectedPeriod === "month"
      ? dashboardData.monthData
      : dashboardData.yearData;

  const xAxisKey = selectedPeriod === "year" ? "month" : "day";
  const chartTitle =
    selectedPeriod === "week"
      ? "Évolution des ventes et articles vendus (7 derniers jours)"
      : selectedPeriod === "month"
      ? "Évolution des ventes et articles vendus (30 derniers jours)"
      : "Évolution des ventes et articles vendus (12 derniers mois)";

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

        {/* Message de bienvenue pour l'admin */}
        <div className="mb-8">
          <p
            className={`welcome-message text-base sm:text-lg text-gray-700 ${montserrat.className}`}
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Bienvenue, Admin ! Voici les statistiques de votre boutique.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
          <div className="data-card group bg-white/30 backdrop-blur-lg group-hover:backdrop-blur-none border-2 border-green-500/50 p-4 sm:p-6 rounded-xl shadow-xl transform transition-all duration-300 sm:hover:scale-105 sm:hover:shadow-green-500/50 sm:hover:border-green-500">
            <div className="flex items-center gap-3 sm:gap-4">
              <DollarSign className="h-8 w-=8 sm:h-10 sm:w-10 text-green-500 group-hover:animate-bounce" />
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                  Total des ventes
                </h3>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                  {parseInt(dashboardData.totalVentes).toLocaleString()} DZD
                </p>
              </div>
            </div>
          </div>

          <div className="data-card group bg-white/30 backdrop-blur-lg group-hover:backdrop-blur-none border-2 border-blue-500/50 p-4 sm:p-6 rounded-xl shadow-xl transform transition-all duration-300 sm:hover:scale-105 sm:hover:shadow-blue-500/50 sm:hover:border-blue-500">
            <div className="flex items-center gap-3 sm:gap-4">
              <ShoppingBag className="h-8 w-8 sm:h-10 sm:w-10 text-blue-500 group-hover:animate-bounce" />
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                  Total des produits
                </h3>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                  {dashboardData.totalProduits} produits
                </p>
              </div>
            </div>
          </div>

          <div className="data-card group bg-white/30 backdrop-blur-lg group-hover:backdrop-blur-none border-2 border-purple-500/50 p-4 sm:p-6 rounded-xl shadow-xl transform transition-all duration-300 sm:hover:scale-105 sm:hover:shadow-purple-500/50 sm:hover:border-purple-500">
            <div className="flex items-center gap-3 sm:gap-4">
              <Users className="h-8 w-8 sm:h-10 sm:w-10 text-purple-500 group-hover:animate-bounce" />
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                  Utilisateurs
                </h3>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                  {dashboardData.utilisateurs.clients +
                    dashboardData.utilisateurs.vendeurs}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  {dashboardData.utilisateurs.clients} clients,{" "}
                  {dashboardData.utilisateurs.vendeurs} vendeurs
                </p>
              </div>
            </div>
          </div>

          <div className="data-card group bg-white/30 backdrop-blur-lg group-hover:backdrop-blur-none border-2 border-teal-500/50 p-4 sm:p-6 rounded-xl shadow-xl transform transition-all duration-300 sm:hover:scale-105 sm:hover:shadow-teal-500/50 sm:hover:border-teal-500">
            <div className="flex items-center gap-3 sm:gap-4">
              <Package className="h-8 w-8 sm:h-10 sm:w-10 text-teal-500 group-hover:animate-bounce" />
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                  Produits vendus
                </h3>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                  {dashboardData.produitsVendus} articles vendus
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cartes de notes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10">
          <div className="data-card group bg-white/30 backdrop-blur-lg group-hover:backdrop-blur-none border-2 border-purple-500/50 p-4 sm:p-6 rounded-xl shadow-xl transform transition-all duration-300 sm:hover:scale-105 sm:hover:shadow-purple-500/50 sm:hover:border-purple-500">
            <div className="flex items-center gap-3 sm:gap-4">
              <Star className="h-8 w-8 sm:h-10 sm:w-10 text-purple-500 group-hover:animate-bounce" />
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                  Meilleur note produit
                </h3>
                <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
                  {dashboardData.meilleurProduit.nom}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  {dashboardData.meilleurProduit.noteMoyenne}/5 •{" "}
                  {parseInt(
                    dashboardData.meilleurProduit.prix
                  ).toLocaleString()}{" "}
                  DZD
                </p>
              </div>
            </div>
          </div>

          <div className="data-card group bg-white/30 backdrop-blur-lg group-hover:backdrop-blur-none border-2 border-red-500/50 p-4 sm:p-6 rounded-xl shadow-xl transform transition-all duration-300 sm:hover:scale-105 sm:hover:shadow-red-500/50 sm:hover:border-red-500">
            <div className="flex items-center gap-3 sm:gap-4">
              <Star className="h-8 w-8 sm:h-10 sm:w-10 text-red-500 group-hover:animate-bounce" />
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                  Pire note produit
                </h3>
                <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
                  {dashboardData.pireProduit.nom}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  {dashboardData.pireProduit.noteMoyenne}/5 •{" "}
                  {parseInt(dashboardData.pireProduit.prix).toLocaleString()}{" "}
                  DZD
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Graphique avec bordure noire */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border-2 border-black">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
            <h2
              className={`text-lg sm:text-xl font-bold text-gray-900 ${montserrat.className}`}
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {chartTitle}
            </h2>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className={`w-full sm:w-auto px-3 py-1 sm:px-4 sm:py-2 bg-white border-2 border-black rounded-lg text-gray-800 font-montserrat text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all duration-300 hover:bg-gray-100 hover:border-gray-800 ${montserrat.className}`}
              >
                <option value="week">Semaine</option>
                <option value="month">Mois</option>
                <option value="year">Année</option>
              </select>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className={`w-full sm:w-auto px-3 py-1 sm:px-4 sm:py-2 bg-white border-2 border-black rounded-lg text-gray-800 font-montserrat text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all duration-300 hover:bg-gray-100 hover:border-gray-800 ${montserrat.className}`}
              >
                <option value="line">Courbes</option>
                <option value="bar">Bâtons</option>
              </select>
            </div>
          </div>
          <div className="relative h-[50vh] sm:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "line" ? (
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 10, left: 0, bottom: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(0, 0, 0, 0.05)"
                  />
                  <XAxis
                    dataKey={xAxisKey}
                    stroke="#1F2937"
                    tick={{
                      fontSize: 10,
                      fontFamily: "Montserrat",
                      fill: "#1F2937",
                    }}
                    interval={0}
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="#1F2937"
                    tick={{
                      fontSize: 10,
                      fontFamily: "Montserrat",
                      fill: "#1F2937",
                    }}
                    tickFormatter={(value) => `${value} DZD`}
                    label={{
                      value: "Ventes (DZD)",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 12,
                      fontFamily: "Montserrat",
                      fontWeight: "bold",
                      fill: "#1F2937",
                      offset: 5,
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#1F2937"
                    tick={{
                      fontSize: 10,
                      fontFamily: "Montserrat",
                      fill: "#1F2937",
                    }}
                    tickFormatter={(value) => `${value}`}
                    label={{
                      value: "Articles vendus",
                      angle: 90,
                      position: "insideRight",
                      fontSize: 12,
                      fontFamily: "Montserrat",
                      fontWeight: "bold",
                      fill: "#1F2937",
                      offset: 5,
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      borderRadius: "8px",
                      color: "#fff",
                      fontFamily: "Montserrat",
                      fontSize: "10px",
                      padding: "8px",
                    }}
                    formatter={(value, name) =>
                      name === "sales" ? `${value} DZD` : `${value}`
                    }
                  />
                  <Legend
                    wrapperStyle={{
                      fontFamily: "Montserrat",
                      fontSize: "12px",
                      paddingTop: "10px",
                    }}
                    layout="horizontal"
                    align="center"
                    verticalAlign="bottom"
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="sales"
                    stroke="#10B981"
                    fill="rgba(16, 185, 129, 0.2)"
                    strokeWidth={2}
                    dot={{
                      r: 3,
                      fill: "#10B981",
                      stroke: "#fff",
                      strokeWidth: 1,
                    }}
                    activeDot={{ r: 5 }}
                    name="Ventes (DZD)"
                    animationDuration={1500}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="itemsSold"
                    stroke="#F472B6"
                    fill="rgba(244, 114, 182, 0.2)"
                    strokeWidth={2}
                    dot={{
                      r: 3,
                      fill: "#F472B6",
                      stroke: "#fff",
                      strokeWidth: 1,
                    }}
                    activeDot={{ r: 5 }}
                    name="Articles vendus"
                    animationDuration={1500}
                  />
                </LineChart>
              ) : (
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 10, left: 0, bottom: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(0, 0, 0, 0.05)"
                  />
                  <XAxis
                    dataKey={xAxisKey}
                    stroke="#1F2937"
                    tick={{
                      fontSize: 10,
                      fontFamily: "Montserrat",
                      fill: "#1F2937",
                    }}
                    interval={0}
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="#1F2937"
                    tick={{
                      fontSize: 10,
                      fontFamily: "Montserrat",
                      fill: "#1F2937",
                    }}
                    tickFormatter={(value) => `${value} DZD`}
                    label={{
                      value: "Ventes (DZD)",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 12,
                      fontFamily: "Montserrat",
                      fontWeight: "bold",
                      fill: "#1F2937",
                      offset: 5,
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#1F2937"
                    tick={{
                      fontSize: 10,
                      fontFamily: "Montserrat",
                      fill: "#1F2937",
                    }}
                    tickFormatter={(value) => `${value}`}
                    label={{
                      value: "Articles vendus",
                      angle: 90,
                      position: "insideRight",
                      fontSize: 12,
                      fontFamily: "Montserrat",
                      fontWeight: "bold",
                      fill: "#1F2937",
                      offset: 5,
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      borderRadius: "8px",
                      color: "#fff",
                      fontFamily: "Montserrat",
                      fontSize: "10px",
                      padding: "8px",
                    }}
                    formatter={(value, name) =>
                      name === "sales" ? `${value} DZD` : `${value}`
                    }
                  />
                  <Legend
                    wrapperStyle={{
                      fontFamily: "Montserrat",
                      fontSize: "12px",
                      paddingTop: "10px",
                    }}
                    layout="horizontal"
                    align="center"
                    verticalAlign="bottom"
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="sales"
                    fill="#10B981"
                    name="Ventes (DZD)"
                    animationDuration={1500}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="itemsSold"
                    fill="#F472B6"
                    name="Articles vendus"
                    animationDuration={1500}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Styles CSS */}
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
