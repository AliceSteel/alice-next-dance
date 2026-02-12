import { StaticImageData } from "next/image";

export type ClassCard = {
    id: string | number;
    title: string;
    imageUrl?: StaticImageData | string;
    description?:string
}
export type ClassesListProps = {
    classes: ClassCard[]
}