"use client";

import { useState, useRef, useEffect } from "react";
import { extractDateString } from "@/lib/utils";
import { OrderFromAPI } from "@/lib/types/order.types";
import { getStatusColor } from "@/lib/helpers/orderStatus";
import { CommandeStatut } from "@prisma/client";
import EmptyState from "@/components/portal/admin/orderspage/EmptyState";

interface OrderTableProps {
  orders: OrderFromAPI[];
  setSelectedOrder: (order: OrderFromAPI) => void;
  statusLabels: Record<CommandeStatut, string>;
}

export default function OrderTable({
  orders,
  setSelectedOrder,
  statusLabels,
}: OrderTableProps) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !Array.from(dropdownRefs.current.values()).some((ref) =>
          ref.contains(event.target as Node)
        )
      ) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      {/* Mobile Card View */}
      <div className="sm:hidden">
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <div
              key={order.id}
              className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg p-4 mb-4 hover:bg-gray-50 transition-all duration-200 cursor-pointer overflow-visible"
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  Commande N°{index + 1}
                </h3>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold shadow-md ${getStatusColor(
                    order.statut
                  )}`}
                >
                  {statusLabels[order.statut as CommandeStatut] || order.statut}
                </span>
              </div>
              <div className="text-xs text-gray-600 mb-1">
                Client: {order.client?.prenom} {order.client?.nom}
              </div>
              <div className="text-xs text-gray-600 mb-1">
                Date: {extractDateString(order.date)}
              </div>
              <div className="text-xs font-semibold text-green-600 mb-2">
                Total: {order.montant.toFixed(2)} DA
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            title="Aucune commande trouvée"
            description="Aucun résultat ne correspond à votre recherche."
          />
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block bg-white/95 backdrop-blur-md rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto overflow-y-visible">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-4 py-2 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold">
                  N°
                </th>
                <th className="px-4 py-2 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold">
                  Client
                </th>
                <th className="px-4 py-2 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold hidden md:table-cell">
                  Date
                </th>
                <th className="px-4 py-2 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold hidden lg:table-cell">
                  Statut
                </th>
                <th className="px-4 py-2 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order, index) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-900">
                    #{index + 1}
                  </td>
                  <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-900">
                    <div>
                      <span className="font-semibold">
                        {order.client?.prenom} {order.client?.nom}
                      </span>
                      <p className="text-xs text-gray-600">
                        {order.client?.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-900 hidden md:table-cell">
                    {extractDateString(order.date)}
                  </td>
                  <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm hidden lg:table-cell">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-md ${getStatusColor(
                        order.statut
                      )}`}
                    >
                      {statusLabels[order.statut as CommandeStatut] ||
                        order.statut}
                    </span>
                  </td>
                  <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm font-semibold text-green-600">
                    {order.montant.toFixed(2)} DA
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
