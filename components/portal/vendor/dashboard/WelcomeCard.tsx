"use client";

import Image from "next/image";
import { montserrat } from "@/styles/fonts";

interface WelcomeCardProps {
  firstName: string;
  lastName: string;
}

export default function WelcomeCard({ firstName, lastName }: WelcomeCardProps) {
  return (
    <div className="bg-black rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden transition-all hover:shadow-2xl transform hover:-translate-y-1 h-auto sm:h-48">
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white opacity-10 rounded-full"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 h-full">
        <div className="text-center sm:text-left">
          <h1
            className={`welcome-text text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight ${montserrat.className} relative z-10`}
          >
            Bienvenue,
          </h1>
          <p
            className={`name-text text-lg sm:text-xl mt-2 sm:mt-4 ${montserrat.className}`}
          >
            {firstName} {lastName}
          </p>
          <p className="greeting-text text-base sm:text-lg mt-2 sm:mt-4 text-gray-300">
            Journée pleine de bonheur
          </p>
        </div>
        <div className="flex-shrink-0">
          <Image
            src="/images/image.png"
            alt="Vendor Dashboard Illustration"
            width={251}
            height={191}
            className="welcome-image w-32 sm:w-40 md:w-48 lg:w-64 h-auto object-contain opacity-100 transition-all duration-300 hover:opacity-100"
          />
        </div>
      </div>
    </div>
  );
} 