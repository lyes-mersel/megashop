import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortField: string;
  onSortFieldChange: (value: string) => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: (value: "asc" | "desc") => void;
  type: "client" | "vendor";
}

export default function UserFilters({
  search,
  onSearchChange,
  sortField,
  onSortFieldChange,
  sortOrder,
  onSortOrderChange,
  type,
}: UserFiltersProps) {
  const sortFields = type === "client" 
    ? [
        { value: "name", label: "Nom" },
        { value: "createdAt", label: "Date d'inscription" },
        { value: "orders", label: "Commandes" },
        { value: "expenses", label: "Dépenses" },
      ]
    : [
        { value: "name", label: "Nom" },
        { value: "createdAt", label: "Date d'inscription" },
        { value: "totalVentes", label: "Total ventes" },
        { value: "totalProduits", label: "Total produits" },
        { value: "produitsVendus", label: "Produits vendus" },
      ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <Input
        placeholder="Rechercher..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-sm"
      />
      <Select value={sortField} onValueChange={onSortFieldChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Trier par" />
        </SelectTrigger>
        <SelectContent>
          {sortFields.map((field) => (
            <SelectItem key={field.value} value={field.value}>
              {field.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={sortOrder} onValueChange={onSortOrderChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Ordre" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">Croissant</SelectItem>
          <SelectItem value="desc">Décroissant</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
} 