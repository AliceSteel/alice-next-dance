import type { Class } from "@/types/ClassDescription";
import { StaticImageData } from "next/image";

export type Category = {
    id: string | number;
    title: string;
}
export type ClassesState = {
  items: Class[];
  categories: Category[]
};
export type Instructor = {
    id: string ;
    name: string;
    image: string | StaticImageData;
    instagram: string;
    youTube: string;
    bioLines: string[];
}