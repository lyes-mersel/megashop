import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: "800",
  display: "swap",
});

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex justify-center items-center">
      <div className="text-center max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <h2 className={`text-xl font-bold text-gray-900 mb-2 ${montserrat.className}`}>
          Erreur de chargement
        </h2>
        <p className="text-gray-700">{error}</p>
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
} 