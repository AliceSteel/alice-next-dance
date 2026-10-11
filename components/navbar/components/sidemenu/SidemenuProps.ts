import type { MenuItem } from "@/types/MenuItem";

export type SidemenuProps = {
  position: "left" | "right";
  menuItems?: MenuItem[];
  isOpen?: boolean;
  onClose?: () => void;
};
