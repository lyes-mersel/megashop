"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Settings } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

// Components
import IsLoading from "@/components/portal/IsLoading";
import Error from "@/components/portal/Error";
import PersonalInfo from "@/components/portal/admin/settingspage/PersonalInfo";
import AddressInfo from "@/components/portal/admin/settingspage/AddressInfo";
import Security from "@/components/portal/admin/settingspage/Security";

// Fonts
import { montserrat } from "@/styles/fonts";

// Types & utils
import { UserFromAPI } from "@/lib/types/user.types";
import { fetchDataFromAPI } from "@/lib/utils/fetchData";

export default function AdminSettings() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserFromAPI | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
      const result = await fetchDataFromAPI<UserFromAPI>(
        `/api/users/${userId}`
      );
      if (result.error) {
        toast.error(result.error);
        console.error(result.error);
      } else {
        setUser(result.data);
      }
      setIsLoading(false);
      hasFetchedRef.current = true;
    };
    fetchData();
  }, [status, session]);

  const handleUpdateUser = (updatedUser: UserFromAPI) => {
    setUser(updatedUser);
    toast.success("Informations mises à jour avec succès");
  };

  if (isLoading) return <IsLoading />;
  if (!user) return <Error />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-6 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <Settings className="h-6 w-6 sm:h-8 sm:w-8 text-black" />
            <h1
              className={`text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight ${montserrat.className}`}
            >
              Paramètres Administrateur
            </h1>
          </div>
          <p className="text-gray-600 mt-2 text-base sm:text-lg">
            Gérez vos informations personnelles avec style et simplicité.
          </p>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/50 p-4 sm:p-6">
            <PersonalInfo user={user} onUpdate={handleUpdateUser} />
            <AddressInfo user={user} onUpdate={handleUpdateUser} />
            <Security user={user} onUpdate={handleUpdateUser} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
