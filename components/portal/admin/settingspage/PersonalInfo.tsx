import React, { useState } from "react";
import { toast } from "sonner";
import { fetchDataFromAPI } from "@/lib/utils/fetchData";
import { UserFromAPI } from "@/lib/types/user.types";
import { getImageUrlFromPublicId } from "@/lib/utils";
import { User, UserCircle } from "lucide-react";
import { Mail } from "lucide-react";
import Image from "next/image";
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
    tel: user.tel || "",
  });
  const [profileImage, setProfileImage] = useState<string | null>(
    user.imagePublicId ? getImageUrlFromPublicId(user.imagePublicId) : null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setIsLoading(true);
      const result = await fetchDataFromAPI<{ imagePublicId: string }>(
        `/api/users/${user.id}/settings/avatar`,
        {
          method: "PUT",
          body: formData,
        }
      );
      if (result.error) {
        toast.error(result.error);
      } else {
        await update({ ...session });
        const newImageUrl = getImageUrlFromPublicId(result.data!.imagePublicId);
        setProfileImage(newImageUrl);
        onUpdate({ ...user, imagePublicId: result.data!.imagePublicId });
      }
      setIsLoading(false);
    }
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
      await update({ ...session });
      onUpdate(result.data!);
      setFormData({
        email: result.data!.email,
        nom: result.data!.nom,
        prenom: result.data!.prenom,
        tel: result.data!.tel || "",
      });
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
          email: user?.email,
          newEmail: user?.emailEnAttente,
          code: verificationCode,
        }),
      }
    );
    if (result.error) {
      toast.error(result.error);
    } else {
      if (user && user.emailEnAttente) {
        setVerificationCode("");
        onUpdate({
          ...user,
          email: user.emailEnAttente,
          emailEnAttente: null,
        });
        setFormData({
          ...formData,
          email: user.emailEnAttente,
        });
      }
      await update({ ...session });
    }
    setIsVerifying(false);
  };

  return (
    <>
      <div className="space-y-6 bg-gray-100 p-6 rounded-lg shadow-inner">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <User className="h-6 w-6 text-gray-700" />
          Informations Personnelles
        </h2>
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-32 h-32 mb-4">
            {profileImage ? (
              <Image
                src={profileImage}
                alt="Profil"
                layout="fill"
                className="rounded-full object-cover border-4 border-gray-200 shadow-lg"
              />
            ) : (
              <UserCircle className="w-full h-full text-gray-400" />
            )}
          </div>
          <label className="cursor-pointer bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all duration-200 shadow-md font-medium text-sm">
            Choisir une photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="prenom"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Prénom
              </label>
              <input
                type="text"
                id="prenom"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-800 placeholder-gray-500 shadow-sm text-base"
                placeholder="Votre prénom"
              />
            </div>
            <div>
              <label
                htmlFor="nom"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nom
              </label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-800 placeholder-gray-500 shadow-sm text-base"
                placeholder="Votre nom"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-800 placeholder-gray-500 shadow-sm text-base"
              placeholder="votre.email@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="tel"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Numéro de téléphone
            </label>
            <input
              type="tel"
              id="tel"
              name="tel"
              value={formData.tel}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-800 placeholder-gray-500 shadow-sm text-base"
              placeholder="+213 12 345 678"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md transform hover:-translate-y-1 font-semibold text-base"
            disabled={isLoading}
          >
            {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </div>
      </div>

      {user.emailEnAttente && (
        <div className="mt-6 p-6 bg-[#f3f4f6] rounded-xl border shadow-sm">
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
              className="w-full px-3 py-2 border rounded-md bg-white shadow-sm"
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
