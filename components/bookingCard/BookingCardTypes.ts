import { StaticImageData } from "next/image";

export type BookingCardProps = {
  booking: Booking;
  index?: number;
  isOpen?: boolean;
  currentCategory?: string;
  onToggleOpen: (index: number) => void;
  onLeftColumnChange?: (isLeftColumn: boolean) => void;
};

type Booking = {
  id: string | number;
  date: string;
  label: string;
  title: string;
  instructor: string;
  timeSlot: string;
  picUrl: string | StaticImageData;
};
