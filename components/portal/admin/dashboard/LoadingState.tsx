import { BarChart2 } from "lucide-react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: "800",
  display: "swap",
});

export default function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex justify-center items-center">
      <div className="text-center">
        <BarChart2 className="h-12 w-12 text-black animate-pulse mx-auto mb-4" />
        <h2 className={`text-xl font-bold text-gray-900 ${montserrat.className}`}>
          Chargement du tableau de bord...
        </h2>
      </div>
    </div>
  );
} 