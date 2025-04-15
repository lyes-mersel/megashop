"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, UserCircle, User, Home, Shield } from "lucide-react";
import { Montserrat } from "next/font/google";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Image from "next/image";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "800"],
  display: "swap",
});

export default function AdminSettings() {
  const [formData, setFormData] = useState({
    firstName: "Admin",
    lastName: "Utilisateur",
    email: "admin@example.com",
    phone: "",
    address: {
      street: "",
      city: "",
      province: "",
    },
    password: "",
    confirmPassword: "",
    profileImage: null as File | null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [provinceFilter, setProvinceFilter] = useState("");

  const provinces = [
    "Adrar",
    "Chlef",
    "Laghouat",
    "Oum El Bouaghi",
    "Batna",
    "Béjaïa",
    "Biskra",
    "Béchar",
    "Blida",
    "Bouira",
    "Tamanrasset",
    "Tébessa",
    "Tlemcen",
    "Tiaret",
    "Tizi Ouzou",
    "Alger",
    "Djelfa",
    "Jijel",
    "Sétif",
    "Saïda",
    "Skikda",
    "Sidi Bel Abbès",
    "Annaba",
    "Guelma",
    "Constantine",
    "Médéa",
    "Mostaganem",
    "M’Sila",
    "Mascara",
    "Ouargla",
    "Oran",
    "El Bayadh",
    "Illizi",
    "Bordj Bou Arréridj",
    "Boumerdès",
    "El Tarf",
    "Tindouf",
    "Tissemsilt",
    "El Oued",
    "Khenchela",
    "Souk Ahras",
    "Tipaza",
    "Mila",
    "Aïn Defla",
    "Naâma",
    "Aïn Témouchent",
    "Ghardaïa",
    "Relizane",
    "Timimoun",
    "Bordj Badji Mokhtar",
    "Ouled Djellal",
    "Béni Abbès",
    "In Salah",
    "In Guezzam",
    "Touggourt",
    "Djanet",
    "El M’Ghair",
    "El Menia",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "profileImage" && files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, profileImage: file }));
      setImagePreview(URL.createObjectURL(file));
    } else if (["street", "city", "province"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
      if (name === "province") setProvinceFilter(value);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas !");
      return;
    }
    toast.success("Informations mises à jour avec succès !");
  };

  const filteredProvinces = provinces.filter((province) =>
    province.toLowerCase().includes(provinceFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-6 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Titre */}
        <header className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <Settings className="h-6 w-6 sm:h-8 sm:w-8 text-black" />
            <h1
              className={`text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight ${montserrat.className}`}
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Paramètres Administrateur
            </h1>
          </div>
          <p className="text-gray-600 mt-2 text-base sm:text-lg">
            Gérez vos informations personnelles avec style et simplicité.
          </p>
        </header>

        {/* Contenu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Card className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/50">
            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                {/* Section Informations Personnelles */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="space-y-4 sm:space-y-6 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-[inset_0_0_10px_rgba(0,0,0,0.2)]"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <User className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
                    <h2
                      className={`text-lg sm:text-xl font-semibold text-gray-800 ${montserrat.className}`}
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 800,
                      }}
                    >
                      Informations Personnelles
                    </h2>
                  </div>
                  <div className="flex flex-col items-center mb-4 sm:mb-6">
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 mb-4">
                      {imagePreview ? (
                        <Image
                          fill
                          src={imagePreview}
                          alt="Aperçu de la photo de profil"
                          className="w-full h-full rounded-full object-cover border-4 border-gray-200 shadow-lg"
                        />
                      ) : (
                        <UserCircle className="w-full h-full text-gray-400" />
                      )}
                    </div>
                    <label
                      htmlFor="profileImage"
                      className="cursor-pointer bg-gray-100 text-gray-800 px-3 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-gray-200 transition-all duration-200 shadow-md font-medium text-sm sm:text-base"
                    >
                      Choisir une photo
                      <input
                        type="file"
                        id="profileImage"
                        name="profileImage"
                        accept="image/*"
                        onChange={handleChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                      >
                        Prénom
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-800 placeholder-gray-500 shadow-sm text-sm sm:text-base"
                        placeholder="Votre prénom"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                      >
                        Nom
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-800 placeholder-gray-500 shadow-sm text-sm sm:text-base"
                        placeholder="Votre nom"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-800 placeholder-gray-500 shadow-sm text-sm sm:text-base"
                      placeholder="votre.email@example.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                    >
                      Numéro de téléphone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-800 placeholder-gray-500 shadow-sm text-sm sm:text-base"
                      placeholder="+213 12 345 678"
                    />
                  </div>
                </motion.div>

                {/* Section Adresse */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="space-y-4 sm:space-y-6 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-[inset_0_0_10px_rgba(0,0,0,0.2)]"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Home className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
                    <h2
                      className={`text-lg sm:text-xl font-semibold text-gray-800 ${montserrat.className}`}
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 800,
                      }}
                    >
                      Adresse
                    </h2>
                  </div>
                  <div>
                    <label
                      htmlFor="street"
                      className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                    >
                      Rue
                    </label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      value={formData.address.street}
                      onChange={handleChange}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-800 placeholder-gray-500 shadow-sm text-sm sm:text-base"
                      placeholder="Nom de la rue"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label
                        htmlFor="city"
                        className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                      >
                        Ville
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.address.city}
                        onChange={handleChange}
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-800 placeholder-gray-500 shadow-sm text-sm sm:text-base"
                        placeholder="Ville"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="province"
                        className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                      >
                        Province
                      </label>
                      <input
                        type="text"
                        id="province"
                        name="province"
                        value={formData.address.province}
                        onChange={handleChange}
                        list="provinces-list"
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-800 placeholder-gray-500 shadow-sm text-sm sm:text-base"
                        placeholder="Saisir ou sélectionner une province"
                      />
                      <datalist
                        id="provinces-list"
                        className="max-h-40 overflow-y-auto"
                      >
                        {filteredProvinces.map((province) => (
                          <option key={province} value={province} />
                        ))}
                      </datalist>
                    </div>
                  </div>
                </motion.div>

                {/* Section Sécurité */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="space-y-4 sm:space-y-6 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-[inset_0_0_10px_rgba(0,0,0,0.2)]"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
                    <h2
                      className={`text-lg sm:text-xl font-semibold text-gray-800 ${montserrat.className}`}
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 800,
                      }}
                    >
                      Sécurité
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                      >
                        Nouveau mot de passe
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-800 placeholder-gray-500 shadow-sm text-sm sm:text-base"
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                      >
                        Confirmer le mot de passe
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-800 placeholder-gray-500 shadow-sm text-sm sm:text-base"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Bouton de soumission */}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-black text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md transform hover:-translate-y-1 font-semibold text-sm sm:text-base"
                  >
                    Sauvegarder les modifications
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Styles CSS */}
      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          [data-animate] {
            animation: none !important;
            transition: none !important;
          }
        }
        /* Ajout d'un style pour le datalist sur mobile */
        input[list="provinces-list"]::-webkit-calendar-picker-indicator {
          display: none;
        }
        datalist {
          max-height: 10rem;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
}
