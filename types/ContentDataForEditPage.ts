export type ContentDataForEditPage = {
  classes: Array<{ id: number; slug: string; title: string; imageUrl: string; description: string }>;
  instructors: Array<{ id: number; slug: string; name: string; image: string; instagram: string; youTube: string; bioLines: string[] }>;
  products: Array<{ id: number; name: string; price: string; terms: string[] }>;
  passesTitle: { title: string };
  purchaseBtnTitle: { title: string };
};
