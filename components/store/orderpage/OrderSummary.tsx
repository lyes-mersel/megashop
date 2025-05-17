import { Button } from "@/components/ui/button";
import { FaArrowRight } from "react-icons/fa6";
import { satoshi } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import { PrepareOrderFromAPI } from "@/lib/types/order.types";

interface OrderSummaryProps {
  orderSummary: PrepareOrderFromAPI;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function OrderSummary({
  orderSummary,
  onSubmit,
  isSubmitting,
}: OrderSummaryProps) {
  return (
    <div className="w-full lg:max-w-[505px] p-6 sm:p-8 rounded-2xl border border-black/10 shadow-md bg-white">
      <h3
        className={cn(
          satoshi.className,
          "text-xl md:text-2xl font-bold text-black mb-6 flex items-center gap-3"
        )}
      >
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
          <ShoppingBag className="h-5 w-5 text-gray-700" />
        </div>
        Résumé de la commande
      </h3>

      <div className="flex flex-col space-y-4">
        {orderSummary.produits.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between text-black py-2"
          >
            <span className="text-sm md:text-base text-gray-700 truncate max-w-[60%] flex flex-col">
              <span className={cn(satoshi.className, "")}>
                {item.quantite} × {item.nomProduit}
              </span>
              <span className={cn(satoshi.className, "ml-[25px]")}>
                Couleur: {item.couleur?.nom}, Taille: {item.taille?.nom}
              </span>
            </span>

            <span
              className={cn(
                satoshi.className,
                "text-sm md:text-base font-medium"
              )}
            >
              {item.quantite * item.prixUnit} DA
            </span>
          </div>
        ))}

        <hr className="border-t border-gray-200 my-2" />

        <div className="flex items-center justify-between py-2">
          <span
            className={cn(
              satoshi.className,
              "md:text-xl text-gray-800 font-medium"
            )}
          >
            Total
          </span>
          <span
            className={cn(
              satoshi.className,
              "text-xl md:text-2xl font-bold text-black"
            )}
          >
            {orderSummary.montant} DA
          </span>
        </div>
      </div>

      <Button
        type="button"
        className={cn(
          satoshi.className,
          "mt-6 text-sm md:text-base font-medium bg-gradient-to-r from-gray-800 to-black rounded-full w-full py-4 h-[54px] md:h-[60px] text-white group hover:from-gray-900 hover:to-black transition-all shadow-lg hover:shadow-xl"
        )}
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Traitement en cours..." : "Passer la commande"}
        <FaArrowRight className="text-xl ml-2 group-hover:translate-x-1 transition-all" />
      </Button>
    </div>
  );
}
