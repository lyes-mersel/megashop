"use client";

import * as XLSX from "xlsx";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { JSX, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Components
import PageHeader from "@/components/portal/client/orderspage/PageHeader";
import SearchAndFilters from "@/components/portal/client/orderspage/SearchAndFilters";
import OrderTable from "@/components/portal/client/orderspage/OrderTable";
import EmptyState from "@/components/portal/client/orderspage/EmptyState";
import OrderDetailModal from "@/components/portal/client/orderspage/OrdersDetailModel";
import Pagination from "@/components/portal/client/orderspage/Pagination";

// Types & Utils
import { OrderFromAPI, SortConfig } from "@/lib/types/order.types";
import { fetchPaginatedDataFromAPI } from "@/lib/utils/fetchData";
import { extractDateString } from "@/lib/utils";

export default function OrderHistoryPage(): JSX.Element {
  const [orders, setOrders] = useState<OrderFromAPI[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchDebounced, setSearchDebounced] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<OrderFromAPI | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [isDateOpen, setIsDateOpen] = useState<boolean>(false);
  const [isTotalOpen, setIsTotalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const pageSize = 10;

  const { data: session, status } = useSession();
  const router = useRouter();

  // Derived state
  const userId = session?.user?.id;
  const sessionReady = status === "authenticated" && !!userId;

  /**
   * Debounce search input before triggering filtering
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounced(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  /**
   * Update URL query string based on filters (search, sort, pagination)
   */
  useEffect(() => {
    if (isLoading || status === "loading") return;

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
  }, [currentPage, searchDebounced, sortConfig, isLoading, status, router]);

  /**
   * Fetch orders from API once session is ready and filters change
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

        const endpoint = `/api/users/${userId}/orders?${queryParams.toString()}`;
        console.log("Fetching orders from:", endpoint);

        const ordersResult = await fetchPaginatedDataFromAPI<OrderFromAPI[]>(
          endpoint
        );

        if (ordersResult.error) {
          console.error(ordersResult.error);
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
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        toast.error(
          "Une erreur est survenue lors de la récupération des commandes."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [sessionReady, userId, currentPage, searchDebounced, sortConfig]);

  const handleExport = (): void => {
    const data = orders.map((order) => ({
      ID: order.id,
      Date: extractDateString(order.date),
      "Total (DA)": order.montant.toFixed(2),
      Articles: order.produits
        .map(
          (produit) =>
            `${produit.nomProduit} (${produit.couleur?.nom}, ${produit.taille?.nom}): ${produit.quantite} x ${produit.prixUnit} DA`
        )
        .join(" | "),
      Adresse: `${order.adresse?.rue ? order.adresse.rue + ", " : ""}${
        order.adresse?.ville ? order.adresse.ville + ", " : ""
      }${order.adresse?.wilaya || ""}${
        order.adresse?.codePostal ? " - " + order.adresse.codePostal : ""
      }`,
      Statut: order.statut,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const headerStyle = {
      font: { bold: true },
      fill: { fgColor: { rgb: "D3D3D3" } },
      alignment: { horizontal: "center" },
    };
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:F1");
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!worksheet[cellAddress]) continue;
      worksheet[cellAddress].s = headerStyle;
    }
    worksheet["!cols"] = [5, 20, 25, 15, 15, 40].map((w) => ({ wch: w }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Historique Commandes");
    XLSX.writeFile(workbook, "historique_commandes.xlsx");
    toast.success("Historique des commandes exporté avec succès !");
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
    // Reset to first page when sorting changes
    setCurrentPage(1);
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  const toggleDateDropdown = (): void => setIsDateOpen(!isDateOpen);
  const toggleTotalDropdown = (): void => setIsTotalOpen(!isTotalOpen);
  const closeDropdowns = (): void => {
    setIsDateOpen(false);
    setIsTotalOpen(false);
  };

  return (
    <div
      className="min-h-[calc(100dvh-125px)] bg-gradient-to-br from-gray-50 to-gray-200 py-6 px-4 sm:pl-10 sm:pr-10"
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
          isTotalOpen={isTotalOpen}
          toggleDateDropdown={toggleDateDropdown}
          toggleTotalDropdown={toggleTotalDropdown}
          closeDropdowns={closeDropdowns}
        />

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : orders.length > 0 ? (
          <>
            <OrderTable orders={orders} setSelectedOrder={setSelectedOrder} />
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
            description="Vous n'avez pas encore effectué de commande."
          />
        )}

        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </div>
    </div>
  );
}
