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
  await insertOrders();
  await insertNotifications();
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

  // Création du client 0
  await prisma.user.create({
    data: {
      nom: "Belkacem",
      prenom: "Karim",
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
        create: {},
      },
    },
  });

  // Création d'un client 1
  await prisma.user.create({
    data: {
      nom: "Cherifi",
      prenom: "Amina",
      email: "client1@email.com",
      password: hashedPassword,
      role: UserRole.CLIENT,
      emailVerifie: true,
      tel: "0555555555",
      adresse: {
        create: {
          rue: "Rue Didouche Mourad",
          ville: "Alger Centre",
          wilaya: "Alger",
          codePostal: "16000",
        },
      },
      client: {
        create: {},
      },
    },
  });

  // Création du client 2
  await prisma.user.create({
    data: {
      nom: "Merad",
      prenom: "Sofiane",
      email: "client2@email.com",
      password: hashedPassword,
      role: UserRole.CLIENT,
      emailVerifie: true,
      tel: "0555555555",
      adresse: {
        create: {
          rue: "Rue Hassiba Ben Bouali",
          ville: "Alger Centre",
          wilaya: "Alger",
          codePostal: "16000",
        },
      },
      client: {
        create: {},
      },
    },
  });

  // Création d'un vendeur (qui est aussi un client)
  await prisma.user.create({
    data: {
      nom: "Krim",
      prenom: "Belkacem",
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
      nom: "Fatma",
      prenom: "Nssoumer",
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
  await prisma.taille.createMany({
    data: [
      { nom: "Standart" },
      // Tailles pour les vêtements adultes
      { nom: "S" },
      { nom: "M" },
      { nom: "L" },
      { nom: "XL" },
      { nom: "XXL" },
      { nom: "3XL" },
      // Tailles pour les vêtements enfants (Ex: 2T = 2 ans)
      { nom: "2T" },
      { nom: "3T" },
      { nom: "4T" },
      { nom: "5T" },
      { nom: "6T" },
      // Tailles pour les baskets
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
  const vendeurId = (
    await prisma.user.findUnique({
      where: { email: "vendeur@email.com" },
    })
  )?.id;

  if (!categories.length || !genres.length || !vendeurId) {
    console.error(
      "Impossible de récupérer les catégories, les genres, ou l'ID du vendeur."
    );
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
          { imagePublicId: "pic1_etcsri_vmai50" },
          { imagePublicId: "pic15_wwfmqd_umm8df" },
          { imagePublicId: "pic4_pixlol_hiaxnj" },
        ],
      },
      produitMarketplace: {
        create: {
          vendeurId: vendeurId,
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
          { imagePublicId: "pic9_cfvvky_qj114o" },
          { imagePublicId: "pic6_ksyt5i_klscfb" },
          { imagePublicId: "pic13_spjtes_n8dmbx" },
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
          { imagePublicId: "pic12_wnptms_sbxlyq" },
          { imagePublicId: "pic14_zgcopv_gur7mr" },
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
          { imagePublicId: "pic2_vqzxsr_fwyict" },
          { imagePublicId: "pic8_xy8nct_rabkms" },
        ],
      },
      produitMarketplace: {
        create: {
          vendeurId: vendeurId,
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
        create: [{ imagePublicId: "pic7_hfywjb_bd7zuk" }],
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
        connect: [{ nom: "Vert" }, { nom: "Bleu" }],
      },
      tailles: {
        connect: [{ nom: "S" }, { nom: "M" }, { nom: "L" }, { nom: "XL" }],
      },
      images: {
        create: [
          { imagePublicId: "pic5_rruoqd_dfgeqq" },
          { imagePublicId: "pic3_tgahxr_worghs" },
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
        create: [{ imagePublicId: "pic17_be8rmr_uhtalr" }],
      },
      produitBoutique: {
        create: {
          fournisseur: "Marque Luxe Béjaia",
        },
      },
    },
    {
      nom: "Ensemble en jean garçon 2",
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
        create: [{ imagePublicId: "pic15_eslrop_dbmnj8" }],
      },
      produitMarketplace: {
        create: {
          vendeurId: vendeurId,
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
          { imagePublicId: "pic18_o6pini_pjmcsk" },
          { imagePublicId: "pic19_fanfuw_sq6ybm" },
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
          { imagePublicId: "pic20_a81vv9_etfc4n" },
          { imagePublicId: "pic21_syyqp6_jr9mb1" },
        ],
      },
      produitMarketplace: {
        create: {
          vendeurId: vendeurId,
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
      genreId: genres.find((g) => g.nom === "Femme")?.id ?? null,
      couleurs: { connect: [{ nom: "Noir" }, { nom: "Marron" }] },
      tailles: { connect: [{ nom: "M" }, { nom: "L" }, { nom: "XL" }] },
      images: {
        create: [
          { imagePublicId: "pic22_flkjfejf_s3yiu9" },
          { imagePublicId: "pic23_evhsovnd_bgf9sc" },
          { imagePublicId: "pic24_nvorishogh_ashv5m" },
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
          { imagePublicId: "pic25_jji03o_dangrc" },
          { imagePublicId: "pic26_np93m8_u5fult" },
          { imagePublicId: "pic27_amvqpz_rvxtlt" },
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
        create: [{ imagePublicId: "pic28_wnnyyd_ok1hij" }],
      },
      produitMarketplace: {
        create: {
          vendeurId: vendeurId,
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
          { imagePublicId: "pic28_eq4xqj_s4tlks" },
          { imagePublicId: "pic29_aqkijy_eknid7" },
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
      tailles: { connect: [{ nom: "Standart" }] },
      images: {
        create: [{ imagePublicId: "pic30_dweino_nnrykg" }],
      },
      produitMarketplace: {
        create: {
          vendeurId: vendeurId,
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
      couleurs: { connect: [{ nom: "Noir" }, { nom: "Marron" }] },
      tailles: { connect: [{ nom: "Standart" }] },
      images: {
        create: [
          { imagePublicId: "pic32_hjy8fx_cmhgfg" },
          { imagePublicId: "pic31_xdtzme_amfppe" },
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

// Insertion des commandes
async function insertOrders() {
  const userId = (
    await prisma.user.findUnique({
      where: { email: "client@email.com" },
    })
  )?.id;

  if (!userId) {
    console.error("Impossible de récupérer l'ID de l'utilisateur.");
    return;
  }

  await prisma.commande.create({
    data: {
      client: { connect: { id: userId } },
      date: new Date(),
      montant: 14500,
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
              imagePublicId: "pic1_etcsri_vmai50",
              produitId: null,
              tailleId: (
                await prisma.taille.findUnique({ where: { nom: "L" } })
              )?.id,
              couleurId: (
                await prisma.couleur.findUnique({ where: { nom: "Noir" } })
              )?.id,
            },
            {
              nomProduit: "Jean slim",
              quantite: 2,
              prixUnit: 4500,
              imagePublicId: "pic2_vqzxsr_fwyict",
              produitId: null,
              tailleId: (
                await prisma.taille.findUnique({ where: { nom: "L" } })
              )?.id,
              couleurId: (
                await prisma.couleur.findUnique({ where: { nom: "Bleu" } })
              )?.id,
            },
            {
              nomProduit: "Baskets sport",
              quantite: 1,
              prixUnit: 4000,
              imagePublicId: "pic25_jji03o_dangrc",
              produitId: null,
              tailleId: (
                await prisma.taille.findUnique({ where: { nom: "42" } })
              )?.id,
              couleurId: (
                await prisma.couleur.findUnique({ where: { nom: "Gris" } })
              )?.id,
            },
          ],
        },
      },
    },
  });

  await prisma.commande.create({
    data: {
      client: { connect: { id: userId } },
      date: new Date(),
      montant: 7000,
      statut: CommandeStatut.EN_ATTENTE,
      adresse: {
        create: {
          rue: "Rue Didouche Mourad",
          ville: "Alger Centre",
          wilaya: "Alger",
          codePostal: "16000",
        },
      },
      lignesCommande: {
        createMany: {
          data: [
            {
              nomProduit: "Pull moderne",
              quantite: 1,
              prixUnit: 2000,
              imagePublicId: "pic9_cfvvky_qj114o",
              produitId: null,
              tailleId: (
                await prisma.taille.findUnique({ where: { nom: "M" } })
              )?.id,
              couleurId: (
                await prisma.couleur.findUnique({ where: { nom: "Vert" } })
              )?.id,
            },
            {
              nomProduit: "Baskets blanches sportives",
              quantite: 1,
              prixUnit: 5000,
              imagePublicId: "pic28_wnnyyd_ok1hij",
              produitId: null,
              tailleId: (
                await prisma.taille.findUnique({ where: { nom: "42" } })
              )?.id,
              couleurId: (
                await prisma.couleur.findUnique({ where: { nom: "Blanc" } })
              )?.id,
            },
          ],
        },
      },
    },
  });

  await prisma.commande.create({
    data: {
      client: { connect: { id: userId } },
      date: new Date(),
      montant: 6000,
      statut: CommandeStatut.EXPEDIEE,
      adresse: {
        create: {
          rue: "Boulevard Colonel Amirouche",
          ville: "Béjaia",
          wilaya: "Béjaia",
          codePostal: "06000",
        },
      },
      lignesCommande: {
        createMany: {
          data: [
            {
              nomProduit: "Pull avec col",
              quantite: 1,
              prixUnit: 2500,
              imagePublicId: "pic12_wnptms_sbxlyq",
              produitId: null,
              tailleId: (
                await prisma.taille.findUnique({ where: { nom: "L" } })
              )?.id,
              couleurId: (
                await prisma.couleur.findUnique({ where: { nom: "Bleu" } })
              )?.id,
            },
            {
              nomProduit: "Robe d'été",
              quantite: 1,
              prixUnit: 3500,
              imagePublicId: "pic20_a81vv9_etfc4n",
              produitId: null,
              tailleId: (
                await prisma.taille.findUnique({ where: { nom: "M" } })
              )?.id,
              couleurId: (
                await prisma.couleur.findUnique({ where: { nom: "Violet" } })
              )?.id,
            },
          ],
        },
      },
    },
  });

  console.log("Commandes insérées avec succès !");
}

// Insertion des notifications
async function insertNotifications() {
  const userId = (
    await prisma.user.findUnique({
      where: { email: "client@email.com" },
    })
  )?.id;

  if (!userId) {
    console.error("Impossible de récupérer l'ID de l'utilisateur.");
    return;
  }

  await prisma.notification.createMany({
    data: [
      {
        type: "COMMANDE",
        objet: "Nouvelle commande",
        text: "Votre commande a été reçue avec succès.",
        estLu: false,
        userId: userId,
        date: new Date(),
        urlRedirection: undefined,
      },
      {
        type: "COMMANDE",
        objet: "Mise à jour de la commande",
        text: "Votre commande a été expédiée.",
        estLu: false,
        userId: userId,
        date: new Date(),
        urlRedirection: undefined,
      },
      {
        type: "MESSAGE",
        objet: "Nouveau message",
        text: "Vous avez reçu un nouveau message de notre équipe.",
        estLu: false,
        userId: userId,
        date: new Date(),
        urlRedirection: undefined,
      },
      {
        type: "EVALUATION",
        objet: "Nouvelle réponse à votre évaluation",
        text: "Le vendeur a répondu à votre évaluation.",
        estLu: false,
        userId: userId,
        date: new Date(),
        urlRedirection: "/product/cmag1sbe0001s3o6izl8lpxqi",
      },
      {
        type: "SECURITE",
        objet: "Alerte de sécurité",
        text: "Un nouvel appareil a été connecté à votre compte.",
        estLu: false,
        userId: userId,
        date: new Date(),
        urlRedirection: undefined,
      },
      {
        type: "PAIEMENT",
        objet: "Confirmation de paiement",
        text: "Votre paiement a été reçu avec succès.",
        estLu: false,
        userId: userId,
        date: new Date(),
        urlRedirection: undefined,
      },
    ],
  });

  console.log("Notifications insérées avec succès !");
}
