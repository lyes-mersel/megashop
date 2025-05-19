import { PrismaClient } from "@prisma/client";

import insertCategories from "@/lib/seed/insertCategories";
import insertColors from "@/lib/seed/insertColors";
import insertGenders from "@/lib/seed/insertGenders";
import insertNotifications from "@/lib/seed/insertNotifications";
import insertOrders from "@/lib/seed/insertOrders";
import insertProducts from "@/lib/seed/insertProducts";
import insertSizes from "@/lib/seed/insertSizes";
import insertUsers from "@/lib/seed/insertUsers";
import insertReports from "@/lib/seed/insertReports";

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
  await insertReports();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
