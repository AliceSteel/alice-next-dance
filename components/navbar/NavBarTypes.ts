import { MenuItem } from "@/types/MenuItem";

export type NavbarProps = {
  menuItemsLeft:  MenuItem[];
  menuItemsRight: MenuItem[];
  title?: string;
};
