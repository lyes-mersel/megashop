import { PrismaClient, UserRole } from "@prisma/client";
import { env } from "process";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash(env.DEFAULT_PASSWORD!, 10);

  // Création d'un client
  await prisma.user.create({
    data: {
      nom: "firstname",
      prenom: "lastname",
      email: "client@email.com",
      password: hashedPassword,
      role: UserRole.CLIENT,
      emailVerifie: true,
      client: {
        create: {},
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
      client: {
        create: {
          vendeur: {
            create: {},
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
      admin: {
        create: {},
      },
    },
  });

  console.log("prisma/seed.ts : Données insérées avec succès !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
