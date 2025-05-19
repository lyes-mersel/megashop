"use client";

import Image from "next/image";
import { Bell, Mail, User } from "lucide-react";
import { UserInfo } from "@/lib/types/ui/portalSideBar.types";

interface ProfileCardProps {
  userInfo: UserInfo;
  isMobile: boolean;
  isCollapsed: boolean;
  montserratVariable: string;
}

export default function ProfileCard({
  userInfo,
  isMobile,
  isCollapsed,
  montserratVariable,
}: ProfileCardProps) {
  const { name, email, photoUrl, role, badgeColor } = userInfo;

  if (isMobile || !isCollapsed) {
    return (
      <div className="mx-3 my-4 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg p-3 shadow-sm border border-gray-200 transition-all duration-300">
        <div className="flex items-start">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div
              className={`${
                isMobile ? "w-12 h-12" : "w-14 h-14"
              } rounded-full overflow-hidden shadow-lg p-0.5 bg-white`}
            >
              <div className="w-full h-full rounded-full overflow-hidden">
                {photoUrl ? (
                  <Image
                    width={50}
                    height={50}
                    src={photoUrl}
                    alt={name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-black flex items-center justify-center">
                    <User
                      className={`${
                        isMobile ? "h-6 w-6" : "h-7 w-7"
                      } text-white`}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* User info */}
          <div className="ml-3 flex-1 overflow-hidden">
            <h3
              className={`${montserratVariable} font-montserrat text-sm font-bold text-gray-900 truncate`}
            >
              {name}
            </h3>
            <div className="flex items-center mt-1 text-xs text-gray-500 w-full pr-1">
              {role === "Administrateur" ? (
                <Bell className="h-3 w-3 mr-1 flex-shrink-0" />
              ) : (
                <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
              )}
              <p className="truncate w-full" title={email}>
                {email}
              </p>
            </div>
            <div className="mt-1">
              <span
                className={`px-2 py-0.5 ${badgeColor} text-xs rounded-full font-medium`}
              >
                {role}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    // Simplified profile for collapsed desktop sidebar
    return (
      <div className="py-4 flex flex-col items-center border-b border-gray-200">
        <div className="w-13 h-13 rounded-full overflow-hidden shadow-md p-0.5 bg-white">
          <div className="w-full h-full relative bg-black flex items-center justify-center rounded-full">
            {photoUrl ? (
              <Image
                width={50}
                height={50}
                src={photoUrl}
                alt={name}
                className="text-black bg-white rounded-full"
                priority
              />
            ) : (
              <User className="text-white bg-black" />
            )}
          </div>
        </div>
      </div>
    );
  }
}
