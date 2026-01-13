import { StaticImageData } from "next/image";

export type ClassCard = {
    id: string;
    title: string;
    imageUrl?: StaticImageData;
    description?:string
}
export type ClassesListProps = {
    classes: ClassCard[]
}