"use client";

import ads from "@/lib/data/ads";
import { montserrat } from "@/styles/fonts";
import Image from "next/image";
import { useEffect, useState } from "react";

const AdsPannel = () => {
  const [currentAd, setCurrentAd] = useState(0);

  // Gestion du carrousel publicitaire
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev === ads.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index: number) => {
    setCurrentAd(index);
  };

  return (
    <div
      className={`${ads[currentAd].bgColor} rounded-2xl shadow-lg overflow-hidden mb-8 ${ads[currentAd].textColor}`}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between h-72 sm:h-56 md:h-64">
        <div className="w-full sm:w-1/2 p-6 flex flex-col justify-center">
          <h2
            className={`text-2xl md:text-3xl font-bold ${montserrat.className}`}
          >
            {ads[currentAd].title}
          </h2>
          <p className={`text-sm md:text-base mt-4 ${montserrat.className}`}>
            {ads[currentAd].description}
          </p>
        </div>
        <div className="w-full sm:w-1/2 flex items-center justify-center">
          <Image
            src={ads[currentAd].image}
            alt={ads[currentAd].title}
            className="object-cover object-center"
            width={
              ads[currentAd].imageWidth
                ? parseInt(ads[currentAd].imageWidth)
                : undefined
            }
            height={
              ads[currentAd].imageHeight
                ? parseInt(ads[currentAd].imageHeight)
                : undefined
            }
            style={{
              width: ads[currentAd].imageWidth,
              height: ads[currentAd].imageHeight,
            }}
          />
        </div>
      </div>
      <div className="flex justify-center gap-2 py-4 bg-black/20">
        {ads.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              currentAd === index ? "bg-white w-4" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default AdsPannel;
