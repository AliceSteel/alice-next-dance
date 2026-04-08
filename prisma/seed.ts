import "dotenv/config";
import prisma from "@/app/actions/db";
import productsData from "./passesData.json";
import classesData from "./classesData.json";
import instructorsData from "./instructorsData.json";
import scheduleData from "./scheduleData.json";

async function main() {
 /*  for (const product of productsData.passes) {
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
   */
  for (const danceClass of classesData.classes) {
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
  }

 /*  for (const instructor of instructorsData.instructors) {
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
  for (const week of scheduleData.weeks) {
    await prisma.week.create({
      data: {
        id: week.id,
        label: week.label,
        startDate: week.startDate,
        days: week.days,
        entries: {
          create: week.entries.map((entry) => ({
            entryId: entry.id,
            day: entry.day,
            timeSlot: entry.timeSlot,
            classId: entry.classId,
            label: entry.label,
            teacher: entry.teacher,
          })),
        },
      },
    });
  } */
  
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