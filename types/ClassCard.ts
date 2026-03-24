import { StaticImageData } from "next/image";

export type ClassCardType = {
    id: string | number;
    title: string;
    imageUrl?: StaticImageData | string;
    description?:string
}