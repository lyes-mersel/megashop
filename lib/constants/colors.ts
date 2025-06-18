export const colorMap = {
  emerald: "border-emerald-500 text-emerald-500",
  indigo: "border-indigo-500 text-indigo-500",
  violet: "border-violet-500 text-violet-500",
  cyan: "border-cyan-500 text-cyan-500",
  amber: "border-amber-500 text-amber-500",
  rose: "border-rose-500 text-rose-500",
  teal: "border-teal-500 text-teal-500",
  purple: "border-purple-500 text-purple-500",
  red: "border-red-500 text-red-500",
  blue: "border-blue-500 text-blue-500",
  green: "border-green-500 text-green-500",
  yellow: "border-yellow-500 text-yellow-500",
  pink: "border-pink-500 text-pink-500",
  fuchsia: "border-fuchsia-500 text-fuchsia-500",
} as const;

export type ColorKey = keyof typeof colorMap;

export const getColorClasses = (color: string) => {
  return colorMap[color as ColorKey] || "border-gray-500 text-gray-500";
}; 