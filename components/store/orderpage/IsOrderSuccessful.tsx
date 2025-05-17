import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { satoshi } from "@/styles/fonts";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const IsOrderSuccessful = () => {
  return (
    <main className="min-h-[calc(100dvh-125px)] py-10 bg-[#ebedf0] flex flex-col">
      <div className="flex-1 flex flex-col max-w-frame mx-auto px-4 xl:px-0">
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 sm:p-8 rounded-2xl border border-black/10 shadow-md bg-white">
          <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          <h2
            className={cn(
              satoshi.className,
              "text-2xl md:text-3xl font-bold text-black mb-4"
            )}
          >
            La commande a été enregistrée avec succès
          </h2>
          <Image
            width={500}
            height={500}
            src="/images/liste-de-controle.png"
            alt="Commande réussie"
            className="w-auto flex-1 h-auto rounded-lg mt-8 mb-10"
          />
          <Link href="/client/orders">
            <Button
              className={cn(
                satoshi.className,
                "text-sm md:text-base font-medium bg-gradient-to-r from-gray-800 to-black rounded-full py-4 px-6 text-white hover:from-gray-900 hover:to-black transition-all shadow-lg hover:shadow-xl"
              )}
            >
              Voir l&apos;historique des commandes
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default IsOrderSuccessful;
