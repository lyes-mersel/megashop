"use client";

import Image from "next/image";

import { extractDateString } from "@/lib/utils";
import { OrderFromAPI } from "@/lib/types/order.types";
import { getStatusColor, getStatusLabel } from "@/lib/helpers/orderStatus";

interface OrderTableProps {
  orders: OrderFromAPI[];
  setSelectedOrder: (order: OrderFromAPI) => void;
}

export default function OrderTable({
  orders,
  setSelectedOrder,
}: OrderTableProps) {
  return (
    <div className="flex flex-col lg:flex-row-reverse gap-6 sm:gap-8">
      {/* Image (100% sur mobile, 40% sur desktop) */}
      <div className="w-full lg:w-2/5 flex items-center justify-center">
        <Image
          height={300}
          width={300}
          src="/images/a.png"
          alt="Historique des commandes"
          className="w-auto h-auto max-w-full max-h-64 object-contain"
          priority
        />
      </div>

      {/* Tableau réduit (100% sur mobile, 60% sur desktop) */}
      <div className="w-full lg:w-3/5 bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Structure de table unique avec en-tête fixe et corps défilant */}
        <div className="overflow-hidden">
          {/* En-tête du tableau (fixe) */}
          <div className="bg-black text-white">
            <table className="w-full table-fixed">
              <thead>
                <tr>
                  <th className="w-1/4 px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold">
                    N° de Commande
                  </th>
                  <th className="w-1/4 px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold">
                    Date
                  </th>
                  <th className="w-1/4 px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold">
                    Statut
                  </th>
                  <th className="w-1/4 px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold">
                    Total
                  </th>
                </tr>
              </thead>
            </table>
          </div>

          {/* Corps du tableau avec défilement (5 lignes maximum) */}
          <div className="max-h-[20rem] overflow-y-auto">
            <table className="w-full table-fixed">
              <tbody>
                {orders.map((order, index) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-all duration-200 cursor-pointer border-b-1 border-gray-200"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="w-1/4 px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="w-1/4 px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">
                      {extractDateString(order.date)}
                    </td>
                    <td className="w-1/4 px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
                      <span
                        className={`px-3 py-1 rounded-full font-medium ${getStatusColor(
                          order.statut!
                        )}`}
                      >
                        {getStatusLabel(order.statut)}
                      </span>
                    </td>
                    <td className="w-1/4 px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-900">
                      {order.montant.toFixed(2)} DA
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
