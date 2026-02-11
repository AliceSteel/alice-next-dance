import { StaticImageData } from "next/image";

export type Class = {
  id: number;
  slug: string;
  title: string;
  imageUrl: string |StaticImageData;
  description: string;
  text1?:string;
  text2?:string;
  buttonText?:string;
  instructor?: {
    id:string;
    name:string;
    image: string | StaticImageData;
    instagram: string;
    youTube: string;
    bioLines: string[];
  };
}