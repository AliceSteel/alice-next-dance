"use client";

import Sidemenu from "@/components/sidemenu/Sidemenu";
import { Lineicons } from "@lineiconshq/react-lineicons";
import { MenuHamburger1Outlined } from "@lineiconshq/free-icons";
import type { MobileNavbarProps } from "./MobileNavBarProps";

export default function MobileNavbar({
  menuItems,
  isOpen,
  isMounted,
  onOpen,
  onClose,
}: MobileNavbarProps) {
  return (
    <div className="flex flex-col items-end md:hidden pr-3 max-w-1/2">
      {!isOpen && (
        <Lineicons
          icon={MenuHamburger1Outlined}
          size={30}
          className="text-white/80 hover:text-white/100 transition-opacity duration-300 cursor-pointer"
          onClick={onOpen}
        />
      )}
      {isMounted && (
        <Sidemenu
          position="right"
          menuItems={menuItems}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
    </div>
  );
}
