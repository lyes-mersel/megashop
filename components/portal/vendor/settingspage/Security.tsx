import { useState } from "react";
import { toast } from "sonner";
import { fetchDataFromAPI } from "@/lib/utils/fetchData";
import { Shield } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface SecurityProps {
  userId: string;
}

export default function Security({ userId }: SecurityProps) {
  const router = useRouter();

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Les nouveaux mots de passe ne correspondent pas");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }
    setIsLoading(true);
    const result = await fetchDataFromAPI<null>(`/api/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }),
    });
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Mot de passe mis à jour avec succès");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
    setIsLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (
      confirm(
        "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible."
      )
    ) {
      setIsLoading(true);
      const result = await fetchDataFromAPI<null>(`/api/users/${userId}`, {
        method: "DELETE",
      });
      if (result.error) {
        toast.error(result.error);
      } else {
        await signOut({ redirect: false });
        toast.success("Compte supprimé avec succès");
        router.push("/");
        router.refresh();
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Shield className="h-5 w-5 text-black" />
          Sécurité
        </h2>
        <p className="text-sm text-gray-500">
          Mettez à jour votre mot de passe ou supprimez votre compte.
        </p>
      </div>
      <form onSubmit={handlePasswordSubmit} className="p-6 space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="currentPassword"
            className="block text-sm font-medium"
          >
            Mot de passe actuel
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="newPassword" className="block text-sm font-medium">
            Nouveau mot de passe
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium"
          >
            Confirmer le nouveau mot de passe
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-black/90 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
        </button>
      </form>
      <div className="p-6 border-t">
        <button
          onClick={handleDeleteAccount}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
          disabled={isLoading}
        >
          Supprimer le compte
        </button>
      </div>
    </div>
  );
}
