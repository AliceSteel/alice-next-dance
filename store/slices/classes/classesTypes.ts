import type { Class } from "@/types/ClassDescription";

export type Category = {
    id: string | number;
    title: string;
}
export type ClassesState = {
  items: Class[];
  categories: Category[]
};