import db from "@/helpers/db";
import { redirect } from "next/navigation";

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