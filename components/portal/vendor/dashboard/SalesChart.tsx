"use client";

import { useState } from "react";
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
import { montserrat } from "@/styles/fonts";
import { VendorDashboardStats } from "@/lib/types/dashboard.types";

interface SalesChartProps {
  stats: VendorDashboardStats;
}

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

export default function SalesChart({ stats }: SalesChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<
    "week" | "month" | "year"
  >("week");
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  const chartData =
    selectedPeriod === "week"
      ? stats.weekData
      : selectedPeriod === "month"
      ? stats.monthData
      : stats.yearData;

  const xAxisKey = selectedPeriod === "year" ? "month" : "day";

  const chartTitle =
    selectedPeriod === "week"
      ? "Évolution des ventes et articles vendus (7 derniers jours)"
      : selectedPeriod === "month"
      ? "Évolution des ventes et articles vendus (30 derniers jours)"
      : "Évolution des ventes et articles vendus (12 derniers mois)";

  return (
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

      <style jsx>{`
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
