"use client";

import { useState } from "react";
import { toast } from "sonner";
import { fetchDataFromAPI } from "@/lib/utils/fetchData";
import { UserFromAPI } from "@/lib/types/user.types";
import { CreditCard, Building } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import { Vendeur } from "@prisma/client";

interface VendorSettingsProps {
  user: UserFromAPI;
  onUpdate: (updatedVendorInfo: Vendeur) => void;
}

export default function VendorSettings({
  user,
  onUpdate,
}: VendorSettingsProps) {
  const [vendorInfo, setVendorInfo] = useState({
    nomBoutique: user.vendeur?.nomBoutique || "",
    description: user.vendeur?.description || "",
    nomBanque: user.vendeur?.nomBanque || "",
    rib: user.vendeur?.rib || "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleVendorInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVendorInfo({ ...vendorInfo, [e.target.name]: e.target.value });
  };

  const handleDescriptionChange = (value?: string) => {
    setVendorInfo({ ...vendorInfo, description: value || "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorInfo.nomBoutique || !vendorInfo.nomBanque || !vendorInfo.rib) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    setIsLoading(true);
    const result = await fetchDataFromAPI<Vendeur>(
      `/api/users/${user.id}/settings/vendor-status`,
      {
        method: "PATCH",
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
      toast.success(
        result.message || "Informations du vendeur mises à jour avec succès"
      );
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Building className="h-5 w-5 text-black" />
            Informations sur l&apos;entreprise
          </h2>
          <p className="text-sm text-gray-500">
            Mettez à jour les détails de votre entreprise
          </p>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label htmlFor="nomBoutique" className="block text-sm font-medium">
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
            <label htmlFor="description" className="block text-sm font-medium">
              Bio (description, markdown accepté)
            </label>
            <MDEditor
              value={vendorInfo.description}
              onChange={handleDescriptionChange}
              style={{ height: "200px" }}
            />
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
            Mettez à jour vos informations bancaires pour les paiements
          </p>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="nomBanque" className="block text-sm font-medium">
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
            {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </div>
      </div>
    </form>
  );
}
