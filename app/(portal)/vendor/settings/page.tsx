"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Image from "next/image";
import {
  Camera,
  User,
  MapPin,
  Phone,
  Shield,
  CreditCard,
  Settings,
} from "lucide-react";

// Fonts
import { montserrat } from "@/styles/fonts";

// Types & utils
import { UserFromAPI } from "@/lib/types/user.types";
import { getImageUrlFromPublicId } from "@/lib/utils";
import { fetchDataFromAPI } from "@/lib/utils/fetchData";

// Components
import PersonalInfo from "@/components/portal/vendor/settingspage/PersonalInfo";
import AddressInfo from "@/components/portal/vendor/settingspage/AddressInfo";
import ContactInfo from "@/components/portal/vendor/settingspage/ContactInfo";
import Security from "@/components/portal/vendor/settingspage/Security";
import VendorSettings from "@/components/portal/vendor/settingspage/VendorSettings";
import IsLoading from "@/components/portal/IsLoading";
import UserNotFound from "@/components/portal/UserNotFound";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserFromAPI | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("personal");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasFetchedRef = useRef(false);
  useEffect(() => {
    if (status === "loading" || hasFetchedRef.current) return;
    const userId = session?.user.id;
    if (!userId) {
      setIsLoading(false);
      toast.error("Vous devez être connecté pour accéder à cette page.");
      console.log("No user ID found in session");
      return;
    }
    const fetchData = async () => {
      setIsLoading(true);
      const userResult = await fetchDataFromAPI<UserFromAPI>(
        `/api/users/${userId}`
      );
      if (userResult.error) {
        toast.error(userResult.error);
        console.error(userResult.error);
      } else {
        setUser(userResult.data);
        if (userResult.data?.imagePublicId) {
          setProfileImage(
            getImageUrlFromPublicId(userResult.data.imagePublicId)
          );
        }
      }
      setIsLoading(false);
      hasFetchedRef.current = true;
    };
    fetchData();
  }, [status, session]);

  const handleProfileImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file && user) {
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
        const newImageUrl = getImageUrlFromPublicId(result.data!.imagePublicId);
        setProfileImage(newImageUrl);
        setUser({ ...user, imagePublicId: result.data!.imagePublicId });
      }
      setIsLoading(false);
    }
  };

  if (isLoading) return <IsLoading />;
  if (!user) return <UserNotFound />;

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-gray-50 to-gray-200 py-6 px-4 sm:pl-10 sm:pr-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, 15, -15, 10, -10, 5, -5, 0] }}
              transition={{ duration: 1.2, ease: "easeInOut", repeat: 0 }}
            >
              <Settings className="h-8 w-8 text-black" />
            </motion.div>
            <h1
              className={`text-3xl font-extrabold text-gray-900 tracking-tight ${montserrat.className}`}
            >
              Paramètres du compte
            </h1>
          </div>
        </div>
        <p className="mb-6 text-lg text-gray-700">
          Gérez vos informations personnelles, vos paramètres de sécurité et vos
          options de vendeur ici.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] lg:grid-cols-[250px_1fr] gap-8">
          <aside className="shrink-0">
            <div className="bg-white rounded-xl border shadow-sm p-4">
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
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-1.5 rounded-full bg-black text-white hover:bg-black/80 transition-colors"
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
                <h2 className="text-lg font-medium">
                  {user.prenom} {user.nom}
                </h2>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <div className="flex flex-col w-full gap-1">
                {[
                  { value: "personal", icon: User, label: "Informations" },
                  { value: "address", icon: MapPin, label: "Adresse" },
                  { value: "contact", icon: Phone, label: "Contact" },
                  { value: "security", icon: Shield, label: "Sécurité" },
                  {
                    value: "vendor",
                    icon: CreditCard,
                    label: "Paramètres vendeur",
                  },
                ].map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`w-full text-left px-3 py-2 flex items-center gap-2 rounded-md ${
                      activeTab === tab.value
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>
          <div className="w-full">
            {activeTab === "personal" && (
              <PersonalInfo user={user} onUpdate={setUser} />
            )}
            {activeTab === "address" && (
              <AddressInfo
                address={user.adresse}
                userId={user.id}
                onUpdate={(updatedAddress) =>
                  setUser({ ...user, adresse: updatedAddress })
                }
              />
            )}
            {activeTab === "contact" && (
              <ContactInfo user={user} onUpdate={setUser} />
            )}
            {activeTab === "security" && <Security userId={user.id} />}
            {activeTab === "vendor" && (
              <VendorSettings
                user={user}
                onUpdate={(updatedVendorStatus) =>
                  setUser({ ...user, vendeur: updatedVendorStatus })
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
