"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  BarChart2,
  ShoppingBag,
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
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

interface Stats {
  totalSales: number;
  totalProducts: number;
  totalItems: number;
  mostProfitableProduct: { name: string; profit: number };
  soldProducts: { products: number; items: number };
  productRatings: {
    highest: { name: string; rating: number; reviews: number };
    lowest: { name: string; rating: number; reviews: number };
  };
}

interface Seller {
  firstName: string;
  lastName: string;
}

// Fonction utilitaire pour générer les étoiles en fonction de la note et de la couleur
const renderStars = (rating: number, color: string) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {[...Array(fullStars)].map((_, index) => (
        <Star
          key={`full-${index}`}
          className={`h-4 w-4 sm:h-5 sm:w-5 ${color} transition-transform duration-300 hover:scale-110`}
        />
      ))}
      {hasHalfStar && (
        <div className="relative h-4 w-4 sm:h-5 sm:w-5">
          <Star className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300" />
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: "50%" }}
          >
            <Star
              className={`h-4 w-4 sm:h-5 sm:w-5 ${color} transition-transform duration-300 hover:scale-110`}
            />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, index) => (
        <Star
          key={`empty-${index}`}
          className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300 transition-transform duration-300 hover:scale-110"
        />
      ))}
    </div>
  );
};

// Composant personnalisé pour le tooltip
interface TooltipProps {
  active?: boolean;
  payload?: { color: string; name: string; value: number }[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-xl shadow-xl border border-gray-200">
        <p className="text-xs sm:text-sm font-semibold text-gray-800 mb-2">
          {label}
        </p>
        {payload.map(
          (
            entry: { color: string; name: string; value: number },
            index: number
          ) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></div>
              <p className="text-xs sm:text-sm text-gray-700">
                {entry.name}:{" "}
                <span className="font-bold text-gray-900">
                  {entry.name === "Ventes (DZD)"
                    ? `${entry.value} DZD`
                    : entry.value}
                </span>
              </p>
            </div>
          )
        )}
      </div>
    );
  }
  return null;
};

// Composant personnalisé pour la légende
import { LegendProps } from "recharts";

