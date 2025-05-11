import { useState } from "react";
import { toast } from "sonner";
import { fetchDataFromAPI } from "@/lib/utils/fetchData";
import wilayas from "@/lib/data/wilayasData";
import { MapPin } from "lucide-react";
import { Adresse as Address } from "@prisma/client";

interface AddressInfoProps {
  address: Address | null;
  userId: string;
  onUpdate: (updatedAddress: Address) => void;
}

export default function AddressInfo({
  address,
  userId,
  onUpdate,
}: AddressInfoProps) {
  const [formData, setFormData] = useState({
    rue: address?.rue || "",
    ville: address?.ville || "",
    wilaya: address?.wilaya || "",
    codePostal: address?.codePostal || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [wilayaInput, setWilayaInput] = useState(formData.wilaya);
  const [filteredWilayas, setFilteredWilayas] = useState<string[]>(wilayas);
  const [isWilayaDropdownOpen, setIsWilayaDropdownOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWilayaInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWilayaInput(value);
    setFormData({ ...formData, wilaya: value });
    const filtered = wilayas.filter((wilaya) =>
      wilaya.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredWilayas(filtered);
    setIsWilayaDropdownOpen(true);
  };

  const handleWilayaSelect = (wilaya: string) => {
    setWilayaInput(wilaya);
    setFormData({ ...formData, wilaya });
    setIsWilayaDropdownOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await fetchDataFromAPI<Address>(
      `/api/users/${userId}/settings/address`,
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
      toast.success(
        result.message || "Informations d'adresse mises à jour avec succès"
      );
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <MapPin className="h-5 w-5 text-black" />
          Informations d&apos;adresse
        </h2>
        <p className="text-sm text-gray-500">
          Mettez à jour vos informations d&apos;adresse de livraison et de
          facturation.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="space-y-2">
          <label htmlFor="rue" className="block text-sm font-medium">
            Adresse
          </label>
          <input
            id="rue"
            name="rue"
            value={formData.rue}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="ville" className="block text-sm font-medium">
              Ville
            </label>
            <input
              id="ville"
              name="ville"
              value={formData.ville}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="wilaya" className="block text-sm font-medium">
              Wilaya
            </label>
            <div className="relative">
              <input
                id="wilaya"
                name="wilaya"
                type="text"
                value={wilayaInput}
                onChange={handleWilayaInputChange}
                onFocus={() => setIsWilayaDropdownOpen(true)}
                onBlur={() =>
                  setTimeout(() => setIsWilayaDropdownOpen(false), 200)
                }
                className="w-full px-3 py-2 border rounded-md"
                autoComplete="off"
              />
              {isWilayaDropdownOpen && (
                <ul className="absolute z-10 w-full bg-white border rounded-md max-h-60 overflow-y-auto shadow-lg">
                  {filteredWilayas.length > 0 ? (
                    filteredWilayas.map((wilaya) => (
                      <li
                        key={wilaya}
                        onClick={() => handleWilayaSelect(wilaya)}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {wilaya}
                      </li>
                    ))
                  ) : (
                    <li className="px-3 py-2 text-gray-500">
                      Aucune wilaya trouvée
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="codePostal" className="block text-sm font-medium">
            Code postal
          </label>
          <input
            id="codePostal"
            name="codePostal"
            value={formData.codePostal}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-black/90 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>
      </form>
    </div>
  );
}
