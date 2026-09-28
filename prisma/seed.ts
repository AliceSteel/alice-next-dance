import "dotenv/config";
import prisma from "@/app/actions/db";
//import productsData from "./passesData.json";
//import classesData from "./classesData.json";
//import instructorsData from "./instructorsData.json";
import scheduleData from "./scheduleData.json";

async function main() {
  /*  for (const product of productsData.passes) {
    await prisma.product.create({
      data: {
        name: product.name,
        price: product.price,
        terms: product.terms,
        credits: product.credits,
        validityDays: product.validityDays,
      },
    });
  } */
  /*  await prisma.passesTitle.create({
    data: {
      title: productsData.passesTitle,
    },
  }); */
  /*   await prisma.purchaseButtonTitle.create({
    data: {
      title: productsData.purchaseButtonTitle,
    },
  }); */

  /*   for (const danceClass of classesData.classes) {
    await prisma.class.create({
      data: {
        slug: danceClass.slug,
        title: danceClass.title,
        imageUrl: danceClass.imageUrl,
        description: danceClass.description,
        text1: danceClass.text1,
        text2: danceClass.text2,
      },
    });
  } */
  /* 
  for (const instructor of instructorsData.instructors) {
    await prisma.instructor.create({
      data: {
        slug: instructor.id,
        name: instructor.name,
        image: instructor.image,
        instagram: instructor.instagram,
        youTube: instructor.youTube,
        bioLines: instructor.bioLines,
      },
    });
  }
   */
  for (const template of scheduleData.templates) {
    const data = {
      classSlug: template.classSlug,
      instructorSlug: template.instructorSlug,
      label: template.label,
      weekday: template.weekday,
      startTime: template.startTime,
      durationMin: template.durationMin,
      timezone: template.timezone,
      effectiveFrom: new Date(`${template.effectiveFrom}T00:00:00.000Z`),
      effectiveTo: template.effectiveTo
        ? new Date(`${template.effectiveTo}T00:00:00.000Z`)
        : null,
      capacity: template.capacity,
    };
    await prisma.scheduleTemplate.upsert({
      where: { id: template.id },
      create: { id: template.id, ...data },
      update: {},
    });
  }

  console.log(`Seeded ${scheduleData.templates.length} schedule templates.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
