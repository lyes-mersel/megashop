import { LucideIcon } from "lucide-react";
import { getColorClasses } from "@/lib/constants/colors";

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  subtitle?: string;
  color: string;
}

export default function StatsCard({ icon: Icon, title, value, subtitle, color }: StatsCardProps) {
  const colorClasses = getColorClasses(color);

  return (
    <div className={`data-card group bg-white/30 backdrop-blur-lg group-hover:backdrop-blur-none border-2 ${colorClasses} p-4 sm:p-6 rounded-xl shadow-xl transform transition-all duration-300 sm:hover:scale-105 sm:hover:shadow-${color}-500/50`}>
      <div className="flex items-center gap-3 sm:gap-4">
        <Icon className={`h-8 w-8 sm:h-10 sm:w-10 ${colorClasses} group-hover:animate-bounce`} />
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">
            {title}
          </h3>
          <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs sm:text-sm text-gray-600">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 