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
  