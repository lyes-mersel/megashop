import { PrismaClient, UserRole, CommandeStatut } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await insertUsers();
  await insertCategories();
  await insertGenders();
  await insertColors();
  await insertSizes();
  await insertProducts();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// Création des utilisateurs
async function insertUsers() {
  const hashedPassword = await bcrypt.hash(process.env.DEFAULT_PASSWORD!, 10);

  // Création d'un client
  await prisma.user.create({
    data: {
      nom: "firstname",
      prenom: "lastname",
      email: "client@email.com",
      password: hashedPassword,
      role: UserRole.CLIENT,
      emailVerifie: true,
      tel: "0555555555",
      adresse: {
        create: {
          rue: "Rue de la liberté",
          ville: "Béjaia",
          wilaya: "Béjaia",
          codePostal: "06000",
        },
      },
      client: {
        create: {
          commandes: {
            create: {
              date: new Date(),
              montant: 10000,
              statut: CommandeStatut.LIVREE,
              adresse: {
                create: {
                  rue: "Rue de la liberté",
                  ville: "Béjaia",
                  wilaya: "Béjaia",
                  codePostal: "06000",
                },
              },
              lignesCommande: {
                createMany: {
                  data: [
                    {
                      nomProduit: "Pull simple",
                      quantite: 1,
                      prixUnit: 1500,
                      imagePublicId: "megashop/products/vb4cs0y36cy0qv8srg4l",
                      produitId: null, // ID du produit à lier
                      tailleId: (
                        await prisma.taille.findUnique({ where: { nom: "M" } })
                      )?.id,
                      couleurId: (
                        await prisma.couleur.findUnique({
                          where: { nom: "Noir" },
                        })
                      )?.id,
                    },
                    {
                      nomProduit: "Jean slim",
                      quantite: 2,
                      prixUnit: 4500,
                      imagePublicId: "megashop/products/kqwugy39a6fp80a5jelb",
                      produitId: null, // ID du produit à lier
                      tailleId: (
                        await prisma.taille.findUnique({ where: { nom: "L" } })
                      )?.id,
                      couleurId: (
                        await prisma.couleur.findUnique({
                          where: { nom: "Bleu" },
                        })
                      )?.id,
                    },
                    {
                      nomProduit: "Baskets sport",
                      quantite: 1,
                      prixUnit: 4000,
                      imagePublicId: "megashop/products/vpan4ziol2swrceu2jhq",
                      produitId: null, // ID du produit à lier
                      tailleId: (
                        await prisma.taille.findUnique({ where: { nom: "42" } })
                      )?.id,
                      couleurId: (
                        await prisma.couleur.findUnique({
                          where: { nom: "Gris" },
                        })
                      )?.id,
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
  });

  // Création d'un vendeur (qui est aussi un client)
  await prisma.user.create({
    data: {
      nom: "firstname",
      prenom: "lastname",
      email: "vendeur@email.com",
      password: hashedPassword,
      role: UserRole.VENDEUR,
      emailVerifie: true,
      tel: "0666666666",
      adresse: {
        create: {
          rue: "Boulevard Colonel Amirouche",
          ville: "Béjaia",
          wilaya: "Béjaia",
          codePostal: "06000",
        },
      },
      client: {
        create: {
          vendeur: {
            create: {
              nomBoutique: "Marque Luxe Béjaia",
              nomBanque: "Algérie Poste",
              rib: "000999554283123",
              description: "Marque de vêtements de luxe",
            },
          },
        },
      },
    },
  });

  // Création d'un admin
  await prisma.user.create({
    data: {
      nom: "firstname",
      prenom: "lastname",
      email: "admin@email.com",
      password: hashedPassword,
      role: UserRole.ADMIN,
      emailVerifie: true,
      tel: "0555555555",
      adresse: {
        create: {
          rue: "Boulevard de l'ALN",
          ville: "Béjaia",
          wilaya: "Béjaia",
          codePostal: "06000",
        },
      },
      admin: {
        create: {},
      },
    },
  });

  console.log("prisma/seed.ts : Utilisateurs insérées avec succès !");
}

// Création des catégories
async function insertCategories() {
  await prisma.categorie.createMany({
    data: [
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
        description:
          "Sacs, écharpes, ceintures et autres compléments de tenue.",
      },
      {
        nom: "Autres",
        description:
          "Articles divers ne rentrant pas dans les autres catégories.",
      },
    ],
  });

  console.log("Catégories ajoutées !");
}

// Création des genres
async function insertGenders() {
  await prisma.genre.createMany({
    data: [
      { nom: "Homme" },
      { nom: "Femme" },
      { nom: "Enfant" },
      { nom: "Unisexe" },
    ],
  });

  console.log("Genres ajoutés !");
}

// Insertion des couleurs
async function insertColors() {
  await prisma.couleur.createMany({
    data: [
      { nom: "Noir", code: "#000000" },
      { nom: "Blanc", code: "#FFFFFF" },
      { nom: "Rouge", code: "#FF0000" },
      { nom: "Bleu", code: "#0000FF" },
      { nom: "Vert", code: "#008000" },
      { nom: "Jaune", code: "#FFFF00" },
      { nom: "Orange", code: "#FFA500" },
      { nom: "Rose", code: "#FFC0CB" },
      { nom: "Gris", code: "#808080" },
      { nom: "Marron", code: "#8B4513" },
      { nom: "Violet", code: "#800080" },
      { nom: "Beige", code: "#F5F5DC" },
    ],
    skipDuplicates: true,
  });

  console.log("Couleurs insérées avec succès !");
}

// Insertion des tailles
async function insertSizes() {
  // Tailles pour les vêtements adultes
  await prisma.taille.createMany({
    data: [
      { nom: "S" },
      { nom: "M" },
      { nom: "L" },
      { nom: "XL" },
      { nom: "XXL" },
      { nom: "3XL" },
    ],
    skipDuplicates: true,
  });

  // Tailles pour les vêtements enfants
  await prisma.taille.createMany({
    data: [
      { nom: "2T" }, // 2T = 2 ans
      { nom: "3T" },
      { nom: "4T" },
      { nom: "5T" },
      { nom: "6T" },
    ],
    skipDuplicates: true,
  });

  // Tailles pour les baskets enfants
  await prisma.taille.createMany({
    data: [
      { nom: "27" },
      { nom: "28" },
      { nom: "29" },
      { nom: "30" },
      { nom: "31" },
      { nom: "32" },
      { nom: "33" },
      { nom: "34" },
      { nom: "35" },
      { nom: "36" },
      { nom: "37" },
      { nom: "38" },
      { nom: "39" },
      { nom: "40" },
      { nom: "41" },
      { nom: "42" },
      { nom: "43" },
      { nom: "44" },
    ],
    skipDuplicates: true,
  });

  console.log("Tailles pour vêtements et baskets insérées avec succès !");
}

// Insertion des produits
async function insertProducts() {
  const categories = await prisma.categorie.findMany();
  const genres = await prisma.genre.findMany();

  if (!categories.length || !genres.length) {
    console.error("Impossible de récupérer les catégories ou genres.");
    return;
  }

  const produits = [
    {
      nom: "Pull simple",
      objet: "Pull en coton",
      description:
        "Un pull classique et confortable, parfait pour un style décontracté. Fabriqué en coton doux pour un confort optimal.",
      prix: 1500,
      qteStock: 40,
      categorieId: categories.find((c) => c.nom === "Hauts")?.id ?? null,
      genreId: genres.find((g) => g.nom === "Homme")?.id ?? null,
      couleurs: {
        connect: [{ nom: "Noir" }, { nom: "Blanc" }, { nom: "Orange" }],
      },
      tailles: { connect: [{ nom: "M" }, { nom: "L" }, { nom: "XL" }] },
      images: {
        create: [
          { imagePublicId: "megashop/products/vb4cs0y36cy0qv8srg4l" },
          { imagePublicId: "megashop/products/bbzxa6ymi8zjvzjhbhir" },
          { imagePublicId: "megashop/products/oysthz7eyefyaztd9zeg" },
        ],
      },
      produitBoutique: {
        create: {
          fournisseur: "Marque Luxe Béjaia",
        },
      },
    },
    {
      nom: "Pull moderne",
      objet: "Pull en laine",
      description:
        "Un pull au design moderne avec des motifs élégants. Conçu en laine de haute qualité pour une chaleur optimale.",
      prix: 2000,
      qteStock: 30,
      categorieId: categories.find((c) => c.nom === "Hauts")?.id ?? null,
      genreId: genres.find((g) => g.nom === "Homme")?.id ?? null,
      couleurs: {
        connect: [{ nom: "Vert" }, { nom: "Orange" }, { nom: "Blanc" }],
      },
      tailles: { connect: [{ nom: "S" }, { nom: "M" }, { nom: "L" }] },
      images: {
        create: [
          { imagePublicId: "megashop/products/qbjwniev3juy4d2ncurl" },
          { imagePublicId: "megashop/products/nhoafrtbgiugboe3heqc" },
          { imagePublicId: "megashop/products/wfvxfviw1uildauhv8ri" },
        ],
      },
      produitBoutique: {
        create: {
          fournisseur: "Marque Luxe Béjaia",
        },
      },
    },
    {
      nom: "Pull avec col",
      objet: "Pull en laine avec col",
      description:
        "Un pull élégant avec un col montant, idéal pour un look chic et raffiné. Confortable et chaud pour l'hiver.",
      prix: 2500,
      qteStock: 25,
      categorieId: categories.find((c) => c.nom === "Hauts")?.id ?? null,
      genreId: genres.find((g) => g.nom === "Homme")?.id ?? null,
      couleurs: { connect: [{ nom: "Bleu" }, { nom: "Rose" }] },
      tailles: { connect: [{ nom: "M" }, { nom: "L" }, { nom: "XL" }] },
      images: {
        create: [
          { imagePublicId: "megashop/products/eymtw8ei2m7ar3lkc7o4" },
          { imagePublicId: "megashop/products/tlhaqc8tk5usveg2ul1a" },
        ],
      },
      produitBoutique: {
        create: {
          fournisseur: "Marque Luxe Béjaia",
        },
      },
    },
    {
      nom: "Jean slim",
      objet: "Jean en denim",
      description:
        "Un jean slim moderne et confortable, idéal pour un look tendance.",
      prix: 4500,
      qteStock: 30,
      categorieId: categories.find((c) => c.nom === "Bas")?.id ?? null,
      genreId: genres.find((g) => g.nom === "Homme")?.id ?? null,
      couleurs: { connect: [{ nom: "Bleu" }, { nom: "Noir" }] },
      tailles: { connect: [{ nom: "S" }, { nom: "M" }, { nom: "L" }] },
      images: {
        create: [
          { imagePublicId: "megashop/products/kqwugy39a6fp80a5jelb" },
          { imagePublicId: "megashop/products/zjj4qgqc4lhbd0darhvj" },
        ],
      },
      produitBoutique: {
        create: {
          fournisseur: "Marque Luxe Béjaia",
        },
      },
    },
    {
      nom: "Short en jean",
      objet: "Short homme en denim",
      description:
        "Un short en jean moderne et confortable, parfait pour l'été. Conçu en denim de haute qualité, il assure un look tendance et une grande durabilité.",
      prix: 3000,
      qteStock: 40,
      categorieId: categories.find((c) => c.nom === "Bas")?.id ?? null,
      genreId: genres.find((g) => g.nom === "Homme")?.id ?? null,
      couleurs: { connect: [{ nom: "Bleu" }] },
      tailles: {
        connect: [{ nom: "S" }, { nom: "M" }, { nom: "L" }, { nom: "XL" }],
      },
      images: {
        create: [{ imagePublicId: "megashop/products/picnxwvjhphzp9wyu177" }],
      },
      produitBoutique: {
        create: {
          fournisseur: "Marque Luxe Béjaia",
        },
      },
    },
    {
      nom: "Chemise élégante",
      objet: "Chemise homme en coton",
      description:
        "Une chemise élégante et confortable, parfaite pour un look habillé ou décontracté. Disponible en plusieurs couleurs vibrantes.",
      prix: 4000,
      qteStock: 30,
      categorieId: categories.find((c) => c.nom === "Hauts")?.id ?? null,
      genreId: genres.find((g) => g.nom === "Homme")?.id ?? null,
      couleurs: {
        connect: [{ nom: "Bleu" }, { nom: "Rouge" }, { nom: "Vert" }],
      },
      tailles: {
        connect: [{ nom: "S" }, { nom: "M" }, { nom: "L" }, { nom: "XL" }],
      },
      images: {
        create: [
          { imagePublicId: "megashop/products/ziwjsx7fai6wvdkw8mu4" },
          { imagePublicId: "megashop/products/d7winzl1jb8psaygpdfj" },
        ],
      },
      produitBoutique: {
        create: {
          fournisseur: "Marque Luxe Béjaia",
        },
      },
    },
    {
      nom: "Ensemble en jean garçon",
      objet: "Veste et pantalon en denim",
      description:
        "Un ensemble en jean robuste et stylé pour les garçons, composé d'une veste et d'un pantalon en denim de haute qualité.",
      prix: 5000,
      qteStock: 25,
      categorieId:
        categories.find((c) => c.nom === "Robes & Ensembles")?.id ?? null,
      genreId: genres.find((g) => g.nom === "Enfant")?.id ?? null,
      couleurs: { connect: [{ nom: "Bleu" }] },
      tailles: {
        connect: [{ nom: "S" }, { nom: "6T" }, { nom: "5T" }, { nom: "4T" }],
      },
      images: {
        create: [{ imagePublicId: "megashop/products/uh5flh2dfd210k3wivmk" }],
      },
      produitBoutique: {
        create: {
          fournisseur: "Marque Luxe Béjaia",
        },
      },
    },
    {
      nom: "Ensemble en jean fille",
      objet: "Veste et pantalon en denim",
      description:
        "Un ensemble en jean tendance et confortable pour les filles, avec une coupe ajustée et une veste élégante.",
      prix: 6000,
      qteStock: 25,
      categorieId:
        categories.find((c) => c.nom === "Robes & Ensembles")?.id ?? null,
      genreId: genres.find((g) => g.nom === "Enfant")?.id ?? null,
      couleurs: { connect: [{ nom: "Bleu" }] },
      tailles: {
        connect: [{ nom: "S" }, { nom: "6T" }, { nom: "5T" }, { nom: "4T" }],
      },
      images: {
        create: [
          { imagePublicId: "megashop/products/lx1tdbokig0umlq01vaa" },
          { imagePublicId: "megashop/products/v8kkh5mqpmih3psdd5tp" },
        ],
      },
      produitBoutique: {
        create: {
          fournisseur: "Marque Luxe Béjaia",
        },
      },
    },
    {
      nom: "Robe d'été",
      objet: "Robe légère en coton",
      description:
        "Une robe fluide et élégante, parfaite pour les journées ensoleillées.",
      prix: 3500,
      qteStock: 20,
      categorieId:
        categories.find((c) => c.nom === "Robes & Ensembles")?.id ?? null,
      genreId: genres.find((g) => g.nom === "Femme")?.id ?? null,
      couleurs: { connect: [{ nom: "Violet" }, { nom: "Blanc" }] },
      tailles: { connect: [{ nom: "S" }, { nom: "M" }] },
      images: {
        create: [
          { imagePublicId: "megashop/products/z4q7qrsxfgtq8b93ina0" },
          { imagePublicId: "megashop/products/ordmhtiy4dbvbks9sxtj" },
        ],
      },
      produitBoutique: {
        create: {
          fournisseur: "Marque Luxe Béjaia",
        },
      },
    },
    {
      nom: "Veste en cuir",
      objet: "Veste en cuir véritable",
      description:
        "Une veste élégante et résistante, idéale pour un look rock.",
      prix: 8000,
      qteStock: 15,
      categorieId:
        categories.find((c) => c.nom === "Vestes & Manteaux")?.id ?? null,
      genreId: genres.find((g) => g.nom === "Homme")?.id ?? null,
      couleurs: { connect: [{ nom: "Noir" }, { nom: "Marron" }] },
      tailles: { connect: [{ nom: "M" }, { nom: "L" }, { nom: "XL" }] },
      images: {
        create: [
          { imagePublicId: "megashop/products/zig8munjwzzlmpl7pv7u" },
          { imagePublicId: "megashop/products/fxv11weoijdb47rfrpgt" },
        ],
      },
      produitBoutique: {
        create: {
          fournisseur: "Marque Luxe Béjaia",
        },
      },
    },
    {
      nom: "Baskets sport",
      objet: "Chaussures de sport légères",
      description: "Des baskets confortables et légères pour le sport.",
      prix: 4000,
      qteStock: 40,
      categorieId: categories.find((c) => c.nom === "Chaussures")?.id ?? null,
      genreId: genres.find((g) => g.nom === "Unisexe")?.id ?? null,
      couleurs: {
        connect: [{ nom: "Gris" }, { nom: "Noir" }, { nom: "Rouge" }],
      },
      tailles: {
        connect: [
          { nom: "36" },
          { nom: "37" },
          { nom: "38" },
          { nom: "39" },
          { nom: "40" },
          { nom: "41" },
          { nom: "42" },
          { nom: "43" },
          { nom: "44" },
        ],
      },
      images: {
        create: [
          { imagePublicId: "megashop/products/vpan4ziol2swrceu2jhq" },
          { imagePublicId: "megashop/products/gbyaknytn3tjjmovxgv2" },
          { imagePublicId: "megashop/products/mlx9tn6fs6upd4cnctdl" },
        ],
      },
      produitBoutique: {
        create: {
          fournisseur: "Marque Luxe Béjaia",
        },
      },
    },
    {
      nom: "Baskets blanches sportives",
      objet: "Chaussures de sport polyvalentes",
      description:
        "Des baskets robustes et confortables, idéales pour l'entraînement et le quotidien.",
      prix: 5000,
      qteStock: 35,
      categorieId: categories.find((c) => c.nom === "Chaussures")?.id ?? null,
      genreId: genres.find((g) => g.nom === "Femme")?.id ?? null,
      couleurs: {
        connect: [{ nom: "Blanc" }],
      },
      tailles: {
        connect: [
          { nom: "36" },
          { nom: "37" },
          { nom: "38" },
          { nom: "39" },
          { nom: "40" },
        ],
      },
      images: {
        create: [{ imagePublicId: "megashop/products/kvjaxufxxrn5zm7gwd1l" }],
      },
      produitBoutique: {
        create: {
          fournisseur: "Marque Luxe Béjaia",
        },
      },
    },
    {
      nom: "Manteau long",
      objet: "Manteau en laine",
      description: "Un manteau élégant et chaud pour l'hiver.",
      prix: 12000,
      qteStock: 25,
      categorieId:
        categories.find((c) => c.nom === "Vestes & Manteaux")?.id ?? null,
      genreId: genres.find((g) => g.nom === "Femme")?.id ?? null,
      couleurs: { connect: [{ nom: "Noir" }, { nom: "Vert" }] },
      tailles: { connect: [{ nom: "S" }, { nom: "M" }, { nom: "L" }] },
      images: {
        create: [
          { imagePublicId: "megashop/products/mdveukyrre9rdyur5ll5" },
          { imagePublicId: "megashop/products/nkyrljzkjma4tarrcml8" },
        ],
      },
      produitBoutique: {
        create: {
          fournisseur: "Marque Luxe Béjaia",
        },
      },
    },
    {
      nom: "Ceinture en cuir",
      objet: "Ceinture élégante",
      description: "Une ceinture en cuir véritable pour un look chic.",
      prix: 1000,
      qteStock: 60,
      categorieId: categories.find((c) => c.nom === "Accessoires")?.id ?? null,
      genreId: genres.find((g) => g.nom === "Unisexe")?.id ?? null,
      couleurs: { connect: [{ nom: "Marron" }, { nom: "Noir" }] },
      images: {
        create: [{ imagePublicId: "megashop/products/aucrct6rjtwwbuxbisah" }],
      },
      produitBoutique: {
        create: {
          fournisseur: "Marque Luxe Béjaia",
        },
      },
    },
    {
      nom: "Sac à main en cuir",
      objet: "Sac à main élégant",
      description: "Un sac à main tendance et pratique pour toutes occasions.",
      prix: 7000,
      qteStock: 30,
      categorieId: categories.find((c) => c.nom === "Accessoires")?.id ?? null,
      genreId: genres.find((g) => g.nom === "Femme")?.id ?? null,
      couleurs: { connect: [{ nom: "Marron" }, { nom: "Noir" }] },
      images: {
        create: [
          { imagePublicId: "megashop/products/zndfbcbh5tzpav3kwvbp" },
          { imagePublicId: "megashop/products/k3pxwto8yx1hfk31daxy" },
        ],
      },
      produitBoutique: {
        create: {
          fournisseur: "Marque Luxe Béjaia",
        },
      },
    },
  ];

  // Note: Slower, but more reliable
  for (const produit of produits) {
    await prisma.produit.create({ data: produit });
  }

  // Faster, but often fails due to poor connection
  // await Promise.all(
  //   produits.map((produit) => prisma.produit.create({ data: produit }))
  // );

  console.log("Produits insérés avec succès !");
}
