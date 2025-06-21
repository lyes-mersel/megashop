"use client";

import { BarChart2 } from "lucide-react";
import { montserrat } from "@/styles/fonts";

export default function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-6 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <BarChart2 className="h-6 w-6 sm:h-8 sm:w-8 text-black animate-pulse" />
            <h1
              className={`text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight ${montserrat.className}`}
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Tableau de bord
            </h1>
          </div>
          <p className="mt-1 sm:mt-2 text-base sm:text-lg text-gray-600">
            Aperçu des performances de votre boutique
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-10">
          {/* Welcome Card Skeleton */}
          <div className="bg-black rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden h-auto sm:h-48">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded mb-4"></div>
              <div className="h-6 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded"></div>
            </div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-3 sm:p-4 border-2 border-gray-200 h-[72px] sm:h-[84px] flex items-center animate-pulse"
              >
                <div className="flex items-center gap-2 sm:gap-3 w-full">
                  <div className="bg-gray-200 p-2 rounded-full w-10 h-10"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-5 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Ratings Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-10">
          {[...Array(2)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-3 sm:p-4 border-2 border-gray-200 animate-pulse"
            >
              <div className="flex items-center justify-between gap-2 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="bg-gray-200 p-2 rounded-full w-10 h-10"></div>
                  <div>
                    <div className="h-3 bg-gray-200 rounded mb-2 w-24"></div>
                    <div className="h-5 bg-gray-200 rounded mb-1 w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, starIndex) => (
                    <div
                      key={starIndex}
                      className="w-4 h-4 bg-gray-200 rounded"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart Skeleton */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border-2 border-black">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-3">
            <div className="h-6 bg-gray-200 rounded w-64 animate-pulse"></div>
            <div className="flex gap-2 sm:gap-3">
              <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
          </div>
          <div className="h-[300px] sm:h-[400px] bg-gray-100 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
} 