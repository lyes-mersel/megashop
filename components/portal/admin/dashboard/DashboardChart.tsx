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


interface ChartData {
  day?: string;
  month?: string;
  sales: number;
  itemsSold: number;
}

interface DashboardChartProps {
  data: ChartData[];
  period: "week" | "month" | "year";
  onPeriodChange: (period: "week" | "month" | "year") => void;
}

export default function DashboardChart({ data, period, onPeriodChange }: DashboardChartProps) {
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  const xAxisKey = period === "year" ? "month" : "day";
  const chartTitle =
    period === "week"
      ? "Évolution des ventes et articles vendus (7 derniers jours)"
      : period === "month"
      ? "Évolution des ventes et articles vendus (30 derniers jours)"
      : "Évolution des ventes et articles vendus (12 derniers mois)";

  return (
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
            value={period}
            onChange={(e) => onPeriodChange(e.target.value as "week" | "month" | "year")}
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
              data={data}
              margin={{ top: 20, right: 10, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.05)" />
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
              data={data}
              margin={{ top: 20, right: 10, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.05)" />
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
  );
} 