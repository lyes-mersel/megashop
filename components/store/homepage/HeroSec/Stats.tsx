"use client";

import * as motion from "framer-motion/client";

// UI Components
import { Separator } from "@/components/ui/separator";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { useEffect, useState } from "react";
const Stats = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalVendors, setTotalVendors] = useState(0);

  // Fetch the stats from the API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/metadata/stats");
        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }
        const data = await response.json();
        setTotalProducts(data.data.totalProducts);
        setTotalUsers(data.data.totalUsers);
        setTotalVendors(data.data.totalVendors);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <motion.div
      initial={{ y: "100px", opacity: 0 }}
      whileInView={{ y: "0", opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 1.6, duration: 0.6 }}
      className="flex md:h-full md:max-h-11 lg:max-h-[52px] xl:max-h-[68px] items-center justify-center md:justify-start flex-wrap sm:flex-nowrap md:space-x-3 lg:space-x-6 xl:space-x-8 md:mt-8 md:mb-[116px]"
    >
      <div className="flex flex-col">
        <span className="font-bold text-2xl md:text-xl lg:text-3xl xl:text-[40px] xl:mb-2">
          <AnimatedCounter from={0} to={totalProducts} />+
        </span>
        <span className="text-xs xl:text-base text-black/60 text-nowrap">
          Produits de Qualité
        </span>
      </div>
      <Separator
        className="ml-6 md:ml-0 h-12 md:h-full bg-black/10"
        orientation="vertical"
      />
      <div className="flex flex-col ml-6 md:ml-0">
        <span className="font-bold text-2xl md:text-xl lg:text-3xl xl:text-[40px] xl:mb-2">
          <AnimatedCounter from={0} to={totalUsers} />+
        </span>
        <span className="text-xs xl:text-base text-black/60 text-nowrap">
          Clients Satisfaits
        </span>
      </div>
      <Separator
        className="hidden sm:block sm:h-12 md:h-full ml-6 md:ml-0 bg-black/10"
        orientation="vertical"
      />
      <div className="flex flex-col w-full text-center sm:w-auto sm:text-left mt-3 sm:mt-0 sm:ml-6 md:ml-0">
        <span className="font-bold text-2xl md:text-xl lg:text-3xl xl:text-[40px] xl:mb-2">
          <AnimatedCounter from={0} to={totalVendors} />+
        </span>
        <span className="text-xs xl:text-base text-black/60 text-nowrap">
          Vendeurs de Confiance
        </span>
      </div>
    </motion.div>
  );
};

export default Stats;
