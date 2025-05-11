import React, { useState } from "react";
import { toast } from "sonner";
import { fetchDataFromAPI } from "@/lib/utils/fetchData";
import { UserFromAPI } from "@/lib/types/user.types";
import { Home } from "lucide-react";
import wilayas from "@/lib/data/wilayasData";

interface AddressInfoProps {
  user: UserFromAPI;
  onUpdate: (updatedUser: UserFromAPI) => void;
}

export default function AddressInfo({ user, onUpdate }: AddressInfoProps) {
  const [formData, setFormData] = useState({
    rue: user.adresse?.rue || "",
    ville: user.adresse?.ville || "",
    wilaya: user.adresse?.wilaya || "",
    codePostal: user.adresse?.codePostal || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [wilayaFilter, setWilayaFilter] = useState(formData.wilaya);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "wilaya") {
      setWilayaFilter(e.target.value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await fetchDataFromAPI<UserFromAPI>(
      `/api/users/${user.id}/settings/address`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );
    if (result.error) {
      toast.error(result.error);
    } else {
      onUpdate(result.data!);
    }
    setIsLoading(false);
  };

  const filteredWilayas = wilayas.filter((wilaya) =>
    wilaya.toLowerCase().includes(wilayaFilter.toLowerCase())
  );

  return (
    <div className="space-y-6 bg-gray-100 p-6 rounded-lg shadow-inner mt-6">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Home className="h-6 w-6 text-gray-700" />
        Adresse
      </h2>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="rue"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Rue
          </label>
          <input
            type="text"
            id="rue"
            name="rue"
            value={formData.rue}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-800 placeholder-gray-500 shadow-sm text-base"
            placeholder="Nom de la rue"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="ville"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ville
            </label>
            <input
              type="text"
              id="ville"
              name="ville"
              value={formData.ville}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-800 placeholder-gray-500 shadow-sm text-base"
              placeholder="Ville"
            />
          </div>
          <div>
            <label
              htmlFor="wilaya"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Wilaya
            </label>
            <input
              type="text"
              id="wilaya"
              name="wilaya"
              value={formData.wilaya}
              onChange={handleChange}
              list="wilayas-list"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-800 placeholder-gray-500 shadow-sm text-base"
              placeholder="Saisir ou sélectionner une wilaya"
            />
            <datalist id="wilayas-list" className="max-h-40 overflow-y-auto">
              {filteredWilayas.map((wilaya) => (
                <option key={wilaya} value={wilaya} />
              ))}
            </datalist>
          </div>
        </div>
        <div>
          <label
            htmlFor="codePostal"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Code Postal
          </label>
          <input
            type="text"
            id="codePostal"
            name="codePostal"
            value={formData.codePostal}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-800 placeholder-gray-500 shadow-sm text-base"
            placeholder="Code postal"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md transform hover:-translate-y-1 font-semibold text-base"
          disabled={isLoading}
        >
          {isLoading ? "Enregistrement..." : "Enregistrer l'adresse"}
        </button>
      </div>
    </div>
  );
}
