"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart2,
  ShoppingBag,
  UserCheck,
  DollarSign,
  Settings,
  LogOut,
  Bell,
  Package,
  Mail,
  Menu,
  X,
} from "lucide-react";
import { Montserrat } from "next/font/google";
import Image from "next/image";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: "800",
  display: "swap",
});

export default function VendeurLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const fileInputRef = useRef(null);

  // Détection de la largeur d'écran pour le mode mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Vérifier au chargement initial
    checkIfMobile();

    // Ajouter l'écouteur d'événement
    window.addEventListener("resize", checkIfMobile);

    // Nettoyer l'écouteur d'événement
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Fermer le menu mobile au changement de route
  useEffect(() => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [pathname, isMobile]);

  // Information du vendeur
  const [vendeurInfo, setVendeurInfo] = useState<{
    name: string;
    email: string;
    photoUrl: string | null;
  }>({
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
    photoUrl: null, // null pour utiliser l'icône par défaut
  });

  const navItems = [
    { name: "Tableau de bord", href: "/seller/dashboard", icon: BarChart2 },
    { name: "Boutique", href: "/seller/shop", icon: ShoppingBag },
    { name: "Ventes", href: "/seller/sells", icon: DollarSign },
    { name: "Commandes", href: "/seller/orders", icon: Package },
    { name: "Notifications", href: "/seller/notifications", icon: Bell },
    { name: "Paramètres", href: "/seller/settings", icon: Settings },
  ];

  // Fonction pour gérer le clic sur la sidebar
  interface SidebarClickEvent extends React.MouseEvent<HTMLDivElement> {
    target: HTMLElement;
  }

  const handleSidebarClick = (e: SidebarClickEvent) => {
    // Sur mobile, ne pas changer l'état collapsed en cliquant sur la sidebar
    if (!isMobile && !e.target.closest("a") && !e.target.closest("button")) {
      setIsCollapsed(!isCollapsed);
    }
  };

  // Fonction pour gérer le changement de photo
  interface VendeurInfo {
    name: string;
    email: string;
    photoUrl: string | null;
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        setVendeurInfo((prevVendeurInfo: VendeurInfo) => ({
          ...prevVendeurInfo,
          photoUrl: event.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Fonction pour ouvrir le sélecteur de fichier
  const openFileSelector = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      (fileInputRef.current as HTMLInputElement).click();
    }
  };

  // Fonction pour basculer le menu mobile
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Header mobile avec bouton hamburger */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 h-16 bg-white z-50 border-b border-gray-200 flex items-center justify-between px-4 shadow-sm">
          <div className="flex items-center">
            <Image
              src="/manifest/favicon.svg"
              alt="Logo de l'application"
              width={50}
              height={50}
              className="object-contain"
              priority
            />
          </div>

          <div className="flex items-center gap-4">
            {/* Notification badge pour mobile */}
            <Link href="/seller/notifications" className="relative">
              <Bell className="h-6 w-6 text-gray-700" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                3
              </span>
            </Link>

            {/* Bouton hamburger */}
            <button
              className="p-1 rounded-md hover:bg-gray-100"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Overlay sombre pour le mode mobile quand le menu est ouvert */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar - fixe en desktop, slide-in en mobile */}
      <div
        className={`h-full bg-white flex flex-col shadow-lg z-50 border-r border-gray-200 transition-all duration-300 ${
          isMobile
            ? `fixed right-0 top-0 bottom-0 ${
                isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
              } w-3/4 max-w-xs`
            : `${isCollapsed ? "w-20" : "w-64"} fixed cursor-pointer`
        }`}
        onClick={isMobile ? undefined : handleSidebarClick}
      >
        {/* Entête de la sidebar - visible seulement en mobile ou en mode déployé sur desktop */}
        {(isMobile || !isCollapsed) && (
          <div
            className={`${
              isMobile ? "h-16" : ""
            } flex items-center justify-between px-4 py-3 border-b border-gray-200`}
          >
            {isMobile ? (
              <h2 className={`${montserrat.className} text-lg font-bold`}>
                Menu
              </h2>
            ) : (
              <div className="h-12 w-full flex items-center justify-center">
                <Image
                  src="/manifest/favicon.svg"
                  alt="Logo de l'application"
                  width={50}
                  height={50}
                  className="object-contain"
                  priority
                />
              </div>
            )}
            {isMobile && (
              <button onClick={toggleMobileMenu}>
                <X className="h-6 w-6 text-gray-700" />
              </button>
            )}
          </div>
        )}

        {/* Logo pour mode collapsé desktop uniquement */}
        {!isMobile && isCollapsed && (
          <div className="flex justify-center items-center py-4 border-b border-gray-200">
            <div className="w-50 h-12 flex items-center justify-center">
              <Image
                src="/manifest/favicon.svg"
                alt="Logo de l'application"
                width={50}
                height={50}
                className="object-contain"
                priority
              />
            </div>
          </div>
        )}

        {/* Profil Vendeur - Version simplifiée sur mobile ou mode déployé sur desktop */}
        {isMobile || !isCollapsed ? (
          <div className="mx-3 my-4 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg p-3 shadow-sm border border-gray-200 transition-all duration-300">
            <div className="flex items-start">
              {/* Avatar à gauche */}
              <div className="relative flex-shrink-0">
                <div
                  className={`${
                    isMobile ? "w-12 h-12" : "w-14 h-14"
                  } rounded-full overflow-hidden shadow-lg p-0.5 bg-white`}
                >
                  <div className="w-full h-full rounded-full overflow-hidden">
                    {vendeurInfo.photoUrl ? (
                      <Image
                        fill
                        src={vendeurInfo.photoUrl}
                        alt="Photo du vendeur"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-black flex items-center justify-center">
                        <UserCheck
                          className={`${
                            isMobile ? "h-6 w-6" : "h-7 w-7"
                          } text-white`}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <button
                  className="absolute -right-1 -bottom-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors border border-gray-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (fileInputRef.current) {
                      (fileInputRef.current as HTMLInputElement).click();
                    }
                  }}
                  title="Modifier photo"
                >
                  <Settings className="h-3 w-3 text-gray-600" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>

              {/* Informations à droite */}
              <div className="ml-3 flex-1 overflow-hidden">
                <h3
                  className={`${montserrat.className} text-sm font-bold text-gray-900 truncate`}
                >
                  {vendeurInfo.name}
                </h3>
                <div className="flex items-center mt-1 text-xs text-gray-500 w-full pr-1">
                  <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                  <p className="truncate w-full" title={vendeurInfo.email}>
                    {vendeurInfo.email}
                  </p>
                </div>
                <div className="mt-1">
                  <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                    Vendeur
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Profil simplifié quand replié sur desktop
          <div className="py-4 flex flex-col items-center border-b border-gray-200">
            <div
              className="w-12 h-12 rounded-full overflow-hidden shadow-md p-0.5 bg-white cursor-pointer"
              onClick={openFileSelector}
            >
              <div className="w-full h-full rounded-full overflow-hidden">
                {vendeurInfo.photoUrl ? (
                  <Image
                    fill
                    src={vendeurInfo.photoUrl}
                    alt="Photo du vendeur"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-black flex items-center justify-center">
                    <UserCheck className="h-6 w-6 text-white" />
                  </div>
                )}
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              className="hidden"
              accept="image/*"
            />
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center ${
                  isMobile ? "px-6 py-4" : "gap-4 py-3 px-6"
                } ${
                  isActive
                    ? "bg-gray-100 text-black font-medium" +
                      (isMobile ? "" : " border-r-4 border-black")
                    : "text-gray-700 hover:bg-gray-50"
                } transition-all duration-200`}
                onClick={isMobile ? toggleMobileMenu : undefined}
              >
                <item.icon
                  className={`${isMobile ? "h-6 w-6 mr-3" : "h-5 w-5"} ${
                    isActive ? "text-black" : "text-gray-500"
                  }`}
                />
                {(!isCollapsed || isMobile) && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bouton de déconnexion - toujours visible */}
        <div className="p-4 border-t border-gray-200">
          <button
            className={`flex items-center ${
              isMobile
                ? "px-6 py-4 gap-3"
                : `${isCollapsed ? "justify-center px-2" : "gap-4 px-6"} py-3`
            } w-full text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 rounded-lg`}
            onClick={(e) => {
              e.stopPropagation();
              // Logique de déconnexion
            }}
          >
            <LogOut className={`${isMobile ? "h-6 w-6" : "h-5 w-5"}`} />
            {(!isCollapsed || isMobile) && <span>Déconnexion</span>}
          </button>
        </div>
      </div>

      {/* Contenu principal en pleine largeur */}
      <div
        className={`w-full transition-all duration-300 h-screen overflow-auto ${
          isMobile
            ? "pt-16" // Espace pour le header mobile
            : isCollapsed
            ? "ml-20"
            : "ml-64"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
