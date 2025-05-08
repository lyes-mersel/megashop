"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import {
  Camera,
  CreditCard,
  User,
  Shield,
  MapPin,
  Phone,
  Settings as SettingsIcon,
} from "lucide-react";
import Image from "next/image";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: "800",
  display: "swap",
});

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
}

interface AddressInfo {
  address: string;
  city: string;
  province: string; // Changé de "state" à "province"
  postalCode: string;
}

interface ContactInfo {
  phone: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface VendorInfo {
  businessName: string;
  accountNumber: string;
  bankName: string;
  taxId: string;
}

export default function SettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVendorActive, setIsVendorActive] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("personal");

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@exemple.com",
  });

  const [addressInfo, setAddressInfo] = useState<AddressInfo>({
    address: "123 Rue Principale",
    city: "Béjaïa", // Changé de "Paris" à "Béjaïa"
    province: "Béjaïa", // Changé de "state" à "province" et valeur par défaut à "Béjaïa"
    postalCode: "06000", // Changé de "75001" à "06000" (code postal de Béjaïa)
  });

  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    phone: "+213 6 12 34 56 78", // Changé de "+33" à "+213"
  });

  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [vendorInfo, setVendorInfo] = useState<VendorInfo>({
    businessName: "",
    accountNumber: "",
    bankName: "",
    taxId: "",
  });

  // Liste des provinces algériennes
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
    "Bordj Bou Arreridj",
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
    "El Meniaa",
  ];

  // État pour gérer l'input de recherche/filtrage des provinces
  const [provinceInput, setProvinceInput] = useState<string>(
    addressInfo.province
  );
  const [filteredProvinces, setFilteredProvinces] =
    useState<string[]>(provinces);
  const [isProvinceDropdownOpen, setIsProvinceDropdownOpen] =
    useState<boolean>(false);

  // Filtrer les provinces en fonction de l'input
  const handleProvinceInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setProvinceInput(value);
    setAddressInfo({ ...addressInfo, province: value });

    const filtered = provinces.filter((province) =>
      province.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredProvinces(filtered);
    setIsProvinceDropdownOpen(true);
  };

  // Sélectionner une province depuis la liste
  const handleProvinceSelect = (province: string) => {
    setProvinceInput(province);
    setAddressInfo({ ...addressInfo, province });
    setIsProvinceDropdownOpen(false);
  };

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

  const handleAddressInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressInfo({ ...addressInfo, [e.target.name]: e.target.value });
  };

  const handleContactInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactInfo({ ...contactInfo, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleVendorInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVendorInfo({ ...vendorInfo, [e.target.name]: e.target.value });
  };

  const handleDeleteStore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsVendorActive(false);
      setVendorInfo({
        businessName: "",
        accountNumber: "",
        bankName: "",
        taxId: "",
      });
      toast.success("Boutique supprimée avec succès");
    }, 700);
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
        toast.success("Image de profil mise à jour avec succès");
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handlePersonalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Informations personnelles mises à jour avec succès");
    }, 700);
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Adresse mise à jour avec succès");
    }, 700);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Coordonnées mises à jour avec succès");
    }, 700);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
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
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Mot de passe mis à jour avec succès");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }, 700);
  };

  const handleVendorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVendorActive) {
      setIsVendorActive(true);
      toast.success("Statut vendeur activé avec succès");
      return;
    }
    if (
      !vendorInfo.businessName ||
      !vendorInfo.accountNumber ||
      !vendorInfo.bankName
    ) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Informations vendeur enregistrées avec succès");
    }, 700);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-6 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Titre "Paramètres du Vendeur" avec texte descriptif en dessous */}
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <SettingsIcon className="h-8 w-8 text-black" />
            <h1
              className={`text-3xl font-extrabold text-gray-900 tracking-tight ${montserrat.className}`}
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Paramètres du Vendeur
            </h1>
          </div>
          <p className="text-lg text-gray-600 mt-2">
            Gérez vos informations et configurez votre boutique avec simplicité.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
          {/* Barre latérale */}
          <aside className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt="Profil"
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <User className="h-12 w-12 text-gray-500" />
                  )}
                </div>
                <button
                  onClick={triggerFileInput}
                  className="absolute bottom-0 right-0 p-1.5 rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                  className="hidden"
                />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                {personalInfo.firstName} {personalInfo.lastName}
              </h2>
              <p className="text-sm text-gray-600">{personalInfo.email}</p>
            </div>

            <div className="flex flex-col gap-2">
              {[
                { value: "personal", icon: User, label: "Informations" },
                { value: "address", icon: MapPin, label: "Adresse" },
                { value: "contact", icon: Phone, label: "Coordonnées" },
                { value: "security", icon: Shield, label: "Sécurité" },
                {
                  value: "vendor",
                  icon: CreditCard,
                  label: "Paramètres Vendeur",
                },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`w-full text-left px-4 py-2 flex items-center gap-2 rounded-lg ${
                    activeTab === tab.value ? "bg-gray-100" : "hover:bg-gray-50"
                  } transition-all duration-200`}
                >
                  <tab.icon className="h-5 w-5 text-gray-700" />
                  <span className="text-gray-900">{tab.label}</span>
                </button>
              ))}
            </div>
          </aside>

          {/* Contenu principal */}
          <div className="space-y-6">
            {/* Informations personnelles */}
            {activeTab === "personal" && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-700" />
                  Informations personnelles
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Mettez à jour vos informations personnelles.
                </p>
                <form onSubmit={handlePersonalSubmit} className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Prénom
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        value={personalInfo.firstName}
                        onChange={handlePersonalInfoChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-gray-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Nom
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        value={personalInfo.lastName}
                        onChange={handlePersonalInfoChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-gray-800"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={personalInfo.email}
                      onChange={handlePersonalInfoChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-gray-800"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? "Enregistrement..." : "Enregistrer"}
                  </button>
                </form>
              </div>
            )}

            {/* Adresse */}
            {activeTab === "address" && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-700" />
                  Adresse
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Mettez à jour votre adresse de livraison.
                </p>
                <form onSubmit={handleAddressSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Adresse
                    </label>
                    <input
                      id="address"
                      name="address"
                      value={addressInfo.address}
                      onChange={handleAddressInfoChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-gray-800"
                    />
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Ville
                      </label>
                      <input
                        id="city"
                        name="city"
                        value={addressInfo.city}
                        onChange={handleAddressInfoChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-gray-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="province"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Province
                      </label>
                      <div className="relative">
                        <input
                          id="province"
                          name="province"
                          type="text"
                          value={provinceInput}
                          onChange={handleProvinceInputChange}
                          onFocus={() => setIsProvinceDropdownOpen(true)}
                          onBlur={() =>
                            setTimeout(
                              () => setIsProvinceDropdownOpen(false),
                              200
                            )
                          }
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-gray-800"
                          autoComplete="off"
                        />
                        {isProvinceDropdownOpen && (
                          <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg max-h-60 overflow-y-auto shadow-lg">
                            {filteredProvinces.length > 0 ? (
                              filteredProvinces.map((province) => (
                                <li
                                  key={province}
                                  onClick={() => handleProvinceSelect(province)}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
                                >
                                  {province}
                                </li>
                              ))
                            ) : (
                              <li className="px-4 py-2 text-gray-500">
                                Aucune province trouvée
                              </li>
                            )}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="postalCode"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Code postal
                    </label>
                    <input
                      id="postalCode"
                      name="postalCode"
                      value={addressInfo.postalCode}
                      onChange={handleAddressInfoChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-gray-800"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? "Enregistrement..." : "Enregistrer"}
                  </button>
                </form>
              </div>
            )}

            {/* Coordonnées */}
            {activeTab === "contact" && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-gray-700" />
                  Coordonnées
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Mettez à jour vos informations de contact.
                </p>
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Téléphone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      value={contactInfo.phone}
                      onChange={handleContactInfoChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-gray-800"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Utilisé pour les notifications de commande
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? "Enregistrement..." : "Enregistrer"}
                  </button>
                </form>
              </div>
            )}

            {/* Sécurité */}
            {activeTab === "security" && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-gray-700" />
                  Sécurité
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Mettez à jour votre mot de passe pour sécuriser votre compte.
                </p>
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="currentPassword"
                      className="block text-sm font-medium text-gray-700"
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
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-gray-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nouveau mot de passe
                    </label>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-gray-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700"
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
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-gray-800"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? "Mise à jour..." : "Mettre à jour"}
                  </button>
                </form>
              </div>
            )}

            {/* Paramètres vendeur */}
            {activeTab === "vendor" && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-gray-700" />
                      Paramètres Vendeur
                    </h2>
                    <p className="text-sm text-gray-600">
                      Configurez les informations de votre boutique.
                    </p>
                  </div>
                  {isVendorActive && (
                    <button
                      onClick={handleDeleteStore}
                      className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md disabled:opacity-50 font-bold"
                      disabled={isLoading}
                    >
                      {isLoading ? "Suppression..." : "Supprimer la boutique"}
                    </button>
                  )}
                </div>
                <form onSubmit={handleVendorSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="businessName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nom de l’entreprise
                    </label>
                    <input
                      id="businessName"
                      name="businessName"
                      value={vendorInfo.businessName}
                      onChange={handleVendorInfoChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-gray-800"
                      placeholder="Ex: Chic & Tendance"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="accountNumber"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Numéro de compte bancaire
                    </label>
                    <input
                      id="accountNumber"
                      name="accountNumber"
                      value={vendorInfo.accountNumber}
                      onChange={handleVendorInfoChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-gray-800"
                      placeholder="Ex: 123456789"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="bankName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nom de la banque
                    </label>
                    <input
                      id="bankName"
                      name="bankName"
                      value={vendorInfo.bankName}
                      onChange={handleVendorInfoChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-gray-800"
                      placeholder="Ex: Banque Nationale"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="taxId"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Identifiant fiscal (optionnel)
                    </label>
                    <input
                      id="taxId"
                      name="taxId"
                      value={vendorInfo.taxId}
                      onChange={handleVendorInfoChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-gray-800"
                      placeholder="Ex: 123-45-6789"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md disabled:opacity-50"
                      disabled={isLoading}
                    >
                      {isLoading
                        ? "Enregistrement..."
                        : isVendorActive
                        ? "Mettre à jour"
                        : "Activer le statut vendeur"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
