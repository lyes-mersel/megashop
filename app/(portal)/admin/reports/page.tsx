"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { SignalementStatut } from "@prisma/client";
import { extractDateString } from "@/lib/utils";

// Components
import PageHeader from "@/components/portal/admin/reportspage/PageHeader";
import SearchAndFilters from "@/components/portal/admin/reportspage/SearchAndFilters";
import ReportCard from "@/components/portal/admin/reportspage/ReportCard";
import ReportTable from "@/components/portal/admin/reportspage/ReportTable";
import ReportDetailModal from "@/components/portal/admin/reportspage/ReportDetailModal";
import EmptyState from "@/components/portal/admin/reportspage/EmptyState";
import { ReportFromAPI } from "@/lib/types/report.types";
import { VALID_SORT_ORDERS } from "@/lib/constants/sorting";
import { PaginatedApiResponse } from "@/lib/types/apiResponse.types";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  pageSize: number;
}) => {
  const maxPagesToShow = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <p className="text-sm text-gray-600">
        Affichage de {(currentPage - 1) * pageSize + 1} à{" "}
        {Math.min(currentPage * pageSize, totalItems)} sur {totalItems}{" "}
        signalements
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Précédent
        </button>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-lg ${
              page === currentPage
                ? "bg-black text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportFromAPI[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState<ReportFromAPI | null>(
    null
  );
  const [responseText, setResponseText] = useState("");
  const [dateSort, setDateSort] = useState<"asc" | "desc" | "">("desc");
  const [statusFilter, setStatusFilter] = useState<SignalementStatut | "">("");
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        queryParams.set("page", currentPage.toString());
        queryParams.set("pageSize", pageSize.toString());

        if (searchQuery) {
          queryParams.set("search", searchQuery);
        }

        if (dateSort && VALID_SORT_ORDERS.includes(dateSort)) {
          queryParams.set("sortBy", "date");
          queryParams.set("sortOrder", dateSort);
        } else {
          queryParams.set("sortBy", "date");
          queryParams.set("sortOrder", "desc");
        }

        if (statusFilter) {
          queryParams.set("statut", statusFilter);
        }

        const res = await fetch(`/api/reports?${queryParams.toString()}`);
        if (!res.ok) throw new Error("Erreur réseau");
        const response: PaginatedApiResponse<ReportFromAPI[]> =
          await res.json();

        if (response.error) {
          throw new Error(response.error);
        }

        setReports(response.data);
        setTotalItems(response.pagination.totalItems);
        setTotalPages(response.pagination.totalPages);
        setPageSize(response.pagination.pageSize);
        setCurrentPage(response.pagination.currentPage);
      } catch {
        toast.error("Erreur lors de la récupération des signalements.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, [currentPage, searchQuery, dateSort, statusFilter, pageSize]);

  const getFilteredReports = () => {
    // Client-side filtering as a fallback (API handles most filtering)
    let filtered = reports.filter((report) => {
      const clientName = report.client
        ? `${report.client.prenom} ${report.client.nom}`
        : "";
      const productName = report.produit?.nom || "";
      return (
        clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    if (statusFilter) {
      filtered = filtered.filter((report) => report.statut === statusFilter);
    }

    if (dateSort) {
      filtered.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateSort === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      });
    }

    return filtered;
  };

  const filteredReports = getFilteredReports();

  const handleRespond = (report: ReportFromAPI, responseText: string) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === report.id
          ? { ...r, statut: SignalementStatut.TRAITE, response: responseText }
          : r
      )
    );
    setResponseText("");
    setSelectedReport(null);
  };

  const handleDelete = async (reportId: string) => {
    try {
      const res = await fetch(`/api/reports/${reportId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur réseau");
      setReports((prev) => prev.filter((r) => r.id !== reportId));
      setSelectedReport(null);
      toast.success("Signalement supprimé avec succès !");
    } catch {
      toast.error("Erreur lors de la suppression du signalement.");
    }
  };

  const handleExport = () => {
    const data = filteredReports.map((report) => ({
      Client: report.client
        ? `${report.client.prenom} ${report.client.nom}`
        : "Inconnu",
      Email: report.client?.email || "Inconnu",
      Produit: report.produit?.nom || "Aucun",
      Signalement: report.text || "Aucun",
      Date: extractDateString(report.date),
      Statut: report.statut,
      Objet: report.objet || "Aucun",
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Signalements");
    XLSX.writeFile(workbook, "signalements.xlsx");
    toast.success("Signalements exportés avec succès !");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-6 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <PageHeader handleExport={handleExport} />
        <p className="mb-6 text-base sm:text-lg text-gray-700">
          Consultez et gérez les signalements envoyés par vos clients ici.
        </p>
        <SearchAndFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          dateSort={dateSort}
          setDateSort={setDateSort}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          isDateOpen={isDateOpen}
          setIsDateOpen={setIsDateOpen}
          isStatusOpen={isStatusOpen}
          setIsStatusOpen={setIsStatusOpen}
        />
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredReports.length > 0 ? (
          <>
            <div className="sm:hidden">
              {filteredReports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  setSelectedReport={setSelectedReport}
                />
              ))}
            </div>
            <ReportTable
              reports={filteredReports}
              setSelectedReport={setSelectedReport}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={totalItems}
              pageSize={pageSize}
            />
          </>
        ) : (
          <EmptyState />
        )}
        {selectedReport && (
          <ReportDetailModal
            report={selectedReport}
            responseText={responseText}
            setResponseText={setResponseText}
            handleRespond={handleRespond}
            handleDelete={handleDelete}
            setSelectedReport={setSelectedReport}
          />
        )}
      </div>
    </div>
  );
}
