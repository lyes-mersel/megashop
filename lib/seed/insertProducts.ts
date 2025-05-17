import { prisma } from "@/lib/utils/prisma";

// Insertion des produits
async function insertProducts() {
  const categories = await prisma.categorie.findMany();
  const genres = await prisma.genre.findMany();
  const users = await prisma.user.findMany();
  const userIds = users.map((user) => user.id);
  const vendeurId = (
    await prisma.user.findUnique({
      where: { email: "vendeur@email.com" },
    })
  )?.id;

  if (
    !categories.length ||
    !genres.length ||
    !vendeurId ||
    userIds.length < 10
  ) {
    console.error(
      "Impossible de récupérer les catégories, les genres, l'ID du vendeur, ou suffisamment d'utilisateurs."
    );
    return;
  }

  // Helper function to generate random evaluations
  const generateEvaluations = (productName: string, count: number) => {
    const notes = Array.from({ length: count }, () => {
      // Generate realistic notes between 3 and 5, with occasional lower ratings
      const rand = Math.random();
      if (rand < 0.1) return 3 + Math.random(); // 3.0–4.0 (10%)
      if (rand < 0.3) return 4 + Math.random() * 0.5; // 4.0–4.5 (20%)
      return 4.5 + Math.random() * 0.5; // 4.5–5.0 (70%)
    }).map((n) => Math.round(n * 10) / 10); // Round to 1 decimal

    const noteMoyenne =
      Math.round((notes.reduce((sum, n) => sum + n, 0) / count) * 10) / 10;

    const comments: { [key: string]: string[] } = {
      "Pull simple": [
        "Super doux et confortable, parfait pour tous les jours !",
        "Bonne qualité, mais légèrement grand pour moi.",
        "Couleur magnifique, je recommande vivement.",
        "Très agréable à porter, coton de bonne facture.",
        "Style simple mais élégant, j’adore.",
        "Un peu fin pour l’hiver, mais parfait pour l’automne.",
        "Excellent rapport qualité-prix !",
        "La coupe est parfaite, très satisfait.",
        "Tissu respirant, idéal pour les longues journées.",
        "Un basique indispensable dans ma garde-robe.",
      ],
      "Pull moderne": [
        "Très beau pull, la qualité est au rendez-vous.",
        "Confortable et stylé, mais taille un peu petit.",
        "Chaud, élégant, parfait pour l’hiver !",
        "Motifs superbes, vraiment tendance.",
        "Laine de qualité, mais lavage délicat requis.",
        "Un pull qui attire les compliments !",
        "Parfait pour le bureau, très chic.",
        "Confort optimal, je le porte souvent.",
        "Design moderne, mais un peu chaud pour l’automne.",
        "Excellent achat, je suis ravi.",
      ],
      "Pull avec col": [
        "Col montant très pratique pour l’hiver.",
        "Laine douce, mais un peu épaisse.",
        "Look élégant, parfait avec une veste.",
        "Chaud et confortable, je recommande.",
        "Style minimaliste, mais très classe.",
        "Un peu serré au col, mais bonne qualité.",
        "Idéal pour les journées froides.",
        "Tissu de qualité, tient bien au lavage.",
        "Parfait pour un look soigné.",
        "Un must pour l’hiver, très satisfait.",
      ],
      "Jean slim": [
        "Coupe parfaite, très confortable à porter.",
        "Denim de qualité, mais un peu rigide au début.",
        "Style moderne, va avec tout !",
        "Un peu étroit aux chevilles, mais joli.",
        "Super jean, je le porte tout le temps.",
        "Couleur bleu profond, magnifique.",
        "Bonne élasticité, très agréable.",
        "Coutures solides, bon achat.",
        "Look décontracté mais chic.",
        "Taille bien, je recommande.",
      ],
      "Short en jean": [
        "Léger et parfait pour l’été !",
        "Coupe ajustée, mais un peu court.",
        "Denim robuste, bonne qualité.",
        "Poches pratiques, style cool.",
        "Idéal pour les vacances, très confortable.",
        "Couleur légèrement délavée, mais sympa.",
        "Facile à assortir avec un t-shirt.",
        "Tient bien après plusieurs lavages.",
        "Super pour les journées chaudes.",
        "Bon rapport qualité-prix.",
      ],
      "Chemise élégante": [
        "Tissu respirant, parfaite pour l’été.",
        "Coupe ajustée, très élégante.",
        "Couleurs vives, j’adore le bleu !",
        "Un peu froissable, mais belle chemise.",
        "Idéale pour le bureau ou les sorties.",
        "Confortable, mais taille un peu grand.",
        "Style raffiné, très satisfait.",
        "Facile à repasser, bon point !",
        "Look professionnel, je recommande.",
        "Superbe chemise, bonne qualité.",
      ],
      "Ensemble en jean garçon": [
        "Robuste et stylé, parfait pour mon fils !",
        "Denim de qualité, mais un peu raide.",
        "Coupe confortable, il adore le porter.",
        "Look cool, idéal pour l’école.",
        "Veste un peu grande, mais bon ensemble.",
        "Résiste bien aux jeux des enfants.",
        "Style intemporel, très satisfait.",
        "Facile à laver, tient bien.",
        "Parfait pour les sorties en famille.",
        "Bonne qualité, je recommande.",
      ],
      "Ensemble en jean garçon 2": [
        "Super ensemble, très résistant !",
        "Confortable, mais taille un peu petit.",
        "Style classique, parfait pour les enfants.",
        "Denim solide, bonne durabilité.",
        "Idéal pour les activités quotidiennes.",
        "Veste stylée, mon fils adore.",
        "Coupe adaptée, mais lavage fréquent requis.",
        "Bon achat, qualité au rendez-vous.",
        "Look décontracté, très pratique.",
        "Parfait pour les jeunes actifs.",
      ],
      "Ensemble en jean fille": [
        "Très joli, ma fille l’adore !",
        "Denim souple, mais un peu cher.",
        "Coupe parfaite, style tendance.",
        "Idéal pour l’école ou les sorties.",
        "Veste élégante, bonne finition.",
        "Confortable, mais lavage délicat.",
        "Look chic pour une enfant.",
        "Résiste bien à l’usure quotidienne.",
        "Super ensemble, je recommande.",
        "Style moderne, très satisfait.",
      ],
      "Robe d'été": [
        "Légère et parfaite pour l’été !",
        "Tissu fluide, mais un peu transparent.",
        "Couleurs éclatantes, très féminine.",
        "Coupe confortable, idéale pour les vacances.",
        "Style décontracté, mais élégant.",
        "Un peu courte, mais très jolie.",
        "Facile à porter avec des sandales.",
        "Bonne qualité, lavage facile.",
        "Parfaite pour les journées chaudes.",
        "Super robe, je l’adore.",
      ],
      "Veste en cuir": [
        "Look rock incroyable, cuir de qualité !",
        "Un peu lourde, mais très stylée.",
        "Coupe parfaite, super élégante.",
        "Idéale pour les soirées fraîches.",
        "Fermetures éclair robustes, top !",
        "Cuir un peu rigide au début.",
        "Style audacieux, je recommande.",
        "Parfaite avec un jean slim.",
        "Bonne qualité, mais entretien requis.",
        "Veste incontournable, très satisfaite.",
      ],
      "Baskets sport": [
        "Super confortables pour le sport !",
        "Légères, mais semelle un peu fine.",
        "Style moderne, parfait pour tous les jours.",
        "Bonne respirabilité, idéal pour la marche.",
        "Couleurs sympas, je les adore.",
        "Un peu étroites, mais bonne qualité.",
        "Parfaites pour la salle de sport.",
        "Résistantes, bon achat.",
        "Confort optimal, je recommande.",
        "Super baskets, très polyvalentes.",
      ],
      "Baskets blanches sportives": [
        "Blanches et élégantes, parfaites !",
        "Confortables, mais se salissent vite.",
        "Idéales pour le sport et le quotidien.",
        "Semelle épaisse, bon soutien.",
        "Style décontracté, très satisfait.",
        "Un peu chères, mais bonne qualité.",
        "Faciles à assortir avec tout.",
        "Résistantes, mais nettoyage fréquent.",
        "Super look, je les porte souvent.",
        "Baskets top, je recommande.",
      ],
      "Manteau long": [
        "Chaud et élégant, parfait pour l’hiver !",
        "Un peu lourd, mais très chic.",
        "Coupe longue, protège bien du froid.",
        "Laine de qualité, mais entretien délicat.",
        "Poches pratiques, style intemporel.",
        "Un peu grand, mais très confortable.",
        "Idéal pour les occasions formelles.",
        "Bonne qualité, je suis ravi.",
        "Look sophistiqué, je recommande.",
        "Parfait pour les jours froids.",
      ],
      "Ceinture en cuir": [
        "Cuir de qualité, très élégante !",
        "Boucle robuste, mais un peu large.",
        "Parfaite pour toutes mes tenues.",
        "Style minimaliste, bon achat.",
        "Résiste bien à l’usure quotidienne.",
        "Un peu rigide au début, mais top.",
        "Facile à assortir, je recommande.",
        "Bonne durabilité, très satisfait.",
        "Look chic, excellent rapport qualité-prix.",
        "Super accessoire, j’adore.",
      ],
      "Sac à main en cuir": [
        "Très chic, cuir de haute qualité !",
        "Compartiments pratiques, mais un peu lourd.",
        "Parfait pour le bureau ou les sorties.",
        "Bandoulière confortable, super design.",
        "Style élégant, je l’adore.",
        "Un peu cher, mais vaut le prix.",
        "Résistant, bonne finition.",
        "Facile à organiser, je recommande.",
        "Look sophistiqué, très satisfait.",
        "Super sac, indispensable !",
      ],
    };

    return {
      noteMoyenne,
      totalEvaluations: count,
      evaluations: {
        create: notes.map((note, i) => ({
          note,
          text: comments[productName][i % comments[productName].length],
          user: {
            connect: {
              id: userIds[Math.floor(Math.random() * userIds.length)],
            },
          },
        })),
      },
    };
  };

  const produits = [
    {
      nom: "Pull simple",
      objet:
        "Ce pull en coton doux et respirant offre un confort optimal pour un usage quotidien.",
      description: `
## Pull Classique en Coton

Un **pull intemporel** conçu pour un confort optimal au quotidien.

- Fabriqué à partir de *100% coton biologique*
- Coupe régulière pour un style **moderne et décontracté**
- Idéal pour les journées fraîches ou les soirées en extérieur
- Disponible en plusieurs coloris tendance

> Ce pull est parfait pour compléter une tenue casual tout en restant élégant.

**Entretien** : Lavable en machine à 30°C. Ne pas utiliser de javel.
      `,
      prix: 1500,
      qteStock: 40,
      ...generateEvaluations("Pull simple", 15),
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
      nom: "Pull avec col",
      objet:
        "Ce pull en laine avec col montant offre une isolation élégante pour l'hiver.",
      description: `
## Pull Élégant avec Col Montant

Un **pull raffiné** pour un look hivernal soigné.

- Col montant pour une meilleure isolation contre le froid
- Tissu en *laine douce* offrant chaleur et confort
- Design épuré, idéal pour un look chic et minimaliste
- Se porte aussi bien avec une veste qu’en pièce principale

> Un incontournable pour affronter l’hiver avec style.

**Entretien** : Lavage délicat en machine. Ne pas passer au sèche-linge.
      `,
      prix: 2500,
      qteStock: 25,
      ...generateEvaluations("Pull avec col", 12),
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
      objet:
        "Ce jean slim en denim stretch épouse parfaitement la silhouette pour un look moderne.",
      description: `
## Jean Slim Homme

Un **jean moderne et ajusté** qui épouse parfaitement la silhouette masculine.

- Coupe slim pour un look contemporain
- Confectionné en *denim stretch* pour plus de confort
- Finitions soignées et coutures résistantes
- Parfait pour un usage quotidien ou une sortie décontractée

> Associez-le avec une chemise ou un t-shirt pour un style affirmé.

**Conseils d'entretien** : Lavage en machine à 30°C. Retourner avant lavage.
      `,
      prix: 4500,
      qteStock: 30,
      ...generateEvaluations("Jean slim", 18),
      categorieId: categories.find((c) => c.nom === "Bas")?.id ?? null,
      genreId: genres.find((g) => g.nom === "Homme")?.id ?? null,
      couleurs: { connect: [{ nom: "Bleu" }, { nom: "Noir" }] },
      tailles: { connect: [{ nom: "S" }, { nom: "M" }, { nom: "L" }] },
      images: {
        create: [
          { imagePublicId: "pic8_xy8nct_rabkms" },
          { imagePublicId: "pic2_vqzxsr_fwyict" },
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
      objet:
        "Ce short en denim robuste et léger est idéal pour les journées d'été.",
      description: `
## Short en Jean

Le **compagnon idéal de vos journées d'été**.

- Conçu en *denim robuste et léger*
- Coupe ajustée pour un maximum de confort
- Poches pratiques et finitions modernes
- Idéal pour les sorties estivales, les vacances ou les promenades

> Portez-le avec un t-shirt simple pour un look casual réussi.

**Entretien** : Lavage classique. Évitez le sèche-linge pour préserver la couleur.
      `,
      prix: 3000,
      qteStock: 40,
      ...generateEvaluations("Short en jean", 10),
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
      objet:
        "Cette chemise en coton haut de gamme allie confort et élégance pour toutes occasions.",
      description: `
## Chemise Élégante Homme

Une **chemise raffinée** qui allie confort et élégance.

- Tissu en *coton respirant* de haute qualité
- Coupe ajustée pour une allure structurée
- Disponible en plusieurs couleurs vibrantes
- Se porte aussi bien pour des occasions formelles que des sorties casual

> Astuce : Rentrez-la dans un pantalon chino pour un look habillé.

**Repassage facile** – Ne se froisse presque pas après lavage.
      `,
      prix: 4000,
      qteStock: 30,
      ...generateEvaluations("Chemise élégante", 14),
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
      objet:
        "Cet ensemble en jean robuste pour garçons comprend une veste et un pantalon en denim de haute qualité.",
      description: `
## Ensemble en Jean Garçon

Un **ensemble robuste et stylé** pour les jeunes aventuriers.

- Fabriqué en *denim de haute qualité* pour une durabilité accrue
- Veste et pantalon avec une coupe ajustée et confortable
- Idéal pour les sorties décontractées ou les occasions spéciales
- Design intemporel qui plaît aux enfants et aux parents

> Parfait pour un look cool et facile à porter au quotidien.

**Entretien** : Lavage en machine à 30°C. Retourner avant lavage pour préserver la couleur.
      `,
      prix: 5000,
      qteStock: 25,
      ...generateEvaluations("Ensemble en jean garçon", 16),
      categorieId:
        categories.find((c) => c.nom === "Robes & Ensembles")?.id ?? null,
      genreId: genres.find((g) => g.nom === "Enfant")?.id ?? null,
      couleurs: { connect: [{ nom: "Bleu" }] },
      tailles: {
        connect: [{ nom: "S" }, { nom: "6Y" }, { nom: "5Y" }, { nom: "4Y" }],
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
      objet:
        "Cet ensemble en jean pour garçons offre une veste et un pantalon en denim durable et stylé.",
      description: `
## Ensemble en Jean Garçon 2

Un **ensemble tendance** pour les garçons actifs.

- Confectionné en *denim robuste* pour une longue durée de vie
- Coupe confortable adaptée aux enfants
- Parfait pour les activités quotidiennes ou les sorties en famille
- Style classique avec des finitions modernes

> Un choix idéal pour un look décontracté et résistant.

**Conseils d'entretien** : Lavage en machine à 30°C. Évitez le sèche-linge.
      `,
      prix: 5000,
      qteStock: 25,
      ...generateEvaluations("Ensemble en jean garçon 2", 13),
      categorieId:
        categories.find((c) => c.nom === "Robes & Ensembles")?.id ?? null,
      genreId: genres.find((g) => g.nom === "Enfant")?.id ?? null,
      couleurs: { connect: [{ nom: "Bleu" }] },
      tailles: {
        connect: [{ nom: "S" }, { nom: "6Y" }, { nom: "5Y" }, { nom: "4Y" }],
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
      objet:
        "Cet ensemble en jean pour filles combine une veste élégante et un pantalon avec une coupe ajustée.",
      description: `
## Ensemble en Jean Fille

Un **ensemble tendance et confortable** pour les jeunes fashionistas.

- Fabriqué en *denim souple* pour un confort optimal
- Veste et pantalon avec des détails modernes
- Idéal pour les sorties scolaires ou les occasions décontractées
- Coupe ajustée qui met en valeur le style enfantin

> Parfait pour un look chic et pratique au quotidien.

**Entretien** : Lavage en machine à 30°C. Séchage à basse température.
      `,
      prix: 6000,
      qteStock: 25,
      ...generateEvaluations("Ensemble en jean fille", 17),
      categorieId:
        categories.find((c) => c.nom === "Robes & Ensembles")?.id ?? null,
      genreId: genres.find((g) => g.nom === "Enfant")?.id ?? null,
      couleurs: { connect: [{ nom: "Bleu" }] },
      tailles: {
        connect: [{ nom: "S" }, { nom: "6Y" }, { nom: "5Y" }, { nom: "4Y" }],
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
      objet:
        "Cette robe légère en coton est parfaite pour les journées ensoleillées et les sorties estivales.",
      description: `
## Robe d'Été Femme

Une **robe fluide et élégante** pour profiter de l'été.

- Confectionnée en *coton léger et respirant*
- Coupe fluide pour un confort optimal sous le soleil
- Design simple et féminin, idéal pour les sorties ou les vacances
- Disponible en couleurs éclatantes pour un look estival

> Portez-la avec des sandales pour un style décontracté et chic.

**Entretien** : Lavage en machine à 30°C. Séchage à l’air libre recommandé.
      `,
      prix: 3500,
      qteStock: 20,
      ...generateEvaluations("Robe d'été", 11),
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
      objet:
        "Cette veste en cuir véritable offre un look rock et élégant pour toutes occasions.",
      description: `
## Veste en Cuir Femme

Une **veste élégante et résistante** pour un style audacieux.

- Fabriquée en *cuir véritable* de haute qualité
- Coupe ajustée pour une silhouette affirmée
- Parfaite pour les soirées ou les journées fraîches
- Détails soignés avec fermetures éclair robustes

> Associez-la à un jean pour un look rock intemporel.

**Conseils d'entretien** : Nettoyage à sec recommandé. Évitez l’exposition prolongée à l’humidité.
      `,
      prix: 8000,
      qteStock: 15,
      ...generateEvaluations("Veste en cuir", 19),
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
      nom: "Ceinture en cuir",
      objet:
        "Cette ceinture en cuir véritable ajoute une touche chic à toutes vos tenues.",
      description: `
## Ceinture en Cuir Unisexe

Une **ceinture élégante** pour compléter votre style.

- Fabriquée en *cuir véritable* pour une durabilité exceptionnelle
- Boucle métallique robuste et design minimaliste
- Parfaite pour les jeans, pantalons ou robes
- Disponible en couleurs classiques pour une polyvalence maximale

> Un accessoire intemporel pour un look soigné.

**Entretien** : Essuyez avec un chiffon humide. Appliquez un soin pour cuir régulièrement.
      `,
      prix: 1000,
      qteStock: 60,
      ...generateEvaluations("Ceinture en cuir", 10),
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
      nom: "Baskets sport",
      objet:
        "Ces baskets légères et confortables sont conçues pour le sport et le quotidien.",
      description: `
## Baskets Sport Unisexe

Des **baskets polyvalentes** pour un mode de vie actif.

- Fabriquées avec des matériaux *légers et respirants*
- Semelle amortissante pour un confort optimal
- Idéales pour le sport, la marche ou les sorties décontractées
- Disponibles en plusieurs couleurs modernes

> Parfaites pour allier style et fonctionnalité au quotidien.

**Entretien** : Nettoyage avec un chiffon humide. Évitez le lavage en machine.
      `,
      prix: 4000,
      qteStock: 40,
      ...generateEvaluations("Baskets sport", 20),
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
          { imagePublicId: "pic26_np93m8_u5fult" },
          { imagePublicId: "pic25_jji03o_dangrc" },
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
      nom: "Pull moderne",
      objet:
        "Ce pull en laine au design géométrique combine style contemporain et chaleur.",
      description: `
## Pull Moderne en Laine

Un **pull contemporain** alliant style et chaleur.

- Confectionné en *laine mérinos de qualité supérieure*
- Motifs élégants et tendance
- Parfait pour les journées froides avec une touche de modernité
- Convient aussi bien pour le bureau que pour les sorties

> Associez-le à un jean ou un pantalon en toile pour un look urbain chic.

**Conseils d'entretien** : Lavage à la main recommandé. Séchage à plat.
      `,
      prix: 2000,
      qteStock: 30,
      ...generateEvaluations("Pull moderne", 12),
      evaluations: {
        create: [
          {
            note: 5,
            text: "Très beau pull, la qualité est au rendez-vous.",
            user: { connect: { id: userIds[0] } },
          },
          {
            note: 4.5,
            text: "Confortable et stylé, mais taille un peu petit.",
            user: { connect: { id: userIds[1] } },
          },
          {
            note: 4,
            text: "Chaud, élégant, parfait pour l’hiver !",
            user: { connect: { id: userIds[3] } },
          },
        ],
      },
      categorieId: categories.find((c) => c.nom === "Hauts")?.id ?? null,
      genreId: genres.find((g) => g.nom === "Homme")?.id ?? null,
      couleurs: {
        connect: [{ nom: "Vert" }, { nom: "Orange" }, { nom: "Blanc" }],
      },
      tailles: { connect: [{ nom: "S" }, { nom: "M" }, { nom: "L" }] },
      images: {
        create: [
          { imagePublicId: "pic13_spjtes_n8dmbx" },
          { imagePublicId: "pic9_cfvvky_qj114o" },
          { imagePublicId: "pic6_ksyt5i_klscfb" },
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
      objet:
        "Ces baskets blanches robustes sont idéales pour l'entraînement et les activités quotidiennes.",
      description: `
## Baskets Blanches Sportives Femme

Des **baskets robustes et confortables** pour un style actif.

- Conçues en *matériaux synthétiques durables*
- Semelle épaisse pour un soutien optimal
- Parfaites pour le sport ou un look décontracté
- Couleur blanche élégante, facile à assortir

> Idéales pour les femmes dynamiques en quête de style et de confort.

**Entretien** : Nettoyage à l’éponge humide. Évitez l’immersion complète.
      `,
      prix: 5000,
      qteStock: 35,
      ...generateEvaluations("Baskets blanches sportives", 12),
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
      objet:
        "Ce manteau long en laine offre chaleur et élégance pour les mois d'hiver.",
      description: `
## Manteau Long Femme

Un **manteau élégant et chaud** pour affronter l’hiver.

- Fabriqué en *laine de qualité supérieure*
- Coupe longue pour une protection optimale contre le froid
- Design intemporel, parfait pour les occasions formelles ou quotidiennes
- Poches spacieuses pour plus de praticité

> Un indispensable pour rester chic même par temps froid.

**Conseils d'entretien** : Nettoyage à sec recommandé. Évitez le lavage en machine.
      `,
      prix: 12000,
      qteStock: 25,
      ...generateEvaluations("Manteau long", 16),
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
      nom: "Sac à main en cuir",
      objet:
        "Ce sac à main en cuir élégant est idéal pour les sorties quotidiennes ou spéciales.",
      description: `
## Sac à Main en Cuir Femme

Un **sac à main tendance et pratique** pour toutes les occasions.

- Fabriqué en *cuir véritable* pour une élégance durable
- Compartiments multiples pour une organisation optimale
- Design chic, parfait pour le bureau ou les sorties
- Bandoulière ajustable pour un port confortable

> Un accessoire incontournable pour une touche de sophistication.

**Conseils d'entretien** : Nettoyez avec un chiffon doux. Appliquez un produit d’entretien pour cuir.
      `,
      prix: 7000,
      qteStock: 30,
      ...generateEvaluations("Sac à main en cuir", 18),
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

  console.log("Produits insérés avec succès !");
}

export default insertProducts;
