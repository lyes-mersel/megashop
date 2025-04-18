// pages/ShopPage.tsx
"use client";

import { useState, useEffect } from "react";
import { Store, Plus, Edit, Trash2, ArrowRight, Info } from "lucide-react";
import { Montserrat } from "next/font/google";
import { toast } from "sonner";
import Image from "next/image";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: "800",
  display: "swap",
});

interface StockDetail {
  size: string;
  color: string;
  quantity: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  quantity: number;
  category: string;
  genre: string;
  price: number;
  image: string;
  sizes: string[];
  colors: string[];
  additionalImages: string[];
  stockDetails: StockDetail[];
  discountPrice?: number;
  discountPercentage?: number;
  dateAdded?: string;
  lastModified?: string;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([
    ...Array.from({ length: 24 }, (_, i) => ({
      id: i + 1,
      name: `Produit ${i + 1}`,
      description: `Description du produit ${i + 1}`,
      quantity: 30,
      category: ["Vêtements", "Chaussures", "Accessoires"][
        Math.floor(Math.random() * 3)
      ],
      genre: ["Homme", "Femme", "Enfant", "Unisexe"][
        Math.floor(Math.random() * 4)
      ],
      price: parseFloat((Math.random() * 100).toFixed(2)),
      image:
        ["Vêtements", "Chaussures", "Accessoires"][
          Math.floor(Math.random() * 3)
        ] === "Vêtements"
          ? "/images/d.jpeg"
          : ["Vêtements", "Chaussures", "Accessoires"][
              Math.floor(Math.random() * 3)
            ] === "Chaussures"
          ? "/images/d.jpeg"
          : "/images/e.jpeg",
      sizes: ["S", "M", "L"],
      colors: ["Noir", "Blanc"],
      additionalImages: [],
      stockDetails: [
        { size: "S", color: "Noir", quantity: 10 },
        { size: "M", color: "Noir", quantity: 5 },
        { size: "L", color: "Blanc", quantity: 15 },
      ],
      dateAdded: new Date().toLocaleDateString(),
      lastModified: new Date().toLocaleDateString(),
    })),
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    quantity: 0,
    category: "",
    genre: "",
    price: 0,
    image: "",
    sizes: [] as string[],
    colors: [] as string[],
    additionalImages: [] as string[],
    stockDetails: [] as StockDetail[],
    discountPrice: undefined as number | undefined,
    discountPercentage: undefined as number | undefined,
  });
  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [stockDetailInput, setStockDetailInput] = useState({
    size: "",
    color: "",
    quantity: 0,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [stockAdjustMode, setStockAdjustMode] = useState<{
    [key: string]: "increment" | "decrement" | null;
  }>({});
  const [isMobile, setIsMobile] = useState(false);
  const [showActions, setShowActions] = useState<{ [key: number]: boolean }>(
    {}
  );
  const productsPerPage = 24;
  const minPages = 5;

  // Détecter si l'utilisateur est sur mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // sm: breakpoint de Tailwind
    };

    handleResize(); // Vérifier au chargement
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleActions = (productId: number) => {
    setShowActions((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPagesBasedOnProducts =
    Math.ceil(filteredProducts.length / productsPerPage) || 1;
  const totalPages = Math.max(totalPagesBasedOnProducts, minPages);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleDeleteProduct = (id: number) => {
    setProductToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (productToDelete !== null) {
      setProducts(products.filter((product) => product.id !== productToDelete));
      setShowDeleteModal(false);
      setProductToDelete(null);
      toast.success("Produit supprimé avec succès !");
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      quantity: product.quantity,
      category: product.category,
      genre: product.genre,
      price: product.price,
      image: product.image,
      sizes: product.sizes,
      colors: product.colors,
      additionalImages: product.additionalImages,
      stockDetails: product.stockDetails,
      discountPrice: product.discountPrice,
      discountPercentage: product.discountPercentage,
    });
    setIsFormOpen(true);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const totalQuantity = newProduct.stockDetails.reduce(
      (sum, detail) => sum + detail.quantity,
      0
    );
    const currentDate = new Date().toLocaleDateString();
    if (editingProduct) {
      setProducts(
        products.map((product) =>
          product.id === editingProduct.id
            ? {
                ...product,
                name: newProduct.name,
                quantity: totalQuantity,
                sizes: newProduct.sizes,
                colors: newProduct.colors,
                stockDetails: newProduct.stockDetails,
                discountPrice: newProduct.discountPrice,
                discountPercentage: newProduct.discountPercentage,
                lastModified: currentDate,
              }
            : product
        )
      );
      setEditingProduct(null);
      toast.success("Produit mis à jour avec succès !");
    } else {
      setProducts([
        ...products,
        {
          ...newProduct,
          id: products.length + 1,
          quantity: totalQuantity,
          dateAdded: currentDate,
          lastModified: currentDate,
        },
      ]);
      toast.success("Produit ajouté avec succès !");
    }
    setNewProduct({
      name: "",
      description: "",
      quantity: 0,
      category: "",
      genre: "",
      price: 0,
      image: "",
      sizes: [],
      colors: [],
      additionalImages: [],
      stockDetails: [],
      discountPrice: undefined,
      discountPercentage: undefined,
    });
    setSizeInput("");
    setColorInput("");
    setStockDetailInput({ size: "", color: "", quantity: 0 });
    setIsFormOpen(false);
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    isMainImage: boolean
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      if (isMainImage) {
        setNewProduct({ ...newProduct, image: imageUrl });
      } else if (newProduct.additionalImages.length < 3) {
        setNewProduct({
          ...newProduct,
          additionalImages: [...newProduct.additionalImages, imageUrl],
        });
      }
    }
  };

  const removeAdditionalImage = (index: number) => {
    setNewProduct({
      ...newProduct,
      additionalImages: newProduct.additionalImages.filter(
        (_, i) => i !== index
      ),
    });
  };

  const addSize = () => {
    if (sizeInput && !newProduct.sizes.includes(sizeInput)) {
      setNewProduct({ ...newProduct, sizes: [...newProduct.sizes, sizeInput] });
      setSizeInput("");
    }
  };

  const removeSize = (size: string) => {
    setNewProduct({
      ...newProduct,
      sizes: newProduct.sizes.filter((s) => s !== size),
      stockDetails: newProduct.stockDetails.filter(
        (detail) => detail.size !== size
      ),
    });
  };

  const handleColorChange = (color: string) => {
    if (newProduct.colors.includes(color)) {
      setNewProduct({
        ...newProduct,
        colors: newProduct.colors.filter((c) => c !== color),
        stockDetails: newProduct.stockDetails.filter(
          (detail) => detail.color !== color
        ),
      });
    } else {
      setNewProduct({ ...newProduct, colors: [...newProduct.colors, color] });
    }
  };

  const addCustomColor = () => {
    if (colorInput && !newProduct.colors.includes(colorInput)) {
      setNewProduct({
        ...newProduct,
        colors: [...newProduct.colors, colorInput],
      });
      setColorInput("");
    }
  };

  const removeColor = (color: string) => {
    setNewProduct({
      ...newProduct,
      colors: newProduct.colors.filter((c) => c !== color),
      stockDetails: newProduct.stockDetails.filter(
        (detail) => detail.color !== color
      ),
    });
  };

  const addStockDetail = () => {
    const { size, color, quantity } = stockDetailInput;
    if (
      size &&
      color &&
      quantity >= 0 &&
      !newProduct.stockDetails.some(
        (detail) => detail.size === size && detail.color === color
      )
    ) {
      setNewProduct({
        ...newProduct,
        stockDetails: [...newProduct.stockDetails, { size, color, quantity }],
      });
      setStockDetailInput({ size: "", color: "", quantity: 0 });
    }
  };

  const increaseStockDetail = (size: string, color: string, amount: number) => {
    const originalProduct = editingProduct;
    const updatedStockDetails = newProduct.stockDetails.map((detail) => {
      if (detail.size === size && detail.color === color) {
        const originalDetail = originalProduct?.stockDetails.find(
          (d) => d.size === size && d.color === color
        );
        const originalQuantity = originalDetail ? originalDetail.quantity : 0;
        const newQuantity = detail.quantity + amount;
        return { ...detail, quantity: Math.max(originalQuantity, newQuantity) };
      }
      return detail;
    });
    setNewProduct({ ...newProduct, stockDetails: updatedStockDetails });
  };

  const calculateDiscount = (discountPrice: number) => {
    if (newProduct.price > 0 && discountPrice < newProduct.price) {
      const percentage =
        ((newProduct.price - discountPrice) / newProduct.price) * 100;
      setNewProduct({
        ...newProduct,
        discountPrice,
        discountPercentage: parseFloat(percentage.toFixed(2)),
      });
    } else {
      setNewProduct({
        ...newProduct,
        discountPrice: undefined,
        discountPercentage: undefined,
      });
    }
  };

  const handleShowDetails = (product: Product) => {
    setSelectedProduct(product);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedProduct(null);
  };

  const availableColors = [
    "Noir",
    "Blanc",
    "Rouge",
    "Bleu",
    "Vert",
    "Jaune",
    "Orange",
    "Rose",
    "Gris",
    "Marron",
    "Violet",
    "Beige",
  ];

  const categories = [
    {
      nom: "Hauts",
      description:
        "T-shirts, chemises, pulls et autres vêtements pour le haut du corps.",
    },
    {
      nom: "Bas",
      description:
        "Pantalons, jeans, shorts et autres vêtements pour le bas du corps.",
    },
    {
      nom: "Robes & Ensembles",
      description: "Robes et ensembles assortis pour toutes occasions.",
    },
    {
      nom: "Vestes & Manteaux",
      description: "Vestes légères, manteaux d'hiver et blousons.",
    },
    {
      nom: "Chaussures",
      description: "Baskets, bottes, sandales et autres types de chaussures.",
    },
    {
      nom: "Accessoires",
      description: "Sacs, écharpes, ceintures et autres compléments de tenue.",
    },
    {
      nom: "Autres",
      description:
        "Articles divers ne rentrant pas dans les autres catégories.",
    },
  ];

  const genres = [
    { nom: "Homme" },
    { nom: "Femme" },
    { nom: "Enfant" },
    { nom: "Unisexe" },
  ];

  const availableSizes = [
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "3XL",
    "2T",
    "3T",
    "4T",
    "5T",
    "6T",
    "27",
    "28",
    "29",
    "30",
    "31",
    "32",
    "33",
    "34",
    "35",
    "36",
    "37",
    "38",
    "39",
    "40",
    "41",
    "42",
    "43",
    "44",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-6 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 flex items-center gap-2 sm:gap-3">
          <Store className="h-6 w-6 sm:h-8 sm:w-8 text-black" />
          <h1
            className={`text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight ${montserrat.className}`}
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Ma Boutique
          </h1>
        </div>
        <p className="mb-6 text-base sm:text-lg text-gray-700">
          Gérez vos produits et suivez votre stock ici.
        </p>

        <div className="relative mb-8 sm:mb-10 bg-gradient-to-r from-gray-700 to-gray-900 text-white p-4 sm:p-6 pr-8 sm:pr-12 rounded-xl shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 min-h-[160px] sm:min-h-[220px]">
          <div>
            <h2
              className={`text-xl sm:text-2xl font-semibold ${montserrat.className}`}
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Chic & Tendance
            </h2>
            <p className="mt-2 text-base sm:text-lg">
              Découvrez des vêtements et accessoires élégants chez{" "}
              <span className="font-bold">Chic & Tendance</span>. ✨
            </p>
            <button
              onClick={() => {
                setEditingProduct(null);
                setNewProduct({
                  name: "",
                  description: "",
                  quantity: 0,
                  category: "",
                  genre: "",
                  price: 0,
                  image: "",
                  sizes: [],
                  colors: [],
                  additionalImages: [],
                  stockDetails: [],
                  discountPrice: undefined,
                  discountPercentage: undefined,
                });
                setSizeInput("");
                setColorInput("");
                setStockDetailInput({ size: "", color: "", quantity: 0 });
                setIsFormOpen(true);
              }}
              className="mt-4 bg-white text-black px-4 py-2 sm:px-6 sm:py-3 rounded-lg flex items-center gap-2 text-sm sm:text-base font-semibold hover:bg-gray-200 transition-all duration-300 shadow-lg"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" /> Ajouter un produit
            </button>
          </div>
          <Image
            width={40}
            height={40}
            src="/images/c.jpeg"
            alt="Vitrine Chic & Tendance"
            className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-full border-4 border-white shadow-lg"
          />
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-md">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un produit par nom..."
                className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white/30 backdrop-blur-lg border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-300 text-black placeholder-black shadow-md text-sm sm:text-base"
              />
              <div className="absolute inset-y-0 right-3 flex items-center">
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {paginatedProducts.map((product, index) => (
              <div
                key={product.id}
                className="group relative bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl animate-slide-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => isMobile && toggleActions(product.id)} // Toggle actions on tap for mobile
              >
                <div className="relative h-32 sm:h-40 w-full">
                  <Image
                    fill
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                  <div
                    className={`absolute inset-0 flex items-center justify-center gap-2 sm:gap-3 transition-opacity duration-300 bg-black/40 ${
                      isMobile
                        ? showActions[product.id]
                          ? "opacity-100"
                          : "opacity-0"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the card's onClick
                        handleEditProduct(product);
                      }}
                      className="bg-black text-white px-4 py-1 sm:px-6 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 hover:bg-gray-800 transition-all duration-200 shadow-md font-bold text-xs sm:text-sm"
                    >
                      <Edit className="h-3 w-3 sm:h-4 sm:w-4" /> Modifier
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the card's onClick
                        handleDeleteProduct(product.id);
                      }}
                      className="bg-red-500 text-white px-4 py-1 sm:px-6 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 hover:bg-red-600 transition-all duration-200 shadow-md font-bold text-xs sm:text-sm"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" /> Supprimer
                    </button>
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
                    {product.name}
                  </h2>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs sm:text-sm text-gray-600">
                      <span className="font-bold">Catégorie :</span>{" "}
                      {product.category}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      <span className="font-bold">Quantité :</span>{" "}
                      {product.quantity}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {product.discountPrice ? (
                        <>
                          <span
                            className={`text-xs sm:text-sm text-gray-500 line-through font-medium ${montserrat.className}`}
                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                          >
                            DA {product.price.toFixed(2)}
                          </span>
                          <span
                            className={`text-base sm:text-lg font-semibold text-green-600 transform hover:scale-105 transition-transform duration-200 ${montserrat.className}`}
                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                          >
                            DA {product.discountPrice.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span
                          className={`text-base sm:text-lg font-semibold text-gray-900 transform hover:scale-105 transition-transform duration-200 ${montserrat.className}`}
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          DA {product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <button
                      className="group/detail bg-black text-white px-2 py-1 sm:px-3 sm:py-1 rounded-lg hover:bg-gray-800 transition-all duration-200 flex items-center gap-1 font-semibold text-xs sm:text-sm"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the card's onClick
                        handleShowDetails(product);
                      }}
                    >
                      Détails
                      <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 opacity-0 group-hover/detail:opacity-100 transition-opacity duration-200" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Image
              width={32}
              height={32}
              src="/images/b.png"
              alt="Produit non trouvé"
              className="mx-auto w-24 h-24 sm:w-32 sm:h-32 mb-4"
            />
            <p className="text-lg sm:text-xl font-semibold text-gray-800">
              Ce produit n&apos;existe pas
            </p>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Aucun produit ne correspond à votre recherche.
            </p>
          </div>
        )}

        <div className="mt-6 sm:mt-8 flex justify-center gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold transition-all duration-200 shadow-md text-sm sm:text-base ${
                currentPage === i + 1
                  ? "bg-black text-white hover:bg-gray-900"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white/30 backdrop-blur-lg border border-gray-200/50 p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-[90%] sm:max-w-sm">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                Confirmer la suppression
              </h3>
              <p className="text-black-600 mb-6 text-sm sm:text-base">
                Êtes-vous sûr de vouloir supprimer ce produit ?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelDelete}
                  className="bg-gray-200 text-gray-800 px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300 text-sm sm:text-base"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-red-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold hover:bg-red-600 transition-all duration-300 text-sm sm:text-base"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        )}

        {isFormOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white p-4 sm:p-8 rounded-2xl w-full max-w-[90%] sm:max-w-lg shadow-xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
              <h2
                className={`text-2xl sm:text-3xl font-bold text-gray-900 mb-6 ${montserrat.className}`}
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {editingProduct ? "Modifier le produit" : "Ajouter un produit"}
              </h2>
              <form
                onSubmit={handleAddProduct}
                className="space-y-4 sm:space-y-6"
              >
                {!editingProduct ? (
                  <>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-800">
                        Nom du produit
                      </label>
                      <input
                        type="text"
                        value={newProduct.name}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, name: e.target.value })
                        }
                        className="mt-1 w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-gray-800 placeholder-gray-400 text-sm sm:text-base"
                        placeholder="Entrez le nom du produit"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-800">
                        Description
                      </label>
                      <textarea
                        value={newProduct.description}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            description: e.target.value,
                          })
                        }
                        className="mt-1 w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-gray-800 placeholder-gray-400 text-sm sm:text-base"
                        rows={4}
                        placeholder="Entrez une description"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-800">
                        Catégorie
                      </label>
                      <select
                        value={newProduct.category}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            category: e.target.value,
                          })
                        }
                        className="mt-1 w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-gray-800 placeholder-gray-400 text-sm sm:text-base"
                        required
                      >
                        <option value="">Sélectionner une catégorie</option>
                        {categories.map((cat) => (
                          <option key={cat.nom} value={cat.nom}>
                            {cat.nom}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-800">
                        Genre
                      </label>
                      <select
                        value={newProduct.genre}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            genre: e.target.value,
                          })
                        }
                        className="mt-1 w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-gray-800 placeholder-gray-400 text-sm sm:text-base"
                        required
                      >
                        <option value="">Sélectionner un genre</option>
                        {genres.map((g) => (
                          <option key={g.nom} value={g.nom}>
                            {g.nom}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-800">
                        Prix (DA)
                      </label>
                      <input
                        type="number"
                        value={newProduct.price}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            price: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="mt-1 w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-gray-800 placeholder-gray-400 text-sm sm:text-base"
                        min="0"
                        step="0.01"
                        placeholder="Entrez le prix"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-800">
                        Image principale
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, true)}
                        className="mt-1 w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-gray-800 placeholder-gray-400 text-sm sm:text-base"
                        required
                      />
                      {newProduct.image && (
                        <Image
                          width={24}
                          height={24}
                          src={newProduct.image}
                          alt="Image principale"
                          className="mt-2 w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md"
                        />
                      )}
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-800">
                        Images supplémentaires (max 3)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, false)}
                        className="mt-1 w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-gray-800 placeholder-gray-400 text-sm sm:text-base"
                        disabled={newProduct.additionalImages.length >= 3}
                      />
                      <div className="mt-2 flex gap-2 flex-wrap">
                        {newProduct.additionalImages.map((img, index) => (
                          <div key={index} className="relative">
                            <Image
                              width={24}
                              height={24}
                              src={img}
                              alt={`Image supplémentaire ${index + 1}`}
                              className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => removeAdditionalImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center hover:bg-red-600 text-xs sm:text-sm"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-800">
                        Nom du produit
                      </label>
                      <input
                        type="text"
                        value={newProduct.name}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, name: e.target.value })
                        }
                        className="mt-1 w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-gray-800 placeholder-gray-400 text-sm sm:text-base"
                        placeholder="Modifier le nom du produit"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-800">
                        Prix initial (DA)
                      </label>
                      <p className="mt-1 text-gray-600 text-sm sm:text-base">
                        DA {newProduct.price.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-800">
                        Nouveau prix (DA)
                      </label>
                      <input
                        type="number"
                        value={newProduct.discountPrice || ""}
                        onChange={(e) => {
                          const discountPrice = parseFloat(e.target.value) || 0;
                          calculateDiscount(discountPrice);
                        }}
                        className="mt-1 w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-gray-800 placeholder-gray-400 text-sm sm:text-base"
                        min="0"
                        step="0.01"
                        placeholder="Entrez le nouveau prix (optionnel)"
                      />
                      {newProduct.discountPercentage && (
                        <p className="mt-2 text-xs sm:text-sm text-green-600">
                          Réduction : {newProduct.discountPercentage}% par
                          rapport au prix initial
                        </p>
                      )}
                    </div>
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <label className="block text-xs sm:text-sm font-medium text-gray-800">
                      Tailles disponibles
                    </label>
                    <div className="relative group">
                      <Info className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 cursor-pointer" />
                      <div className="absolute left-0 top-6 hidden group-hover:block bg-gray-800 text-white text-xs p-2 rounded-lg z-10 w-64">
                        Tailles disponibles : {availableSizes.join(", ")}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      value={sizeInput}
                      onChange={(e) => setSizeInput(e.target.value)}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-gray-800 placeholder-gray-400 text-sm sm:text-base"
                      placeholder="Ex: S, 38, XL"
                    />
                    <button
                      type="button"
                      onClick={addSize}
                      className="bg-black text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-gray-800 transition-all duration-200 text-xs sm:text-sm"
                    >
                      Ajouter
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {newProduct.sizes.map((size) => (
                      <div
                        key={size}
                        className="bg-gray-200 text-gray-800 px-2 sm:px-3 py-1 rounded-full flex items-center gap-2 text-xs sm:text-sm"
                      >
                        {size}
                        <button
                          type="button"
                          onClick={() => removeSize(size)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-800">
                    Couleurs disponibles
                  </label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {availableColors.map((color) => (
                      <label key={color} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={newProduct.colors.includes(color)}
                          onChange={() => handleColorChange(color)}
                          className="h-4 w-4 sm:h-5 sm:w-5 text-black focus:ring-black"
                        />
                        <span className="text-xs sm:text-sm">{color}</span>
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={colorInput}
                      onChange={(e) => setColorInput(e.target.value)}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-gray-800 placeholder-gray-400 text-sm sm:text-base"
                      placeholder="Ex: Cyan"
                    />
                    <button
                      type="button"
                      onClick={addCustomColor}
                      className="bg-black text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-gray-800 transition-all duration-200 text-xs sm:text-sm"
                    >
                      Ajouter
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {newProduct.colors.map((color) => (
                      <div
                        key={color}
                        className="bg-gray-200 text-gray-800 px-2 sm:px-3 py-1 rounded-full flex items-center gap-2 text-xs sm:text-sm"
                      >
                        {color}
                        <button
                          type="button"
                          onClick={() => removeColor(color)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-800">
                    Détails du stock par taille et couleur
                  </label>
                  <div className="mt-1 space-y-2">
                    {editingProduct && (
                      <div className="mb-2">
                        <span className="font-bold text-xs sm:text-sm">
                          Quantité Totale :{" "}
                        </span>
                        <span className="text-xs sm:text-sm">
                          {newProduct.stockDetails.reduce(
                            (sum, detail) => sum + detail.quantity,
                            0
                          )}
                        </span>
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <select
                        value={stockDetailInput.size}
                        onChange={(e) =>
                          setStockDetailInput({
                            ...stockDetailInput,
                            size: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-gray-800 placeholder-gray-400 text-sm sm:text-base"
                      >
                        <option value="">Taille</option>
                        {newProduct.sizes.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                      <select
                        value={stockDetailInput.color}
                        onChange={(e) =>
                          setStockDetailInput({
                            ...stockDetailInput,
                            color: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-gray-800 placeholder-gray-400 text-sm sm:text-base"
                      >
                        <option value="">Couleur</option>
                        {newProduct.colors.map((color) => (
                          <option key={color} value={color}>
                            {color}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={stockDetailInput.quantity}
                        onChange={(e) =>
                          setStockDetailInput({
                            ...stockDetailInput,
                            quantity: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-gray-800 placeholder-gray-400 text-sm sm:text-base"
                        min="0"
                        placeholder="Quantité"
                      />
                      <button
                        type="button"
                        onClick={addStockDetail}
                        className="bg-black text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-gray-800 transition-all duration-200 text-xs sm:text-sm"
                      >
                        Ajouter
                      </button>
                    </div>
                    <div className="space-y-2">
                      {newProduct.stockDetails.map((detail) => {
                        const key = `${detail.size}-${detail.color}`;
                        const mode = stockAdjustMode[key] || null;
                        return (
                          <div
                            key={key}
                            className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg justify-between"
                          >
                            <span className="text-xs sm:text-sm">
                              {detail.size} - {detail.color}
                            </span>
                            {editingProduct ? (
                              <div className="flex items-center gap-2">
                                <span className="bg-gray-200 px-2 py-1 rounded-full text-xs sm:text-sm">
                                  {detail.quantity}
                                </span>
                                <div className="flex gap-1">
                                  {mode && (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          increaseStockDetail(
                                            detail.size,
                                            detail.color,
                                            mode === "increment" ? 1 : -1
                                          )
                                        }
                                        className={`${
                                          mode === "increment"
                                            ? "bg-green-500"
                                            : "bg-red-500"
                                        } text-white px-2 py-1 rounded-lg hover:${
                                          mode === "increment"
                                            ? "bg-green-600"
                                            : "bg-red-600"
                                        } text-xs sm:text-sm`}
                                      >
                                        1
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          increaseStockDetail(
                                            detail.size,
                                            detail.color,
                                            mode === "increment" ? 10 : -10
                                          )
                                        }
                                        className={`${
                                          mode === "increment"
                                            ? "bg-green-500"
                                            : "bg-red-500"
                                        } text-white px-2 py-1 rounded-lg hover:${
                                          mode === "increment"
                                            ? "bg-green-600"
                                            : "bg-red-600"
                                        } text-xs sm:text-sm`}
                                      >
                                        10
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          increaseStockDetail(
                                            detail.size,
                                            detail.color,
                                            mode === "increment" ? 100 : -100
                                          )
                                        }
                                        className={`${
                                          mode === "increment"
                                            ? "bg-green-500"
                                            : "bg-red-500"
                                        } text-white px-2 py-1 rounded-lg hover:${
                                          mode === "increment"
                                            ? "bg-green-600"
                                            : "bg-red-600"
                                        } text-xs sm:text-sm`}
                                      >
                                        100
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          increaseStockDetail(
                                            detail.size,
                                            detail.color,
                                            mode === "increment" ? 1000 : -1000
                                          )
                                        }
                                        className={`${
                                          mode === "increment"
                                            ? "bg-green-500"
                                            : "bg-red-500"
                                        } text-white px-2 py-1 rounded-lg hover:${
                                          mode === "increment"
                                            ? "bg-green-600"
                                            : "bg-red-600"
                                        } text-xs sm:text-sm`}
                                      >
                                        1000
                                      </button>
                                    </>
                                  )}
                                </div>
                                <div className="flex flex-col gap-1">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setStockAdjustMode({
                                        ...stockAdjustMode,
                                        [key]: "increment",
                                      })
                                    }
                                    className="bg-green-500 text-white px-2 py-1 rounded-lg hover:bg-green-600 text-xs sm:text-sm"
                                  >
                                    +
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setStockAdjustMode({
                                        ...stockAdjustMode,
                                        [key]: "decrement",
                                      })
                                    }
                                    className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 text-xs sm:text-sm"
                                  >
                                    −
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs sm:text-sm">
                                {detail.quantity}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-black/80 text-white px-4 py-2 sm:px-8 sm:py-3 rounded-lg font-semibold hover:bg-black transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base"
                  >
                    {editingProduct ? "Mettre à jour" : "Ajouter"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="bg-gray-200/80 text-gray-800 px-4 py-2 sm:px-8 sm:py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300 shadow-md text-sm sm:text-base"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showDetailsModal && selectedProduct && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-gradient-to-br from-white to-gray-100 p-4 sm:p-6 rounded-2xl w-full max-w-[90%] sm:max-w-md shadow-2xl transform transition-all duration-500 scale-100 max-h-[90vh] overflow-y-auto border border-gray-200/50">
              <div className="relative">
                <button
                  onClick={closeDetailsModal}
                  className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 text-sm sm:text-base"
                >
                  ✕
                </button>
                <h2
                  className={`text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 ${montserrat.className}`}
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Détails du produit
                </h2>
              </div>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex justify-center">
                  <Image
                    width={32}
                    height={32}
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                    Nom du produit
                  </label>
                  <p className="mt-1 text-base sm:text-lg font-medium text-gray-900">
                    {selectedProduct.name}
                  </p>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                    Description
                  </label>
                  <p className="mt-1 text-gray-600 leading-relaxed text-sm sm:text-base">
                    {selectedProduct.description}
                  </p>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                    Quantité totale
                  </label>
                  <p className="mt-1 text-gray-900 font-medium text-sm sm:text-base">
                    {selectedProduct.quantity}
                  </p>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                    Répartition du stock
                  </label>
                  <div className="mt-2 space-y-2">
                    {selectedProduct.stockDetails.length > 0 ? (
                      selectedProduct.stockDetails.map((detail) => (
                        <div
                          key={`${detail.size}-${detail.color}`}
                          className="bg-gray-200/50 p-2 rounded-lg flex items-center justify-between shadow-sm"
                        >
                          <span className="text-gray-800 font-medium text-xs sm:text-sm">
                            {detail.size} - {detail.color}
                          </span>
                          <span className="bg-black text-white px-2 py-1 rounded-full text-xs sm:text-sm font-semibold">
                            {detail.quantity}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base">
                        Aucun détail de stock disponible.
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                    Tailles disponibles
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedProduct.sizes.map((size) => (
                      <span
                        key={size}
                        className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm shadow-md"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                    Couleurs disponibles
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedProduct.colors.map((color) => (
                      <span
                        key={color}
                        className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm shadow-md"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                    Date d’ajout
                  </label>
                  <p className="mt-1 text-gray-600 text-sm sm:text-base">
                    {selectedProduct.dateAdded || "Non spécifiée"}
                  </p>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                    Dernière modification
                  </label>
                  <p className="mt-1 text-gray-600 text-sm sm:text-base">
                    {selectedProduct.lastModified || "Non spécifiée"}
                  </p>
                </div>
              </div>
              <div className="mt-6 sm:mt-8 flex justify-center">
                <button
                  onClick={closeDetailsModal}
                  className="bg-gradient-to-r from-gray-800 to-black text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg font-semibold hover:from-gray-900 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          @media (prefers-reduced-motion: reduce) {
            .animate-fade-in,
            .animate-slide-in,
            [data-animate] {
              animation: none !important;
              transition: none !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
