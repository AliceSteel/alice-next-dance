import { StaticImageData } from "next/image";

export type BookingCardData = {
  id: string;
  date: string;
  label: string;
  title: string;
  instructor: string;
  instructorSlug: string;
  timeSlot: string;
  picUrl?: string | StaticImageData;
};