const CustomLegend = ({ payload }: LegendProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-4 sm:mt-6">
      {payload?.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div
              className="w-4 h-1 sm:w-6 sm:h-1 rounded-full"
              style={{
                background: `linear-gradient(to right, ${entry.color || ""}, ${
                  entry.color || ""
                }80)`,
              }}
            ></div>
            <div
              className="w-2 h-2 sm:w-3 sm:h-3 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: entry.color || "" }}
            ></div>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-gray-800 font-montserrat">
            {entry.value || ""}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<
    "week" | "month" | "year"
  >("week");
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  // Ajout d'un état pour simuler l'ouverture/fermeture du sidebar
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const [stats] = useState<Stats>({
    totalSales: 125000,
    totalProducts: 50,
    totalItems: 320,
    mostProfitableProduct: { name: "Chaussures Sport", profit: 15000 },
    soldProducts: { products: 30, items: 150 },
    productRatings: {
      highest: { name: "T-shirt Vintage", rating: 4.5, reviews: 123 },
      lowest: { name: "Casquette Simple", rating: 1, reviews: 100 },
    },
  });

  const [seller] = useState<Seller>({
    firstName: "Billal",
    lastName: "Mechekour",
  });

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

  // Animation d'entrée des cartes statistiques
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

  // Animation d'entrée pour le texte et l'image dans la carte colorée
  useEffect(() => {
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
  }, []);

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
          <div className="bg-black rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden transition-all hover:shadow-2xl transform hover:-translate-y-1 h-auto sm:h-48">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white opacity-10 rounded-full"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 h-full">
              <div className="text-center sm:text-left">
                <h1
                  className={`welcome-text text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight ${montserrat.className} relative z-10`}
                >
                  Bienvenue,
                </h1>
                <p
                  className={`name-text text-lg sm:text-xl mt-2 sm:mt-4 ${montserrat.className}`}
                >
                  {seller.firstName} {seller.lastName}
                </p>
                <p className="greeting-text text-base sm:text-lg mt-2 sm:mt-4 text-gray-300">
                  Journée pleine de bonheur
                </p>
              </div>
              <div className="flex-shrink-0">
                <Image
                  src="/images/image.png"
                  alt="Seller Dashboard Illustration"
                  width={251}
                  height={191}
                  className={`welcome-image w-32 sm:w-40 md:w-48 lg:w-64 h-auto object-contain opacity-100 transition-all duration-300 hover:opacity-100 ${
                    !isSidebarOpen ? "pr-4 sm:pr-6" : ""
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="data-card bg-white rounded-xl shadow-lg p-3 sm:p-4 border-2 border-green-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-green-50 hover:border-green-600 h-[72px] sm:h-[84px] flex items-center">
              <div className="flex items-center gap-2 sm:gap-3 w-full">
                <div className="bg-green-100 p-2 rounded-full transition-all duration-300 group-hover:bg-green-200">
                  <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-600">
                    Total des ventes
                  </h3>
                  <p className="text-base sm:text-lg font-bold text-gray-900">
                    {stats.totalSales.toLocaleString()} DZD
                  </p>
                </div>
              </div>
            </div>

            <div className="data-card bg-white rounded-xl shadow-lg p-3 sm:p-4 border-2 border-blue-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-blue-50 hover:border-blue-600 h-[72px] sm:h-[84px] flex items-center">
              <div className="flex items-center gap-2 sm:gap-3 w-full">
                <div className="bg-blue-100 p-2 rounded-full transition-all duration-300 group-hover:bg-blue-200">
                  <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-600">
                    Total des produits
                  </h3>
                  <p className="text-base sm:text-lg font-bold text-gray-900">
                    {stats.totalProducts} produits
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500">
                    {stats.totalItems} articles au total
                  </p>
                </div>
              </div>
            </div>

            <div className="data-card bg-white rounded-xl shadow-lg p-3 sm:p-4 border-2 border-teal-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-teal-50 hover:border-teal-600 h-[72px] sm:h-[84px] flex items-center">
              <div className="flex items-center gap-2 sm:gap-3 w-full">
                <div className="bg-teal-100 p-2 rounded-full transition-all duration-300 group-hover:bg-teal-200">
                  <Package className="h-5 w-5 sm:h-6 sm:w-6 text-teal-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-600">
                    Produits vendus
                  </h3>
                  <p className="text-base sm:text-lg font-bold text-gray-900">
                    {stats.soldProducts.products} produits
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500">
                    {stats.soldProducts.items} articles vendus
                  </p>
                </div>
              </div>
            </div>

            <div className="data-card bg-white rounded-xl shadow-lg p-3 sm:p-4 border-2 border-yellow-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-yellow-50 hover:border-yellow-600 h-[72px] sm:h-[84px] flex items-center">
              <div className="flex items-center gap-2 sm:gap-3 w-full">
                <div className="bg-yellow-100 p-2 rounded-full transition-all duration-300 group-hover:bg-yellow-200">
                  <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-600">
                    Produit le plus rentable
                  </h3>
                  <p className="text-base sm:text-lg font-bold text-gray-900">
                    {stats.mostProfitableProduct.name}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500">
                    {stats.mostProfitableProduct.profit.toLocaleString()} DZD de
                    bénéfice
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-10">
          <div className="data-card bg-white rounded-xl shadow-lg p-3 sm:p-4 border-2 border-purple-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-purple-50 hover:border-purple-600">
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-purple-100 p-2 rounded-full transition-all duration-300 group-hover:bg-purple-200">
                  <Star className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-600">
                    Meilleure note produit
                  </h3>
                  <p className="text-lg sm:text-xl font-bold text-gray-900">
                    {stats.productRatings.highest.name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {stats.productRatings.highest.rating}/5 (
                    {stats.productRatings.highest.reviews} avis)
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                {renderStars(
                  stats.productRatings.highest.rating,
                  "text-purple-500 fill-purple-500"
                )}
              </div>
            </div>
          </div>

          <div className="data-card bg-white rounded-xl shadow-lg p-3 sm:p-4 border-2 border-red-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-red-50 hover:border-red-600">
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-red-100 p-2 rounded-full transition-all duration-300 group-hover:bg-red-200">
                  <Star className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-600">
                    Pire note produit
                  </h3>
                  <p className="text-lg sm:text-xl font-bold text-gray-900">
                    {stats.productRatings.lowest.name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {stats.productRatings.lowest.rating}/5 (
                    {stats.productRatings.lowest.reviews} avis)
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                {renderStars(
                  stats.productRatings.lowest.rating,
                  "text-red-500 fill-red-500"
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Graphique (avec bordure des boutons en noir et couleurs des courbes/bâtons modifiées) */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border-2 border-black">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-3">
            <h2
              className={`text-lg sm:text-xl font-bold text-gray-900 ${montserrat.className}`}
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {chartTitle}
            </h2>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) =>
                  setSelectedPeriod(e.target.value as "week" | "month" | "year")
                }
                className={`w-full sm:w-auto px-3 py-1 sm:px-4 sm:py-2 bg-white border-2 border-black rounded-lg text-gray-800 font-montserrat text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all duration-300 hover:bg-gray-100 hover:border-gray-800 ${montserrat.className}`}
              >
                <option value="week">Semaine</option>
                <option value="month">Mois</option>
                <option value="year">Année</option>
              </select>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value as "line" | "bar")}
                className={`w-full sm:w-auto px-3 py-1 sm:px-4 sm:py-2 bg-white border-2 border-black rounded-lg text-gray-800 font-montserrat text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all duration-300 hover:bg-gray-100 hover:border-gray-800 ${montserrat.className}`}
              >
                <option value="line">Courbes</option>
                <option value="bar">Bâtons</option>
              </select>
            </div>
          </div>
          <div className="relative h-[300px] sm:h-[400px]">
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
                  <Tooltip content={<CustomTooltip />} />
                  <Legend content={<CustomLegend />} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="sales"
                    stroke="#2563EB"
                    fill="rgba(37, 99, 235, 0.2)"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: "#2563EB",
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                    activeDot={{ r: 6 }}
                    name="Ventes (DZD)"
                    animationDuration={1500}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="itemsSold"
                    stroke="#7C3AED"
                    fill="rgba(124, 58, 237, 0.2)"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: "#7C3AED",
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                    activeDot={{ r: 6 }}
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
                  <Tooltip content={<CustomTooltip />} />
                  <Legend content={<CustomLegend />} />
                  <Bar
                    yAxisId="left"
                    dataKey="sales"
                    fill="#2563EB"
                    name="Ventes (DZD)"
                    animationDuration={1500}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="itemsSold"
                    fill="#7C3AED"
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
