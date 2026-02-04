import "dotenv/config";
import prisma from "@/helpers/db";
import productsData from "./passesData.json";


async function main() {
  for (const product of productsData.passes) {
    await prisma.product.create({
      data: {
        name: product.name,
        price: product.price,
        terms: product.terms,
      },
    });
  }
  await prisma.passesTitle.create({
    data: {
      title: productsData.passesTitle,
    },
  });
  await prisma.purchaseButtonTitle.create({
    data: {
      title: productsData.purchaseButtonTitle,
    },
  });
}

main()
  .then(async () => {
    console.log("Seeding completed.");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
