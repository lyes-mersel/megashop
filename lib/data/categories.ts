import { CategoryFromAPI } from "@/lib/types/category.types";

const categories: CategoryFromAPI[] = [
  {
    id: "1",
    nom: "Hauts",
    description:
      "T-shirts, chemises, pulls et autres vêtements pour le haut du corps.",
  },
  {
    id: "2",
    nom: "Bas",
    description:
      "Pantalons, jeans, shorts et autres vêtements pour le bas du corps.",
  },
  {
    id: "3",
    nom: "Robes & Ensembles",
    description: "Robes et ensembles assortis pour toutes occasions.",
  },
  {
    id: "4",
    nom: "Vestes & Manteaux",
    description: "Vestes légères, manteaux d'hiver et blousons.",
  },
  {
    id: "5",
    nom: "Chaussures",
    description: "Baskets, bottes, sandales et autres types de chaussures.",
  },
  {
    id: "6",
    nom: "Accessoires",
    description: "Sacs, écharpes, ceintures et autres compléments de tenue.",
  },
  {
    id: "7",
    nom: "Autres",
    description: "Articles divers ne rentrant pas dans les autres catégories.",
  },
];

export default categories;
