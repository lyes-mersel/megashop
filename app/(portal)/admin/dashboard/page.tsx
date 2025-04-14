"use client";

import { useState, useEffect } from "react";
import {
  BarChart2,
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
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

interface Stats {
  totalSales: number;
  totalProducts: number;
  totalItems: number;
  totalUsers: { clients: number; sellers: number };
  topSellingProduct: { name: string; sold: number };
  mostProfitableProduct: { name: string; profit: number };
  soldProducts: { products: number; items: number };
  productRatings: {
    highest: { name: string; rating: number; reviews: number };
    lowest: { name: string; rating: number; reviews: number };
  };
}

export default function DashboardPage() {
  const [stats] = useState<Stats>({
    totalSales: 125000,
    totalProducts: 50,
    totalItems: 320,
    totalUsers: { clients: 120, sellers: 15 },
    topSellingProduct: { name: "T-shirt Vintage", sold: 45 },
    mostProfitableProduct: { name: "Chaussures Sport", profit: 15000 },
    soldProducts: { products: 30, items: 150 },
    productRatings: {
      highest: { name: "T-shirt Vintage", rating: 4.5, reviews: 123 },
      lowest: { name: "Casquette Simple", rating: 1, reviews: 100 },
    },
  });

  const [selectedPeriod, setSelectedPeriod] = useState<
    "week" | "month" | "year"
  >("week");
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  const weekData = [
    { day: "Lun", sales: 5000, itemsSold: 20 },
    { day: "Mar", sales: 7000, itemsSold: 30 },
    { day: "Mer", sales: 3000, itemsSold: 15 },
    { day: "Jeu", sales: 9000, itemsSold: 40 },
    { day: "Ven", sales: 6000, itemsSold: 25 },
    { day: "Sam", sales: 12000, itemsSold: 50 },
    { day: "Dim", sales: 8000, itemsSold: 35 },
  ];

  const monthData = [
    { day: "1-5", sales: 15000, itemsSold: 60 },
    { day: "6-10", sales: 20000, itemsSold: 80 },
    { day: "11-15", sales: 12000, itemsSold: 50 },
    { day: "16-20", sales: 25000, itemsSold: 100 },
    { day: "21-25", sales: 18000, itemsSold: 70 },
    { day: "26-30", sales: 30000, itemsSold: 120 },
  ];

  const yearData = [
    { month: "Jan", sales: 40000, itemsSold: 150 },
    { month: "Fév", sales: 35000, itemsSold: 130 },
    { month: "Mar", sales: 50000, itemsSold: 200 },
    { month: "Avr", sales: 45000, itemsSold: 180 },
    { month: "Mai", sales: 60000, itemsSold: 250 },
    { month: "Juin", sales: 55000, itemsSold: 220 },
    { month: "Juil", sales: 70000, itemsSold: 300 },
    { month: "Août", sales: 65000, itemsSold: 270 },
    { month: "Sept", sales: 50000, itemsSold: 200 },
    { month: "Oct", sales: 55000, itemsSold: 220 },
    { month: "Nov", sales: 60000, itemsSold: 250 },
    { month: "Déc", sales: 75000, itemsSold: 320 },
  ];

  const chartData =
    selectedPeriod === "week"
      ? weekData
      : selectedPeriod === "month"
      ? monthData
      : yearData;
  const xAxisKey = selectedPeriod === "year" ? "month" : "day";
  const chartTitle =
    selectedPeriod === "week"
      ? "Évolution des ventes et articles vendus (7 derniers jours)"
      : selectedPeriod === "month"
      ? "Évolution des ventes et articles vendus (30 derniers jours)"
      : "Évolution des ventes et articles vendus (12 derniers mois)";

  // Animation d'entrée des cartes
  useEffect(() => {
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
  }, []);

  // Animation d'entrée pour le message de bienvenue
  useEffect(() => {
    const welcomeMessage = document.querySelector(".welcome-message");
    if (welcomeMessage) {
      welcomeMessage.animate(
        [
          { opacity: 0, transform: "translateY(-20px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 800,
          easing: "ease-out",
          fill: "forwards",
        }
      );
    }
  }, []);

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
                  {stats.totalSales.toLocaleString()} DZD
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
                  {stats.totalProducts} produits
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  {stats.totalItems} articles au total
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
                  {stats.totalUsers.clients + stats.totalUsers.sellers}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  {stats.totalUsers.clients} clients, {stats.totalUsers.sellers}{" "}
                  vendeurs
                </p>
              </div>
            </div>
          </div>

          <div className="data-card group bg-white/30 backdrop-blur-lg group-hover:backdrop-blur-none border-2 border-orange-500/50 p-4 sm:p-6 rounded-xl shadow-xl transform transition-all duration-300 sm:hover:scale-105 sm:hover:shadow-orange-500/50 sm:hover:border-orange-500">
            <div className="flex items-center gap-3 sm:gap-4">
              <TrendingUp className="h-8 w-8 sm:h-10 sm:w-10 text-orange-500 group-hover:animate-bounce" />
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                  Produit le plus vendu
                </h3>
                <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
                  {stats.topSellingProduct.name}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  {stats.topSellingProduct.sold} unités vendues
                </p>
              </div>
            </div>
          </div>

          <div className="data-card group bg-white/30 backdrop-blur-lg group-hover:backdrop-blur-none border-2 border-yellow-500/50 p-4 sm:p-6 rounded-xl shadow-xl transform transition-all duration-300 sm:hover:scale-105 sm:hover:shadow-yellow-500/50 sm:hover:border-yellow-500">
            <div className="flex items-center gap-3 sm:gap-4">
              <DollarSign className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-500 group-hover:animate-bounce" />
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                  Produit le plus rentable
                </h3>
                <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
                  {stats.mostProfitableProduct.name}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  {stats.mostProfitableProduct.profit.toLocaleString()} DZD de
                  bénéfice
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
                  {stats.soldProducts.products} produits
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  {stats.soldProducts.items} articles vendus
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
                  {stats.productRatings.highest.name}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  {stats.productRatings.highest.rating}/5 (
                  {stats.productRatings.highest.reviews} avis)
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
                  {stats.productRatings.lowest.name}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  {stats.productRatings.lowest.rating}/5 (
                  {stats.productRatings.lowest.reviews} avis)
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
                onChange={(e) =>
                  setSelectedPeriod(e.target.value as "week" | "month" | "year")
                }
                className={`w-full sm:w-auto px-3 py-1 sm:px-4 sm:py-2 bg-white border-2 border-black rounded-lg text-gray-800 font-montserrat text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all duration-300 hover:bg-gray-100 hover:border-gray-800 ${montserrat.className}`}
              >
                <option value="week">Semaine</option>
                <option value="month">Mois</option>
                <option value="year">Année</option>
              </select>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value as "line" | "bar")}
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
                    formatter={(value: number, name: string) =>
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
                    formatter={(value: number, name: string) =>
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
