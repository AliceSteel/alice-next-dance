import db from "@/helpers/db";

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