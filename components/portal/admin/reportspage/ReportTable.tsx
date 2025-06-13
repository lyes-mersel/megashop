import { ReportFromAPI } from "@/lib/types/report.types";
import { extractDateString } from "@/lib/utils";
import { getStatusColor, getStatusLabel } from "@/lib/helpers/reportStatus";

const ReportTable = ({
  reports,
  setSelectedReport,
}: {
  reports: ReportFromAPI[];
  setSelectedReport: (report: ReportFromAPI) => void;
}) => (
  <div className="hidden sm:block bg-white rounded-xl shadow-lg overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-black text-white">
        <tr>
          <th className="px-4 py-2 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold">
            Client
          </th>
          <th className="px-4 py-2 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold hidden md:table-cell">
            Produit
          </th>
          <th className="px-4 py-2 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold hidden md:table-cell">
            Date
          </th>
          <th className="px-4 py-2 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold">
            Statut
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {reports.map((report) => (
          <tr
            key={report.id}
            className="hover:bg-gray-50 transition-all duration-200 cursor-pointer"
            onClick={() => setSelectedReport(report)}
          >
            <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-900">
              <div>
                <span className="font-semibold">
                  {report.client?.prenom} {report.client?.nom}
                </span>
                <p className="text-xs text-gray-600">{report.client?.email}</p>
              </div>
            </td>
            <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-900 hidden md:table-cell">
              {report.produit?.nom || "Aucun produit"}
            </td>
            <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-900 hidden md:table-cell">
              {extractDateString(report.date)}
            </td>
            <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm">
              <span
                className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-md ${getStatusColor(
                  report.statut
                )}`}
              >
                {getStatusLabel(report.statut)}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ReportTable;
