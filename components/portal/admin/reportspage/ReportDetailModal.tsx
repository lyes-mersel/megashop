import { X, Send, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { SignalementStatut } from "@prisma/client";
import { ReportFromAPI } from "@/lib/types/report.types";
import { extractDateString } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";
import { getStatusColor, getStatusLabel } from "@/lib/helpers/reportStatus";

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
        body: JSON.stringify({
          // The status will be updated manually by the admin,
          // who selects either "resolved" or "declined".
          // statut: SignalementStatut.TRAITE,
          reponse: responseText.trim(),
        }),
      });
      if (!res.ok) throw new Error("Erreur réseau");

      toast.success("Réponse envoyée avec succès !");
      // Update the report locally with the new response
      setSelectedReport({ ...report, reponse: responseText.trim() });
      handleRespond(report, responseText);
    } catch {
      toast.error("Erreur lors de l'envoi de la réponse.");
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedStatus) {
      toast.error("Veuillez sélectionner un statut.");
      return;
    }

    try {
      const res = await fetch(`/api/reports/${report.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          statut: selectedStatus,
        }),
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
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-4 sm:p-8 rounded-3xl shadow-2xl w-full max-w-[90%] sm:max-w-2xl border border-gray-200"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <div className="space-y-4 sm:space-y-6">
          <div className="flex justify-between items-center border-b border-gray-200 pb-4">
            <h3 className="text-lg sm:text-2xl font-bold text-gray-900">
              Signalement
            </h3>
            <button
              onClick={() => setSelectedReport(null)}
              className="text-gray-500 hover:text-gray-800 transition-colors"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center">
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
                    {getStatusLabel(status)}
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

          {/* Informations client */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-gray-50 p-3 sm:p-4 rounded-xl">
            <div>
              <span className="text-gray-700 font-semibold text-sm sm:text-base">
                Client :
              </span>
              <span className="text-gray-900 block text-sm sm:text-base font-semibold">
                {report.client?.prenom} {report.client?.nom}
              </span>
            </div>

            <div>
              <span className="text-gray-700 font-semibold text-sm sm:text-base">
                Date :
              </span>
              <span className="text-gray-900 block text-sm sm:text-base font-semibold">
                {extractDateString(report.date)}
              </span>
            </div>

            <div>
              <span className="text-gray-700 font-medium text-sm sm:text-base">
                Produit :
              </span>
              <span className="text-gray-900 font-semibold block text-sm sm:text-base">
                {report.produit?.nom || "Aucun produit"}
              </span>
            </div>

            <div>
              <span className="text-gray-700 font-medium text-sm sm:text-base">
                Statut :
              </span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-md ${getStatusColor(
                  report.statut
                )}`}
              >
                {getStatusLabel(report.statut)}
              </span>
            </div>
          </div>

          {/* Contenu du signalement */}
          <div className="space-y-2">
            <h4 className="text-gray-900 font-semibold text-sm sm:text-base">
              Objet :
            </h4>
            <p className="text-gray-700 text-sm sm:text-base">
              {report.objet || "Aucun objet spécifié"}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-gray-900 font-semibold text-sm sm:text-base">
              Description :
            </h4>
            <p className="text-gray-700 text-sm sm:text-base">
              {report.text || "Aucune description"}
            </p>
          </div>

          {/* Réponse */}
          {report.reponse ? (
            <div className="space-y-2">
              <h4 className="text-gray-900 font-semibold text-sm sm:text-base">
                Réponse envoyée :
              </h4>
              <p className="text-gray-900 text-xs sm:text-sm">
                {report.reponse}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <h4 className="text-gray-900 font-semibold text-sm sm:text-base">
                Répondre :
              </h4>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Entrez votre réponse ici..."
                className="w-full h-32 px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleDelete(report.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm sm:text-base hover:bg-red-700 transition-all duration-300 flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer
                </button>
                <button
                  onClick={handleSubmitResponse}
                  className="px-4 py-2 bg-black text-white rounded-lg text-sm sm:text-base hover:bg-gray-800 transition-all duration-300 flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Envoyer
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReportDetailModal;
