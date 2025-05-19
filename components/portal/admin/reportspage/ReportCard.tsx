import { ReportFromAPI } from "@/lib/types/report.types";
import { extractDateString } from "@/lib/utils";
import { SignalementStatut } from "@prisma/client";

const ReportCard = ({
  report,
  setSelectedReport,
}: {
  report: ReportFromAPI;
  setSelectedReport: (report: ReportFromAPI) => void;
}) => (
  <div
    className="bg-white rounded-xl shadow-lg p-4 mb-4 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
    onClick={() => setSelectedReport(report)}
  >
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-sm font-semibold text-gray-900">
        {report.client?.prenom} {report.client?.nom}
      </h3>
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold shadow-md ${
          report.statut === SignalementStatut.TRAITE
            ? "bg-green-100 text-green-800"
            : report.statut === SignalementStatut.REJETE
            ? "bg-red-100 text-red-800"
            : "bg-yellow-100 text-yellow-800"
        }`}
      >
        {report.statut}
      </span>
    </div>
    <div className="text-xs text-gray-600 mb-1">
      Produit: {report.produit?.nom || "Aucun produit"}
    </div>
    <div className="text-xs text-gray-600 mb-1">
      Date: {extractDateString(report.date)}
    </div>
  </div>
);

export default ReportCard;
