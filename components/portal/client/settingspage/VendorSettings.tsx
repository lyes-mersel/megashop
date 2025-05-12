"use client";

import { useState } from "react";
import { toast } from "sonner";
import { fetchDataFromAPI } from "@/lib/utils/fetchData";
import { UserFromAPI } from "@/lib/types/user.types";
import { CreditCard, Building, BadgeCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import MDEditor from "@uiw/react-md-editor";
import { Vendeur } from "@prisma/client";
import { MAX_VENDOR_DESCRIPTION_LENGTH } from "@/lib/constants/settings";

interface VendorSettingsProps {
  user: UserFromAPI;
  onUpdate: (updatedVendorInfo: Vendeur) => void;
}

export default function VendorSettings({
  user,
  onUpdate,
}: VendorSettingsProps) {
  const { data: session, update } = useSession();
  const router = useRouter();

  const [isVendorActive, setIsVendorActive] = useState(false);
  const [vendorInfo, setVendorInfo] = useState({
    nomBoutique: "",
    description: "",
    nomBanque: "",
    rib: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleVendorInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVendorInfo({ ...vendorInfo, [e.target.name]: e.target.value });
  };

  const handleDescriptionChange = (value?: string) => {
    if ((value || "").length <= MAX_VENDOR_DESCRIPTION_LENGTH) {
      setVendorInfo({ ...vendorInfo, description: value || "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorInfo.nomBoutique || !vendorInfo.nomBanque || !vendorInfo.rib) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    setIsLoading(true);
    const result = await fetchDataFromAPI<null>(
      `/api/users/${user.id}/settings/vendor-status`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomBoutique: vendorInfo.nomBoutique,
          description: vendorInfo.description,
          nomBanque: vendorInfo.nomBanque,
          rib: vendorInfo.rib,
        }),
      }
    );
    if (result.error) {
      toast.error(result.error);
    } else {
      onUpdate(result.data!);
      await update({ ...session });
      toast.success("Vous êtes maintenant un vendeur");
      router.push("/vendor/dashboard");
      router.refresh();
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <BadgeCheck className="h-5 w-5 text-black" />
            Statut de vendeur
          </h2>
          <p className="text-sm text-gray-500">
            Activez votre compte vendeur pour commencer à vendre des produits
          </p>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Devenir vendeur</h4>
              <p className="text-sm text-gray-500">
                Activez les fonctionnalités vendeur sur votre compte
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isVendorActive}
                onChange={(e) => setIsVendorActive(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-11 h-6 rounded-full ${
                  isVendorActive ? "bg-black" : "bg-gray-200"
                }`}
              ></div>
              <div
                className={`absolute w-5 h-5 bg-white rounded-full transition-transform ${
                  isVendorActive ? "translate-x-5" : "translate-x-1"
                }`}
              ></div>
            </label>
          </div>
        </div>
      </div>
      {isVendorActive && (
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Building className="h-5 w-5 text-black" />
                Informations sur l&apos;entreprise
              </h2>
              <p className="text-sm text-gray-500">
                Fournissez des détails sur votre entreprise
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="nomBoutique"
                  className="block text-sm font-medium"
                >
                  Nom de votre boutique en ligne
                </label>
                <input
                  id="nomBoutique"
                  name="nomBoutique"
                  value={vendorInfo.nomBoutique}
                  onChange={handleVendorInfoChange}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="space-y-2" data-color-mode="light">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium"
                >
                  Bio (description)
                </label>
                <MDEditor
                  value={vendorInfo.description}
                  onChange={handleDescriptionChange}
                  style={{ height: "200px" }}
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {vendorInfo.description.length} /{" "}
                  {MAX_VENDOR_DESCRIPTION_LENGTH} caractères
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-black" />
                Coordonnées bancaires
              </h2>
              <p className="text-sm text-gray-500">
                Ajoutez vos informations bancaires pour les paiements
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="nomBanque"
                    className="block text-sm font-medium"
                  >
                    Nom de la banque
                  </label>
                  <input
                    id="nomBanque"
                    name="nomBanque"
                    value={vendorInfo.nomBanque}
                    onChange={handleVendorInfoChange}
                    required
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="rib" className="block text-sm font-medium">
                    Numéro de compte (RIB)
                  </label>
                  <input
                    id="rib"
                    name="rib"
                    value={vendorInfo.rib}
                    onChange={handleVendorInfoChange}
                    required
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t">
              <button
                type="submit"
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-black/90 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading
                  ? "Enregistrement..."
                  : "Enregistrer les informations"}
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  );
}
