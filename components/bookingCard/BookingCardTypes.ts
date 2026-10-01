import type { BookingCardData } from "@/types/BookingCardData";

export type BookingCardProps = {
  booking: BookingCardData;
  index?: number;
  isOpen?: boolean;
  currentCategory?: string;
  onToggleOpen: (index: number) => void;
  onLeftColumnChange?: (isLeftColumn: boolean) => void;
};
