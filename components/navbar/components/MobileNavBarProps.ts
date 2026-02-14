import type { MenuItem } from "@/types/MenuItem";

export type MobileNavbarProps = {
  menuItems: MenuItem[];
  isOpen: boolean;
  isMounted: boolean;
  onOpen: () => void;
  onClose: () => void;
};