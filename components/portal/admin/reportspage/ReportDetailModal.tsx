import { X, Send, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { SignalementStatut } from "@prisma/client";
import { ReportFromAPI } from "@/lib/types/report.types";
import { extractDateString } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";

const ReportDetailModal = ({
  report,
  responseText,
  setResponseText,
  handleRespond,
  handleDelete,
  setSelectedReport,
}: {
  report: ReportFromAPI;
  responseText: string;
  setResponseText: (value: string) => void;
  handleRespond: (report: ReportFromAPI, responseText: string) => void;
  handleDelete: (reportId: string) => void;
  setSelectedReport: (report: ReportFromAPI | null) => void;
}) => {
  const [selectedStatus, setSelectedStatus] = useState<SignalementStatut | "">(
    report.statut as SignalementStatut
  );

  const handleSubmitResponse = async () => {
    if (!responseText.trim()) {
      toast.error("Veuillez entrer une réponse avant d'envoyer.");
      return;
    }

    try {
      const res = await fetch(`/api/reports/${report.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: SignalementStatut.TRAITE }),
      });
      if (!res.ok) throw new Error("Erreur réseau");

      toast.success("Réponse envoyée avec succès !");
      handleRespond(report, responseText);
    } catch {
      toast.error("Erreur lors de l'envoi de la réponse.");
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedStatus || selectedStatus === report.statut) {
      toast.error("Veuillez sélectionner un nouveau statut.");
      return;
    }

    try {
      const res = await fetch(`/api/reports/${report.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: selectedStatus }),
      });
      if (!res.ok) throw new Error("Erreur réseau");

      toast.success("Statut mis à jour avec succès !");
      // Update the report status locally
      setSelectedReport({ ...report, statut: selectedStatus });
    } catch {
      toast.error("Erreur lors de la mise à jour du statut.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <motion.div
        className="bg-white p-4 sm:p-8 rounded-3xl shadow-2xl w-full max-w-[90%] sm:max-w-2xl border border-gray-200"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <button
          onClick={() => setSelectedReport(null)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-200 pb-4">
            <h3 className="text-lg sm:text-2xl font-bold text-gray-900">
              Signalement
            </h3>
            <div className="flex items-center gap-2">
              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value as SignalementStatut)
                }
                className="px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="" disabled>
                  Sélectionner un statut
                </option>
                {Object.values(SignalementStatut).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <button
                onClick={handleUpdateStatus}
                className="px-3 py-1 bg-black text-white rounded-lg text-xs sm:text-sm hover:bg-gray-800 transition-all duration-300"
              >
                Mettre à jour
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-gray-50 p-3 sm:p-4 rounded-xl">
            <div>
              <span className="text-gray-700 font-medium text-xs sm:text-sm">
                Client :
              </span>{" "}
              <span className="text-gray-900 font-semibold block text-xs sm:text-sm">
                {report.client
                  ? `${report.client.prenom} ${report.client.nom}`
                  : "Inconnu"}
              </span>
            </div>
            <div>
              <span className="text-gray-700 font-medium text-xs sm:text-sm">
                Email :
              </span>{" "}
              <span className="text-gray-900 block text-xs sm:text-sm">
                {report.client?.email || "Inconnu"}
              </span>
            </div>
            <div>
              <span className="text-gray-700 font-medium text-xs sm:text-sm">
                Produit :
              </span>{" "}
              <span className="text-gray-900 block text-xs sm:text-sm">
                {report.produit?.nom || "Aucun produit"}
              </span>
            </div>
            <div>
              <span className="text-gray-700 font-medium text-xs sm:text-sm">
                Date :
              </span>{" "}
              <span className="text-gray-900 block text-xs sm:text-sm">
                {extractDateString(report.date)}
              </span>
            </div>
          </div>
          <div className="bg-gray-50 p-3 sm:p-4 rounded-xl">
            <span className="text-gray-700 font-medium block mb-2 text-xs sm:text-sm">
              Objet :
            </span>
            <p className="text-gray-900 text-xs sm:text-sm">
              {report.objet || "Aucun objet"}
            </p>
          </div>
          <div className="bg-gray-50 p-3 sm:p-4 rounded-xl">
            <span className="text-gray-700 font-medium block mb-2 text-xs sm:text-sm">
              Texte du signalement :
            </span>
            <p className="text-gray-900 text-xs sm:text-sm">
              {report.text || "Aucun texte"}
            </p>
          </div>
          {report.statut === SignalementStatut.TRAITE && responseText ? (
            <div className="bg-green-50 p-3 sm:p-4 rounded-xl">
              <span className="text-green-700 font-medium block mb-2 text-xs sm:text-sm">
                Réponse envoyée :
              </span>
              <p className="text-gray-900 text-xs sm:text-sm">{responseText}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Entrez votre réponse ici..."
                className="w-full p-3 sm:p-4 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus██
                focus:ring-black focus:border-black transition-all duration-300 text-xs sm:text-sm"
                rows={4}
              />
              <div className="flex gap-4">
                <button
                  onClick={handleSubmitResponse}
                  className="bg-black text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-all duration-300 shadow-md text-sm sm:text-base"
                >
                  <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                  Envoyer la réponse
                </button>
                <button
                  onClick={() => handleDelete(report.id)}
                  className="bg-red-600 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition-all duration-300 shadow-md text-sm sm:text-base"
                >
                  <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  Supprimer
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ReportDetailModal;
