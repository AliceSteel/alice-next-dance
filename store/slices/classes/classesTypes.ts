import type { Class } from "@/types/ClassDescription";

export type Category = {
    id: string;
    title: string;
}
export type ClassesState = {
  items: Class[];
  categories: Category[]
};