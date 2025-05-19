"use client";

import { Settings, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { extractDateString } from "@/lib/utils";
import { OrderFromAPI } from "@/lib/types/order.types";
import { getStatusColor } from "@/lib/helpers/orderStatus";
import { CommandeStatut } from "@prisma/client";
import EmptyState from "@/components/portal/admin/orderspage/EmptyState";

interface OrderTableProps {
  orders: OrderFromAPI[];
  setSelectedOrder: (order: OrderFromAPI) => void;
  handleToggleStatus: (orderId: string, newStatus: CommandeStatut) => void;
  statusChangeOrderId: string | null;
  statusTransitions: Record<CommandeStatut, CommandeStatut[]>;
  statusLabels: Record<CommandeStatut, string>;
}

export default function OrderTable({
  orders,
  setSelectedOrder,
  handleToggleStatus,
  statusChangeOrderId,
  statusTransitions,
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
              <div
                className="relative overflow-visible"
                ref={(el) => {
                  if (el) {
                    dropdownRefs.current.set(order.id, el);
                  }
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDropdownId(
                      openDropdownId === order.id ? null : order.id
                    );
                  }}
                  className={`w-full px-3 py-1 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-md text-xs overflow-visible ${
                    order.statut === CommandeStatut.LIVREE ||
                    order.statut === CommandeStatut.ANNULEE
                      ? "bg-gray-500 text-white cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                  disabled={
                    order.statut === CommandeStatut.LIVREE ||
                    order.statut === CommandeStatut.ANNULEE
                  }
                >
                  <Settings className="h-4 w-4" />
                  Changer le statut
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      openDropdownId === order.id ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openDropdownId === order.id && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-20 w-full mt-2 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200"
                    >
                      {statusTransitions[order.statut as CommandeStatut]?.map(
                        (newStatus) => (
                          <button
                            key={newStatus}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleStatus(order.id, newStatus);
                              setOpenDropdownId(null);
                            }}
                            className={`w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition-all ${getStatusColor(
                              newStatus
                            )}`}
                            disabled={statusChangeOrderId === order.id}
                          >
                            {statusLabels[newStatus]}
                          </button>
                        )
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
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
                <th className="px-4 py-2 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold">
                  Actions
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
                  <td className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm">
                    <div
                      className="relative"
                      ref={(el) => {
                        if (el) {
                          dropdownRefs.current.set(order.id, el);
                        }
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownId(
                            openDropdownId === order.id ? null : order.id
                          );
                        }}
                        className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-md text-xs sm:text-sm ${
                          order.statut === CommandeStatut.LIVREE ||
                          order.statut === CommandeStatut.ANNULEE
                            ? "bg-gray-500 text-white cursor-not-allowed"
                            : "bg-black text-white hover:bg-gray-800"
                        }`}
                        disabled={
                          order.statut === CommandeStatut.LIVREE ||
                          order.statut === CommandeStatut.ANNULEE
                        }
                      >
                        <Settings className="h-4 w-4" />
                        Changer
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            openDropdownId === order.id ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {openDropdownId === order.id && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-10 w-40 mt-2 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200 overflow-hidden"
                          >
                            {statusTransitions[
                              order.statut as CommandeStatut
                            ]?.map((newStatus) => (
                              <button
                                key={newStatus}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleStatus(order.id, newStatus);
                                  setOpenDropdownId(null);
                                }}
                                className={`w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition-all ${getStatusColor(
                                  newStatus
                                )}`}
                                disabled={statusChangeOrderId === order.id}
                              >
                                {statusLabels[newStatus]}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
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
