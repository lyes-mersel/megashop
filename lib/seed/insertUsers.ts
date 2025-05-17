import { prisma } from "@/lib/utils/prisma";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

// Création des utilisateurs
async function insertUsers() {
  const hashedPassword = await bcrypt.hash(process.env.DEFAULT_PASSWORD!, 10);

  // Création du client 0
  await prisma.user.create({
    data: {
      nom: "Belkacem",
      prenom: "Krim",
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
      nom: "Bouhired",
      prenom: "Djamila",
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
      nom: "Youcef",
      prenom: "Zighoud",
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

  // Création d'un client 3
  await prisma.user.create({
    data: {
      nom: "Ammar",
      prenom: "Ali",
      email: "client3@email.com",
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

  // Création d'un client 4
  await prisma.user.create({
    data: {
      nom: "Ben Bouali",
      prenom: "Hassiba",
      email: "client4@email.com",
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

  // Création d'un client 5
  await prisma.user.create({
    data: {
      nom: "Mourad",
      prenom: "Didouche",
      email: "client5@email.com",
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

  // Création d'un client 6
  await prisma.user.create({
    data: {
      nom: "Boudiaf",
      prenom: "Mohamed",
      email: "client6@email.com",
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

  // Création d'un client 7
  await prisma.user.create({
    data: {
      nom: "N'Soumer",
      prenom: "Fatma",
      email: "client7@email.com",
      password: hashedPassword,
      role: UserRole.CLIENT,
      emailVerifie: true,
      tel: "0555555555",
      adresse: {
        create: {
          rue: "Rue de la République",
          ville: "Tizi Ouzou",
          wilaya: "Tizi Ouzou",
          codePostal: "15000",
        },
      },
      client: {
        create: {},
      },
    },
  });

  // Création d'un client 8
  await prisma.user.create({
    data: {
      nom: "Aït Hamouda",
      prenom: "Amirouche",
      email: "client8@email.com",
      password: hashedPassword,
      role: UserRole.CLIENT,
      emailVerifie: true,
      tel: "0555555555",
      adresse: {
        create: {
          rue: "Rue de la République",
          ville: "Canstantine",
          wilaya: "Canstantine",
          codePostal: "25000",
        },
      },
      client: {
        create: {},
      },
    },
  });

  // Création d'un client 9
  await prisma.user.create({
    data: {
      nom: "Benboulaïd",
      prenom: "Mustapha",
      email: "client9@email.com",
      password: hashedPassword,
      role: UserRole.CLIENT,
      emailVerifie: true,
      tel: "0555555555",
      adresse: {
        create: {
          rue: "Rue de la République",
          ville: "Batna",
          wilaya: "Batna",
          codePostal: "05000",
        },
      },
      client: {
        create: {},
      },
    },
  });

  // Création d'un client 10
  await prisma.user.create({
    data: {
      nom: "Boupacha",
      prenom: "Djamila",
      email: "client10@email.com",
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

  // Création d'un vendeur
  await prisma.user.create({
    data: {
      nom: "Ben M'hidi",
      prenom: "Larbi",
      email: "vendeur@email.com",
      password: hashedPassword,
      role: UserRole.VENDEUR,
      emailVerifie: true,
      tel: "0666666666",
      imagePublicId: "clothes_mqs4nn",
      adresse: {
        create: {
          rue: "Boulevard de la République",
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
              description: `
## Marque Luxe Béjaia

**Marque Luxe Béjaia** propose une collection exclusive de vêtements et accessoires haut de gamme.

- Offre des *vêtements élégants* pour hommes, femmes et enfants
- Utilise des *matériaux de qualité supérieure* pour un confort optimal
- Designs modernes et intemporels, parfaits pour toutes les occasions
- Basée à Béjaia, avec une passion pour la mode locale et internationale

> Découvrez des pièces uniques qui allient style et sophistication pour sublimer votre garde-robe.

**Contact** : Visitez notre boutique à Béjaia ou contactez-nous au 0666666666 pour plus d'informations.
              `,
            },
          },
        },
      },
    },
  });

  // Création d'un vendeur 1
  await prisma.user.create({
    data: {
      nom: "Zabana",
      prenom: "Ahmed",
      email: "vendeur1@email.com",
      password: hashedPassword,
      role: UserRole.VENDEUR,
      emailVerifie: true,
      tel: "0777777777",
      imagePublicId: "clothes_mqs4nn",
      adresse: {
        create: {
          rue: "Boulevard de la République",
          ville: "Alger",
          wilaya: "Alger",
          codePostal: "16000",
        },
      },
      client: {
        create: {
          vendeur: {
            create: {
              nomBoutique: "Marque VIP Alger",
              nomBanque: "BNP Paribas El Djazaïr",
              rib: "000999554283123",
              description: `
## Marque VIP Alger

**Marque VIP Alger** propose une collection exclusive de vêtements et accessoires haut de gamme.

- Offre des *vêtements élégants* pour hommes, femmes et enfants
- Utilise des *matériaux de qualité supérieure* pour un confort optimal
- Designs modernes et intemporels, parfaits pour toutes les occasions
- Basée à Béjaia, avec une passion pour la mode locale et internationale

> Découvrez des pièces uniques qui allient style et sophistication pour sublimer votre garde-robe.

**Contact** : Visitez notre boutique à Alger ou contactez-nous au 0777777777 pour plus d'informations.
              `,
            },
          },
        },
      },
    },
  });

  // Création d'un vendeur 2
  await prisma.user.create({
    data: {
      nom: "Aït Ahmed",
      prenom: "Hocine",
      email: "vendeur2@email.com",
      password: hashedPassword,
      role: UserRole.VENDEUR,
      emailVerifie: true,
      tel: "0555555555",
      imagePublicId: "clothes_mqs4nn",
      adresse: {
        create: {
          rue: "Boulevard de la République",
          ville: "Oran",
          wilaya: "Oran",
          codePostal: "31000",
        },
      },
      client: {
        create: {
          vendeur: {
            create: {
              nomBoutique: "Votre boutique en ligne",
              nomBanque: "BNP Paribas El Djazaïr",
              rib: "000999554283123",
              description: `
## Votre boutique en ligne

**Votre boutique en ligne** propose une collection exclusive de vêtements et accessoires haut de gamme.

- Offre des *vêtements élégants* pour hommes, femmes et enfants
- Utilise des *matériaux de qualité supérieure* pour un confort optimal
- Designs modernes et intemporels, parfaits pour toutes les occasions
- Basée à Béjaia, avec une passion pour la mode locale et internationale

> Découvrez des pièces uniques qui allient style et sophistication pour sublimer votre garde-robe.

**Contact** : Contactez-nous au 0555555555 pour plus d'informations.
              `,
            },
          },
        },
      },
    },
  });

  // Création d'un admin
  await prisma.user.create({
    data: {
      nom: "Ramdane",
      prenom: "Abane",
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

export default insertUsers;
