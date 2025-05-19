"use client";

import * as XLSX from "xlsx";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { JSX, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Components
import PageHeader from "@/components/portal/admin/orderspage/PageHeader";
import SearchAndFilters from "@/components/portal/admin/orderspage/SearchAndFilters";
import OrderTable from "@/components/portal/admin/orderspage/OrderTable";
import EmptyState from "@/components/portal/admin/orderspage/EmptyState";
import OrderDetailModal from "@/components/portal/admin/orderspage/OrdersDetailModel";
import Pagination from "@/components/portal/admin/orderspage/Pagination";
import ConfirmationModal from "@/components/portal/admin/orderspage/ConfirmationModal";

// Types & Utils
import { OrderFromAPI, SortConfig } from "@/lib/types/order.types";
import { fetchPaginatedDataFromAPI } from "@/lib/utils/fetchData";
import { extractDateString } from "@/lib/utils";
import { CommandeStatut } from "@prisma/client";

export default function OrderHistoryPage(): JSX.Element {
  const [orders, setOrders] = useState<OrderFromAPI[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchDebounced, setSearchDebounced] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<OrderFromAPI | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [isDateOpen, setIsDateOpen] = useState<boolean>(false);
  const [isStatusOpen, setIsStatusOpen] = useState<boolean>(false);
  const [isTotalOpen, setIsTotalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusChangeOrderId, setStatusChangeOrderId] = useState<string | null>(
    null
  );
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [pendingStatus, setPendingStatus] = useState<CommandeStatut | null>(
    null
  );
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const pageSize = 10;

  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  // Derived state
  const userId = session?.user?.id;
  const sessionReady = sessionStatus === "authenticated" && !!userId;

  // Valid status transitions
  const statusTransitions: Record<CommandeStatut, CommandeStatut[]> = {
    [CommandeStatut.EN_COURS]: [
      CommandeStatut.EXPEDIEE,
      CommandeStatut.ANNULEE,
    ],
    [CommandeStatut.EXPEDIEE]: [CommandeStatut.LIVREE, CommandeStatut.ANNULEE],
    [CommandeStatut.LIVREE]: [],
    [CommandeStatut.ANNULEE]: [],
  };

  // Status labels for display
  const statusLabels: Record<CommandeStatut, string> = {
    [CommandeStatut.EN_COURS]: "En attente",
    [CommandeStatut.EXPEDIEE]: "Expédiée",
    [CommandeStatut.LIVREE]: "Livrée",
    [CommandeStatut.ANNULEE]: "Annulée",
  };

  /**
   * Debounce search input
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounced(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  /**
   * Update URL query string
   */
  useEffect(() => {
    if (isLoading || sessionStatus === "loading") return;

    const params = new URLSearchParams();
    params.set("page", currentPage.toString());

    if (searchDebounced) params.set("search", searchDebounced);

    if (sortConfig) {
      params.set("sortBy", sortConfig.key.toString());
      params.set("sortOrder", sortConfig.direction);
    } else {
      params.set("sortBy", "date");
      params.set("sortOrder", "desc");
    }

    router.push(`?${params.toString()}`, { scroll: false });
  }, [
    currentPage,
    searchDebounced,
    sortConfig,
    isLoading,
    sessionStatus,
    router,
  ]);

  /**
   * Fetch orders
   */
  useEffect(() => {
    if (!sessionReady || !userId) return;

    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        queryParams.set("page", currentPage.toString());
        queryParams.set("pageSize", pageSize.toString());

        if (sortConfig) {
          queryParams.set("sortBy", sortConfig.key.toString());
          queryParams.set("sortOrder", sortConfig.direction);
        } else {
          queryParams.set("sortBy", "date");
          queryParams.set("sortOrder", "desc");
        }

        if (searchDebounced) {
          queryParams.set("search", searchDebounced);
        }

        const endpoint = `/api/orders?${queryParams.toString()}`;
        const ordersResult = await fetchPaginatedDataFromAPI<OrderFromAPI[]>(
          endpoint
        );

        if (ordersResult.error) {
          toast.error("Erreur lors de la récupération des commandes.");
          return;
        }

        const ordersData = ordersResult.data;
        if (!ordersData) {
          toast.error("Aucune commande trouvée.");
          return;
        }

        setOrders(ordersData.data);
        setTotalItems(ordersData.pagination.totalItems);
        setTotalPages(ordersData.pagination.totalPages);
        setCurrentPage(ordersData.pagination.currentPage);
      } catch {
        toast.error(
          "Une erreur est survenue lors de la récupération des commandes."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [sessionReady, userId, currentPage, searchDebounced, sortConfig]);

  /**
   * Handle status change
   */
  const handleToggleStatus = async (
    orderId: string,
    newStatus: CommandeStatut
  ) => {
    setPendingStatus(newStatus);
    setStatusChangeOrderId(orderId);
    setIsConfirmModalOpen(true);
  };

  const updateStatus = async (orderId: string, newStatus: CommandeStatut) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Échec de la mise à jour du statut.");
      }

      // Refresh orders
      const queryParams = new URLSearchParams();
      queryParams.set("page", currentPage.toString());
      queryParams.set("pageSize", pageSize.toString());

      // Use the same sort logic as in useEffect to respect URL state
      if (sortConfig) {
        queryParams.set("sortBy", sortConfig.key.toString());
        queryParams.set("sortOrder", sortConfig.direction);
      } else {
        queryParams.set("sortBy", "date");
        queryParams.set("sortOrder", "desc");
      }

      if (searchDebounced) {
        queryParams.set("search", searchDebounced);
      }

      const ordersResult = await fetchPaginatedDataFromAPI<OrderFromAPI[]>(
        `/api/orders?${queryParams.toString()}`
      );

      if (ordersResult.data) {
        setOrders(ordersResult.data.data);
        setTotalItems(ordersResult.data.pagination.totalItems);
        setTotalPages(ordersResult.data.pagination.totalPages);
      }

      toast.success(`Statut mis à jour à "${statusLabels[newStatus]}"`);
    } catch {
      toast.error("Erreur lors de la mise à jour du statut.");
    } finally {
      setIsUpdating(false);
      setStatusChangeOrderId(null);
      setPendingStatus(null);
      setIsConfirmModalOpen(false);
    }
  };

  const handleExport = () => {
    const data = orders.map((order) => ({
      ID: order.id,
      Client: order.client
        ? `${order.client.prenom} ${order.client.nom}`
        : "Inconnu",
      Email: order.client?.email || "Inconnu",
      Date: extractDateString(order.date),
      Statut: order.statut,
      "Total (DA)": order.montant.toFixed(2),
      Articles: order.produits
        .map(
          (item) =>
            `${item.nomProduit} (${item.couleur?.nom}, ${item.taille?.nom}): ${item.quantite} x ${item.prixUnit} DA`
        )
        .join(", "),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const headerStyle = {
      font: { bold: true },
      fill: { fgColor: { rgb: "D3D3D3" } },
      alignment: { horizontal: "center" },
    };
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:G1");
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!worksheet[cellAddress]) continue;
      worksheet[cellAddress].s = headerStyle;
    }
    worksheet["!cols"] = [5, 20, 25, 15, 10, 15, 40].map((w) => ({ wch: w }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Commandes");
    XLSX.writeFile(workbook, "commandes_chic_et_tendance.xlsx");
    toast.success("Commandes exportées avec succès !");
  };

  const handleSort = (
    key: keyof OrderFromAPI,
    direction: "asc" | "desc" | ""
  ): void => {
    if (direction === "") {
      setSortConfig(null);
    } else {
      setSortConfig({ key, direction });
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  const toggleDateDropdown = (): void => setIsDateOpen(!isDateOpen);
  const toggleStatusDropdown = (): void => setIsStatusOpen(!isStatusOpen);
  const toggleTotalDropdown = (): void => setIsTotalOpen(!isTotalOpen);
  const closeDropdowns = (): void => {
    setIsDateOpen(false);
    setIsTotalOpen(false);
    setIsStatusOpen(false);
  };

  return (
    <div
      className="min-h-[100dvh] bg-gradient-to-br from-gray-50 to-gray-200 py-6 px-4 sm:pl-10 sm:pr-10"
      onClick={closeDropdowns}
    >
      <div className="max-w-7xl mx-auto">
        <PageHeader handleExport={handleExport} />

        <SearchAndFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortConfig={sortConfig}
          handleSort={handleSort}
          isDateOpen={isDateOpen}
          isStatusOpen={isStatusOpen}
          isTotalOpen={isTotalOpen}
          toggleDateDropdown={toggleDateDropdown}
          toggleStatusDropdown={toggleStatusDropdown}
          toggleTotalDropdown={toggleTotalDropdown}
          closeDropdowns={closeDropdowns}
        />

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : orders.length > 0 ? (
          <>
            <OrderTable
              orders={orders}
              setSelectedOrder={setSelectedOrder}
              handleToggleStatus={handleToggleStatus}
              statusChangeOrderId={statusChangeOrderId}
              statusTransitions={statusTransitions}
              statusLabels={statusLabels}
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
          <EmptyState
            title="Aucune commande trouvée"
            description="Aucun résultat ne correspond à votre recherche."
          />
        )}

        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}

        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          orderId={statusChangeOrderId}
          newStatus={pendingStatus}
          isUpdating={isUpdating}
          statusLabels={statusLabels}
          onConfirm={() => updateStatus(statusChangeOrderId!, pendingStatus!)}
          onCancel={() => setIsConfirmModalOpen(false)}
        />
      </div>
    </div>
  );
}
