'use server';
import db from "@/helpers/db";
import { redirect } from "next/navigation";
import type { ScheduleResponse } from "@/types/ScheduleItem";
import { zodProductSchema, zodInstructorSchema, zodImageSchema, validateWithZod } from "@/helpers/zodSchema";
import { uploadImageToSupabase } from "@/helpers/supabase";
import type { ContentDataForEditPage } from "@/types/ContentDataForEditPage";

export const fetchProducts = () => {
  return db.product.findMany({orderBy: { price: "asc" }});
}

export const fetchPassesTitleRecord = async() => {
   const row = await db.passesTitle.findFirst();
  return row?.title ?? "Memberships";
}

export const fetchBtnTitleRecord = async() => {
  const row = await db.purchaseButtonTitle.findFirst();
 return row?.title ?? "Purchase";
}

export const fetchClasses = () => {
  return db.class.findMany();
}

export const fetchSingleClass = async (slug: string) => {
  const danceClass = await db.class.findUnique({ where: { slug } });
  if (!danceClass) {
    redirect("/classes?error=classnotfound");
  }
  return danceClass;
}

export const fetchAllInstructors = () => {
  return db.instructor.findMany();
}


export const fetchSchedule = async (): Promise<ScheduleResponse["weeks"]> => {
  const weeks = await db.week.findMany({
    orderBy: { id: "asc" },
    include: { entries: true },
  });

  return weeks.map((week) => ({
    id: week.id,
    label: week.label,
    startDate: week.startDate,
    days: week.days,
    entries: week.entries.map((entry) => ({
      id: entry.entryId,           
      day: entry.day,
      timeSlot: entry.timeSlot as any, 
      classId: entry.classId,
      label: entry.label ?? undefined,
      teacher: entry.teacher ?? undefined,
    })),
  }));
};


export const createProduct = async (prevState: any, formData: FormData):Promise<{errorMessage?: string; successMessage?: string}> => {
 try {
  const rawData = Object.fromEntries(formData.entries());
  const { terms1, terms2, terms3, ...rest } = rawData;
  const terms = [terms1, terms2, terms3].filter((term): term is string => typeof term === "string" && term.trim() !== "",);

  const validatedData = zodProductSchema.safeParse({ ...rest, terms });

  if (!validatedData.success) {
    const errors= validatedData.error.issues.map(err => err.message).join(", ")
    throw new Error(`Validation failed: ${errors}`);
  }

  await db.product.create({
    data: validatedData.data,
  });
    return { successMessage: "Product is created!" };
 }
  catch (error) {
    console.log("Error creating product:", error);
    return { errorMessage: error instanceof Error ? error.message : "An unknown error occurred" };
  }
};

export const createInstructor = async (prevState: any, formData: FormData):Promise<{errorMessage?: string; successMessage?: string}> => {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const { image, bio1, bio2, bio3, ...rest } = rawData;

    const bioLines = [bio1, bio2, bio3].filter((line): line is string => typeof line === "string" && line.trim() !== "",);
  
    const validatedData = validateWithZod(zodInstructorSchema, { ...rest, bioLines });
    const validatedImage = validateWithZod(zodImageSchema, { image });

    const imagePath = await uploadImageToSupabase(validatedImage.image);

  await db.instructor.create({
    data: {
      slug: validatedData.slug,
      name: validatedData.name,
      bioLines: validatedData.bioLines,
      image: imagePath,
      instagram: validatedData.instagram,
      youTube: validatedData.youTube,
  }
  });
 }
  catch (error) {
    console.log("Error creating instructor:", error);
    return { errorMessage: error instanceof Error ? error.message : "An unknown error occurred" };
  }
  redirect("/admin/edit?success=instructorcreated");
};

export const fetchAdminContentToEdit: () => Promise<ContentDataForEditPage> = async () => {
  const [products, classes, instructors, passesTitle, purchaseBtnTitle] = await Promise.all([
    db.product.findMany({ orderBy: { price: "asc" } }),
    db.class.findMany(),
    db.instructor.findMany(),
    db.passesTitle.findFirst(),
    db.purchaseButtonTitle.findFirst(),
  ]);

  return { 
    products, classes, instructors,  
    passesTitle: { title: passesTitle?.title ?? "[No Title]" },
    purchaseBtnTitle: { title: purchaseBtnTitle?.title ?? "[No Title]" }
  } as ContentDataForEditPage;
};
