import { useState } from "react";
import { toast } from "sonner";
import { fetchDataFromAPI } from "@/lib/utils/fetchData";
import { UserFromAPI } from "@/lib/types/user.types";
import { Phone } from "lucide-react";

interface ContactInfoProps {
  user: UserFromAPI;
  onUpdate: (updatedUser: UserFromAPI) => void;
}

export default function ContactInfo({ user, onUpdate }: ContactInfoProps) {
  const [tel, setTel] = useState(user.tel || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await fetchDataFromAPI<UserFromAPI>(
      `/api/users/${user.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tel }),
      }
    );
    if (result.error) {
      toast.error(result.error);
    } else {
      onUpdate(result.data!);
      toast.success("Informations de contact mises à jour avec succès");
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Phone className="h-5 w-5 text-black" />
          Informations de contact
        </h2>
        <p className="text-sm text-gray-500">
          Mettez à jour vos coordonnées pour les notifications de commande.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="space-y-2">
          <label htmlFor="tel" className="block text-sm font-medium">
            Numéro de téléphone
          </label>
          <input
            id="tel"
            name="tel"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
          <p className="text-xs text-gray-500 mt-1">
            Utilisé pour les mises à jour de commande et les notifications de
            livraison
          </p>
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
