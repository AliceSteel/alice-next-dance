'use server';
import db from "@/helpers/db";
import { redirect } from "next/navigation";
import type { ScheduleResponse } from "@/types/ScheduleItem";

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


export const createCMSAction = async (prevState: any, formData: FormData):Promise<{message:string}> => {
 try {
  const name = formData.get("name") as string;
  const terms1 = formData.get("terms1") as string;
  const terms2 = formData.get("terms2") as string;
  const terms3 = formData.get("terms3") as string;
  const terms = [terms1, terms2, terms3].filter(term => term.trim() !== "")
  const price = formData.get("price")?.toString();
  if(!price) return { message: "Price is required" };

  await db.product.create({
    data: {
      name,
      terms,
      price,
    },
  });
    return { message: "product created successfully" };
 }
  catch (error) {
    console.log("Error creating product:", error);
    return { message: error instanceof Error ? error.message : "An unknown error occurred" };
  }
};
  