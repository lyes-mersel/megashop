export interface Produit {
  id: string;
  nom: string;
  prix: number;
  noteMoyenne?: number;
}

export interface ProduitPlusRevenu extends Produit {
  totalRevenu: number;
  quantiteVendue: number;
}

export interface TimeSeriesData {
  sales: number;
  itemsSold: number;
}

export interface WeekData extends TimeSeriesData {
  day: string;
}

export interface MonthData extends TimeSeriesData {
  day: string;
}

export interface YearData extends TimeSeriesData {
  month: string;
}

export interface AdminAnalytics {
  totalVentes: number | null;
  totalProduits: number;
  utilisateurs: {
    clients: number;
    vendeurs: number;
  };
  produitsVendus: number | null;
  meilleurProduit: Produit | null;
  pireProduit: Produit | null;
  produitPlusRevenu: ProduitPlusRevenu | null;
  weekData: WeekData[];
  monthData: MonthData[];
  yearData: YearData[];
}

export interface VendorAnalytics {
  totalVentes: number | null;
  totalProduits: number;
  produitsVendus: number | null;
  meilleurProduit: Produit | null;
  pireProduit: Produit | null;
  produitPlusRevenu: ProduitPlusRevenu | null;
  weekData: WeekData[];
  monthData: MonthData[];
  yearData: YearData[];
}
