import { useState } from "react";
import { toast } from "sonner";
import { fetchDataFromAPI } from "@/lib/utils/fetchData";
import { UserFromAPI } from "@/lib/types/user.types";
import { User, Mail } from "lucide-react";
import { useSession } from "next-auth/react";

interface PersonalInfoProps {
  user: UserFromAPI;
  onUpdate: (updatedUser: UserFromAPI) => void;
}

export default function PersonalInfo({ user, onUpdate }: PersonalInfoProps) {
  const { data: session, update } = useSession();
  const [formData, setFormData] = useState({
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await fetchDataFromAPI<UserFromAPI>(
      `/api/users/${user.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );
    if (result.error) {
      toast.error(result.error);
    } else {
      onUpdate(result.data!);
      toast.success("Informations personnelles mises à jour avec succès");
    }
    setIsLoading(false);
  };

  const handleVerifyEmail = async () => {
    if (verificationCode.length !== 6) {
      toast.error("Le code doit contenir 6 caractères");
      return;
    }
    setIsVerifying(true);
    const result = await fetchDataFromAPI<{ message: string }>(
      "/api/auth/email/update",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          newEmail: user.emailEnAttente,
          code: verificationCode,
        }),
      }
    );
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Email vérifié avec succès");
      setVerificationCode("");
      onUpdate({ ...user, email: user.emailEnAttente!, emailEnAttente: null });
      await update({ ...session });
    }
    setIsVerifying(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <User className="h-5 w-5 text-black" />
            Informations personnelles
          </h2>
          <p className="text-sm text-gray-500">
            Mettez à jour vos informations personnelles et de contact.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="prenom" className="block text-sm font-medium">
                Prénom
              </label>
              <input
                id="prenom"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="nom" className="block text-sm font-medium">
                Nom
              </label>
              <input
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
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

      {/* Email Verification Section */}
      {user.emailEnAttente && (
        <div className="mt-6 p-6 bg-white rounded-xl border shadow-sm">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Mail className="h-5 w-5 text-black" />
            Vérification de l&apos;adresse email
          </h3>
          <p className="text-sm text-gray-700">
            Un code de vérification à 6 chiffres a été envoyé à :{" "}
            <span className="font-medium">{user.emailEnAttente}</span>
          </p>
          <p className="text-sm text-gray-600">
            Veuillez saisir ce code ci-dessous pour confirmer votre nouvelle
            adresse email.
            <br />
            <span className="text-red-500 font-medium">
              ⚠️ Le code est valable pendant 5 minutes.
            </span>
          </p>

          <div className="space-y-2 mt-4">
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Entrez le code"
              className="w-full px-3 py-2 border rounded-md"
              maxLength={6}
            />
            <button
              onClick={handleVerifyEmail}
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-black/90 disabled:opacity-50"
              disabled={isVerifying || verificationCode.length !== 6}
            >
              {isVerifying ? "Vérification..." : "Vérifier"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
