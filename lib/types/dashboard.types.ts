export type TimeSeriesData = {
  sales: number;
  itemsSold: number;
};

export type WeekData = TimeSeriesData & {
  day: string;
};

export type MonthData = TimeSeriesData & {
  day: string;
};

export type YearData = TimeSeriesData & {
  month: string;
};

export type ProductStats = {
  id: string;
  nom: string;
  noteMoyenne: string;
  totalEvaluations: number;
};

export type ProductWithRevenue = {
  id: string;
  nom: string;
  prix: string;
  totalRevenu: number;
  quantiteVendue: number;
};

export type ProductWithQuantity = {
  id: string;
  nom: string;
  prix: string;
  quantiteVendue: number;
};

export type AdminDashboardStats = {
  totalVentes: string;
  totalProduits: number;
  utilisateurs: {
    clients: number;
    vendeurs: number;
  };
  produitsVendus: number;
  meilleurProduit: ProductStats;
  pireProduit: ProductStats;
  produitPlusRevenu: ProductWithRevenue | null;
  produitPlusVendu: ProductWithQuantity | null;
  weekData: WeekData[];
  monthData: MonthData[];
  yearData: YearData[];
};

export type VendorDashboardStats = {
  totalVentes: number | null;
  totalProduits: number;
  produitsVendus: number | null;
  meilleurProduit: ProductStats | null;
  pireProduit: ProductStats | null;
  produitPlusRevenu: ProductWithRevenue | null;
  weekData: WeekData[];
  monthData: MonthData[];
  yearData: YearData[];
}; 